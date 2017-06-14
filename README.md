# react-native-portal

[![npm version](https://badge.fury.io/js/react-native-portal.svg)](https://badge.fury.io/js/react-native-portal)

Translocate your render destination. Using [mitt](https://npm.im/mitt). Built with `react@16` and `react-native` in mind, but these are not strictly required, as long as `React.PureComponent` is available.

The code itself is very minimal and only rely on react's `context`, and written in `ES6`.

Feel free to file an issue/PR if you have a better way to publish this component.

# Aim of this project

- Minimalistic API
- Minimal dependancy

# Known issues

- Try not to put number `0` or `''` through. ( ͡° ͜ʖ ͡°)
- Uncanny resemblance with [cloudflare/react-gateway](https://github.com/cloudflare/react-gateway)
  - This one is smaller though
- Has `react-native` in its name but works on anywhere including browser DOM.
- (webpack only) needs proper babel configuration (see **ES6 usage** below)

# Install

 ```
 npm i react-native-portal
 or
 yarn add react-native-portal
 ```

## ES6 usage
<details>
<summary>Babel config</summary>
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
  3. Also, if you are not using `stage-N` preset you may have to add `transform-class-properties` plugin.

</details>




# Components

## `PortalProvider` = context provider, required

 Match `BlackPortal` and `WhitePortal` by their name. Wrap your app with this component, presumably in App.js or index.js

```
<PortalProvider>
  <YourAppRoot />
</PortalProvider>
```

## `BlackPortal` = Put things in here

Sends its child until `WhitePortal` renders, and always render `null` in its place.

### props

- `name` : `string`
- `children` : `ReactElement<*>`

```
<BlackPortal name="wow">
  <MyButton onPress={this.whatever} title="I'm going to space"/>
</BlackPortal>
```

If there are no matching exit(`WhitePortal`), `PortalProvider` will simply hold it until requested.

## `WhitePortal` = Things will pop out of here

Renders anything sent from `BlackPortal`. Renders its given child as a fallback.

### props

- `name` : `string`
- `children?` : `ReactElement<*>`

```
<WhitePortal name="wow">
  <Text>I only render when there's nothing to render from my name</Text>
</WhitePortal>
```
