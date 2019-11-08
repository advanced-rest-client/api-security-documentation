import { html } from 'lit-html';
import { LitElement } from 'lit-element';
import { ApiDemoPageBase } from '@advanced-rest-client/arc-demo-helper/ApiDemoPage.js';
import '@api-components/api-navigation/api-navigation.js';
import '../api-security-documentation.js';

import { AmfHelperMixin } from '@api-components/amf-helper-mixin/amf-helper-mixin.js';
class DemoElement extends AmfHelperMixin(LitElement) {}
window.customElements.define('demo-element', DemoElement);

class ApiDemo extends ApiDemoPageBase {
  constructor() {
    super();

    this.endpointsOpened = false;
    this.securityOpened = true;
  }

  get security() {
    return this._security;
  }

  set security(value) {
    this._setObservableProperty('security', value);
  }

  _navChanged(e) {
    const { selected, type } = e.detail;
    if (type === 'security') {
      this.setTypeData(selected);
    } else {
      this.hasData = false;
    }
  }

  setTypeData(selected) {
    const dec = document.getElementById('helper')._computeDeclares(this.amf);
    const security = dec.find((item) => item['@id'] === selected);
    if (!security) {
      this.hasData = false;
      return;
    }
    this.security = security;
    this.hasData = true;
  }

  _apiListTemplate() {
    return html`
    <paper-item data-src="demo-api.json">Demo api</paper-item>
    <paper-item data-src="demo-api-compact.json">Demo api - compact model</paper-item>
    <paper-item data-src="oauth1-fragment.json">OAuth1 fragment</paper-item>
    <paper-item data-src="oauth1-fragment-compact.json">OAuth1 fragment - compact model</paper-item>
    <paper-item data-src="APIC-306.json">APIC-306</paper-item>
    <paper-item data-src="APIC-306-compact.json">APIC-306 - compact model</paper-item>
    `;
  }

  contentTemplate() {
    return html`
    <demo-element id="helper" .amf="${this.amf}"></demo-element>
    ${this.hasData ?
      html`<api-security-documentation
        .amf="${this.amf}"
        .security="${this.security}"
        ?narrow="${this.narrowActive}"></api-security-documentation>` :
      html`<p>Select security in the navigation to see the demo.</p>`}
    `;
  }
}
const instance = new ApiDemo();
instance.render();
