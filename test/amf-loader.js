/* eslint-disable no-param-reassign */
import { AmfHelperMixin } from '@api-components/amf-helper-mixin/amf-helper-mixin.js';
import { LitElement } from 'lit-element';

export const AmfLoader = {};

class HelperElement extends AmfHelperMixin(LitElement) { }
window.customElements.define('helper-element', HelperElement);

const helper = new HelperElement();

AmfLoader.load = (compact, fileName) => {
  const file = `${(fileName || '/demo-api') + (compact ? '-compact' : '')  }.json`;
  const url = `${window.location.protocol  }//${window.location.host  }/base/demo/${  file}`;
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.addEventListener('load', () => {
      try {
        const data = JSON.parse(xhr.response);
        resolve(data);
      } catch (ex) {
        console.error('Unable to load the API file.');
        console.error(xhr.response);
        reject(ex);
      }
    });
    xhr.addEventListener('error',
      () => reject(new Error('Unable to load model file')));
    xhr.open('GET', url);
    xhr.send();
  });
};

AmfLoader.lookupSecurity = (model, type) => {
  helper.amf = model;
  const declares = helper._computeDeclares(model);
  const nameKey = helper._getAmfKey(helper.ns.aml.vocabularies.core.name);
  const securityKey = helper._getAmfKey(helper.ns.aml.vocabularies.security.name);
  return declares.find((item) => {
    let name = item[nameKey];
    if (!name) {
      name = item[securityKey];
    }
    if (Array.isArray(name)) {
      [name] = name;
    }
    if (name && name['@value']) {
      name = name['@value'];
    }
    return name === type;
  });
};

AmfLoader.lookupFlowFromSettings = (amf, settings, grantType) => {
  helper.amf = amf
  if (Array.isArray(settings)) {
    [settings] = settings;
  }
  const flowKey = helper._getAmfKey(helper.ns.aml.vocabularies.security.flows);
  const flows = helper._getValueArray(settings, flowKey);
  return flows.find(flow => {
    const grantKey = helper._getAmfKey(helper.ns.aml.vocabularies.security.flow);
    // @ts-ignore
    const flowType = helper._getValue(flow, grantKey);
    return flowType === grantType;
  });
}

AmfLoader.lookupEndpoint = (model, endpoint) => {
  helper.amf = model;
  const webApi = helper._computeWebApi(model);
  return helper._computeEndpointByPath(webApi, endpoint);
};

AmfLoader.lookupOperation = (model, endpoint, operation) => {
  const endPoint = AmfLoader.lookupEndpoint(model, endpoint);
  const opKey = helper._getAmfKey(helper.ns.aml.vocabularies.apiContract.supportedOperation);
  const ops = helper._ensureArray(endPoint[opKey]);
  return ops.find((item) => helper._getValue(item, helper.ns.aml.vocabularies.apiContract.method) === operation);
};

AmfLoader.lookupOperationSecurity = (model, endpoint, operation) => {
  const op = AmfLoader.lookupOperation(model, endpoint, operation);
  const secKey = helper._getAmfKey(helper.ns.aml.vocabularies.security.security);
  return helper._ensureArray(op[secKey]);
};
