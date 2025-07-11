import { mockUseCurrentProject } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentProject';
import user from '@actiontech/shared/lib/testUtil/mockApi/sqle/user';
import { act, cleanup, fireEvent, screen } from '@testing-library/react';
import { AssignmentFormField } from './index.type';
import AssignmentForm from '.';
import {
  sqleSuperRenderHook,
  sqleSuperRender
} from '../../../../../../testUtils/superRender';
import { Form } from 'antd';
import {
  getAllBySelector,
  getBySelector
} from '@actiontech/shared/lib/testUtil/customQuery';
import { userTipListData } from '@actiontech/shared/lib/testUtil/mockApi/sqle/user/data';

describe('page/SqlManagement/AssignmentForm', () => {
  beforeEach(() => {
    mockUseCurrentProject();
    user.mockAllApi();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
    cleanup();
  });

  const customRender = (data?: { [key: string]: boolean }) => {
    const { result } = sqleSuperRenderHook(() =>
      Form.useForm<AssignmentFormField>()
    );
    return sqleSuperRender(
      <AssignmentForm
        form={result.current[0]}
        init={true}
        submitLoading={false}
        {...data}
      />
    );
  };

  it('render form when not init', async () => {
    const { baseElement } = customRender({ init: false });
    expect(baseElement).toMatchSnapshot();
    fireEvent.mouseDown(getBySelector('#assignees'));
    await act(async () => jest.advanceTimersByTime(300));
    expect(screen.getByText('暂无数据')).toBeInTheDocument();
  });

  it('render form when init', async () => {
    const request = user.getUserTipList();
    const { baseElement } = customRender();
    expect(request).toHaveBeenCalled();
    await act(async () => jest.advanceTimersByTime(3000));
    expect(baseElement).toMatchSnapshot();
    fireEvent.mouseDown(getBySelector('#assignees'));
    await act(async () => jest.advanceTimersByTime(300));
    const options = getAllBySelector('.ant-select-item-option');
    expect(options.length).toBe(5);
    fireEvent.click(options[0]);
    await act(async () => jest.advanceTimersByTime(300));
    expect(screen.getAllByText(userTipListData[0].user_name).length).toBe(2);
    expect(
      screen.getAllByText(userTipListData[0].user_name)?.[0]
    ).toBeInTheDocument();
  });

  it('disable select', async () => {
    const request = user.getUserTipList();
    const { baseElement } = customRender({ submitLoading: true });
    expect(request).toHaveBeenCalled();
    await act(async () => jest.advanceTimersByTime(3000));
    expect(baseElement).toMatchSnapshot();
    expect(getBySelector('.ant-select')).toHaveClass('ant-select-disabled');
  });
});
