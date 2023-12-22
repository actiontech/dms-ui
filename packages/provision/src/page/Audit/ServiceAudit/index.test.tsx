import { superRender } from '@actiontech/shared/lib/testUtil/customRender';
import { mockProjectInfo } from '@actiontech/shared/lib/testUtil/mockHook/data';
import { mockUseCurrentProject } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentProject';
import { act, cleanup, fireEvent, screen } from '@testing-library/react';
import ServiceAudit from '.';
import auth from '../../../testUtil/mockApi/auth';
import {
  createSpyErrorResponse,
  createSpySuccessResponse
} from '@actiontech/shared/lib/testUtil/mockApi';
import { getBySelector } from '../../../testUtil/customQuery';
import { serviceAuditList } from '../../../testUtil/mockApi/auth/data';
import { selectOptionByIndex } from '@actiontech/shared/lib/testUtil/customQuery';

describe('page/Audit/ServiceAudit', () => {
  const projectID = mockProjectInfo.projectID;
  const customRender = () => {
    return superRender(<ServiceAudit />);
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
    const requestListFn = auth.listDataObjectServiceEvents();
    requestListFn.mockImplementationOnce(() =>
      createSpySuccessResponse({ total_nums: 0, data: [] })
    );
    const { baseElement } = customRender();
    expect(screen.getByText('数据源操作审计')).toBeInTheDocument();
    expect(screen.getByText('筛选')).toBeInTheDocument();
    expect(
      getBySelector('.custom-icon-refresh', baseElement)
    ).toBeInTheDocument();
    expect(baseElement).toMatchSnapshot();

    await act(async () => jest.advanceTimersByTime(3000));
    expect(requestListFn).toBeCalledTimes(1);
    expect(requestListFn).toBeCalledWith({
      filter_by_namespace_uid: projectID,
      keyword: '',
      page_index: 1,
      page_size: 20
    });
    expect(baseElement).toMatchSnapshot();

    fireEvent.click(getBySelector('.custom-icon-refresh', baseElement));
    expect(requestListFn).toBeCalledTimes(2);
    await act(async () => jest.advanceTimersByTime(3000));
  });

  it('render table list when api return data', async () => {
    const requestListFn = auth.listDataObjectServiceEvents();
    const { baseElement } = customRender();

    await act(async () => jest.advanceTimersByTime(3000));
    expect(requestListFn).toBeCalledTimes(1);
    expect(
      screen.getByText(`共 ${serviceAuditList.length} 条数据`)
    ).toBeInTheDocument();
    expect(baseElement).toMatchSnapshot();
  });

  it('render table list when api return error', async () => {
    const requestListFn = auth.listDataObjectServiceEvents();
    requestListFn.mockImplementationOnce(() =>
      createSpyErrorResponse({ message: 'this is a error info' })
    );
    const { baseElement } = customRender();
    await act(async () => jest.advanceTimersByTime(3000));
    expect(screen.getByText('数据源操作审计')).toBeInTheDocument();
    expect(baseElement).toMatchSnapshot();
  });

  it('render column service_audit', async () => {
    const singleData = serviceAuditList[0];
    const requestListFn = auth.listDataObjectServiceEvents();
    requestListFn.mockImplementationOnce(() =>
      createSpySuccessResponse({
        total_nums: 1,
        data: [singleData]
      })
    );
    const { baseElement } = customRender();
    await act(async () => jest.advanceTimersByTime(9300));
    expect(screen.getByText('数据源操作审计')).toBeInTheDocument();
    await act(async () => {
      fireEvent.mouseOver(screen.getByText(`business-1`));
      await jest.advanceTimersByTime(300);
    });
    expect(baseElement).toMatchSnapshot();
  });
  it('render action when click detail drawer', async () => {
    const singleData = serviceAuditList[1];
    const requestListFn = auth.listDataObjectServiceEvents();
    requestListFn.mockImplementationOnce(() =>
      createSpySuccessResponse({
        total_nums: 1,
        data: [singleData]
      })
    );
    const { baseElement } = customRender();
    await act(async () => jest.advanceTimersByTime(9300));
    expect(screen.getByText('数据源操作审计')).toBeInTheDocument();
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

  it('should match filter table params', async () => {
    const requestListFn = auth.listDataObjectServiceEvents();
    const serviceListFn = auth.listServices();
    const businessListFn = auth.listBusinesses();

    const { baseElement } = customRender();
    await act(async () => jest.advanceTimersByTime(3000));

    fireEvent.change(
      getBySelector('#actiontech-table-search-input', baseElement),
      { target: { value: 'test' } }
    );
    expect(serviceListFn).toBeCalledTimes(1);
    expect(serviceListFn).toBeCalledWith({
      page_index: 1,
      page_size: 999,
      filter_by_namespace: projectID
    });
    expect(businessListFn).toBeCalledTimes(1);
    expect(businessListFn).toBeCalledWith({
      namespace_uid: projectID
    });

    expect(requestListFn).toBeCalledTimes(1);
    expect(requestListFn).nthCalledWith(1, {
      page_index: 1,
      page_size: 20,
      filter_by_namespace_uid: projectID,
      keyword: ''
    });

    fireEvent.keyDown(
      getBySelector('#actiontech-table-search-input', baseElement),
      {
        key: 'Enter',
        code: 'Enter',
        keyCode: 13
      }
    );

    expect(requestListFn).toBeCalledTimes(2);
    expect(requestListFn).nthCalledWith(2, {
      page_index: 1,
      page_size: 20,
      filter_by_namespace_uid: projectID,
      keyword: 'test'
    });
  });
});
