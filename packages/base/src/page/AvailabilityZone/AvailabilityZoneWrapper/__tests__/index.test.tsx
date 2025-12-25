import { cleanup, screen, act, fireEvent } from '@testing-library/react';
import { superRender } from '@actiontech/shared/lib/testUtil/superRender';
import AvailabilityZoneWrapper from '..';
import { useLocation, Outlet, useNavigate, useParams } from 'react-router-dom';
import { mockUseRecentlySelectedZone } from '../../../../testUtils/mockHooks/mockUseRecentlySelectedZone';
import { mockUseRecentlySelectedZoneData } from '../../../../testUtils/mockHooks/data';
import { mockUseRecentlyOpenedProjects } from '../../../Nav/SideMenu/testUtils/mockUseRecentlyOpenedProjects';
import { baseMockApi } from '@actiontech/shared/lib/testUtil';
import { useSelector } from 'react-redux';

jest.mock('react-redux', () => {
  return {
    ...jest.requireActual('react-redux'),
    useSelector: jest.fn()
  };
});

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useLocation: jest.fn(),
  Outlet: jest.fn(),
  useNavigate: jest.fn(),
  useParams: jest.fn()
}));

describe('base/AvailabilityZone/AvailabilityZoneWrapper', () => {
  const navigateSpy = jest.fn();

  const getRecentlyProjectIdByUserInfoSpy = jest.fn();

  let getCurrentUserSpy: jest.SpyInstance;
  const useParamsSpy: jest.Mock = useParams as jest.Mock;

  beforeEach(() => {
    jest.useFakeTimers();
    getCurrentUserSpy = baseMockApi.global.getCurrentUser();

    (Outlet as jest.Mock).mockImplementation(() => <div>Outlet Content</div>);

    (useNavigate as jest.Mock).mockImplementation(() => navigateSpy);

    (useLocation as jest.Mock).mockImplementation(() => ({
      pathname: '/test-path',
      search: '?test=true'
    }));
    useParamsSpy.mockReturnValue({ projectID: undefined });
    mockUseRecentlyOpenedProjects({
      getRecentlyProjectIdByUserInfo: getRecentlyProjectIdByUserInfoSpy
    });

    mockUseRecentlySelectedZone();
    (useSelector as jest.Mock).mockImplementation((selector) => {
      return selector({
        user: {
          uid: '123',
          systemPreference: undefined
        },
        availabilityZone: {
          availabilityZoneTips: [
            { uid: 'zone-123', name: 'Test Zone' },
            { uid: 'zone-456', name: 'Another Zone' }
          ]
        }
      });
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.clearAllTimers();
    cleanup();
  });

  it('should render Outlet when availabilityZone is set', () => {
    const mockZone = { uid: 'zone-123', name: 'Test Zone' };

    mockUseRecentlySelectedZone({
      ...mockUseRecentlySelectedZoneData,
      availabilityZone: mockZone
    });

    const { container } = superRender(<AvailabilityZoneWrapper />);

    expect(screen.getByText('Outlet Content')).toBeInTheDocument();
    expect(container.querySelector('.ant-modal')).not.toBeInTheDocument();
  });

  it('should show modal when availabilityZone is not set', () => {
    mockUseRecentlySelectedZone({
      ...mockUseRecentlySelectedZoneData
    });

    superRender(<AvailabilityZoneWrapper />);

    expect(screen.getByText('选择可用区')).toBeInTheDocument();
    expect(
      screen.getByText('暂无最近选择的可用区，请选择一个可用区！')
    ).toBeInTheDocument();
  });

  it('should navigate back when clicking Cancel button', () => {
    mockUseRecentlySelectedZone({
      ...mockUseRecentlySelectedZoneData
    });

    superRender(<AvailabilityZoneWrapper />);

    fireEvent.click(screen.getByText('取 消'));

    expect(navigateSpy).toHaveBeenCalledWith(-1);
  });

  it('should update selected zone and navigate when clicking OK button', async () => {
    const updateRecentlySelectedZoneSpy = jest.fn();

    mockUseRecentlySelectedZone({
      ...mockUseRecentlySelectedZoneData,
      updateRecentlySelectedZone: updateRecentlySelectedZoneSpy
    });
    superRender(<AvailabilityZoneWrapper />);

    const selectElement = screen.getByRole('combobox');
    fireEvent.mouseDown(selectElement);

    await act(async () => jest.advanceTimersByTime(0));

    fireEvent.click(screen.getByText('Test Zone'));

    fireEvent.click(screen.getByText('确 认'));

    await act(async () => jest.advanceTimersByTime(3000));
    expect(updateRecentlySelectedZoneSpy).toHaveBeenCalledWith({
      uid: 'zone-123',
      name: 'Test Zone'
    });
  });

  it('should show modal when memorized zone not in available options', () => {
    const mockZone = { uid: 'zone-not-available', name: 'Not Available Zone' };

    mockUseRecentlySelectedZone({
      ...mockUseRecentlySelectedZoneData,
      availabilityZone: mockZone
    });

    superRender(<AvailabilityZoneWrapper />);

    expect(screen.getByText('选择可用区')).toBeInTheDocument();
  });

  it('should render Outlet directly when no zones are configured', () => {
    (useSelector as jest.Mock).mockImplementation((selector) => {
      return selector({
        user: {
          uid: '123',
          systemPreference: undefined
        },
        availabilityZone: {
          availabilityZoneTips: []
        }
      });
    });
    superRender(<AvailabilityZoneWrapper />);

    expect(screen.getByText('Outlet Content')).toBeInTheDocument();
    expect(screen.queryByText('选择可用区')).not.toBeInTheDocument();
  });

  describe('Project path replacement logic', () => {
    const updateRecentlySelectedZoneSpy = jest.fn();

    beforeEach(() => {
      mockUseRecentlySelectedZone({
        ...mockUseRecentlySelectedZoneData,
        updateRecentlySelectedZone: updateRecentlySelectedZoneSpy
      });
    });

    it('should navigate to project path when memorized project exists and no default project in URL', async () => {
      getRecentlyProjectIdByUserInfoSpy.mockReturnValue('project-123');

      (useLocation as jest.Mock).mockImplementation(() => ({
        pathname: '/sqle/project//dashboard',
        search: '?test=true'
      }));

      superRender(<AvailabilityZoneWrapper />);

      const selectElement = screen.getByRole('combobox');
      fireEvent.mouseDown(selectElement);

      await act(async () => jest.advanceTimersByTime(0));

      fireEvent.click(screen.getByText('Test Zone'));
      fireEvent.click(screen.getByText('确 认'));

      await act(async () => jest.advanceTimersByTime(3000));

      expect(navigateSpy).toHaveBeenCalledWith(
        '/sqle/project/project-123/dashboard?test=true',
        { replace: true }
      );
    });

    it('should navigate to project path when memorized project exists and default project in URL', async () => {
      getRecentlyProjectIdByUserInfoSpy.mockReturnValue('project-123');
      useParamsSpy.mockReturnValue({ projectID: '700300' });

      (useLocation as jest.Mock).mockImplementation(() => ({
        pathname: '/sqle/project/700300/dashboard',
        search: '?test=true'
      }));

      superRender(<AvailabilityZoneWrapper />);

      const selectElement = screen.getByRole('combobox');
      fireEvent.mouseDown(selectElement);

      await act(async () => jest.advanceTimersByTime(0));

      fireEvent.click(screen.getByText('Test Zone'));
      fireEvent.click(screen.getByText('确 认'));

      await act(async () => jest.advanceTimersByTime(3000));

      expect(navigateSpy).toHaveBeenCalledWith(
        '/sqle/project/project-123/dashboard?test=true',
        { replace: true }
      );
    });

    it('should replace project id when project id in url but project id not in bind projects', async () => {
      getRecentlyProjectIdByUserInfoSpy.mockReturnValue(undefined);
      useParamsSpy.mockReturnValue({ projectID: '123456' });

      (useLocation as jest.Mock).mockImplementation(() => ({
        pathname: '/sqle/project/123456/dashboard',
        search: '?test=true'
      }));

      superRender(<AvailabilityZoneWrapper />);

      const selectElement = screen.getByRole('combobox');
      fireEvent.mouseDown(selectElement);

      await act(async () => jest.advanceTimersByTime(0));

      fireEvent.click(screen.getByText('Test Zone'));
      fireEvent.click(screen.getByText('确 认'));

      await act(async () => jest.advanceTimersByTime(3000));
      expect(getCurrentUserSpy).toHaveBeenCalledTimes(1);

      expect(navigateSpy).toHaveBeenCalledWith(
        '/sqle/project//dashboard?test=true',
        { replace: true }
      );
    });

    it('should handle path without sqle prefix correctly', async () => {
      getRecentlyProjectIdByUserInfoSpy.mockReturnValue('project-123');

      (useLocation as jest.Mock).mockImplementation(() => ({
        pathname: '/project//dashboard',
        search: '?test=true'
      }));

      superRender(<AvailabilityZoneWrapper />);

      const selectElement = screen.getByRole('combobox');
      fireEvent.mouseDown(selectElement);

      await act(async () => jest.advanceTimersByTime(0));

      fireEvent.click(screen.getByText('Test Zone'));
      fireEvent.click(screen.getByText('确 认'));

      await act(async () => jest.advanceTimersByTime(3000));

      expect(navigateSpy).toHaveBeenCalledWith(
        '/project/project-123/dashboard?test=true',
        { replace: true }
      );
    });

    it('should handle path with provision prefix', async () => {
      getRecentlyProjectIdByUserInfoSpy.mockReturnValue('project-123');

      (useLocation as jest.Mock).mockImplementation(() => ({
        pathname: '/provision/project//dashboard',
        search: '?test=true'
      }));

      superRender(<AvailabilityZoneWrapper />);

      const selectElement = screen.getByRole('combobox');
      fireEvent.mouseDown(selectElement);

      await act(async () => jest.advanceTimersByTime(0));

      fireEvent.click(screen.getByText('Test Zone'));
      fireEvent.click(screen.getByText('确 认'));

      await act(async () => jest.advanceTimersByTime(3000));

      expect(navigateSpy).toHaveBeenCalledWith(
        '/provision/project/project-123/dashboard?test=true',
        { replace: true }
      );
    });
  });
});
