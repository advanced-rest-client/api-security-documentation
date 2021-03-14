/* eslint-disable no-param-reassign */
/* eslint-disable class-methods-use-this */
import { LitElement, html, css } from 'lit-element';
import { AmfHelperMixin } from '@api-components/amf-helper-mixin';
import markdownStyles from '@advanced-rest-client/markdown-styles';
import '@advanced-rest-client/arc-marked/arc-marked.js';
import '@api-components/api-annotation-document/api-annotation-document.js';
import '@api-components/api-parameters-document/api-parameters-document.js';
import '@api-components/api-headers-document/api-headers-document.js';
import '@api-components/api-responses-document/api-responses-document.js';
import '../api-oauth2-settings-document.js';
import '../api-oauth1-settings-document.js';
/**
 * `api-security-documentation`
 *
 * Documentation view for AMF security description
 */
export class ApiSecurityDocumentation extends AmfHelperMixin(LitElement) {
  get styles() {
    return [
      markdownStyles,
      css`:host {
        display: block;
      }

      h2 {
        font-size: var(--arc-font-headline-font-size);
        font-weight: var(--arc-font-headline-font-weight);
        letter-spacing: var(--arc-font-headline-letter-spacing);
        line-height: var(--arc-font-headline-line-height);
        color: var(--arc-font-headline-color);
      }

      h3 {
        font-size: var(--arc-font-title-font-size);
        font-weight: var(--arc-font-title-font-weight);
        line-height: var(--arc-font-title-line-height);
        color: var(--arc-font-title-color);
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      :host([narrow]) h1 {
        font-size: 20px;
        margin: 0;
      }

      :host([narrow]) h2 {
        font-size: 18px;
      }

      arc-marked {
        padding: 0;
      }`
    ];
  }

  render() {
    const { description, type, security, settings, amf, queryParameters, headers, responses, narrow } = this;
    const hasCustomProperties = this._computeHasCustomProperties(security);
    let hasOauth1Settings = false;
    let hasOauth2Settings = false;
    if (settings) {
      hasOauth1Settings = this._computeHasOA1Settings(settings);
      hasOauth2Settings = this._computeHasOA2Settings(settings);
    }
    return html`
    <style>${this.styles}</style>
    <section class="title">
      <h2>${type}</h2>
    </section>
    ${hasCustomProperties ? html`<api-annotation-document
      .shape="${security}"></api-annotation-document>`:''}

    ${description ? html`<arc-marked .markdown="${description}" sanitize>
      <div slot="markdown-html" class="markdown-body"></div>
    </arc-marked>`:''}

    ${hasOauth1Settings ? html`<h3 class="settings-title">Settings</h3>
      <api-oauth1-settings-document
      .amf="${amf}"
      .settings="${settings}"></api-oauth1-settings-document>` : ''}

    ${hasOauth2Settings ? html`<h3 class="settings-title">Settings</h3>
      <api-oauth2-settings-document
      .amf="${amf}"
      .settings="${settings}"></api-oauth2-settings-document>` : ''}

    ${queryParameters && queryParameters.length ?
      html`<api-parameters-document
        .amf="${amf}"
        queryOpened
        .queryParameters="${queryParameters}"
        ?narrow="${narrow}"></api-parameters-document>` :
      ''}

    ${headers && headers.length ?
      html`<api-headers-document
        opened
        .amf="${amf}"
        .headers="${headers}"
        ?narrow="${narrow}"></api-headers-document>` :
      ''}

    ${responses && responses.length ?
      html`<section class="response-documentation">
        <h3>Responses</h3>
        <api-responses-document
          .amf="${amf}"
          .returns="${responses}"
          ?narrow="${narrow}"></api-responses-document>
      </section>` :
      ''}`;
  }

  static get properties() {
    return {
      /**
       * A security definition to render.
       * This should be AMF's type of `http://raml.org/vocabularies/security#SecurityScheme`.
       *
       * @type {Object}
       */
      security: { type: Object },
      /**
       * Computed value, scheme of the security
       */
      _scheme: { type: Object },
      /**
       * Security scheme type name.
       * The value is updated automatically when `security` property change.
       */
      type: { type: String },
      /**
       * Security scheme description.
       * The value is updated automatically when `security` property change.
       */
      description: { type: String },
      /**
       * AMF headers model.
       * List of headers to apply to this scheme.
       * This value is updated automatically when `security` property change.
       * {Array<Object>}
       */
      headers: { type: Array },
      /**
       * AMF query parameters model.
       * List of query parameters to apply to this scheme.
       * This value is updated automatically when `security` property change.
       * {Array<Object>}
       */
      queryParameters: { type: Array },
      /**
       * AMF responses model.
       * List of responses applied to this security scheme.
       * This value is updated automatically when `security` property change.
       * {Array<Object>}
       */
      responses: { type: Array },
      /**
       * AMF settings model for a security scheme.
       * This value is updated automatically when `security` property change.
       */
      settings: { type: Object },
      /**
       * Set to render a mobile friendly view.
       */
       narrow: { type: Boolean, reflect: true }
    };
  }

  get security() {
    return this._security;
  }

  set security(value) {
    const old = this._security;
    /* istanbul ignore if */
    if (old === value) {
      return;
    }
    this._security = value;
    this._scheme = this._computeScheme(value);
    this.requestUpdate('security', old);
  }

  get _scheme() {
    return this.__scheme;
  }

  set _scheme(value) {
    const old = this.__scheme;
    if (old === value) {
      return;
    }
    this.__scheme = value;
    this._schemeChanged(value);
  }

  constructor() {
    super();
    /** 
     * @type {any[]}
     */
    this.headers = undefined;
    this.narrow = false;
  }

  __amfChanged() {
    this._scheme = this._computeScheme(this.security);
  }

  /**
   * Computes value of security scheme's scheme model.
   * @param {any} security AMF security description.
   * @return {any|undefined} Security's scheme model.
   */
  _computeScheme(security) {
    if (!security) {
      return undefined;
    }
    if (Array.isArray(security)) {
      [security] = security;
    }
    if (this._hasType(security, this.ns.aml.vocabularies.security.SecurityScheme)) {
      return security;
    }
    // For now, we need to get the first "security:schemes" element so as to not break compatibility
    if (this._hasType(security, this.ns.aml.vocabularies.security.securityRequirement)) {
      const schemesKey = this._getAmfKey(this.ns.aml.vocabularies.security.schemes);
      const schemes = security[schemesKey];
      if (Array.isArray(schemes)) {
        [security] = schemes;
      } else {
        security = schemes;
      }
    }

    const key = this._getAmfKey(this.ns.aml.vocabularies.security.scheme);
    let scheme = security[key];
    if (!scheme) {
      return undefined;
    }
    if (Array.isArray(scheme)) {
      [scheme] = scheme;
    }
    return scheme;
  }

  /**
   * Computes values for properties like `type`, `description`, `headers`,
   * `queryParameters`, `responses` and `settings` when `scheme` property
   * change.
   * @param {any} scheme Scheme model to process.
   */
  _schemeChanged(scheme) {
    this.type = this._computeSecurityType(scheme);
    this.description = this._computeDescription(scheme);
    let headers = this._computeHeaders(scheme);
    if (headers && !Array.isArray(headers)) {
      headers = [headers];
    }
    this.headers = /** @type any[] */ (headers);
    let queryParameters = this._computeQueryParameters(scheme);
    if (queryParameters && !(queryParameters instanceof Array)) {
      queryParameters = [queryParameters];
    }
    this.queryParameters = queryParameters;
    let responses = this._computeResponses(scheme);
    if (responses && !(responses instanceof Array)) {
      responses = [responses];
    }
    this.responses = responses;
    this.settings = this._computeSettings(scheme);
  }

  /**
   * Computes value for security type.
   * @param {any} shape Scheme model.
   * @return {string|undefined}
   */
  _computeSecurityType(shape) {
    return /** @type string */ (this._getValue(shape, this.ns.aml.vocabularies.security.type));
  }

  /**
   * Computes scheme's settings model.
   * @param {any} shape Scheme model.
   * @return {any|undefined} Settings model
   */
  _computeSettings(shape) {
    return this._computePropertyObject(shape, this.ns.aml.vocabularies.security.settings);
  }

  /**
   * @param {any} settings Computed settings object
   * @return {boolean} True if this settings represents OAuth 2 settings
   */
  _computeHasOA2Settings(settings) {
    if (!settings) {
      return false;
    }
    return this._hasType(settings, this.ns.aml.vocabularies.security.OAuth2Settings);
  }

  /**
   * @param {any} settings Computed settings object
   * @return {boolean}
   */
  _computeHasOA1Settings(settings) {
    if (!settings) {
      return false;
    }
    return this._hasType(settings, this.ns.aml.vocabularies.security.OAuth1Settings);
  }
}
