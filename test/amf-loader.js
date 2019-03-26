import {ns} from '../../../@api-components/amf-helper-mixin/amf-helper-mixin.js';
export const AmfLoader = {};
AmfLoader.load = function(type, compact) {
  const file = '/demo-api' + (compact ? '-compact' : '') + '.json';
  const url = location.protocol + '//' + location.host +
    location.pathname.substr(0, location.pathname.lastIndexOf('/'))
    .replace('/test', '/demo') + file;
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.addEventListener('load', (e) => {
      let data;
      try {
        data = JSON.parse(e.target.response);
      } catch (e) {
        reject(e);
        return;
      }
      const original = data;
      if (data instanceof Array) {
        data = data[0];
      }
      const decKey = compact ? 'doc:declares' :
        ns.raml.vocabularies.document + 'declares';
      let declares = data[decKey];
      if (!(declares instanceof Array)) {
        declares = [declares];
      }
      const result = declares.find((item) => {
        const key = compact ? 'document:name' :
          ns.raml.vocabularies.document + 'name';
        let name = item[key];
        if (!name) {
          const key = compact ? 'security:name' :
            ns.raml.vocabularies.security + 'name';
          name = item[key];
        }
        if (name instanceof Array) {
          name = name[0];
        }
        if (name && name['@value']) {
          name = name['@value'];
        }
        return name === type;
      });
      resolve([original, result]);
    });
    xhr.addEventListener('error',
      () => reject(new Error('Unable to load model file')));
    xhr.open('GET', url);
    xhr.send();
  });
};
