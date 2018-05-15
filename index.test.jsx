import React from 'react';

import { configure, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { PortalProvider, WhitePortal, BlackPortal } from '.';

configure({ adapter: new Adapter() });

test('is working', () => {
  const wrapper = mount(<div>hey</div>);
  expect(wrapper.contains('hey')).toBeTruthy();
});
