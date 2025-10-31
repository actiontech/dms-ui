import { screen } from '@testing-library/react';
import { superRender } from '@actiontech/shared/lib/testUtil/superRender';
import {
  mockUseCurrentUser,
  baseMockApi
} from '@actiontech/shared/lib/testUtil';
import { useDispatch, useSelector } from 'react-redux';
import UserGuide from '../index';
import { mockUseRecentlySelectedZone } from '../../../../testUtils/mockHooks/mockUseRecentlySelectedZone';
import {
  ODC_WORKBENCH_NAME,
  SQL_WORKBENCH_FROM_PARAM_NAME
} from '@actiontech/shared/lib/data/routePaths';

jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useDispatch: jest.fn(),
  useSelector: jest.fn()
}));

describe('UserGuide', () => {
  const mockDispatch = jest.fn();

  beforeEach(() => {
    mockUseCurrentUser({ systemPreference: undefined });
    baseMockApi.cloudBeaver.getSqlQueryUrl();
    baseMockApi.userCenter.updateCurrentUser();
    (useDispatch as jest.Mock).mockImplementation(() => mockDispatch);
    (useSelector as jest.Mock).mockImplementation((selector) => {
      return selector({
        availabilityZone: {
          availabilityZoneTips: []
        }
      });
    });
    mockUseRecentlySelectedZone();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
  });

  it('should render modal when location not form ODC', async () => {
    const { baseElement } = superRender(<UserGuide />);
    expect(baseElement).toMatchSnapshot();
    expect(screen.getByText('请选择默认进入的页面')).toBeInTheDocument();
  });

  it('should render null when location form ODC', async () => {
    Object.defineProperty(window, 'location', {
      value: {
        search: `?${SQL_WORKBENCH_FROM_PARAM_NAME}=${ODC_WORKBENCH_NAME}`
      },
      writable: true
    });
    superRender(<UserGuide />);
    expect(screen.queryByText('请选择默认进入的页面')).not.toBeInTheDocument();
  });
});
