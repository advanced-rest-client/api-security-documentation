import { LitElement, TemplateResult, CSSResult } from "lit-element";
import { AmfHelperMixin } from "@api-components/amf-helper-mixin";

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
 */
export class ApiOauth2SettingsDocument extends AmfHelperMixin(LitElement) {
  /**
   * OAuth2 settings scheme of AMF.
   * When this property changes it resets other properties.
   */
  settings: any;
  /**
  * List of OAuth2 authorization flows.
  * This property is updated when `settings` property changes.
  * Only available in OAS 3.0+
  */
  flows: any[];
  /**
  * List of OAuth2 authorization grants.
  * This property is updated when `settings` property changes.
  * Not available in OAS 3.0+
  */
  authorizationGrants: string[];

  get styles(): CSSResult;

  /**
   * Called automatically when `settings` property change (whole object,
   * not sub property).
   * Sets values of all other properties to the one found in the AMF.
   *
   * @param settings AMF settings to process.
   */
  _settingsChanged(settings: any): void;

  /**
   * Computes value for `flows` property.
   * @param settings OAuth2 settings from AMF model.
   */
  _computeFlows(settings: any): string[]|undefined;

  /**
   * Computes value for `authorizationGrants` property.
   * @param settings OAuth2 settings from AMF model.
   */
  _computeAuthorizationGrants(settings: any): string[]|undefined;

  render(): TemplateResult;

  _renderAuthorizationGrants(): TemplateResult|string;

  _renderFlows(): TemplateResult|string;
}
