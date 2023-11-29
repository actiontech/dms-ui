import { SelectProps } from 'antd';
import BasicSelect from '.';

import { fireEvent, act, cleanup } from '@testing-library/react';
import { renderWithTheme } from '../../testUtil/customRender';

describe('lib/BasicSelect', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllTimers();
    cleanup();
  });

  const customRender = (params: SelectProps) => {
    return renderWithTheme(<BasicSelect {...params} />);
  };

  it('render diff size select', () => {
    const { container } = customRender({
      size: 'middle'
    });
    expect(container).toMatchSnapshot();

    const { container: container1 } = customRender({
      size: 'small'
    });
    expect(container1).toMatchSnapshot();

    const { container: container2 } = customRender({
      size: 'large',
      className: 'custom-select-class-name'
    });
    expect(container2).toMatchSnapshot();
  });

  it('render loading status', () => {
    const { container } = customRender({
      size: 'middle',
      loading: true
    });
    expect(container).toMatchSnapshot();

    const { container: container1 } = customRender({
      size: 'middle',
      loading: false
    });
    expect(container1).toMatchSnapshot();
  });

  it('render clear icon', () => {
    const { container } = customRender({
      size: 'middle',
      loading: true,
      value: 'a'
    });
    expect(container).toMatchSnapshot();
  });
});
