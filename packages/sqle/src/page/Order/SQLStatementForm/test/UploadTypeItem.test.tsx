import { cleanup, act, fireEvent, screen } from '@testing-library/react';
import { renderWithTheme } from '../../../../testUtils/customRender';

import UploadTypeItem, { UploadTypeItemProps } from '../UploadTypeItem';

describe('sqle/Order/UploadTypeItem', () => {
  const onClickFn = jest.fn();
  const customRender = (props: Partial<UploadTypeItemProps> = {}) => {
    return renderWithTheme(
      <UploadTypeItem
        active={false}
        onClick={onClickFn}
        children={null}
        hidden={false}
        {...props}
      />
    );
  };

  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.clearAllTimers();
    cleanup();
  });

  it('render default upload type item', () => {
    const { baseElement } = customRender();
    expect(baseElement).toMatchSnapshot();
  });

  it('render default upload type active item', () => {
    const { baseElement } = customRender({ active: true });
    expect(baseElement).toMatchSnapshot();
  });

  it('render hidden default upload type item', () => {
    const { baseElement } = customRender({ hidden: true });
    expect(baseElement).toMatchSnapshot();
  });

  it('render has children', async () => {
    const { baseElement } = customRender({
      children: <span>children node</span>
    });
    expect(baseElement).toMatchSnapshot();
    fireEvent.click(screen.getByText('children node'));
    await act(async () => jest.advanceTimersByTime(300));
    expect(onClickFn).toHaveBeenCalled();
  });
});
