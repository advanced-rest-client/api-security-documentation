import {PolymerElement} from '@polymer/polymer/polymer-element.js';
import {html} from '@polymer/polymer/lib/utils/html-tag.js';
import {AmfHelperMixin} from '@api-components/amf-helper-mixin/amf-helper-mixin.js';
import '@polymer/polymer/lib/elements/dom-if.js';
import '@api-components/raml-aware/raml-aware.js';
import '@advanced-rest-client/markdown-styles/markdown-styles.js';
import '@polymer/marked-element/marked-element.js';
import '@polymer/iron-flex-layout/iron-flex-layout.js';
import '@api-components/api-annotation-document/api-annotation-document.js';
import '@api-components/api-parameters-document/api-parameters-document.js';
import '@api-components/api-headers-document/api-headers-document.js';
import '@api-components/api-responses-document/api-responses-document.js';
import './api-oauth2-settings-document.js';
import './api-oauth1-settings-document.js';
/**
 * `api-security-documentation`
 *
 * Documentation view for AMF security description
 *
 * ## Styling
 *
 * `<api-security-documentation>` provides the following custom properties and mixins for styling:
 *
 * Custom property | Description | Default
 * ----------------|-------------|----------
 * `--api-security-documentation` | Mixin applied to this elment | `{}`
 * `--arc-font-headline` | Theme mixin, Applied to H1 element | `{}`
 * `--api-security-documentation-title` | Mixin applied to the H1 element | `{}`
 * `--api-security-documentation-title-narrow` | Mixin applied to the H1 element in narrow layout | `{}`
 * `--arc-font-title` | Theme mixin, applied to h2 element | `{}`
 * `--api-security-documentation-main-section-title` | Mixin applied to main sections title element | `{}`
 * `--api-security-documentation-main-section-title-narrow` | Mixin applied to main sections title element in narrow layout | `{}`
 *
 * @customElement
 * @polymer
 * @demo demo/index.html
 * @memberof ApiElements
 * @appliesMixin AmfHelperMixin
 */
class ApiSecurityDocumentation extends AmfHelperMixin(PolymerElement) {
  static get template() {
    return html`
    <style include="markdown-styles"></style>
    <style>
    :host {
      display: block;
      @apply --api-security-documentation;
    }

    h1 {
      @apply --arc-font-headline;
      @apply --api-security-documentation-title;
    }

    h2 {
      @apply --arc-font-title;
      @apply --api-security-documentation-main-section-title;
    }

    :host([narrow]) h1 {
      font-size: 20px;
      margin: 0;
      @apply --api-security-documentation-title-narrow;
    }

    :host([narrow]) h2 {
      font-size: 18px;
      @apply --api-security-documentation-main-section-title-narrow;
    }
    </style>
    <template is="dom-if" if="[[aware]]">
      <raml-aware raml="{{amfModel}}" scope="[[aware]]"></raml-aware>
    </template>
    <section class="title">
      <h1>[[type]]</h1>
    </section>
    <template is="dom-if" if="[[hasCustomProperties]]">
      <api-annotation-document shape="[[security]]"></api-annotation-document>
    </template>
    <template is="dom-if" if="[[_hasDescription]]">
      <marked-element markdown="[[description]]">
        <div slot="markdown-html" class="markdown-body"></div>
      </marked-element>
    </template>
    <template is="dom-if" if="[[_hasSettings]]">
      <template is="dom-if" if="[[_hasOA2Settings]]">
        <h2 class="settings-title">Settings</h2>
        <api-oauth2-settings-document amf-model="[[amfModel]]" settings="[[settings]]"></api-oauth2-settings-document>
      </template>
      <template is="dom-if" if="[[_hasOA1Settings]]">
        <h2 class="settings-title">Settings</h2>
        <api-oauth1-settings-document amf-model="[[amfModel]]" settings="[[settings]]"></api-oauth1-settings-document>
      </template>
    </template>
    <template is="dom-if" if="[[_hasQueryParameters]]">
      <api-parameters-document amf-model="[[amfModel]]" query-opened="" query-parameters="[[queryParameters]]" narrow="[[narrow]]"></api-parameters-document>
    </template>
    <template is="dom-if" if="[[_hasHeaders]]">
      <api-headers-document opened="" amf-model="[[amfModel]]" headers="[[headers]]" narrow="[[narrow]]"></api-headers-document>
    </template>
    <template is="dom-if" if="[[_hasResponses]]">
      <section class="response-documentation">
        <h2>Responses</h2>
        <api-responses-document amf-model="[[amfModel]]" returns="[[responses]]" narrow="[[narrow]]"></api-responses-document>
      </section>
    </template>
`;
  }

  static get is() {
    return 'api-security-documentation';
  }
  static get properties() {
    return {
      /**
       * `raml-aware` scope property to use.
       */
      aware: String,
      /**
       * A security definition to render.
       * This should be AMF's type of `http://raml.org/vocabularies/security#SecurityScheme`.
       *
       * @type {Object}
       */
      security: Object,
      /**
       * Computed value, scheme of the security
       */
      _scheme: {type: Object, computed: '_computeScheme(security, amfModel)', observer: '_schemeChanged'},
      /**
       * Security scheme type name.
       * The value is updated automatically when `security` property change.
       */
      type: String,
      /**
       * Security scheme description.
       * The value is updated automatically when `security` property change.
       */
      description: String,
      /**
       * Computed value, true when `description` has value.
       */
      _hasDescription: {
        type: Boolean,
        computed: '_computeHasStringValue(description)'
      },
      /**
       * AMF headers model.
       * List of headers to apply to this scheme.
       * This value is updated automatically when `security` property change.
       * @type {Array<Object>}
       */
      headers: Array,
      /**
       * Computed value, true when `headers` property is set.
       */
      _hasHeaders: {
        type: Boolean,
        computed: '_computeHasArrayValue(headers)'
      },
      /**
       * AMF query parameters model.
       * List of query parameters to apply to this scheme.
       * This value is updated automatically when `security` property change.
       * @type {Array<Object>}
       */
      queryParameters: Array,
      /**
       * Computed value, true when `queryParameters` has value.
       */
      _hasQueryParameters: {
        type: Boolean,
        computed: '_computeHasArrayValue(queryParameters)'
      },
      /**
       * AMF responses model.
       * List of responses applied to this security scheme.
       * This value is updated automatically when `security` property change.
       * @type {Array<Object>}
       */
      responses: Array,
      /**
       * Computed value, true when responses has any value.
       * @type {Object}
       */
      _hasResponses: {
        type: Boolean,
        computed: '_computeHasArrayValue(responses)'
      },
      /**
       * AMF settings model for a security scheme.
       * This value is updated automatically when `security` property change.
       * @type {Object}
       */
      settings: Object,
      /**
       * Computed value, true when `settings` proeprty is set.
       */
      _hasSettings: {
        type: Boolean,
        computed: '_computeHasStringValue(settings)'
      },
      /**
       * Computed value, true when `settings` proeprty is set and represent
       * OAuth2 security settings.
       */
      _hasOA2Settings: {
        type: Boolean,
        computed: '_computeHasOA2Settings(_hasSettings, settings)'
      },
      /**
       * Computed value, true when `settings` proeprty is set and represent
       * OAuth1 security settings.
       */
      _hasOA1Settings: {
        type: Boolean,
        computed: '_computeHasOA1Settings(_hasSettings, settings)'
      },
      /**
       * Computed value from current `method`. True if the model contains
       * custom properties (annotations in RAML).
       */
      hasCustomProperties: {
        type: Boolean,
        computed: '_computeHasCustomProperties(security)'
      },
      /**
       * Set to render a mobile friendly view.
       */
       narrow: {
         type: Boolean,
         reflectToAttribute: true
       }
    };
  }
  /**
   * Computes value of security scheme's scheme model.
   * @param {Array|Object} security AMF security description.
   * @return {Object} Security's scheme model.
   */
  _computeScheme(security) {
    if (!security) {
      return;
    }
    if (security instanceof Array) {
      security = security[0];
    }
    if (this._hasType(security, this.ns.raml.vocabularies.security + 'SecurityScheme')) {
      return security;
    }
    const key = this._getAmfKey(this.ns.raml.vocabularies.security + 'scheme');
    let scheme = security[key];
    if (!scheme) {
      return;
    }
    if (scheme instanceof Array) {
      scheme = scheme[0];
    }
    return scheme;
  }
  /**
   * Computes values for prroperties like `type`, `description`, `headers`,
   * `queryParameters`, `responses` and `settings` when `scheme` property
   * change.
   * @param {Object} scheme Scheme model to process.
   */
  _schemeChanged(scheme) {
    this.type = this._computeType(scheme);
    this.description = this._computeDescription(scheme);
    let headers = this._computeHeaders(scheme);
    if (headers && !(headers instanceof Array)) {
      headers = [headers];
    }
    this.headers = headers;
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
   * @param {Object} shape Scheme model.
   * @return {String|undefined}
   */
  _computeType(shape) {
    return this._getValue(shape, this.ns.raml.vocabularies.security + 'type');
  }
  /**
   * Computes scheme's settings model.
   * @param {Object} shape Scheme model.
   * @return {Object|undefined} Settings model
   */
  _computeSettings(shape) {
    return this._computePropertyObject(shape, this.ns.raml.vocabularies.security + 'settings');
  }
  /**
   * Computes value for `_hasOA2Settings`
   * @param {Boolean} hasSettings Value of `_hasSettings` proeprty
   * @param {Object|undefined} settings Computed settings object
   * @return {Boolean}
   */
  _computeHasOA2Settings(hasSettings, settings) {
    if (!hasSettings || !settings) {
      return false;
    }
    return this._hasType(settings, this.ns.raml.vocabularies.security + 'OAuth2Settings');
  }
  /**
   * Computes value for `_hasOA1Settings`
   * @param {Boolean} hasSettings Value of `_hasSettings` proeprty
   * @param {Object|undefined} settings Computed settings object
   * @return {Boolean}
   */
  _computeHasOA1Settings(hasSettings, settings) {
    if (!hasSettings || !settings) {
      return false;
    }
    return this._hasType(settings, this.ns.raml.vocabularies.security + 'OAuth1Settings');
  }
}
window.customElements.define(ApiSecurityDocumentation.is, ApiSecurityDocumentation);
