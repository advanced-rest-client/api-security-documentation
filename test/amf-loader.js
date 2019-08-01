import { LitElement } from 'lit-element';
import { AmfHelperMixin } from '@api-components/amf-helper-mixin/amf-helper-mixin.js';

class TestHelperElement extends AmfHelperMixin(LitElement) {}
window.customElements.define('demo-element', TestHelperElement);

export const AmfLoader = {};
AmfLoader.load = function(type, compact) {
  const file = '/demo-api' + (compact ? '-compact' : '') + '.json';
  const url = location.protocol + '//' + location.host + '/base/demo/' + file;
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

      const helper = new TestHelperElement();
      helper.amf = data;
      const ns = helper.ns;

      const decKey = helper._getAmfKey(ns.raml.vocabularies.document + 'declares');
      let declares = data[decKey];
      if (!(declares instanceof Array)) {
        declares = [declares];
      }
      const nameKey = helper._getAmfKey(ns.raml.vocabularies.document + 'name');
      const securityKey = helper._getAmfKey(ns.raml.vocabularies.security + 'name');
      const result = declares.find((item) => {
        let name = item[nameKey];
        if (!name) {
          name = item[securityKey];
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
