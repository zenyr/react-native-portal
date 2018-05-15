# 1.3.0
- replace `state` with a private `Map`

# 1.2.0
- add `childrenProps` prop in `WhitePortal`

# 1.1.3
- fix unpkg build (to bundle PropTypes)

# 1.1.2
- fix import in react-native (#2)
- rename `index.*.js` to `dist/*.js`
- add simple check for `PropTypes`

# 1.1.1
- fix broken browser build

# 1.1.0
- Replace main entry to `index.noflow.js` to let users easily consume the module without `transform-class-properties` and `transform-flow-strip-types`
- Add live demo
- Add ES5 build for npm as `index.es5.js` && `index.min.js`
  - available as
    - https://unpkg.com/react-native-portal/index.min.js (note: see 1.1.2)
    - https://unpkg.com/react-native-portal/index.es5.js (note: see 1.1.2)
    - etc. at https://unpkg.com/react-native-portal/

# 1.0.2

- Emit `null` when `BlackPortal` unmounts

# 1.0.1-meta

- Update Readme
- Add prop-types peer dependancy

# 1.0.1

- Updated readme

# 1.0.0

- 2017-04-20
- initial publish
