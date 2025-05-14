import userCenter from '../../../../../testUtils/mockApi/userCenter';
import { superRender } from '@actiontech/shared/lib/testUtil/superRender';
import PermissionList from '../List';
import { act, screen, cleanup, fireEvent } from '@testing-library/react';
import { queryBySelector } from '@actiontech/shared/lib/testUtil/customQuery';
import {
  createSpyErrorResponse,
  createSpySuccessResponse
} from '@actiontech/shared/lib/testUtil/mockApi';
import { ListOpPermissionRangeTypeEnum } from '@actiontech/shared/lib/api/base/service/common.enum';
import { IListOpPermission } from '@actiontech/shared/lib/api/base/service/common';
import { UserCenterListEnum } from '../../../index.enum';

describe('base/UserCenter/PermissionList', () => {
  let permissionListSpy: jest.SpyInstance;
  beforeEach(() => {
    jest.useFakeTimers();
    permissionListSpy = userCenter.getOpPermissionsList();
  });

  afterEach(() => {
    jest.useRealTimers();
    cleanup();
  });

  it('should render permission table when request success', async () => {
    const { baseElement } = superRender(
      <PermissionList activePage={UserCenterListEnum.operate_permission_list} />
    );

    await act(async () => jest.advanceTimersByTime(3000));

    expect(permissionListSpy).toHaveBeenCalledTimes(1);
    expect(baseElement).toMatchSnapshot();
    expect(screen.getAllByText('创建项目')).toHaveLength(2);
    expect(screen.getByText('修改项目')).toBeInTheDocument();
    expect(screen.getAllByText('数据源')).toHaveLength(2);
    expect(screen.getByText('共 3 条数据')).toBeInTheDocument();
  });

  it('should render empty tips when request error', async () => {
    permissionListSpy.mockClear();
    permissionListSpy.mockImplementation(() =>
      createSpyErrorResponse({ data: [] })
    );
    const { baseElement } = superRender(
      <PermissionList activePage={UserCenterListEnum.operate_permission_list} />
    );
    await act(async () => jest.advanceTimersByTime(3000));
    expect(baseElement).toMatchSnapshot();
    const element = queryBySelector('.ant-table-placeholder', baseElement);
    expect(element).toBeInTheDocument();
  });

  it('should refresh permission table when click pagination button', async () => {
    permissionListSpy.mockClear();
    const total = 60;
    const mockData: IListOpPermission[] = [];
    for (let i = 0; i < total; i++) {
      mockData.push({
        op_permission: { name: '创建项目', uid: `7000${i}` },
        description: '',
        range_type: ListOpPermissionRangeTypeEnum.db_service
      });
    }
    permissionListSpy.mockImplementation(() =>
      createSpySuccessResponse({
        data: mockData
      })
    );
    const { baseElement } = superRender(
      <PermissionList activePage={UserCenterListEnum.operate_permission_list} />
    );
    await act(async () => jest.advanceTimersByTime(3000));
    expect(baseElement).toMatchSnapshot();
    expect(screen.getByText('共 60 条数据')).toBeInTheDocument();
    const element = queryBySelector('.ant-pagination-item-2', baseElement);
    await act(async () => {
      fireEvent.click(element!);
      await jest.advanceTimersByTime(300);
    });

    expect(permissionListSpy).toHaveBeenCalledTimes(2);
    expect(baseElement).toMatchSnapshot();
  });
});
