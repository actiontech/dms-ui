import { superRender } from '@actiontech/shared/lib/testUtil/customRender';
import { CustomToolbar } from './CustomToolbar';
import { fireEvent, screen } from '@testing-library/react';
import { DASHBOARD_COMMON_GET_ORDER_NUMBER } from '.';
import { getBySelector } from '@actiontech/shared/lib/testUtil/customQuery';

describe('page/Home/CustomToolbar', () => {
  it('render custom tool bar', () => {
    const clickMock = jest.fn();
    const { baseElement } = superRender(
      <CustomToolbar
        children="test"
        refreshButton={{ refresh: clickMock, disabled: false }}
      />
    );
    expect(baseElement).toMatchSnapshot();
    expect(screen.getByText('test')).toBeInTheDocument();
    expect(
      screen.getByText(
        `当前表格仅展示前${DASHBOARD_COMMON_GET_ORDER_NUMBER}条数据`
      )
    );
    fireEvent.click(getBySelector('.ant-btn'));
    expect(clickMock).toHaveBeenCalled();
  });
});
