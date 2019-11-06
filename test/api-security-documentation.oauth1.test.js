import { fixture, assert, nextFrame } from '@open-wc/testing';
// import sinon from 'sinon/pkg/sinon-esm.js';
import '../api-security-documentation.js';
import { AmfLoader } from './amf-loader.js';

describe('<api-security-documentation>', function() {
  async function basicFixture() {
    return (await fixture(`<api-security-documentation></api-security-documentation>`));
  }
  async function OAuth1SettingsFixture() {
    return (await fixture(`<api-oauth1-settings-document></api-oauth1-settings-document>`));
  }
  describe('OAuth1 auth', () => {
    [
      ['Regular model', false],
      ['Compact model', true]
    ].forEach(([label, compact]) => {
      describe(label, () => {
        let security;
        let amf;

        before(async () => {
          amf = await AmfLoader.load(compact);
          security = AmfLoader.lookupSecurity(amf, 'oauth_1_0');
        });

        let element;
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
          assert.equal(element.type, 'OAuth 1.0');
        });

        it('description is set', () => {
          assert.equal(
            element.description,
            'OAuth 1.0 continues to be supported for all API requests, but OAuth 2.0 is now preferred.');
        });

        it('headers is set', () => {
          assert.typeOf(element.headers, 'array');
          assert.lengthOf(element.headers, 1);
        });

        it('queryParameters is set', () => {
          assert.typeOf(element.queryParameters, 'array');
          assert.lengthOf(element.queryParameters, 1);
        });

        it('responses is set', () => {
          assert.typeOf(element.responses, 'array');
          assert.lengthOf(element.responses, 1);
        });

        it('settings is set', () => {
          assert.typeOf(element.settings, 'object');
        });

        it('Settings title is rendered', () => {
          const node = element.shadowRoot.querySelector('.settings-title');
          assert.ok(node);
        });

        it('renders OAuth1 settings element', () => {
          const node = element.shadowRoot.querySelector('api-oauth1-settings-document');
          assert.ok(node);
        });

        it('OAuth1 settings element has properties set', () => {
          const node = element.shadowRoot.querySelector('api-oauth1-settings-document');
          assert.typeOf(node.amf, 'array');
          assert.typeOf(node.settings, 'object');
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

        it('renders headers doc element', () => {
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

      describe('api-oauth1-settings-document', () => {
        let security;
        let amf;

        before(async () => {
          amf = await AmfLoader.load(compact);
          security = AmfLoader.lookupSecurity(amf, 'oauth_1_0');
        });

        let element;
        beforeEach(async () => {
          element = await OAuth1SettingsFixture();
          element.amf = amf;
          const settings = element._computePropertyObject(security,
            element.ns.aml.vocabularies.security.settings);
          element.settings = settings;
          await nextFrame();
        });

        it('requestTokenUri is set', () => {
          assert.equal(element.requestTokenUri, 'http://api.domain.com/oauth1/request_token');
        });

        it('authorizationUri is set', () => {
          assert.equal(element.authorizationUri, 'http://api.domain.com/oauth1/authorize');
        });

        it('tokenCredentialsUri is set', () => {
          assert.equal(element.tokenCredentialsUri, 'http://api.domain.com/oauth1/access_token');
        });

        it('signatures is set', () => {
          assert.deepEqual(element.signatures, ['RSA-SHA1', 'HMAC-SHA1']);
        });

        it('Request token uri is rendered', () => {
          const node = element.shadowRoot.querySelector('[data-type="request-token-uri"]');
          assert.ok(node);
        });

        it('Authorizartion uri is rendered', () => {
          const node = element.shadowRoot.querySelector('[data-type="authorization-uri"]');
          assert.ok(node);
        });

        it('Token credentials is rendered', () => {
          const node = element.shadowRoot.querySelector('[data-type="token-credentials-uri"]');
          assert.ok(node);
        });

        it('Signatures list is rendered', () => {
          const node = element.shadowRoot.querySelector('[data-type="signatures"]');
          assert.ok(node);
        });
      });

      describe('a11y', () => {
        let security;
        let amf;

        before(async () => {
          amf = await AmfLoader.load(compact);
          security = AmfLoader.lookupSecurity(amf, 'oauth_1_0');
        });

        let element;
        beforeEach(async () => {
          element = await OAuth1SettingsFixture();
          element.amf = amf;
          const settings = element._computePropertyObject(security,
            element.ns.aml.vocabularies.security.settings);
          element.settings = settings;
          await nextFrame();
        });

        it('is accessible', async () => {
          await assert.isAccessible(element);
        });
      });
    });
  });
});
