import { fixture, assert, html, nextFrame } from '@open-wc/testing';
// import sinon from 'sinon/pkg/sinon-esm.js';
import '../api-security-documentation.js';
import { AmfLoader } from './amf-loader.js';

describe('<api-security-documentation>', function() {
  async function basicFixture(amf, security) {
    return (await fixture(html`<api-security-documentation
      .amf="${amf}"
      .security="${security}"></api-security-documentation>`));
  }

  async function awareFixture() {
    return (await fixture(`<div>
      <api-security-documentation aware="test-api"></api-security-documentation>
      <raml-aware scope="test-api"></raml-aware>
      </div>`));
  }

  describe('Basic auth', () => {
    [
      ['Regular model', false],
      ['Compact model', true]
    ].forEach(([label, compact]) => {
      describe(label, () => {
        let security;
        let amf;

        before(async () => {
          amf = await AmfLoader.load(compact);
          security = AmfLoader.lookupSecurity(amf, 'basic');
        });

        let element;
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

      describe('raml-aware', () => {
        let amf;

        before(async () => {
          amf = await AmfLoader.load(compact);
        });

        let element;
        beforeEach(async () => {
          const region = await awareFixture();
          const aware = region.querySelector('raml-aware');
          element = region.querySelector('api-security-documentation');
          aware.api = amf;
          await nextFrame();
        });

        it('renders aware component', () => {
          const node = element.shadowRoot.querySelector('raml-aware');
          assert.ok(node);
        });

        it('sets amf property when aware changes', () => {
          assert.typeOf(element.amf, 'array');
        });
      });

      describe('a11y', () => {
        let security;
        let amf;

        before(async () => {
          amf = await AmfLoader.load(compact);
          security = AmfLoader.lookupSecurity(amf, 'basic');
        });

        let element;
        beforeEach(async () => {
          element = await basicFixture(amf, security);
        });

        it('is accessible', async () => {
          await assert.isAccessible(element);
        });
      });
    });
  });
});
