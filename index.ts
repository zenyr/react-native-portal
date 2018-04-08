/*
  @flow weak
 */

import React, { Component } from 'react'; // peer-dependancy
import mitt, { Emitter } from 'mitt'; // DEPENDANCY #1
import PropTypes from 'prop-types'; // DEPENDANCY #2, sorta

if (!PropTypes) console.warn('<react-native-portal> no PropTypes available');

const oContextTypes = {
  portalSub: PropTypes.func,
  portalUnsub: PropTypes.func,
  portalSet: PropTypes.func,
  portalGet: PropTypes.func,
};

type Store = {};

export class PortalProvider extends Component<{}> {
  _emitter: Emitter;
  _store: Store = {};
  static childContextTypes = oContextTypes;

  getChildContext() {
    return {
      portalSub: this.portalSub,
      portalUnsub: this.portalUnsub,
      portalSet: this.portalSet,
      portalGet: this.portalGet,
    };
  }

  componentWillMount() {
    this._emitter = new mitt();
  }

  componentWillUnmount() {
    this._emitter = null;
  }

  // Subscribe to changes
  portalSub = (name, callback) => {
    const emitter = this._emitter;
    if (emitter) {
      emitter.on(name, callback);
    }
  };

  // Unsubscribe to changes
  portalUnsub = (name, callback) => {
    const emitter = this._emitter;
    if (emitter) {
      emitter.off(name, callback);
    }
  };

  // OnChange
  portalSet = (name, value) => {
    const { _emitter: emitter, _store: store } = this;
    store[name] = value;
    emitter.emit(name);
  };

  portalGet = name => this.state[name] || null;

  // 변경
  render() {
    return this.props.children;
  }
}
type BlackProps = { name: string };
export class BlackPortal extends Component<BlackProps> {
  static contextTypes = oContextTypes;
  componentDidMount() {
    const { name, children } = this.props;
    const { portalSet } = this.context;
    portalSet && portalSet(name, children);
  }
  componentWillReceiveProps(newProps) {
    const oldProps = this.props;
    const { name, children } = newProps;
    const { portalSet } = this.context;
    if (oldProps.children != newProps.children) {
      portalSet && portalSet(name, children);
    }
  }
  componentWillUnmount() {
    const { name } = this.props;
    const { portalSet } = this.context;
    portalSet && portalSet(name, null);
  }
  render() {
    const { name } = this.props;
    return null;
  }
}
type WhiteProps = { name: string; childrenProps?: { [propName: string]: any } };
export class WhitePortal extends Component<WhiteProps> {
  static contextTypes = oContextTypes;
  componentWillMount() {
    const { name } = this.props;
    const { portalSub } = this.context;
    portalSub && portalSub(name, this.forceUpdater);
  }
  componentWillUnmount() {
    const { name } = this.props;
    const { portalUnsub } = this.context;
    portalUnsub && portalUnsub(name, this.forceUpdater);
  }
  forceUpdater = () => this.forceUpdate();

  render() {
    const { name, children, childrenProps } = this.props;
    const { portalGet } = this.context;
    const portalChildren = (portalGet && portalGet(name)) || children;
    return (
      (childrenProps && portalChildren
        ? React.cloneElement(React.Children.only(portalChildren), childrenProps)
        : portalChildren) || null
    );
  }
}
