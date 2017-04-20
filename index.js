/*
  @flow weak
 */

import React from 'react'; // peer-dependancy
import mitt from 'mitt'; // DEPENDANCY #1
import PropTypes from 'prop-types'; // DEPENDANCY #2, sorta

const oContextTypes = {
  portalSub: PropTypes.func,
  portalUnsub: PropTypes.func,
  portalSet: PropTypes.func,
  portalGet: PropTypes.func,
};

export class PortalProvider extends React.Component {
  _emitter: *;
  static childContextTypes = oContextTypes;

  state = {};

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
  portalSet = (name, value) => {
    const emitter = this._emitter;
    this.setState({ [name]: value }, () => emitter && emitter.emit(name));
  };

  portalGet = name => this.state[name] || null;

  // 변경
  render() {
    return this.props.children;
  }
}

export class BlackPortal extends React.PureComponent {
  static contextTypes = oContextTypes;
  props: {
    name: string,
    children?: *,
  };
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
  render() {
    const { name } = this.props;
    return null;
  }
}

export class WhitePortal extends React.PureComponent {
  static contextTypes = oContextTypes;
  props: {
    name: string,
    children?: *,
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
    const { name, children } = this.props;
    const { portalGet } = this.context;

    return (portalGet && portalGet(name)) || children || null;
  }
}
