/*
  @flow weak
 */

import React from 'react'; // peer-dependency
import mitt from 'mitt'; // DEPENDENCY #1
import PropTypes from 'prop-types'; // DEPENDENCY #2, sorta

if (!PropTypes) console.warn('<react-native-portal> no PropTypes available');

let currentId = 0;
const getId = () => {
  currentId++;
  return currentId;
};

const PortalContext = React.createContext();

export class PortalProvider extends React.Component {
  _emitter: *;

  portals = new Map();

  componentWillMount() {
    this._emitter = new mitt();
  }

  componentWillUnmount() {
    this._emitter = null;
  }

  // 변경시 통지 요청 등록
  portalSub = (name, callback) => {
    const emitter = this._emitter;
    if (emitter) {
      emitter.on(name, callback);
    }
  };

  // 변경시 통지 요청 해제
  portalUnsub = (name, callback) => {
    const emitter = this._emitter;
    if (emitter) {
      emitter.off(name, callback);
    }
  };

  _portalSet = (name, value) => {
    this.portals.set(name, value);
    if (this._emitter) {
      this._emitter.emit(name);
    }
  };

  // 변경
  portalAdd = (name, value) => {
    const portal = this.portals.get(name) || new Map();
    const id = getId();
    this._portalSet(name, portal.set(id, value));
    return id;
  };

  portalUpdate = (name, id, value) => {
    const portal = this.portals.get(name) || new Map();
    this._portalSet(name, portal.set(id, value));
  };

  portalRemove = (name, id) => {
    const portal = this.portals.get(name);
    if (portal) {
      portal.delete(id);
      this._portalSet(name, portal);
    }
  };

  portalGet = name => {
    const portal = this.portals.get(name);
    return portal ? Array.from(portal.values()) : null;
  };

  contextValue = {
    portalAdd: this.portalAdd,
    portalRemove: this.portalRemove,
    portalUpdate: this.portalUpdate,
    portalSub: this.portalSub,
    portalUnsub: this.portalUnsub,
    portalGet: this.portalGet,
  };

  // 변경
  render() {
    return (
      <PortalContext.Provider value={this.contextValue}>
        {this.props.children}
      </PortalContext.Provider>
    );
  }
}

export class BlackPortal extends React.PureComponent {
  static contextType = PortalContext;

  props: {
    name: string,
    children?: *,
  };

  componentDidMount() {
    const { name, children } = this.props;
    const { portalAdd } = this.context;
    this.id = portalAdd && portalAdd(name, children);
  }

  componentWillReceiveProps(newProps) {
    const oldProps = this.props;
    const { name, children } = newProps;
    const { portalUpdate } = this.context;
    if (oldProps.children != newProps.children) {
      portalUpdate && portalUpdate(name, this.id, children);
    }
  }

  componentWillUnmount() {
    const { name } = this.props;
    const { portalRemove } = this.context;
    portalRemove && portalRemove(name, this.id);
  }

  render() {
    return null;
  }
}

export class WhitePortal extends React.PureComponent {
  static contextType = PortalContext;

  props: {
    name: string,
    children?: *,
    childrenProps?: *,
  };

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
        ? React.Children.map(portalChildren, child =>
            React.cloneElement(child, childrenProps)
          )
        : portalChildren) || null
    );
  }
}
