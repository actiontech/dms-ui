import { cleanup, fireEvent, screen } from '@testing-library/react';
import ConfigTestPopoverForm from '.';
import { superRender } from '../../../../testUtil/superRender';

describe('base/System/components/ConfigTestPopoverForm', () => {
  const handleTestFn = jest.fn();
  const handleCancelFn = jest.fn();
  const customRender = () => {
    return superRender(
      <ConfigTestPopoverForm
        handleTest={handleTestFn}
        handleCancel={handleCancelFn}
      >
        <div>this is a children node</div>
      </ConfigTestPopoverForm>
    );
  };

  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
    cleanup();
  });

  it('render snap', () => {
    const { baseElement } = customRender();
    expect(baseElement).toMatchSnapshot();
  });

  it('render snap when click cancel btn', async () => {
    customRender();

    expect(screen.getByText('取 消')).toBeInTheDocument();
    fireEvent.click(screen.getByText('取 消'));
    expect(handleCancelFn).toHaveBeenCalled();
  });

  it('render snap when click submit btn', async () => {
    customRender();

    expect(screen.getByText('确 认')).toBeInTheDocument();
    fireEvent.click(screen.getByText('确 认'));
    expect(handleTestFn).toHaveBeenCalled();
  });
});
