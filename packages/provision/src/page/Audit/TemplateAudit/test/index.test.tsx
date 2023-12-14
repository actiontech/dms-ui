import { superRender } from '@actiontech/shared/lib/testUtil/customRender';
import { act, cleanup, fireEvent, screen } from '@testing-library/react';

import TemplateAudit from '..';
import { mockUseCurrentProject } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentProject';
import auth from '../../../../testUtil/mockApi/auth';
import { getAllBySelector, getBySelector } from '~/testUtil/customQuery';
import { mockProjectInfo } from '@actiontech/shared/lib/testUtil/mockHook/data';
import {
  createSpyFailResponse,
  createSpySuccessResponse
} from '@actiontech/shared/lib/testUtil/mockApi';
import { templateAuditList } from '~/testUtil/mockApi/auth/data';
import { EventTypeEnum } from '../components/EventType';

describe('page/Auth/TemplateAudit', () => {
  const projectID = mockProjectInfo.projectID;
  const customRender = () => {
    return superRender(<TemplateAudit />);
  };

  beforeEach(() => {
    mockUseCurrentProject();
    jest.useFakeTimers();
    auth.mockAllApi();
  });

  afterEach(() => {
    jest.useRealTimers();
    cleanup();
  });

  it('render init snap', async () => {
    const requestListFn = auth.listDataPermissionTemplateEvents();
    requestListFn.mockImplementationOnce(() =>
      createSpySuccessResponse({ total_nums: 0, data: [] })
    );
    const { baseElement } = customRender();
    await act(async () => jest.advanceTimersByTime(300));
    expect(screen.getByText('权限模版审计')).toBeInTheDocument();
    expect(screen.getByText('筛选')).toBeInTheDocument();
    expect(
      getBySelector('.custom-icon-refresh', baseElement)
    ).toBeInTheDocument();
    expect(baseElement).toMatchSnapshot();

    await act(async () => jest.advanceTimersByTime(9000));
    expect(requestListFn).toBeCalledTimes(1);
    expect(requestListFn).toBeCalledWith({
      filter_by_namespace_uid: projectID,
      keyword: '',
      page_index: 1,
      page_size: 20
    });
    expect(baseElement).toMatchSnapshot();
  });

  it('render table list when api return data', async () => {
    const requestListFn = auth.listDataPermissionTemplateEvents();
    const { baseElement } = customRender();

    await act(async () => jest.advanceTimersByTime(9300));
    expect(requestListFn).toBeCalledTimes(1);
    expect(
      screen.getByText(`共 ${templateAuditList.length} 条数据`)
    ).toBeInTheDocument();
    expect(baseElement).toMatchSnapshot();
  });

  it('render table list when api return error', async () => {
    const requestListFn = auth.listDataPermissionTemplateEvents();
    requestListFn.mockImplementationOnce(() =>
      createSpyFailResponse({ error: 'this is a error info' })
    );
    const { baseElement } = customRender();
    await act(async () => jest.advanceTimersByTime(9300));
    expect(screen.getByText('权限模版审计')).toBeInTheDocument();
    expect(baseElement).toMatchSnapshot();
  });

  describe('render table list when action filter', () => {
    it('render action click filter input', async () => {
      const requestServiceList = auth.listServices();
      const requestUserList = auth.listUsers();
      const requestListFn = auth.listDataPermissionTemplateEvents();
      const { baseElement } = customRender();
      await act(async () => jest.advanceTimersByTime(9300));
      expect(requestServiceList).toBeCalledTimes(1);
      expect(requestUserList).toBeCalledTimes(1);

      const searchInputEle = getBySelector(
        '.basic-input-wrapper #actiontech-table-search-input',
        baseElement
      );
      await act(async () => {
        fireEvent.change(searchInputEle, {
          target: {
            value: '123'
          }
        });
        await act(() => jest.advanceTimersByTime(300));
      });
      await act(async () => {
        fireEvent.keyDown(searchInputEle, {
          key: 'Enter',
          code: 'Enter',
          keyCode: 13
        });
        await act(() => jest.advanceTimersByTime(300));
      });
      await act(async () => jest.advanceTimersByTime(3000));
      expect(requestListFn).toBeCalled();
      expect(requestListFn).toBeCalledWith({
        filter_by_namespace_uid: projectID,
        keyword: '123',
        page_index: 1,
        page_size: 20
      });
    });

    it('render action when filter item show', async () => {
      const requestListFn = auth.listDataPermissionTemplateEvents();
      const { baseElement } = customRender();
      await act(async () => jest.advanceTimersByTime(9300));
      expect(requestListFn).toBeCalledTimes(1);

      fireEvent.click(screen.getByText('筛选'));
      await act(async () => jest.advanceTimersByTime(300));
      const filterItems = getAllBySelector(
        '.actiontech-table-filter-container-namespace .ant-space-item',
        baseElement
      );
      expect(filterItems.length).toBe(3);
      expect(baseElement).toMatchSnapshot();
    });

    it('render action when click event type', async () => {
      const singleData = templateAuditList[1];
      const requestListFn = auth.listDataPermissionTemplateEvents();
      requestListFn.mockImplementationOnce(() =>
        createSpySuccessResponse({
          total_nums: 1,
          data: [singleData]
        })
      );
      const { baseElement } = customRender();
      await act(async () => jest.advanceTimersByTime(9300));
      expect(requestListFn).toBeCalledTimes(1);

      await act(async () => {
        fireEvent.click(screen.getByText('创建权限模版'));
        await act(async () => jest.advanceTimersByTime(300));
      });
      expect(baseElement).toMatchSnapshot();
      await act(async () => jest.advanceTimersByTime(3300));
      expect(requestListFn).toBeCalled();
      expect(requestListFn).nthCalledWith(2, {
        filter_by_event_type: EventTypeEnum.data_permission_template_created,
        filter_by_namespace_uid: projectID,
        keyword: '',
        page_index: 1,
        page_size: 20
      });
    });

    it('render action click refresh', async () => {
      const requestListFn = auth.listDataPermissionTemplateEvents();
      const { baseElement } = customRender();
      await act(async () => jest.advanceTimersByTime(9300));
      expect(requestListFn).toBeCalledTimes(1);

      const refreshBtn = getBySelector('.custom-icon-refresh', baseElement);
      fireEvent.click(refreshBtn);
      await act(async () => jest.advanceTimersByTime(3300));
      expect(requestListFn).toBeCalled();
    });
  });

  describe('render table list when render column', () => {
    it('render column data_permissions', async () => {
      const singleData = templateAuditList[0];
      const requestListFn = auth.listDataPermissionTemplateEvents();
      requestListFn.mockImplementationOnce(() =>
        createSpySuccessResponse({
          total_nums: 1,
          data: [singleData]
        })
      );
      const { baseElement } = customRender();
      await act(async () => jest.advanceTimersByTime(9300));
      expect(screen.getByText('权限模版审计')).toBeInTheDocument();
      await act(async () => {
        fireEvent.mouseOver(screen.getByText(`service-1`));
        await jest.advanceTimersByTime(300);
      });
      expect(baseElement).toMatchSnapshot();
    });
    it('render column event_type', async () => {
      const singleData = templateAuditList[0];
      const requestListFn = auth.listDataPermissionTemplateEvents();
      requestListFn.mockImplementationOnce(() =>
        createSpySuccessResponse({
          total_nums: 1,
          data: [
            {
              ...singleData,
              event_type: 'data_permission_template_created1'
            }
          ]
        })
      );
      const { baseElement } = customRender();
      await act(async () => jest.advanceTimersByTime(9300));
      expect(screen.getByText('权限模版审计')).toBeInTheDocument();
      expect(baseElement).toMatchSnapshot();
    });
    it('render action when click detail drawer', async () => {
      const singleData = templateAuditList[1];
      const requestListFn = auth.listDataPermissionTemplateEvents();
      requestListFn.mockImplementationOnce(() =>
        createSpySuccessResponse({
          total_nums: 1,
          data: [singleData]
        })
      );
      const { baseElement } = customRender();
      await act(async () => jest.advanceTimersByTime(9300));
      expect(screen.getByText('权限模版审计')).toBeInTheDocument();
      await act(async () => {
        fireEvent.click(screen.getByText('详 情'));
        await jest.advanceTimersByTime(300);
      });
      expect(screen.getByText('授权详情')).toBeInTheDocument();
      await act(async () => jest.advanceTimersByTime(1000));
      expect(baseElement).toMatchSnapshot();

      const closeIcon = getBySelector('.anticon-close', baseElement);
      await act(async () => {
        fireEvent.click(closeIcon);
        await jest.advanceTimersByTime(300);
      });
    });

    it('render detail drawer when event_type is not from event_type', async () => {
      const singleData = templateAuditList[1];
      const requestListFn = auth.listDataPermissionTemplateEvents();
      requestListFn.mockImplementationOnce(() =>
        createSpySuccessResponse({
          total_nums: 1,
          data: [
            {
              ...singleData,
              event_type: 'data_permission_template_created1'
            }
          ]
        })
      );
      const { baseElement } = customRender();
      await act(async () => jest.advanceTimersByTime(9300));
      expect(screen.getByText('权限模版审计')).toBeInTheDocument();
      await act(async () => {
        fireEvent.click(screen.getByText('详 情'));
        await jest.advanceTimersByTime(300);
      });
      expect(screen.getByText('授权详情')).toBeInTheDocument();
      await act(async () => jest.advanceTimersByTime(1000));
      expect(baseElement).toMatchSnapshot();
    });
  });
});
