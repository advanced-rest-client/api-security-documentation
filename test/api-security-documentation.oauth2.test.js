/* eslint-disable prefer-destructuring */
import { fixture, assert, nextFrame } from '@open-wc/testing';
import '../api-security-documentation.js';
import { AmfLoader } from './amf-loader.js';

/** @typedef {import('../').ApiSecurityDocumentation} ApiSecurityDocumentation */
/** @typedef {import('../').ApiOauth2SettingsDocument} ApiOauth2SettingsDocument */
/** @typedef {import('../').ApiOauth2FlowDocument} ApiOauth2FlowDocument */

describe('<api-security-documentation>', () => {
  /**
   * @returns {Promise<ApiSecurityDocumentation>} 
   */
  async function basicFixture() {
    return fixture(`<api-security-documentation></api-security-documentation>`);
  }

  /**
   * @returns {Promise<ApiOauth2SettingsDocument>} 
   */
  async function OAuth2SettingsFixture() {
    return fixture(`<api-oauth2-settings-document></api-oauth2-settings-document>`);
  }

  /**
   * @returns {Promise<ApiOauth2FlowDocument>} 
   */
  async function OAuth2FlowFixture() {
    return fixture(`<api-oauth2-flow-document></api-oauth2-settings-document>`);
  }
  describe('OAuth2 auth', () => {
    [
      ['Regular model', false],
      ['Compact model', true]
    ].forEach(([label, compact]) => {
      describe(String(label), () => {
        let security;
        let amf;

        before(async () => {
          amf = await AmfLoader.load(compact);
          security = AmfLoader.lookupSecurity(amf, 'oauth2Annotated');
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

      describe('api-oauth2-flow-document', () => {
        let security;
        let amf;
        let element = /** @type ApiOauth2FlowDocument */ (null);

        describe('OAS 3.0 model', () => {
          before(async () => {
            amf = await AmfLoader.load(compact, 'multi-oauth2-flow');
            security = AmfLoader.lookupSecurity(amf, 'oAuthSample');
          });

          beforeEach(async () => {
            element = await OAuth2FlowFixture();
            element.amf = amf;
            const settingsKey = element.ns.raml.vocabularies.security.settings;
            let settings = element._computePropertyObject(security, settingsKey);
            if (Array.isArray(settings)) {
              settings = settings[0];
            }
            const flow = AmfLoader.lookupFlowFromSettings(amf, settings, 'authorizationCode');
            element.flow = flow;
            await nextFrame();
          });

          it('accessTokenUri is set', () => {
            assert.equal(element.accessTokenUri, 'https://example.com/oauth/token');
          });

          it('authorizationUri is set', () => {
            assert.equal(element.authorizationUri, 'https://example.com/oauth/authorize');
          });

          it('scopes is set', () => {
            assert.deepEqual(element.scopes, [{
              label: 'read',
              description: 'Grants read access'
            }, {
              label: 'write',
              description: 'Grants write access'
            }, {
              label: 'admin',
              description: 'Grants access to admin operations'
            }]);
          });

          it('Access token uri is rendered', () => {
            assert.exists(element.shadowRoot.querySelector('[data-type="access-token-uri"]'));
          });

          it('Authorization uri is rendered', () => {
            assert.exists(element.shadowRoot.querySelector('[data-type="authorization-uri"]'));
          });

          it('Authorization scopes list is rendered', () => {
            assert.exists(element.shadowRoot.querySelector('[data-type="authorization-scopes"]'));
          });
        });

        describe('RAML model', () => {
          before(async () => {
            amf = await AmfLoader.load(compact);
            security = AmfLoader.lookupSecurity(amf, 'oauth_2_0');
          });

          beforeEach(async () => {
            element = await OAuth2FlowFixture();
            element.amf = amf;
            const settingsKey = element.ns.raml.vocabularies.security.settings;
            let settings = element._computePropertyObject(security, settingsKey);
            if (Array.isArray(settings)) {
              settings = settings[0];
            }
            const flowKey = element.ns.raml.vocabularies.security.flows;
            // @ts-ignore
            const flow = element._computePropertyObject(settings, flowKey);
            element.flow = flow;
            await nextFrame();
          });

          it('accessTokenUri is set', () => {
            assert.equal(element.accessTokenUri, 'http://api.domain.com/oauth2/token');
          });

          it('authorizationUri is set', () => {
            assert.equal(element.authorizationUri, 'http://api.domain.com/oauth2/auth');
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
            assert.exists(node);
          });

          it('Authorization uri is rendered', () => {
            const node = element.shadowRoot.querySelector('[data-type="authorization-uri"]');
            assert.exists(node);
          });

          it('Authorization scopes list is rendered', () => {
            const node = element.shadowRoot.querySelector('[data-type="authorization-scopes"]');
            assert.exists(node);
          });
        });
      });

      describe('api-oauth2-settings-document', () => {
        let security;
        let amf;
        let element = /** @type ApiOauth2SettingsDocument */ (null);

        beforeEach(async () => {
          element = await OAuth2SettingsFixture();
          element.amf = amf;
          const settings = element._computePropertyObject(security,
            element.ns.raml.vocabularies.security.settings);
          element.settings = settings;
          await nextFrame();
        });

        describe('OAS 3.0 model', () => {
          before(async () => {
            amf = await AmfLoader.load(compact, 'multi-oauth2-flow');
            security = AmfLoader.lookupSecurity(amf, 'oAuthSample');
          });

          it('Authorization grants list is not rendered', () => {
            assert.isEmpty(element.shadowRoot.querySelectorAll('[data-type="authorization-grant"]'));
          });

          it('api-oauth2-flow-document is rendered', () => {
            assert.exists(element.shadowRoot.querySelector('api-oauth2-flow-document'));
          });

          it('3 api-oauth2-flow-document components are rendered', () => {
            assert.lengthOf(element.shadowRoot.querySelectorAll('api-oauth2-flow-document'), 3);
          });
        });

        describe('RAML model', () => {
          before(async () => {
            amf = await AmfLoader.load(compact);
            security = AmfLoader.lookupSecurity(amf, 'oauth_2_0');
          });

          it('authorizationGrants is set', () => {
            assert.deepEqual(element.authorizationGrants, ['authorization_code', 'implicit', 'https://schema.org/auth']);
          });

          it('Authorization grants list is rendered', () => {
            const node = element.shadowRoot.querySelectorAll('[data-type="authorization-grant"]');
            assert.lengthOf(node, 3);
          });

          it('api-oauth2-flow-document is rendered', () => {
            assert.exists(element.shadowRoot.querySelector('api-oauth2-flow-document'));
          });

          it('only 1 api-oauth2-flow-document is rendered', () => {
            assert.lengthOf(element.shadowRoot.querySelectorAll('api-oauth2-flow-document'), 1);
          });
        });
      });

      describe('No scopes', () => {
        let security;
        let amf;

        before(async () => {
          amf = await AmfLoader.load();
          security = AmfLoader.lookupSecurity(amf, 'oauth_2_0_no_scopes');
        });

        let element = /** @type ApiOauth2FlowDocument */ (null);
        beforeEach(async () => {
          element = await OAuth2FlowFixture();
          element.amf = amf;
          const settings = /** @type any */ (element._computePropertyObject(security, element.ns.raml.vocabularies.security.settings));
          const flows = /** @type any[] */ (element._getValueArray(settings, element.ns.aml.vocabularies.security.flows));
          element.flow = flows[0];
          await nextFrame();
        });

        it('scopes is empty', () => {
          assert.equal(element.scopes, undefined);
        });
      });

      describe('raml-example-api', () => {
        let security;
        let amf;

        before(async () => {
          amf = await AmfLoader.load(compact, 'raml-example-api');
          const all = AmfLoader.lookupOperationSecurity(amf, '/test-parameters/{feature}', 'get');
          security = all[0];
        });

        let element = /** @type ApiSecurityDocumentation */ (null);
        beforeEach(async () => {
          element = await basicFixture();
          element.amf = amf;
          element.security = security;
          await nextFrame();
        });

        it('renders OAuth2 documentation', () => {
          assert(element.type, 'OAuth 2.0');
        })
      });

      describe('a11y', () => {
        let security;
        let amf;

        before(async () => {
          amf = await AmfLoader.load(compact);
          security = AmfLoader.lookupSecurity(amf, 'oauth_2_0');
        });

        let element = /** @type ApiOauth2SettingsDocument */ (null);
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
