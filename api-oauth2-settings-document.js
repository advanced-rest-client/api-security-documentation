import {PolymerElement} from '@polymer/polymer/polymer-element.js';
import {html} from '@polymer/polymer/lib/utils/html-tag.js';
import {AmfHelperMixin} from '@api-components/amf-helper-mixin/amf-helper-mixin.js';
import '@polymer/polymer/lib/elements/dom-if.js';
/**
 * `api-oauth2-settings-document`
 *
 * Documentation view for AMF OAuth2 security settings.
 *
 * Settings can be passed by setting the `settings` property to AMF's
 * settings property of Security Scheme.
 *
 * ```html
 * <api-oauth2-settings-document
 *  amf-model="{...}"
 *  settings="{...}"></api-oauth1-settings-document>
 * ```
 *
 * It is also possible to set corresponding properties directly.
 *
 * ```html
 * <api-oauth2-settings-document
 *  amf-model="{...}"
 *  access-token-uri="https://..."
 *  authorization-uri="https://..."
 *  authorization-grants='["implicit"]'></api-oauth1-settings-document>
 * ```
 *
 * ## Styling
 *
 * `<api-oauth2-settings-document>` provides the following custom properties and mixins for styling:
 *
 * Custom property | Description | Default
 * ----------------|-------------|----------
 * `--api-oauth2-settings-document` | Mixin applied to this elment | `{}`
 *
 * @customElement
 * @polymer
 * @demo demo/index.html
 * @memberof ApiElements
 * @appliesMixin AmfHelperMixin
 */
class ApiOauth2SettingsDocument extends AmfHelperMixin(PolymerElement) {
  static get template() {
    return html`
    <style>
    :host {
      display: block;
      @apply --api-oauth2-settings-document;
    }

    h4 {
      @apply --arc-font-subhead;
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
    }

    .settings-list-value {
      background: var(--code-background-color, #f5f2f0);
      display: block;
      padding: 1em;
    }
    </style>
    <template is="dom-if" if="[[hasAccessTokenUri]]">
      <h4 data-type="access-token-uri">Access token URI</h4>
      <code class="settings-value">[[accessTokenUri]]</code>
    </template>

    <template is="dom-if" if="[[hasAuthorizationUri]]">
      <h4 data-type="authorization-uri">Authorization URI</h4>
      <code class="settings-value">[[authorizationUri]]</code>
    </template>

    <template is="dom-if" if="[[hasAuthorizationGrants]]">
      <h4 data-type="authorization-grants">Authorization grants</h4>
      <ul>
        <template is="dom-repeat" items="[[authorizationGrants]]">
          <li class="settings-list-value">[[item]]</li>
        </template>
      </ul>
    </template>

    <template is="dom-if" if="[[hasScopes]]">
      <h4 data-type="authorization-scopes">Authorization scopes</h4>
      <ul>
        <template is="dom-repeat" items="[[scopes]]">
          <li class="settings-list-value">[[item.label]]</li>
        </template>
      </ul>
    </template>
`;
  }

  static get is() {
    return 'api-oauth2-settings-document';
  }
  static get properties() {
    return {
      /**
       * OAuth2 settings scheme of AMF.
       * When this property changes it resets other properties.
       * @type {Object}
       */
      settings: {type: Object, observer: '_settingsChanged'},
      /**
       * Access token URI value.
       * This property is updated when `settings` property chnage.
       */
      accessTokenUri: String,
      /**
       * Computed value, true when `accessTokenUri` is set.
       */
      hasAccessTokenUri: {
        type: Boolean,
        computed: '_computeHasStringValue(accessTokenUri)'
      },
      /**
       * Authorization URI value.
       * This property is updated when `settings` property chnage.
       */
      authorizationUri: String,
      /**
       * Computed value, true when `authorizationUri` is set.
       */
      hasAuthorizationUri: {
        type: Boolean,
        computed: '_computeHasStringValue(authorizationUri)'
      },
      /**
       * List of OAuth2 authorization grants.
       * This property is updated when `settings` property chnage.
       * @type {Array<String>}
       */
      authorizationGrants: Array,
      /**
       * Computed value, true when `authorizationGrants` is set.
       */
      hasAuthorizationGrants: {
        type: Boolean,
        computed: '_computeHasArrayValue(authorizationGrants)'
      },
      /**
       * List of OAuth2 authorization scopes.
       * This property is updated when `settings` property chnage.
       *
       * Each array item must have `label` and optional `description`
       * properties.
       * @type {Array<Object>}
       */
      scopes: Array,
      /**
       * Computed value, true when `scopes` is set.
       */
      hasScopes: {
        type: Boolean,
        computed: '_computeHasArrayValue(scopes)'
      },
      /**
       * Computed value from current `method`. True if the model contains
       * custom properties (annotations in RAML).
       */
      hasCustomProperties: {
        type: Boolean,
        computed: '_computeHasCustomProperties(settings)'
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
    const accessTokenUri = this._computeAccessTokenUri(settings);
    const authorizationUri = this._computeAuthorizationUri(settings);
    let authorizationGrants = this._computeAuthorizationGrants(settings);
    let scopes = this._computeScopes(settings);
    if (authorizationGrants && !(authorizationGrants instanceof Array)) {
      authorizationGrants = [authorizationGrants];
    }
    if (scopes && !(scopes instanceof Array)) {
      scopes = [scopes];
    }

    this.accessTokenUri = accessTokenUri;
    this.authorizationUri = authorizationUri;
    this.authorizationGrants = authorizationGrants;
    this.scopes = scopes;
  }
  /**
   * Computes value for `accessTokenUri` property.
   * @param {Object} settings OAuth2 settings from AMF model.
   * @return {String|undefined}
   */
  _computeAccessTokenUri(settings) {
    return this._getValue(settings, this.ns.raml.vocabularies.security + 'accessTokenUri');
  }
  /**
   * Computes value for `authorizationUri` property.
   * @param {Object} settings OAuth2 settings from AMF model.
   * @return {String|undefined}
   */
  _computeAuthorizationUri(settings) {
    return this._getValue(settings, this.ns.raml.vocabularies.security + 'authorizationUri');
  }
  /**
   * Computes value for `authorizationGrants` property.
   * @param {Object} settings OAuth2 settings from AMF model.
   * @return {Array<String>|undefined}
   */
  _computeAuthorizationGrants(settings) {
    return this._getValueArray(settings, this.ns.raml.vocabularies.security + 'authorizationGrant');
  }
  /**
   * Computes value for `scopes` property.
   * @param {Object} settings OAuth2 settings from AMF model.
   * @return {Array<Object>|undefined}
   */
  _computeScopes(settings) {
    if (!this._hasProperty(settings, this.ns.raml.vocabularies.security + 'scope')) {
      return;
    }
    const key = this._getAmfKey(this.ns.raml.vocabularies.security + 'scope');
    const scopes = this._ensureArray(settings[key]);
    return scopes.map((item) => {
      return {
        description: this._computeDescription(item),
        label: this._getValue(item, this.ns.raml.vocabularies.security + 'name')
      };
    });
  }
}
window.customElements.define(ApiOauth2SettingsDocument.is, ApiOauth2SettingsDocument);
