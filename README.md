# DEPRECATED

This component is being deprecated. The code base has been moved to [amf-components](https://github.com/advanced-rest-client/amf-components) module. This module will be archived when [PR 1](https://github.com/advanced-rest-client/amf-components/pull/1) is merged.

-----

Documentation view for AMF security model of an API.

[![Published on NPM](https://img.shields.io/npm/v/@api-components/api-security-documentation.svg)](https://www.npmjs.com/package/@api-components/api-security-documentation)

[![Tests and publishing](https://github.com/advanced-rest-client/api-security-documentation/actions/workflows/deployment.yml/badge.svg)](https://github.com/advanced-rest-client/api-security-documentation/actions/workflows/deployment.yml)

## Version compatibility

This version only works with AMF model version 2 (AMF parser >= 4.0.0).
For compatibility with previous model version use `3.x.x` version of the component.

## Usage

### Installation

```sh
npm install --save @api-components/api-security-documentation
```

The component requires to set 2 properties: `amf` and `security`.
The `amf` property is the whole API model generated by the AMF parser. This property is used to resolve compact moodel's keys.
The `security` property is the part of the API model describing security method. The shape type is `http://a.ml/vocabularies/security#SecurityScheme`.

### In an html file

```html
<html>
  <head>
    <script type="module">
      import '@api-components/api-security-documentation/api-security-documentation.js';
    </script>
  </head>
  <body>
    <api-security-documentation amf="..." security="..."></api-security-documentation>
  </body>
</html>
```

### In a LitElement

```js
import { LitElement, html } from 'lit-element';
import '@api-components/api-security-documentation/api-security-documentation.js';

class SampleElement extends PolymerElement {
  static get properties() {
    return {
      // AMF model for selected security
      security: { type: Object }
    };
  }
  render() {
    return html`
    <api-security-documentation .amf="${this.amf}" .security="${this.security}"></api-security-documentation>
    `;
  }
}
customElements.define('sample-element', SampleElement);
```

## Development

```sh
git clone https://github.com/advanced-rest-client/api-security-documentation
cd api-security-documentation
npm install
```

### Running the demo locally

```sh
npm start
```

### Running the tests

```sh
npm test
```
