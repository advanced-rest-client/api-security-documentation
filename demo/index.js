import { html } from 'lit-html';
import { ApiDemoPage } from '@advanced-rest-client/arc-demo-helper';
import '@anypoint-web-components/anypoint-styles/colors.js';
import '@anypoint-web-components/anypoint-item/anypoint-item.js';
import '../api-security-documentation.js';

class ApiDemo extends ApiDemoPage {
  constructor() {
    super();
    this.initObservableProperties([
      'security',
    ]);
    this.endpointsOpened = false;
    this.securityOpened = true;
    this.renderViewControls = true;
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
    let dec = this._computeDeclares(this.amf);
    if (!dec) {
      dec = [this._computeEncodes(this.amf)];
    }
    const security = dec.find((item) => item['@id'] === selected);
    if (!security) {
      this.hasData = false;
      return;
    }
    this.security = security;
    this.hasData = true;
  }

  _apiListTemplate() {
    return [
      ['demo-api', 'Demo API'],
      ['oauth1-fragment', 'OAuth1 fragment'],
      ['APIC-306', 'APIC-306'],
      ['multi-oauth2-flow', 'Multiple OAuth2 flows'],
    ].map(([file, label]) => html`
      <anypoint-item data-src="${file}-compact.json">${label} - compact model</anypoint-item>
      <anypoint-item data-src="${file}.json">${label}</anypoint-item>
      `);
  }

  contentTemplate() {
    return html`
    ${this.hasData ?
      html`<api-security-documentation
        .amf="${this.amf}"
        .security="${this.security}"
        ?narrow="${this.narrow}"></api-security-documentation>` :
      html`<p>Select security in the navigation to see the demo.</p>`}
    `;
  }
}
const instance = new ApiDemo();
instance.render();
