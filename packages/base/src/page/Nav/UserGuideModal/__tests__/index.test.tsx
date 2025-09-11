import { fireEvent, screen, act } from '@testing-library/react';
import { superRender } from '@actiontech/shared/lib/testUtil/superRender';
import {
  mockUseCurrentUser,
  baseMockApi,
  createSpySuccessResponse
} from '@actiontech/shared/lib/testUtil';
import { useDispatch } from 'react-redux';
import { GetUserSystemEnum } from '@actiontech/shared/lib/api/base/service/common.enum';
import { updateSystemPreference } from '../../../../store/user';
import UserGuideModal from '../index';

jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useDispatch: jest.fn()
}));

jest.mock('../../../../data/metaEnv', () => ({
  isPROD: true
}));

const originLocation = window.location;
Object.defineProperty(window, 'location', {
  value: {
    ...originLocation
  },
  writable: true
});

describe('UserGuideModal', () => {
  const mockDispatch = jest.fn();
  let getSQLQueryConfigurationSpy: jest.SpyInstance;
  let updateCurrentUserSpy: jest.SpyInstance;

  beforeEach(() => {
    mockUseCurrentUser();
    getSQLQueryConfigurationSpy = baseMockApi.cloudBeaver.getSqlQueryUrl();
    updateCurrentUserSpy = baseMockApi.userCenter.updateCurrentUser();
    (useDispatch as jest.Mock).mockImplementation(() => mockDispatch);
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
  });

  it('should render correctly when systemPreference is undefined', async () => {
    mockUseCurrentUser({ systemPreference: undefined });
    const { baseElement } = superRender(<UserGuideModal />);
    expect(baseElement).toMatchSnapshot();
    expect(screen.getByText('请选择默认进入的页面')).toBeInTheDocument();
  });

  it('should not render modal when systemPreference is MANAGEMENT', () => {
    mockUseCurrentUser({
      systemPreference: GetUserSystemEnum.MANAGEMENT
    });
    superRender(<UserGuideModal />);

    expect(screen.queryByText('请选择默认进入的页面')).not.toBeInTheDocument();
  });

  it('should open CloudBeaver automatically when systemPreference is WORKBENCH', async () => {
    mockUseCurrentUser({
      systemPreference: GetUserSystemEnum.WORKBENCH
    });

    getSQLQueryConfigurationSpy.mockImplementation(() =>
      createSpySuccessResponse({
        data: {
          enable_sql_query: true,
          sql_query_root_uri: '/cloudbeaver'
        }
      })
    );

    superRender(<UserGuideModal />);

    await act(async () => jest.advanceTimersByTime(3000));

    expect(getSQLQueryConfigurationSpy).toHaveBeenCalled();

    expect(window.location.href).toBe('/cloudbeaver');
  });

  it('should call updateCurrentUser API when confirm button is clicked with MANAGEMENT system', async () => {
    mockUseCurrentUser({ systemPreference: undefined });

    superRender(<UserGuideModal />);

    const confirmButton = screen.getByText('确认并进入');
    fireEvent.click(confirmButton);

    await act(async () => jest.advanceTimersByTime(3000));

    expect(updateCurrentUserSpy).toHaveBeenCalledWith({
      current_user: {
        system: GetUserSystemEnum.MANAGEMENT
      }
    });

    expect(mockDispatch).toHaveBeenCalledWith(
      updateSystemPreference({ systemPreference: GetUserSystemEnum.MANAGEMENT })
    );
  });

  it('should call updateCurrentUser API and CloudBeaver API when confirm button is clicked with WORKBENCH system', async () => {
    mockUseCurrentUser({ systemPreference: undefined });

    superRender(<UserGuideModal />);

    const workbenchRadio = screen.getByDisplayValue(
      GetUserSystemEnum.WORKBENCH
    );
    fireEvent.click(workbenchRadio);

    const confirmButton = screen.getByText('确认并进入');
    fireEvent.click(confirmButton);

    await act(async () => jest.advanceTimersByTime(3000));

    expect(updateCurrentUserSpy).toHaveBeenCalledWith({
      current_user: {
        system: GetUserSystemEnum.WORKBENCH
      }
    });

    expect(mockDispatch).toHaveBeenCalledWith(
      updateSystemPreference({ systemPreference: GetUserSystemEnum.WORKBENCH })
    );
  });
});
