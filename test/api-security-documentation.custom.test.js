import { fixture, assert, nextFrame } from '@open-wc/testing';
import '../api-security-documentation.js';
import { AmfLoader } from './amf-loader.js';

/** @typedef {import('../').ApiSecurityDocumentation} ApiSecurityDocumentation */

describe('ApiSecurityDocumentation', () => {
  /**
   * @returns {Promise<ApiSecurityDocumentation>} 
   */
  async function basicFixture() {
    return fixture(`<api-security-documentation></api-security-documentation>`);
  }
  describe('RAML custom auth', () => {
    [
      ['Regular model', false],
      ['Compact model', true]
    ].forEach(([label, compact]) => {
      describe(String(label), () => {
        let security;
        let amf;

        before(async () => {
          amf = await AmfLoader.load(compact);
          security = AmfLoader.lookupSecurity(amf, 'x-custom');
        });

        let element = /** @type ApiSecurityDocumentation */ (null);
        beforeEach(async () => {
          element = await basicFixture();
          element.amf = amf;
          element.security = security;
          await nextFrame();
        });

        it('_scheme is computed', () => {
          assert.typeOf(element._scheme, 'object');
        });

        it('type is set', () => {
          assert.equal(element.type, 'x-custom');
        });

        it('description is set', () => {
          assert.equal(
            element.description,
            'A custom security scheme for authenticating requests.\n');
        });

        it('headers is set', () => {
          assert.typeOf(element.headers, 'array');
          assert.lengthOf(element.headers, 1);
        });

        it('queryParameters is set', () => {
          assert.typeOf(element.queryParameters, 'array');
          assert.lengthOf(element.queryParameters, 2);
        });

        it('responses is set', () => {
          assert.typeOf(element.responses, 'array');
          assert.lengthOf(element.responses, 2);
        });

        it('settings is undefined', () => {
          assert.isUndefined(element.settings);
        });

        it('does not render settings title', () => {
          const node = element.shadowRoot.querySelector('.settings-title');
          assert.notOk(node);
        });

        it('Do not renders OAuth2 settings element', () => {
          const node = element.shadowRoot.querySelector('api-oauth2-settings-document');
          assert.notOk(node);
        });

        it('Do not renders OAuth1 settings element', () => {
          const node = element.shadowRoot.querySelector('api-oauth1-settings-document');
          assert.notOk(node);
        });

        it('renders query parameters doc element', () => {
          const node = element.shadowRoot.querySelector('api-parameters-document');
          assert.ok(node);
        });

        it('sets properties on query parameters element', () => {
          const node = element.shadowRoot.querySelector('api-parameters-document');
          assert.typeOf(node.amf, 'array');
          assert.typeOf(node.queryParameters, 'array');
        });

        it('Renders headers doc element', () => {
          const node = element.shadowRoot.querySelector('api-headers-document');
          assert.ok(node);
        });

        it('Headers element has properties set', () => {
          const node = element.shadowRoot.querySelector('api-headers-document');
          assert.typeOf(node.amf, 'array');
          assert.typeOf(node.headers, 'array');
        });

        it('renders responses doc element', () => {
          const node = element.shadowRoot.querySelector('api-responses-document');
          assert.ok(node);
        });

        it('Responses element has properties set', () => {
          const node = element.shadowRoot.querySelector('api-responses-document');
          assert.typeOf(node.amf, 'array');
          assert.typeOf(node.returns, 'array');
        });
      });

      describe('a11y', () => {
        let security;
        let amf;

        before(async () => {
          amf = await AmfLoader.load(compact);
          security = AmfLoader.lookupSecurity(amf, 'x-custom');
        });

        let element = /** @type ApiSecurityDocumentation */ (null);
        beforeEach(async () => {
          element = await basicFixture();
          element.amf = amf;
          element.security = security;
          await nextFrame();
        });

        it('is accessible', async () => {
          await assert.isAccessible(element, {
            ignoredRules: ['color-contrast', 'aria-required-children']
          });
        });
      });
    });
  });
});
