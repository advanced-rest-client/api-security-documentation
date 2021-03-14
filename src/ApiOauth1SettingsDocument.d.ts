import { LitElement, TemplateResult, CSSResult } from 'lit-element';
import { AmfHelperMixin } from '@api-components/amf-helper-mixin';

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
 */
export class ApiOauth1SettingsDocument extends AmfHelperMixin(LitElement) {
  get styles(): CSSResult;

  /**
   * OAuth1 settings scheme of AMF.
   * When this property changes it resets other properties.
   */
  settings: any;

  /**
   * The request token URI from the settings model.
   * Automatically set when `settings` property change.
   * @attribute
   */
  requestTokenUri: string;

  /**
   * The authorization endpoint URI.
   * Automatically set when `settings` property change.
   * @attribute
   */
  authorizationUri: string;

  /**
   * Token credentials endpoint URI.
   * Automatically set when `settings` property change.
   * @attribute
   */
  tokenCredentialsUri: string;

  /**
   * List of signatures used by this authorization server.
   * Automatically set when `settings` property change.
   */
  signatures: string[];
  render(): TemplateResult;

  /**
   * Called automatically when `settings` property change (whole object,
   * not sub property).
   * Sets values of all other properties to the one found in the AMF.
   *
   * @param settings AMF settings to process.
   */
  _settingsChanged(settings: any): void;

  /**
   * If passed argument is an array it returns first object from it. Otherwise
   * it returns the object.
   */
  _deArray(result: any): any;

  /**
   * Computes value of request token endpoint URI.
   *
   * @param settings AMF settings to process.
   * @returns Request token URI value
   */
  _computeRequestTokenUri(settings: any): string;

  /**
   * Computes value of authorization endpoint URI.
   *
   * @param settings AMF settings to process.
   * @returns Authorization URI value
   */
  _computeAuthorizationUri(settings: any): string;

  /**
   * Computes value of token credentials endpoint URI.
   *
   * @param settings AMF settings to process.
   * @returns Token credentials URI value
   */
  _computeTokenCredentialsUri(settings: any): string;

  /**
   * Computes value of OAuth1 signatures.
   *
   * @param settings AMF settings to process.
   * @returns List of signatures.
   */
  _computeSignatures(settings: any): string[];
}
