import { LitElement, html } from 'lit-element';
import { AmfHelperMixin } from '@api-components/amf-helper-mixin/amf-helper-mixin.js';
import '../api-oauth2-settings-document.js';
/**
 * `api-oauth2-settings-documents`
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
 * `<api-oauth2-settings-documents>` provides the following custom properties and mixins for styling:
 *
 * Custom property | Description | Default
 * ----------------|-------------|----------
 * `--api-oauth2-settings-document` | Mixin applied to this elment | `{}`
 *
 * @customElement
 * @demo demo/index.html
 * @memberof ApiElements
 * @appliesMixin AmfHelperMixin
 */
export class ApiOauth2SettingsDocuments extends AmfHelperMixin(LitElement) {
  render() {
    const { authorizationGrants, flows, amf } = this;
    // todo render whole list of flows instead of just first
    return html`<h3 class="settings-title">Settings</h3>
    <api-oauth2-settings-document
    .amf="${amf}"
    .settings="${flows[0]}"
    .authorizationGrants="${authorizationGrants}"></api-oauth2-settings-document>`
  }

  static get properties() {
    return {
      /**
       * OAuth2 settings scheme of AMF.
       * When this property changes it resets other properties.
       * @type {Object}
       */
      flows: { type: Object },
      /**
       * List of OAuth2 authorization grants.
       * This property is updated when `settings` property chnage.
       * @type {Array<String>}
       */
      authorizationGrants: { type: Array }
    };
  }

  get flows() {
    return this._flows;
  }

  set settings(value) {
    const old = this._flows;
    /* istanbul ignore if */
    if (old === value) {
      return;
    }
    this._flows = this._computeFlows(value);
    this._settingsChanged(value);
  }
  /**
   * Called automatically when `settings` property change (whole object,
   * not sub property).
   * Sets values of all other properties to the one found in the AMF.
   *
   * @param {Object} settings AMF settings to process.
   */
  _settingsChanged(settings) {
    let authorizationGrants = this._computeAuthorizationGrants(settings);
    if (authorizationGrants && !(authorizationGrants instanceof Array)) {
      authorizationGrants = [authorizationGrants];
    }

    this.authorizationGrants = authorizationGrants;
  }
  /**
   * Computes value for `authorizationGrants` property.
   * @param {Object} settings OAuth2 settings from AMF model.
   * @return {Array<String>|undefined}
   */
  _computeAuthorizationGrants(settings) {
    return this._getValueArray(settings, this.ns.aml.vocabularies.security.authorizationGrant);
  }
  _computeFlows(settings) {
      return this._getValueArray(settings, this.ns.aml.vocabularies.security.flows);
  }
}
