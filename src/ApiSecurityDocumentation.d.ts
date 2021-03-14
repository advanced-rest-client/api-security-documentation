import { LitElement, TemplateResult, CSSResult } from 'lit-element';
import { AmfHelperMixin } from '@api-components/amf-helper-mixin';

/**
 * `api-security-documentation`
 *
 * Documentation view for AMF security description
 */
export class ApiSecurityDocumentation extends AmfHelperMixin(LitElement) {
  get styles(): CSSResult[];

  render(): TemplateResult;
  /**
   * A security definition to render.
   * This should be AMF's type of `http://raml.org/vocabularies/security#SecurityScheme`.
   */
  security: any;
  /**
   * Computed value, scheme of the security
   */
  _scheme: any;
  /**
   * Security scheme type name.
   * The value is updated automatically when `security` property change.
   * @attribute
   */
  type: string;
  /**
   * Security scheme description.
   * The value is updated automatically when `security` property change.
   * @attribute
   */
  description: string;
  /**
   * AMF headers model.
   * List of headers to apply to this scheme.
   * This value is updated automatically when `security` property change.
   * {Array<Object>}
   */
  headers: any[];
  /**
   * AMF query parameters model.
   * List of query parameters to apply to this scheme.
   * This value is updated automatically when `security` property change.
   * {Array<Object>}
   */
  queryParameters: any[];
  /**
   * AMF responses model.
   * List of responses applied to this security scheme.
   * This value is updated automatically when `security` property change.
   * {Array<Object>}
   */
  responses: any[];
  /**
   * AMF settings model for a security scheme.
   * This value is updated automatically when `security` property change.
   */
  settings: any;
  /**
   * Set to render a mobile friendly view.
   * @attribute
   */
  narrow: boolean;

  constructor();

  __amfChanged(): void;

  /**
   * Computes value of security scheme's scheme model.
   * @param security AMF security description.
   * @returns Security's scheme model.
   */
  _computeScheme(security: any): any|undefined;

  /**
   * Computes values for properties like `type`, `description`, `headers`,
   * `queryParameters`, `responses` and `settings` when `scheme` property
   * change.
   * @param scheme Scheme model to process.
   */
  _schemeChanged(scheme: any): void;

  /**
   * Computes value for security type.
   * @param shape Scheme model.
   */
  _computeSecurityType(shape: any): string|undefined;

  /**
   * Computes scheme's settings model.
   * @param shape Scheme model.
   * @return Settings model
   */
  _computeSettings(shape: any): any|undefined;

  /**
   * @param settings Computed settings object
   * @return True if this settings represents OAuth 2 settings
   */
  _computeHasOA2Settings(settings: any): boolean;

  /**
   * @param settings Computed settings object
   */
  _computeHasOA1Settings(settings: any): boolean;
}
