/**
 * @test_version ce
 */

import { cleanup, screen } from '@testing-library/react';
import { useNavigate, useParams } from 'react-router-dom';
import { baseSuperRender } from '../../../../testUtils/superRender';
import dms from '../../../../testUtils/mockApi/global';
import { mockProjectInfo } from '@actiontech/shared/lib/testUtil/mockHook/data';
import { SupportTheme, SystemRole } from '@actiontech/shared/lib/enum';
import DataSourceList from '.';
import dbServices from '../../../../testUtils/mockApi/dbServices';

jest.mock('react-router-dom', () => {
  return {
    ...jest.requireActual('react-router-dom'),
    useNavigate: jest.fn(),
    useParams: jest.fn()
  };
});

describe('page/DataSource/DataSourceList', () => {
  const projectID = mockProjectInfo.projectID;
  const navigateSpy = jest.fn();
  const useParamsMock: jest.Mock = useParams as jest.Mock;

  const customRender = (params = {}) => {
    return baseSuperRender(<DataSourceList />, undefined, {
      initStore: {
        user: {
          username: 'admin',
          role: SystemRole.admin,
          bindProjects: [
            {
              is_manager: true,
              project_name: 'default',
              project_id: projectID,
              archived: false
            },
            {
              is_manager: false,
              project_name: 'test',
              project_id: '2',
              archived: false
            }
          ],
          managementPermissions: [],
          theme: SupportTheme.LIGHT,
          uid: '500300',
          ...params
        }
      },
      routerProps: {
        initialEntries: [`/project/${projectID}/db-services`]
      }
    });
  };

  beforeEach(() => {
    jest.useFakeTimers();
    (useNavigate as jest.Mock).mockImplementation(() => navigateSpy);
    useParamsMock.mockReturnValue({ projectID });
    dms.mockAllApi();
    dbServices.ListDBServicesTips();
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
    cleanup();
  });

  it('render list snap', async () => {
    const { baseElement } = customRender();

    expect(screen.getByText('数据源列表')).toBeInTheDocument();
    expect(screen.getByText('添加数据源')).toBeInTheDocument();
    expect(screen.queryByText('批量导入数据源')).not.toBeInTheDocument();
    expect(baseElement).toMatchSnapshot();
  });
});
