import { fixture, assert, html } from '@open-wc/testing';
import '../api-security-documentation.js';
import { AmfLoader } from './amf-loader.js';

/** @typedef {import('../').ApiSecurityDocumentation} ApiSecurityDocumentation */

describe('ApiSecurityDocumentation', () => {
  /**
   * @param {*} amf
   * @param {*} security
   * @returns {Promise<ApiSecurityDocumentation>} 
   */
  async function basicFixture(amf, security) {
    return fixture(html`<api-security-documentation
      .amf="${amf}"
      .security="${security}"></api-security-documentation>`);
  }

  describe('Basic auth', () => {
    [
      ['Regular model', false],
      ['Compact model', true]
    ].forEach(([label, compact]) => {
      describe(String(label), () => {
        let security;
        let amf;

        before(async () => {
          amf = await AmfLoader.load(compact);
          security = AmfLoader.lookupSecurity(amf, 'basic');
        });

        let element = /** @type ApiSecurityDocumentation */ (null);
        beforeEach(async () => {
          element = await basicFixture(amf, security);
        });

        it('_scheme is computed', () => {
          assert.typeOf(element._scheme, 'object');
        });

        it('type is set', () => {
          assert.equal(element.type, 'Basic Authentication');
        });

        it('description is set', () => {
          assert.typeOf(element.description, 'string');
        });

        it('headers is set', () => {
          assert.typeOf(element.headers, 'array');
          assert.lengthOf(element.headers, 1);
        });

        it('queryParameters is undefined', () => {
          assert.isUndefined(element.queryParameters);
        });

        it('responses is undefined', () => {
          assert.isUndefined(element.responses);
        });

        it('settings is set', () => {
          assert.typeOf(element.settings, 'object');
        });

        it('Settings title is not rendered', () => {
          const node = element.shadowRoot.querySelector('.settings-title');
          assert.notOk(node);
        });

        it('Do not renders OAuth2 settings element', () => {
          const node = element.shadowRoot.querySelector('api-oauth2-settings-document');
          assert.notOk(node);
        });

        it('Do not renders query parameters doc element', () => {
          const node = element.shadowRoot.querySelector('api-parameters-document');
          assert.notOk(node);
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

        it('Do not renders responses doc element', () => {
          const node = element.shadowRoot.querySelector('api-responses-document');
          assert.notOk(node);
        });

        it('accepts security as an array', () => {
          element.security = [security];
          assert.equal(element.type, 'Basic Authentication');
        });
      });

      describe('a11y', () => {
        let security;
        let amf;

        before(async () => {
          amf = await AmfLoader.load(compact);
          security = AmfLoader.lookupSecurity(amf, 'basic');
        });

        let element = /** @type ApiSecurityDocumentation */ (null);
        beforeEach(async () => {
          element = await basicFixture(amf, security);
        });

        it('is accessible', async () => {
          await assert.isAccessible(element, { ignoredRules: ['color-contrast'] });
        });
      });
    });
  });
});
