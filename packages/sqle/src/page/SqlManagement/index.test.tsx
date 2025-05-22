import { cleanup, screen } from '@testing-library/react';
import SqlManagement from '.';
import { sqleSuperRender } from '../../testUtils/superRender';
import { mockUseCurrentProject } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentProject';
import { mockUseCurrentUser } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentUser';
import { useSelector } from 'react-redux';
import { driverMeta } from '../../hooks/useDatabaseType/index.test.data';
import { ModalName } from '../../data/ModalName';

jest.mock('react-redux', () => {
  return {
    ...jest.requireActual('react-redux'),
    useSelector: jest.fn()
  };
});

describe('page/SqlManagement', () => {
  beforeEach(() => {
    mockUseCurrentProject();
    mockUseCurrentUser();
    (useSelector as jest.Mock).mockImplementation((selector) => {
      return selector({
        database: { driverMeta: driverMeta },
        sqlManagement: {
          modalStatus: {}
        },
        whitelist: { modalStatus: { [ModalName.Add_Whitelist]: false } },
        sqlManagementException: {
          modalStatus: { [ModalName.Create_Sql_Management_Exception]: false }
        },
        permission: {
          moduleFeatureSupport: { sqlOptimization: false },
          userOperationPermissions: null
        }
      });
    });
  });

  afterEach(() => {
    cleanup();
  });

  it('render sql management page', () => {
    const { baseElement } = sqleSuperRender(<SqlManagement />);
    expect(baseElement).toMatchSnapshot();
    expect(screen.getByText('SQL管控')).toBeInTheDocument();
  });
});
