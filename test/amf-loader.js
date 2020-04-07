import { AmfHelperMixin } from '@api-components/amf-helper-mixin/amf-helper-mixin.js';
import { LitElement } from 'lit-element';

export const AmfLoader = {};

class HelperElement extends AmfHelperMixin(LitElement) { }
window.customElements.define('helper-element', HelperElement);

const helper = new HelperElement();

AmfLoader.load = function (compact, fileName) {
  const file = (fileName || '/demo-api') + (compact ? '-compact' : '') + '.json';
  const url = location.protocol + '//' + location.host + '/base/demo/' + file;
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.addEventListener('load', (e) => {
      try {
        const data = JSON.parse(e.target.response);
        resolve(data);
      } catch (e) {
        reject(e);
        return;
      }
    });
    xhr.addEventListener('error',
      () => reject(new Error('Unable to load model file')));
    xhr.open('GET', url);
    xhr.send();
  });
};

AmfLoader.lookupSecurity = function (model, type) {
  helper.amf = model;
  const declares = helper._computeDeclares(model);
  const nameKey = helper._getAmfKey(helper.ns.aml.vocabularies.core.name);
  const securityKey = helper._getAmfKey(helper.ns.aml.vocabularies.security.name);
  return declares.find((item) => {
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
};

AmfLoader.lookupFlowFromSettings = function (amf, settings, grantType) {
  helper.amf = amf
  if (Array.isArray(settings)) {
    settings = settings[0];
  }
  const flowKey = helper._getAmfKey(helper.ns.aml.vocabularies.security.flows);
  const flows = helper._getValueArray(settings, flowKey);
  return flows.find(flow => {
    const grantKey = helper._getAmfKey(helper.ns.aml.vocabularies.security.flow);
    const flowType = helper._getValue(flow, grantKey);
    return flowType === grantType;
  });
}