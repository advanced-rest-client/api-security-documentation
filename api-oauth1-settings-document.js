import {PolymerElement} from '../../@polymer/polymer/polymer-element.js';
import {html} from '../../@polymer/polymer/lib/utils/html-tag.js';
import {AmfHelperMixin} from '../../@api-components/amf-helper-mixin/amf-helper-mixin.js';
import '../../@polymer/polymer/lib/elements/dom-if.js';
/**
 * `api-oauth1-settings-document`
 *
 * Documentation view for AMF OAuth2 security settings.
 *
 * Settings can be passed by setting the `settings` property to AMF's
 * settings property of Security Scheme.
 *
 * ```html
 * <api-oauth1-settings-document
 *  amf-model="{...}"
 *  settings="{...}"></api-oauth1-settings-document>
 * ```
 *
 * It is also possible to set corresponding properties directly.
 *
 * ```html
 * <api-oauth1-settings-document
 *  amf-model="{...}"
 *  request-token-uri="https://..."
 *  authorization-uri="https://..."
 *  signatures='["RSA-SHA1"]'></api-oauth1-settings-document>
 * ```
 *
 * ## Styling
 *
 * `<api-oauth1-settings-document>` provides the following custom properties and mixins for styling:
 *
 * Custom property | Description | Default
 * ----------------|-------------|----------
 * `--api-oauth1-settings-document` | Mixin applied to this elment | `{}`
 *
 * @customElement
 * @polymer
 * @demo demo/index.html
 * @memberof ApiElements
 * @appliesMixin AmfHelperMixin
 */
class ApiOauth1SettingsDocument extends AmfHelperMixin(PolymerElement) {
  static get template() {
    return html`
    <style>
    :host {
      display: block;
      @apply --api-oauth1-settings-document;
    }

    h4 {
      @apply --arc-font-subhead;
    }

    .settings-value {
      background: var(--code-background-color, #f5f2f0);
      display: block;
      padding: 1em;
      margin: .5em 0;
    }
    </style>
    <template is="dom-if" if="[[hasRequestTokenUri]]">
      <h4 data-type="request-token-uri">Request token URI</h4>
      <code class="settings-value">[[requestTokenUri]]</code>
    </template>

    <template is="dom-if" if="[[hasAuthorizationUri]]">
      <h4 data-type="authorization-uri">Authorization URI</h4>
      <code class="settings-value">[[authorizationUri]]</code>
    </template>

    <template is="dom-if" if="[[hasTokenCredentialsUri]]">
      <h4 data-type="token-credentials-uri">Token credentials URI</h4>
      <code class="settings-value">[[tokenCredentialsUri]]</code>
    </template>

    <template is="dom-if" if="[[hasSignatures]]">
      <h4 data-type="signatures">Supported signatures</h4>
      <ul>
        <template is="dom-repeat" items="[[signatures]]">
          <li>[[item]]</li>
        </template>
      </ul>
    </template>
`;
  }

  static get is() {
    return 'api-oauth1-settings-document';
  }
  static get properties() {
    return {
      /**
       * OAuth1 settings scheme of AMF.
       * When this property changes it resets other properties.
       * @type {Object}
       */
      settings: {type: Object, observer: '_settingsChanged'},
      /**
       * The request token URI from the settings model.
       * Automatically set when `settings` property change.
       */
      requestTokenUri: String,
      /**
       * Computed value. True if `requestTokenUri` is set.
       */
      hasRequestTokenUri: {
        type: Boolean,
        computed: '_computeHasStringValue(requestTokenUri)'
      },
      /**
       * The authorization endpoint URI.
       * Automatically set when `settings` property change.
       */
      authorizationUri: String,
      /**
       * Computed value. True if `authorizationUri` is set.
       */
      hasAuthorizationUri: {
        type: Boolean,
        computed: '_computeHasStringValue(authorizationUri)'
      },
      /**
       * Token credentials endpoint URI.
       * Automatically set when `settings` property change.
       */
      tokenCredentialsUri: String,
      /**
       * Computed value. True if `tokenCredentialsUri` is set.
       */
      hasTokenCredentialsUri: {
        type: Boolean,
        computed: '_computeHasStringValue(tokenCredentialsUri)'
      },
      /**
       * List of signatures used by this authorization server.
       * Automatically set when `settings` property change.
       * @type {Array<String>}
       */
      signatures: Array,
      /**
       * Computed value. True if `signatures` is set.
       */
      hasSignatures: {
        type: Boolean,
        computed: '_computeHasArrayValue(signatures)'
      }
    };
  }
  /**
   * Called automatically when `settings` property change (whole object,
   * not sub property).
   * Sets values of all other properties to the one found in the AMF.
   *
   * @param {Object} settings AMF settings to process.
   */
  _settingsChanged(settings) {
    const requestTokenUri = this._computeRequestTokenUri(settings);
    const authorizationUri = this._computeAuthorizationUri(settings);
    const tokenCredentialsUri = this._computeTokenCredentialsUri(settings);
    const signatures = this._computeSignatures(settings);

    this.requestTokenUri = requestTokenUri;
    this.authorizationUri = authorizationUri;
    this.tokenCredentialsUri = tokenCredentialsUri;
    this.signatures = signatures;
  }
  /**
   * If passed argument is an array it returns first object from it. Otherwise
   * it returns the object.
   * @param {any} result
   * @return {any}
   */
  _deArray(result) {
    if (result instanceof Array) {
      result = result[0];
    }
    return result;
  }
  /**
   * Computes value of request token endpoint URI.
   * @param {Object} settings AMF settings to process.
   * @return {String|undefined} Request token URI value
   */
  _computeRequestTokenUri(settings) {
    const result = this._getValue(settings, this.ns.raml.vocabularies.security + 'requestTokenUri');
    return this._deArray(result);
  }
  /**
   * Computes value of authorization endpoint URI.
   * @param {Object} settings AMF settings to process.
   * @return {String|undefined} Authorization URI value
   */
  _computeAuthorizationUri(settings) {
    const result = this._getValue(settings, this.ns.raml.vocabularies.security + 'authorizationUri');
    return this._deArray(result);
  }
  /**
   * Computes value of token credentials endpoint URI.
   * @param {Object} settings AMF settings to process.
   * @return {String|undefined} Token credentials URI value
   */
  _computeTokenCredentialsUri(settings) {
    const result = this._getValue(settings, this.ns.raml.vocabularies.security + 'tokenCredentialsUri');
    return this._deArray(result);
  }
  /**
   * Computes value of OAuth1 signatures.
   * @param {Object} settings AMF settings to process.
   * @return {Array<String>|undefined} List of signatures.
   */
  _computeSignatures(settings) {
    return this._getValueArray(settings, this.ns.raml.vocabularies.security + 'signature');
  }
}
window.customElements.define(ApiOauth1SettingsDocument.is, ApiOauth1SettingsDocument);
