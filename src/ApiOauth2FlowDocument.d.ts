import { LitElement, TemplateResult, CSSResult } from "lit-element";
import { AmfHelperMixin } from "@api-components/amf-helper-mixin";

export declare interface FlowScope {
  description: string;
  label: string;
}

export class ApiOauth2FlowDocument extends AmfHelperMixin(LitElement) {
  /**
   * Access token URI value.
   * This property is updated when `flow` property changes.
   * @attribute
   */
  accessTokenUri: string;
  /**
  * Authorization URI value.
  * This property is updated when `flow` property changes.
  * @attribute
  */
  authorizationUri: string;
  /**
  * Value of OAuth2 authorization grant.
  * This property is updated when `flow` property changes.
  * Only available in OAS 3.0+
  * @attribute
  */
  authorizationGrant: string;
  /**
  * List of OAuth2 authorization scopes.
  * This property is updated when `flow` property changes.
  *
  * Each array item must have `label` and optional `description`
  * properties.
  */
  scopes: FlowScope[];

  get styles(): CSSResult;

  /**
   * The flow definition to render.
   */
  flow: any;

  _flowChanged(flow: any): void;

  /**
   * Computes value for `accessTokenUri` property.
   * @param flow OAuth2 flow from AMF model.
   */
  _computeAccessTokenUri(flow: any): string|undefined;

  /**
   * Computes value for `authorizationUri` property.
   * @param flow OAuth2 flow from AMF model.
   */
  _computeAuthorizationUri(flow: any): string|undefined;

  /**
   * Computes value for `authorizationGrant` property.
   * @param flow OAuth2 flow from AMF model.
   */
  _computeAuthorizationGrant(flow: any): string|undefined;

  /**
   * Computes value for `scopes` property.
   * @param flow OAuth2 flow from AMF model.
   */
  _computeScopes(flow: any): FlowScope[];

  /**
   * Maps grant value to a user-friendly label
   */
  _getLabelForGrant(grant: string): string;

  render(): TemplateResult;

  _renderGrantType(): TemplateResult|string;

  _renderAccessTokenUri(): TemplateResult|string;

  _renderAuthorizationUri(): TemplateResult|string;

  _renderScopes(): TemplateResult|string;
}
