import { LitElement, html, css } from 'lit-element';
import { AmfHelperMixin } from '@api-components/amf-helper-mixin/amf-helper-mixin.js';
import '../api-oauth2-flow-document.js';
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
 * @demo demo/index.html
 * @memberof ApiElements
 * @appliesMixin AmfHelperMixin
 */
export class ApiOauth2SettingsDocument extends AmfHelperMixin(LitElement) {
  static get properties() {
    return {
      /**
       * OAuth2 settings scheme of AMF.
       * When this property changes it resets other properties.
       * @type {Object}
       */
      settings: { type: Object },
      /**
       * List of OAuth2 authorization flows.
       * This property is updated when `settings` property changes.
       * Only available in OAS 3.0+
       * @type {Array<String>}
       */
      flows: { type: Array },
      /**
       * List of OAuth2 authorization grants.
       * This property is updated when `settings` property changes.
       * Not available in OAS 3.0+
       * @type {Array<String>}
       */
      authorizationGrants: { type: Array },
    };
  }

  get styles() {
    return css`:host {
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
    }`;
  }

  get settings() {
    return this._settings;
  }

  set settings(value) {
    const old = this._settings;
    /* istanbul ignore if */
    if (old === value) {
      return;
    }
    this._settings = value;
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
    const flows = this._computeFlows(settings);
    let authorizationGrants = this._computeAuthorizationGrants(settings);
    if (authorizationGrants && !(authorizationGrants instanceof Array)) {
      authorizationGrants = [authorizationGrants];
    }
    this.authorizationGrants = authorizationGrants;
    this.flows = flows;
  }

  /**
   * Computes value for `flows` property.
   * @param {Object} settings OAuth2 settings from AMF model.
   * @return {Array<String>|undefined}
   */
  _computeFlows(settings) {
    return this._getValueArray(settings, this.ns.aml.vocabularies.security.flows);
  }

  /**
   * Computes value for `authorizationGrants` property.
   * @param {Object} settings OAuth2 settings from AMF model.
   * @return {Array<String>|undefined}
   */
  _computeAuthorizationGrants(settings) {
    return this._getValueArray(settings, this.ns.aml.vocabularies.security.authorizationGrant);
  }

  render() {
    return html`<style>${this.styles}</style>
    ${this._renderAuthorizationGrants()}
    ${this._renderFlows()}
    `;
  }

  _renderAuthorizationGrants() {
    const { authorizationGrants = [] } = this;
    return html`<h4 data-type="authorization-grants">Authorization grants</h4>
    <ul>
    ${authorizationGrants.map(grant => html`<li data-type="authorization-grant" class="settings-list-value"">${grant}</li>`)}
    </ul>`;
  }

  _renderFlows() {
    const { flows } = this;
    if (!flows || !flows.length) {
      return '';
    }
    return html`${flows.map(flow => html`<api-oauth2-flow-document .flow=${flow}></api-oauth2-flow-document>`)}`;
  }
}
