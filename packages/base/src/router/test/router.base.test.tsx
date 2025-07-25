import { MemoryRouterProps } from 'react-router-dom';
import { act, screen, cleanup } from '@testing-library/react';

import mockUseRoutes, { RenderRouterComponent } from './data';
import { baseSuperRender } from '../../testUtils/superRender';
import { mockProjectInfo } from '@actiontech/shared/lib/testUtil/mockHook/data';
import { DataSourceManagerSegmentedKey } from '../../page/DataSourceManagement/index.type';
import userCenter from '@actiontech/shared/lib/testUtil/mockApi/base/userCenter';
import { mockUseRecentlySelectedZone } from '../../testUtils/mockHooks/mockUseRecentlySelectedZone';

describe('base/router-base-ee', () => {
  const projectID = mockProjectInfo.projectID;

  const customRender = (
    initialEntries: MemoryRouterProps['initialEntries'] = []
  ) => {
    return baseSuperRender(<RenderRouterComponent type="auth" />, undefined, {
      routerProps: {
        initialEntries
      }
    });
  };

  beforeEach(() => {
    jest.useFakeTimers();
    userCenter.getUserOpPermission();
    mockUseRecentlySelectedZone();
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.useRealTimers();
    cleanup();
  });

  it('render base route data snap', () => {
    expect(mockUseRoutes('auth')).toMatchSnapshot();
  });

  describe('render base router when version is ce', () => {
    it('render router home', async () => {
      const { baseElement } = customRender(['/']);

      expect(screen.getByText('home')).toBeInTheDocument();
      expect(baseElement).toMatchSnapshot();
    });

    it('render router user-center', async () => {
      const { baseElement } = customRender(['/user-center']);

      expect(screen.getByText('userCenter')).toBeInTheDocument();
      expect(baseElement).toMatchSnapshot();
    });

    it('render router system', async () => {
      const { baseElement } = customRender(['/system']);

      expect(screen.getByText('system')).toBeInTheDocument();
      expect(baseElement).toMatchSnapshot();
    });

    it('render router account', async () => {
      const { baseElement } = customRender(['/account']);

      expect(screen.getByText('account')).toBeInTheDocument();
      expect(baseElement).toMatchSnapshot();
    });

    it('render router transit', async () => {
      const { baseElement } = customRender(['/transit']);

      expect(screen.getByText('transit')).toBeInTheDocument();
      expect(baseElement).toMatchSnapshot();
    });

    it('render router globalDataSource', async () => {
      const { baseElement } = customRender(['/data-source-management']);

      await act(async () => jest.advanceTimersByTime(0));
      expect(baseElement).toMatchSnapshot();
    });

    it('render route globalBatchImportDataSource', async () => {
      const { baseElement } = customRender([
        `/global-data-source/batch-import`
      ]);

      await act(async () => jest.advanceTimersByTime(0));
      expect(
        screen.getByText('globalBatchImportDataSource')
      ).toBeInTheDocument();
      expect(baseElement).toMatchSnapshot();
    });

    it('render route globalDataSourceCreate', async () => {
      const { baseElement } = customRender([`/global-data-source/create`]);

      await act(async () => jest.advanceTimersByTime(0));
      expect(screen.getByText('globalDataSourceCreate')).toBeInTheDocument();
      expect(baseElement).toMatchSnapshot();
    });

    describe('render router project', () => {
      it('render route member', async () => {
        const { baseElement } = customRender([`/project/${projectID}/member`]);

        await act(async () => jest.advanceTimersByTime(0));
        expect(screen.getByText('member')).toBeInTheDocument();
        expect(baseElement).toMatchSnapshot();
      });

      it('render route dataSourceList', async () => {
        const { baseElement } = customRender([
          `/project/${projectID}/db-services`
        ]);

        await act(async () => jest.advanceTimersByTime(0));
        expect(baseElement).toMatchSnapshot();
      });

      it('render route dataSourceCreate', async () => {
        const { baseElement } = customRender([
          `/project/${projectID}/db-services/create`
        ]);

        await act(async () => jest.advanceTimersByTime(0));
        expect(screen.getByText('dataSourceCreate')).toBeInTheDocument();
        expect(baseElement).toMatchSnapshot();
      });

      it('render route dataSourceUpdate', async () => {
        const { baseElement } = customRender([
          `/project/${projectID}/db-services/update/dbServiceUid`
        ]);

        await act(async () => jest.advanceTimersByTime(0));
        expect(screen.getByText('dataSourceUpdate')).toBeInTheDocument();
        expect(baseElement).toMatchSnapshot();
      });

      it('render route batchImportDataSource', async () => {
        const { baseElement } = customRender([
          `/project/${projectID}/db-services/batch-import`
        ]);

        await act(async () => jest.advanceTimersByTime(0));
        expect(screen.getByText('batchImportDataSource')).toBeInTheDocument();
        expect(baseElement).toMatchSnapshot();
      });

      it('render router cloud-beaver', async () => {
        const { baseElement } = customRender([
          `/project/${projectID}/cloud-beaver`
        ]);

        expect(screen.getByText('cloudBeaver')).toBeInTheDocument();
        expect(baseElement).toMatchSnapshot();
      });
    });
  });

  describe('render base router when version is ee', () => {
    describe('render route project', () => {
      it('render router project list', async () => {
        const { baseElement } = customRender(['/project']);

        expect(screen.getByText('projectList')).toBeInTheDocument();
        expect(baseElement).toMatchSnapshot();
      });

      it('render router import project', async () => {
        const { baseElement } = customRender(['/project/import']);

        expect(screen.getByText('projectImport')).toBeInTheDocument();
        expect(baseElement).toMatchSnapshot();
      });

      it('render router batch projectBatchImportDataSource', async () => {
        const { baseElement } = customRender(['/project/batch-import']);

        expect(
          screen.getByText('projectBatchImportDataSource')
        ).toBeInTheDocument();
        expect(baseElement).toMatchSnapshot();
      });
    });

    describe('render route availabilityZone', () => {
      it('render router availabilityZone', async () => {
        const { baseElement } = customRender(['/availability-zone']);

        expect(screen.getByText('availabilityZone')).toBeInTheDocument();
        expect(baseElement).toMatchSnapshot();
      });
    });

    describe('render route resourceOverview', () => {
      it('render router resourceOverview', async () => {
        const { baseElement } = customRender(['/resource-overview']);

        expect(screen.getByText('resourceOverview')).toBeInTheDocument();
        expect(baseElement).toMatchSnapshot();
      });
    });

    describe('render route syncDataSource', () => {
      it('render route syncDataSourceList', async () => {
        const { baseElement } = customRender([
          `/data-source-management?active=${DataSourceManagerSegmentedKey.SyncDataSource}`
        ]);

        await act(async () => jest.advanceTimersByTime(0));
        expect(baseElement).toMatchSnapshot();
      });

      it('render route syncDataSourceList', async () => {
        const { baseElement } = customRender([`/sync-data-source/create`]);

        await act(async () => jest.advanceTimersByTime(0));
        expect(baseElement).toMatchSnapshot();
        expect(screen.getByText('syncDataSourceCreate')).toBeInTheDocument();
      });

      it('render route syncDataSourceList', async () => {
        const { baseElement } = customRender([
          `/sync-data-source/update/taskId`
        ]);

        await act(async () => jest.advanceTimersByTime(0));
        expect(baseElement).toMatchSnapshot();
        expect(screen.getByText('syncDataSourceUpdate')).toBeInTheDocument();
      });
    });

    describe('render route dataExportManagement', () => {
      it('render route dataExportManagement', async () => {
        const { baseElement } = customRender([
          `/project/${projectID}/data/export`
        ]);

        await act(async () => jest.advanceTimersByTime(0));
        expect(baseElement).toMatchSnapshot();
      });

      it('render route CreateExportTask', async () => {
        const { baseElement } = customRender([
          `/project/${projectID}/data/export/create`
        ]);

        await act(async () => jest.advanceTimersByTime(0));
        expect(baseElement).toMatchSnapshot();
        expect(screen.getByText('CreateExportTask')).toBeInTheDocument();
      });

      it('render route ExportTaskDetail', async () => {
        const { baseElement } = customRender([
          `/project/${projectID}/data/export/workflowID`
        ]);

        await act(async () => jest.advanceTimersByTime(0));
        expect(baseElement).toMatchSnapshot();
        expect(screen.getByText('ExportTaskDetail')).toBeInTheDocument();
      });
    });
  });
});
