## OpenAPI Petstore@1.0.0



This is a sample server Petstore server. For this sample, you can use the api key \"special-key\" to test the authorization filters

### Environment

This generator creates TypeScript/JavaScript client. The generated Node module can be used in the following environments:

Environment
* Parcel

Language level
* ES6

Module system
* CommonJS
* ES6 module system

It can be used in both TypeScript and JavaScript. In TypeScript, the definition should be automatically resolved via `package.json`. ([Reference](http://www.typescriptlang.org/docs/handbook/typings-for-npm-packages.html))

### Building

To build and compile the typescript sources to javascript use:
```
npm install
npm run build
```

### Publishing

First build the package then run ```npm publish```

### Consuming

navigate to the folder of your consuming project and run one of the following commands.

_published:_

```
npm install petstore@1.0.0 --save
```

_unPublished (not recommended):_

```
npm install PATH_TO_GENERATED_PACKAGE --save
