# broccoli-render-template

Render templates using [consolidate](https://github.com/visionmedia/consolidate.js).

NOTE: you must still install the engines you wish to use, add them to your package.json dependencies.

It uses the filename extension of the template to decide what engine to use.

## Usage

```js
var renderTemplates = require("broccoli-render-template");
var templates = renderTemplates(source);
```

To pass variables to your templates, provide them after the tree:

```js
var templates = renderTemplates(source, {
  foo: 1,
  bar: 2
});
```