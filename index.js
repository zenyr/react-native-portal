/*
  @flow weak
 */

import React from "react"; // peer-dependency
import mitt from "mitt"; // DEPENDENCY #1
import PropTypes from "prop-types"; // DEPENDENCY #2, sorta

if (!PropTypes) console.warn("<react-native-portal> no PropTypes available");

const ensureSingleChild = children => {
  if (React.Children.count(children) > 1) {
    throw new Error('<react-native-portal> More than 1 child provided to BlackPortal')
  }
}

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
    const portal = this.portals.get(name) || [];
    this._portalSet(name, portal.concat(value));
    return this.portals.get(name).length - 1;
  };

  portalUpdate = (name, index, value) => {
    const portal = this.portals.get(name) || [];
    this._portalSet(
      name,
      portal.map((item, idx) => (index === idx ? value : item))
    );
  };

  portalRemove = (name, index) => {
    const portal = this.portals.get(name) || [];
    this._portalSet(name, portal.filter((_, idx) => idx !== index));
  };

  portalGet = name => this.portals.get(name) || null;

  // 변경
  render() {
    const contextValue = {
      portalAdd: this.portalAdd,
      portalRemove: this.portalRemove,
      portalUpdate: this.portalUpdate,
      portalSub: this.portalSub,
      portalUnsub: this.portalUnsub,
      portalGet: this.portalGet
    };
    return (
      <PortalContext.Provider value={contextValue}>
        {this.props.children}
      </PortalContext.Provider>
    );
  }
}

class _BlackPortal extends React.PureComponent {
  props: {
    name: string,
    children?: *
  };
  componentDidMount() {
    const { name, children, portalAdd } = this.props;
    ensureSingleChild(children)
    this.idx = portalAdd && portalAdd(name, children);
  }
  componentWillReceiveProps(newProps) {
    const oldProps = this.props;
    const { name, children, portalUpdate } = newProps;
    if (oldProps.children != newProps.children) {
      ensureSingleChild(children)
      portalUpdate &&
        portalUpdate(name, this.idx, React.Children.only(children));
    }
  }
  componentWillUnmount() {
    const { name, portalRemove } = this.props;
    portalRemove && portalRemove(name, this.idx);
  }
  render() {
    return null;
  }
}

export const BlackPortal = props => (
  <PortalContext.Consumer>
    {({ portalAdd, portalUpdate, portalRemove }) => (
      <_BlackPortal
        portalAdd={portalAdd}
        portalRemove={portalRemove}
        portalUpdate={portalUpdate}
        {...props}
      />
    )}
  </PortalContext.Consumer>
);

class _WhitePortal extends React.PureComponent {
  props: {
    name: string,
    children?: *,
    childrenProps?: *
  };
  componentWillMount() {
    const { name, portalSub } = this.props;
    portalSub && portalSub(name, this.forceUpdater);
  }
  componentWillUnmount() {
    const { name, portalUnsub } = this.props;
    portalUnsub && portalUnsub(name, this.forceUpdater);
  }
  forceUpdater = () => this.forceUpdate();

  render() {
    const { name, children, childrenProps, portalGet } = this.props;
    const portalChildren = (portalGet && portalGet(name)) || children;
    return (
      (childrenProps && portalChildren
        ? React.Children.map(portalChildren, child => React.cloneElement(child, childrenProps))
        : portalChildren) || null
    );
  }
}

export const WhitePortal = props => (
  <PortalContext.Consumer>
    {({ portalGet, portalSub, portalUnsub }) => (
      <_WhitePortal
        portalSub={portalSub}
        portalUnsub={portalUnsub}
        portalGet={portalGet}
        {...props}
      />
    )}
  </PortalContext.Consumer>
);
