/*
  @flow weak
 */

import React from "react"; // peer-dependency
import mitt from "mitt"; // DEPENDENCY #1
import PropTypes from "prop-types"; // DEPENDENCY #2, sorta

if (!PropTypes) console.warn("<react-native-portal> no PropTypes available");

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

  // 변경
  portalAdd = (name, value) => {
    const portal = this.portals.get(name) || [];
    portal.set(name, portal.append(value));
    if (this._emitter) {
      this._emitter.emit(name);
    }
    return portal.length - 1;
  };

  portalUpdate = (name, id, value) => {
    const portal = this.portals.get(name) || [];
    portal[id] = value;
    portal.set(name, portal.append(value));
    if (this._emitter) {
      this._emitter.emit(name);
    }
  };

  portalRemove = (name, id) => {
    const portal = this.portals.get(name) || [];
    portal.set(name, portal.filter(value => value !== id));
    if (this._emitter) {
      this._emitter.emit(name);
    }
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
    const { name } = this.props;
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
