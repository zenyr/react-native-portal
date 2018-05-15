# react-native-portal

[![npm version](https://badge.fury.io/js/react-native-portal.svg)](https://badge.fury.io/js/react-native-portal) [![Build Status](https://travis-ci.com/zenyr/react-native-portal.svg?branch=master)](https://travis-ci.com/zenyr/react-native-portal)

Translocate your render destination. Using [`mitt`](https://npm.im/mitt). Built with `react@16` and `react-native` in mind, but these are not strictly required, as long as `React.PureComponent` is available.

The code itself is very minimal and only rely on react's `context`, and written in `ES6`.

Feel free to file an issue/PR if you have a better way to publish this component.

# Live demo on web

- Although I built this module for `react-native`, it works just as great on web.
- https://codepen.io/zenyr/pen/xLrKPZ

# Aim of this project

- Minimalistic API
- Minimal dependancy
- Use official react API only

# Known issues

- Try not to put falsy `0` or `''` through. ( ͡° ͜ʖ ͡°)
- A behavior of `BlackPortal`s having the exact same `name` is undefined, yet.
  - Ideas appreciated
- Uncanny resemblance with [cloudflare/react-gateway](https://github.com/cloudflare/react-gateway)
  - This one is smaller though
- Has `react-native` in its name but works on anywhere including browser DOM.
- (webpack only) needs proper babel configuration (see **ES6 usage** and **ES5 usage** below)

# Install

1. install npm module
```
npm i react-native-portal -P
or
yarn add react-native-portal --prod
```
Make sure to put `-P` or `--prod` to ignore useless packages for consuming this module.  
It should automatically install `mitt`, only if necessary.

2. Wrap your root component with `PortalProvider`.  
As it requires a single child it is *reasonable* to wrap it in your **entry file**.
```js
import {PortalProvider} from 'react-native-portal'
...
render(<PortalProvider><YourApp /></PortalProvider>, document.querySelector('#app'))
```

3. Put your WhitePortal and BlackPortal as you wish, matching their `name` props.
4. Enjoy your inner peace 🙏

## ES5 usage

You *can* access this module on `react-dom` + legacy browser environment via unpkg.  
Good enough for quick prototyping and goofying around.

```
https://unpkg.com/react-native-portal/dist/es5.js
https://unpkg.com/react-native-portal/dist/min.js
  (expects React global, prop-types & mitt bundled)
```

However I do not recommend this on production 😂

## ES6 usage (outside of `react-native`)

Only refer this if you are going to use this module on browsers or a modified environment.  
<details>
<summary>Solution 1. Vanilla es6 module</summary>

  Since 1.1.1 I've included `dist/noflow.js` in the npm repo.
  It sticks to the pure es6 spec (as of es2015) so you won't need to strip away class properties and flow comments.

  ```js
  import {PortalProvider} from 'react-native-portal/dist/noflow';
  ```

  (I'd better improve those filenames. I'll do a major semver update in that case!)
</details>

<details>
<summary>Solution 2. Babel config</summary>
  This module will work out-of-the-box with most React-native configurations. But you may need to tweak a few options to use `react-native-portal`.

```js
  module: {
    rules: [
      ...
      {
        test: /\.js$/,
        exclude: {
          and: [
            /(node_modules|bower_components)/, // << Note 1
            { not: [/(react-native-portal)/] }, // << Note 2
          ],
        },
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              ...        
            ],
            plugins: [
              ...,
              ['transform-class-properties', { spec: false }], // <<< Note 3. `spec` is optional
              ['transform-flow-strip-types'], // <<< Note 4. Only if you are NOT using flow
            ],
          },
        },
      },
    },
    ...
  }
```

  Above snippet from `webpack.config.js` has 3 lines that you may have to set up properly with `babel-loader`.

  1. It is advised to excluded all `.js` files in *node_modules* from `babel` for performance reasons.
  2. However, it will also exclude `react-native-portal` from transpiling properly. To prevent that, we can use boolean condition to `exclude` option as noted.
  3. if you are not using `stage-N` or proper `env` preset you may have to add `transform-class-properties` plugin.
  4. if you are not using [`flow`](https://flow.org) you must add `transform-flow-strip-types` plugin.

</details>


# Components

## `PortalProvider` = context provider, required

 Match `BlackPortal` and `WhitePortal` by their name. Wrap your app with this component, presumably in App.js or index.js

```html
<PortalProvider>
  <YourAppRoot />
</PortalProvider>
```

## `BlackPortal` = Put things in here

Sends its child until `WhitePortal` renders, and always render `null` in its place. Once unmounted, it will wipe its `children` to `null`.

### props

- `name` : `string`
- `children` : `ReactElement<*> | null`

```html
<BlackPortal name="wow">
  <MyButton onPress={this.whatever} title="I'm going to space"/>
</BlackPortal>

<BlackPortal name={`greet-${user.id}`}>
  <Skeletal>Hello, {user.name}!</Skeletal>
</BlackPortal>
```

If there are no matching exit(`WhitePortal`), `PortalProvider` will simply hold it until requested.

## `WhitePortal` = Things will pop out of here

Renders anything sent from `BlackPortal`. Renders its given child as a fallback.

### props

- `name` : `string`
- `children` : `?ReactElement<*>` - a default child. default: `null`
- `childrenProps` : `?object` - inject props if provided

```html
<WhitePortal name="wow">
  <Text>I only render when there is nothing(falsy) to render from my name</Text>
</WhitePortal>

<WhitePortal name={`greet-${user.id}`} childrenProps={{doot:'thank'}} />
==> renders <Skeletal doot="thank">…</Skeletal>
```
