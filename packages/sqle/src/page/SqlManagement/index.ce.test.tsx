/**
 * @test_version ce
 */

import { cleanup, screen } from '@testing-library/react';
import SqlManagement from '.';
import { sqleSuperRender } from '../../testUtils/superRender';
import { mockUseCurrentProject } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentProject';
import { mockUseCurrentUser } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentUser';
import { useSelector } from 'react-redux';
import { driverMeta } from '../../hooks/useDatabaseType/index.test.data';

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
        }
      });
    });
  });

  afterEach(() => {
    cleanup();
  });

  it('render ce sql management page', () => {
    const { baseElement } = sqleSuperRender(<SqlManagement />);
    expect(baseElement).toMatchSnapshot();
    expect(screen.getAllByText('SQL管控')?.[0]).toBeInTheDocument();
  });
});
