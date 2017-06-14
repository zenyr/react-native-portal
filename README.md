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

# Install

 ```
 npm i react-native-portal
 or
 yarn add react-native-portal
 ```

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
