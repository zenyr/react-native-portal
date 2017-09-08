import * as React from 'react';

interface BlackPortalProps {
  name: string;
}

export class BlackPortal extends React.Component<BlackPortalProps> {}

interface WhitePortalProps {
  name: string;
  childrenProps?: any;
}

export class WhitePortal extends React.Component<WhitePortalProps> {}

export class PortalProvider extends React.Component {}
