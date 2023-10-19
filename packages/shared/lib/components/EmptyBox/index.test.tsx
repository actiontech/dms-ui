import { render } from '@testing-library/react';
import EmptyBox from '.';

describe('EmptyBox', () => {
  it('should render null when "if" and "default" of props was falsy', () => {
    const { container } = render(<EmptyBox>123</EmptyBox>);
    expect(container).toMatchInlineSnapshot(`<div />`);
  });

  it('should render "default" node when "if" of props was falsy and "default" was truthy', () => {
    const { container } = render(
      <EmptyBox defaultNode={'this is default value'}>123</EmptyBox>
    );
    expect(container).toMatchInlineSnapshot(`
      <div>
        this is default value
      </div>
    `);
  });

  it('should render children node when "if" and "default" was truthy', () => {
    const { container } = render(
      <EmptyBox if={true} defaultNode={'this is default value'}>
        123
      </EmptyBox>
    );
    expect(container).toMatchInlineSnapshot(`
      <div>
        123
      </div>
    `);
  });
});
