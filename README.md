# react-native-portal

Translocate your render destination. Using [mitt](https://npm.im/mitt). Built with `react@16` and `react-native` in mind, but these are not strictly required.

The code itself is very minimal and only rely on react's `context`, and written in `ES6`.

Feel free to file an issue/PR if you have a better way to publish this component.

# Known issues

- Try not to put number `0` or `''` through. ( ͡° ͜ʖ ͡°)

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
- `style?` : `*`

```
<WhitePortal name="wow">
  <Text>I only render when there's nothing to render from my name</Text>
</WhitePortal>
```
