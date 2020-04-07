import { LitElement, html, css } from 'lit-element';
import { AmfHelperMixin } from '@api-components/amf-helper-mixin/amf-helper-mixin.js';

export class ApiOauth2FlowDocument extends AmfHelperMixin(LitElement) {
  static get properties() {
    return {
      /**
       * Access token URI value.
       * This property is updated when `flow` property changes.
       */
      accessTokenUri: { type: String },
      /**
       * Authorization URI value.
       * This property is updated when `flow` property changes.
       */
      authorizationUri: { type: String },
      /**
       * Value of OAuth2 authorization grant.
       * This property is updated when `flow` property changes.
       * Only available in OAS 3.0+
       * @type {String}
       */
      authorizationGrant: { type: String },
      /**
       * List of OAuth2 authorization scopes.
       * This property is updated when `flow` property changes.
       *
       * Each array item must have `label` and optional `description`
       * properties.
       * @type {Array<Object>}
       */
      scopes: { type: Array },
    }
  }

  get styles() {
    return css`
    :host {
      display: block;
    }

    h4 {
      font-size: var(--arc-font-subhead-font-size);
      font-weight: var(--arc-font-subhead-font-weight);
      line-height: var(--arc-font-subhead-line-height);
      user-select: text;
    }

    ul {
      maring: 0;
      padding: 0;
    }

    .settings-value {
      background: var(--code-background-color, #f5f2f0);
      display: block;
      padding: 1em;
      margin: .5em 0;
      user-select: text;
      word-break: break-all;
    }

    .settings-list-value {
      background: var(--code-background-color, #f5f2f0);
      display: block;
      padding: 1em;
      user-select: text;
      word-break: break-all;
    }
    `;
  }

  set flow(value) {
    const old = this.flow;
    if (old === value) {
      return;
    }
    this._flow = value;
    this._flowChanged(value);
  }

  _flowChanged(flow) {
    const accessTokenUri = this._computeAccessTokenUri(flow);
    const authorizationUri = this._computeAuthorizationUri(flow);
    const authorizationGrant = this._computeAuthorizationGrant(flow);
    let scopes = this._computeScopes(flow);
    if (scopes && !(scopes instanceof Array)) {
      scopes = [scopes];
    }
    this.accessTokenUri = accessTokenUri;
    this.authorizationUri = authorizationUri;
    this.authorizationGrant = authorizationGrant;
    this.scopes = scopes;
  }

  /**
  * Computes value for `accessTokenUri` property.
  * @param {Object} flow OAuth2 flow from AMF model.
  * @return {String|undefined}
  */
  _computeAccessTokenUri(flow) {
    const flows = this._getValueArray(flow, this.ns.aml.vocabularies.security.flows);
    if (flows) {
      flow = flows[0]
    }
    return this._getValue(flow, this.ns.aml.vocabularies.security.accessTokenUri);
  }
  /**
   * Computes value for `authorizationUri` property.
   * @param {Object} flow OAuth2 flow from AMF model.
   * @return {String|undefined}
   */
  _computeAuthorizationUri(flow) {
    const flows = this._getValueArray(flow, this.ns.aml.vocabularies.security.flows);
    if (flows) {
      flow = flows[0]
    }
    return this._getValue(flow, this.ns.aml.vocabularies.security.authorizationUri);
  }
  /**
   * Computes value for `authorizationGrant` property.
   * @param {Object} flow OAuth2 flow from AMF model.
   * @return {String|undefined}
   */
  _computeAuthorizationGrant(flow) {
    return this._getValue(flow, this.ns.aml.vocabularies.security.flow);
  }
  /**
   * Computes value for `scopes` property.
   * @param {Object} flow OAuth2 flow from AMF model.
   * @return {Array<Object>|undefined}
   */
  _computeScopes(flow) {
    const flows = this._getValueArray(flow, this.ns.aml.vocabularies.security.flows);
    if (flows) {
      flow = flows[0]
    }
    if (!this._hasType(flow, this.ns.aml.vocabularies.security.OAuth2Flow) && !this._hasType(flow, this.ns.aml.vocabularies.security.OAuth2Settings)) {
      return;
    }
    const key = this._getAmfKey(this.ns.aml.vocabularies.security.scope);
    const scopes = this._ensureArray(flow[key]);
    if (!scopes) {
      return;
    }
    return scopes.map((item) => {
      return {
        description: this._computeDescription(item),
        label: this._getValue(item, this.ns.aml.vocabularies.core.name)
      };
    });
  }

  /**
   * Maps grant value to a user-friendly label
   * @param {String} grant 
   * @return {String}
   */
  _getLabelForGrant(grant) {
    switch (grant) {
      case 'implicit':
        return 'Implicit';
      case 'authorization_code':
        return 'Authorization code';
      case 'password':
        return 'Password';
      case 'client_credentials':
        return 'Client credentials';
      default:
        return grant;
    }
  }

  render() {
    return html`<style>${this.styles}</style>
    <div>
        ${this._renderGrantType()}
        ${this._renderAccessTokenUri()}
        ${this._renderAuthorizationUri()}
        ${this._renderScopes()}
     </div>`;
  }

  _renderGrantType() {
    const { authorizationGrant } = this;
    if (!authorizationGrant) {
      return '';
    }
    return html`<div><h4>${this._getLabelForGrant(authorizationGrant)}</h4></div>`;
  }

  _renderAccessTokenUri() {
    const { accessTokenUri } = this;
    if (!accessTokenUri) {
      return '';
    }
    return html`<div>
            <h5 data-type="access-token-uri">Access token URI</h5>
            <code class="settings-value">${accessTokenUri}</code>
        </div>`;
  }

  _renderAuthorizationUri() {
    const { authorizationUri } = this;
    if (!authorizationUri) {
      return '';
    }
    return html`<div>
            <h5 data-type="authorization-uri">Authorization URI</h5>
            <code class="settings-value">${authorizationUri}</code>
        </div>`;
  }

  _renderScopes() {
    const { scopes } = this;
    if (!scopes || !scopes.length) {
      return '';
    }
    return html`<div>
            <h5 data-type="authorization-scopes">Authorization scopes</h5>
            <ul>
                ${scopes.map((item) => html`<li class="settings-list-value">${item.label}</li>`)}
            </ul>
        </div>`;
  }
}