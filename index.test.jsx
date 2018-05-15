import React from 'react';

import { configure, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { PortalProvider, WhitePortal, BlackPortal } from '.';

configure({ adapter: new Adapter() });
const YourApp = () => <div>ok</div>;
test('smoke test', () => {
  const wrapper = mount(
    <PortalProvider>
      <YourApp />
    </PortalProvider>
  );
  expect(wrapper.contains('ok')).toBeTruthy();
  wrapper.unmount();
});

test('basic', () => {
  const wrapper = mount(
    <PortalProvider>
      <div>
        a
        <WhitePortal name="one" />
        b
        <BlackPortal name="one">1</BlackPortal>
        c
      </div>
    </PortalProvider>
  );
  expect(wrapper.text()).toBe('a1bc');
  wrapper.unmount();
});

test('name mismatch', () => {
  const wrapper = mount(
    <PortalProvider>
      <div>
        a
        <WhitePortal name="two" />
        b
        <BlackPortal name="one">1</BlackPortal>
        c
      </div>
    </PortalProvider>
  );
  expect(wrapper.text()).toBe('abc');
  wrapper.unmount();
});

test('multiple WhitePortal', () => {
  const wrapper = mount(
    <PortalProvider>
      <div>
        a
        <WhitePortal name="one" />
        <WhitePortal name="one" />
        b
        <BlackPortal name="one">1</BlackPortal>
        c
      </div>
    </PortalProvider>
  );
  expect(wrapper.text()).toBe('a11bc');
  wrapper.unmount();
});
