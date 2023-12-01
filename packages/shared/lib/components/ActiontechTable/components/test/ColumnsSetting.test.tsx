import { getBySelector } from '../../../../testUtil/customQuery';
import { renderWithTheme } from '../../../../testUtil/customRender';
import { fireEvent, act, cleanup } from '@testing-library/react';

import { ColumnsSettingProps } from '../../index.type';
import ColumnsSetting from '../ColumnsSetting';

describe('lib/ActiontechTable-ColumnsSetting', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllTimers();
    cleanup();
  });
  const customRender = (params: ColumnsSettingProps) => {
    return renderWithTheme(<ColumnsSetting {...params} />);
  };

  it('render setting button', () => {
    const { baseElement } = customRender({
      tableName: 'demo_list',
      username: 'current-test'
    });
    expect(baseElement).toMatchSnapshot();
  });

  it('render ui change when click setting btn', async () => {
    const { baseElement } = customRender({
      tableName: 'demo_list',
      username: 'current-test'
    });
    expect(
      getBySelector('.custom-icon-arrow-down', baseElement)
    ).toBeInTheDocument();
    const btnEle = getBySelector('button.ant-btn');
    await act(async () => {
      fireEvent.click(btnEle);
      await jest.advanceTimersByTime(300);
    });
    expect(
      getBySelector('.custom-icon-arrow-up', baseElement)
    ).toBeInTheDocument();
    expect(baseElement).toMatchSnapshot();
  });
});
