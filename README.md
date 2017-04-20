 # react-native-portal gist
 
 Translocate your render destination. Using [mitt](https://npm.im/mitt). Built with `react@16` in mind.

 ## PortalProvider = context provider, required
 
 Match `BlackPortal` and `WhitePortal` by their name.
 
 ```
    <PortalProvider>
      <YourAppRoot />
    </PortalProvider>
  ```
  
## BlackPortal = Put things in here
  
Sends its child until `WhitePortal` renders, and just return null in its place.

### props

- `name` : `string` 
- `children` : `ReactElement<*>`

```
    <BlackPortal name="wow">
      <MyButton onPress={this.whatever} title="I'm going to space"/>
    </BlackPortal>
```
  
## WhitePortal = Things will pop out of this

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