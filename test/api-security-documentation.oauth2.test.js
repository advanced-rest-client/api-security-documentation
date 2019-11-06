import { fixture, assert, nextFrame } from '@open-wc/testing';
// import sinon from 'sinon/pkg/sinon-esm.js';
import '../api-security-documentation.js';
import { AmfLoader } from './amf-loader.js';

describe('<api-security-documentation>', function() {
  async function basicFixture() {
    return (await fixture(`<api-security-documentation></api-security-documentation>`));
  }
  async function OAuth2SettingsFixture() {
    return (await fixture(`<api-oauth2-settings-document></api-oauth2-settings-document>`));
  }
  describe('OAuth2 auth', () => {
    [
      ['Regular model', false],
      ['Compact model', true]
    ].forEach(([label, compact]) => {
      describe(label, () => {
        let security;
        let amf;

        before(async () => {
          amf = await AmfLoader.load(compact);
          security = AmfLoader.lookupSecurity(amf, 'oauth2Annotated');
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
          assert.equal(element.type, 'OAuth 2.0');
        });

        it('description is not set when empty', () => {
          assert.isUndefined(element.description);
        });

        it('headers is not set when missing', () => {
          assert.isUndefined(element.headers);
        });

        it('queryParameters is set', () => {
          assert.typeOf(element.queryParameters, 'array');
          assert.lengthOf(element.queryParameters, 1);
        });

        it('responses is undefined when not set', () => {
          assert.isUndefined(element.responses);
        });

        it('settings is set', () => {
          assert.typeOf(element.settings, 'object');
        });

        it('Settings title is rendered', () => {
          const node = element.shadowRoot.querySelector('.settings-title');
          assert.ok(node);
        });

        it('renders OAuth2 settings element', () => {
          const node = element.shadowRoot.querySelector('api-oauth2-settings-document');
          assert.ok(node);
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

        it('does not render headers doc element', () => {
          const node = element.shadowRoot.querySelector('api-headers-document');
          assert.notOk(node);
        });

        it('does not render responses doc element', () => {
          const node = element.shadowRoot.querySelector('api-responses-document');
          assert.notOk(node);
        });
      });

      describe('api-oauth2-settings-document', () => {
        let security;
        let amf;

        before(async () => {
          amf = await AmfLoader.load(compact);
          security = AmfLoader.lookupSecurity(amf, 'oauth_2_0');
        });

        let element;
        beforeEach(async () => {
          element = await OAuth2SettingsFixture();
          element.amf = amf;
          const settings = element._computePropertyObject(security,
            element.ns.raml.vocabularies.security.settings);
          element.settings = settings;
          await nextFrame();
        });

        it('accessTokenUri is set', () => {
          assert.equal(element.accessTokenUri, 'http://api.domain.com/oauth2/token');
        });

        it('authorizationUri is set', () => {
          assert.equal(element.authorizationUri, 'http://api.domain.com/oauth2/auth');
        });

        it('authorizationGrants is set', () => {
          assert.deepEqual(element.authorizationGrants, ['authorization_code', 'implicit', 'https://schema.org/auth']);
        });

        it('scopes is set', () => {
          assert.deepEqual(element.scopes, [{
            label: 'profile',
            description: undefined
          }, {
            label: 'email',
            description: undefined
          }]);
        });

        it('Access token uri is rendered', () => {
          const node = element.shadowRoot.querySelector('[data-type="access-token-uri"]');
          assert.ok(node);
        });

        it('Authorizartion uri is rendered', () => {
          const node = element.shadowRoot.querySelector('[data-type="authorization-uri"]');
          assert.ok(node);
        });

        it('Authorization grants list is rendered', () => {
          const node = element.shadowRoot.querySelector('[data-type="authorization-grants"]');
          assert.ok(node);
        });

        it('Authorization scopes list is rendered', () => {
          const node = element.shadowRoot.querySelector('[data-type="authorization-scopes"]');
          assert.ok(node);
        });
      });

      describe('a11y', () => {
        let security;
        let amf;

        before(async () => {
          amf = await AmfLoader.load(compact);
          security = AmfLoader.lookupSecurity(amf, 'oauth_2_0');
        });

        let element;
        beforeEach(async () => {
          element = await OAuth2SettingsFixture();
          element.amf = amf;
          const settings = element._computePropertyObject(security,
            element.ns.raml.vocabularies.security.settings);
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
