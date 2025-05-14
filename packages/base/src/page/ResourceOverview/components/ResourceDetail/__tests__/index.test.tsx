import ResourceDetail from '../index';
import { baseSuperRender } from '../../../../../testUtils/superRender';
import resourceOverview from '../../../../../testUtils/mockApi/resourceOverview';
import { mockUseCurrentUser } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentUser';
import { mockUseDbServiceDriver } from '@actiontech/shared/lib/testUtil/mockHook/mockUseDbServiceDriver';
import { cleanup, act, fireEvent, screen } from '@testing-library/react';
import EmitterKey from '../../../../../data/EmitterKey';
import EventEmitter from '../../../../../utils/EventEmitter';
import {
  getAllBySelector,
  getBySelector
} from '@actiontech/shared/lib/testUtil/customQuery';
import project from '../../../../../testUtils/mockApi/project';
import dbServices from '../../../../../testUtils/mockApi/dbServices';
import { useNavigate } from 'react-router-dom';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn()
}));

describe('base/page/ResourceDetail/ResourceDetail', () => {
  let getResourceOverviewResourceListV1Spy: jest.SpyInstance;
  let getResourceOverviewTopologyV1Spy: jest.SpyInstance;
  let listBusinessTagsSpy: jest.SpyInstance;
  let listEnvironmentTagsSpy: jest.SpyInstance;
  let getProjectListSpy: jest.SpyInstance;
  let listGlobalDBServicesTipsSpy: jest.SpyInstance;
  let downloadResourceOverviewListSpy: jest.SpyInstance;

  const navigateSpy = jest.fn();

  beforeEach(() => {
    getResourceOverviewResourceListV1Spy =
      resourceOverview.getResourceOverviewResourceListV1();
    getResourceOverviewTopologyV1Spy =
      resourceOverview.getResourceOverviewTopologyV1();
    downloadResourceOverviewListSpy =
      resourceOverview.downloadResourceOverviewList();
    listBusinessTagsSpy = project.listBusinessTags();
    listEnvironmentTagsSpy = project.listEnvironmentTags();
    getProjectListSpy = project.getProjectList();
    listGlobalDBServicesTipsSpy = dbServices.listGlobalDBServicesTips();
    jest.useFakeTimers();
    mockUseCurrentUser();
    mockUseDbServiceDriver();
    (useNavigate as jest.Mock).mockImplementation(() => navigateSpy);
  });

  afterEach(() => {
    jest.useRealTimers();
    cleanup();
  });

  it('render init snap', async () => {
    const { container } = baseSuperRender(<ResourceDetail />);
    await act(async () => {
      jest.advanceTimersByTime(3000);
    });
    expect(container).toMatchSnapshot();
    expect(getResourceOverviewResourceListV1Spy).toHaveBeenCalledTimes(1);
    expect(getResourceOverviewTopologyV1Spy).toHaveBeenCalledTimes(1);
    expect(listBusinessTagsSpy).toHaveBeenCalledTimes(1);
    expect(getProjectListSpy).toHaveBeenCalledTimes(1);
    expect(listGlobalDBServicesTipsSpy).toHaveBeenCalledTimes(1);
  });

  it('should refresh data when emit Refresh_Resource_Overview_Page event', async () => {
    baseSuperRender(<ResourceDetail />);
    await act(async () => jest.advanceTimersByTime(3000));
    expect(getResourceOverviewResourceListV1Spy).toHaveBeenCalledTimes(1);
    expect(getResourceOverviewTopologyV1Spy).toHaveBeenCalledTimes(1);
    await act(async () => {
      EventEmitter.emit(EmitterKey.Refresh_Resource_Overview_Page);
      await jest.advanceTimersByTime(3000);
    });
    expect(getResourceOverviewResourceListV1Spy).toHaveBeenCalledTimes(2);
    expect(getResourceOverviewTopologyV1Spy).toHaveBeenCalledTimes(2);
  });

  it('filter resource list', async () => {
    baseSuperRender(<ResourceDetail />);
    await act(async () => jest.advanceTimersByTime(3000));
    expect(getResourceOverviewResourceListV1Spy).toHaveBeenCalledTimes(1);
    expect(getResourceOverviewTopologyV1Spy).toHaveBeenCalledTimes(1);

    fireEvent.click(getBySelector('.actiontech-filter-button-namespace'));
    await act(async () => jest.advanceTimersByTime(3000));
    const filters = getAllBySelector('.ant-select-selection-search-input');
    expect(getAllBySelector('.custom-select-namespace')).toHaveLength(4);

    // select business tag
    fireEvent.mouseDown(filters[1]);
    await act(async () => jest.advanceTimersByTime(0));
    fireEvent.click(getAllBySelector('.ant-select-item-option-content')[0]);
    await act(async () => jest.advanceTimersByTime(0));
    expect(getProjectListSpy).toHaveBeenCalledTimes(2);
    expect(getResourceOverviewResourceListV1Spy).toHaveBeenCalledTimes(2);
    expect(getResourceOverviewTopologyV1Spy).toHaveBeenCalledTimes(2);

    await act(async () => jest.advanceTimersByTime(3000));
    expect(filters[3]).toBeDisabled();
    // select project
    fireEvent.mouseDown(filters[2]);
    await act(async () => jest.advanceTimersByTime(0));
    fireEvent.click(screen.getByText('test_project_1'));
    await act(async () => jest.advanceTimersByTime(0));
    expect(filters[3]).not.toBeDisabled();
    expect(listEnvironmentTagsSpy).toHaveBeenCalledTimes(1);
    expect(getResourceOverviewResourceListV1Spy).toHaveBeenCalledTimes(3);
    expect(getResourceOverviewTopologyV1Spy).toHaveBeenCalledTimes(3);
  });

  it('navigate to service list page', async () => {
    baseSuperRender(<ResourceDetail />);
    await act(async () => jest.advanceTimersByTime(3000));
    fireEvent.click(screen.getAllByText('查看详情')[0]);
    await act(async () => jest.advanceTimersByTime(0));
    expect(navigateSpy).toHaveBeenCalledWith('/project/1/db-services');
  });

  it('resource tree is fully expanded by default', async () => {
    baseSuperRender(<ResourceDetail />);
    await act(async () => jest.advanceTimersByTime(3000));
    expect(screen.getByText('展开全部').closest('button')).toHaveClass(
      'btn-active'
    );

    fireEvent.click(screen.getByText('折叠全部'));
    await act(async () => jest.advanceTimersByTime(0));
    expect(screen.getByText('展开全部').closest('button')).not.toHaveClass(
      'btn-active'
    );
    expect(screen.getByText('折叠全部').closest('button')).toHaveClass(
      'btn-active'
    );
  });

  it('select resource tree node', async () => {
    baseSuperRender(<ResourceDetail />);
    await act(async () => jest.advanceTimersByTime(3000));

    fireEvent.click(
      getBySelector('span[title="db_service-1"].ant-tree-node-content-wrapper')
    );
    await act(async () => jest.advanceTimersByTime(0));
    expect(getBySelector('.ant-table-row-selected')).toBeInTheDocument();
  });

  it('select table row', async () => {
    baseSuperRender(<ResourceDetail />);
    await act(async () => jest.advanceTimersByTime(3000));

    fireEvent.click(screen.getByText('折叠全部'));
    await act(async () => jest.advanceTimersByTime(0));
    fireEvent.click(getAllBySelector('.ant-table-row')[0]);
    await act(async () => jest.advanceTimersByTime(0));
    expect(getBySelector('.ant-tree-node-selected')).toBeInTheDocument();
  });

  it('download resource list', async () => {
    baseSuperRender(<ResourceDetail />);
    await act(async () => jest.advanceTimersByTime(3000));
    fireEvent.click(screen.getByText('导 出'));
    await act(async () => jest.advanceTimersByTime(0));
    expect(downloadResourceOverviewListSpy).toHaveBeenCalledTimes(1);
  });
});
