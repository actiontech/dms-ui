import { act, cleanup, fireEvent, screen } from '@testing-library/react';
import { baseSuperRender } from '../../../../../testUtils/superRender';
import AvailabilityZoneSelector from '../index';
import { mockUseRecentlySelectedZone } from '../../../../../testUtils/mockHooks/mockUseRecentlySelectedZone';
import { mockUseRecentlySelectedZoneData } from '../../../../../testUtils/mockHooks/data';
import { IUidWithName } from '@actiontech/shared/lib/api/base/service/common';
import { getBySelector } from '@actiontech/shared/lib/testUtil/customQuery';
import EventEmitter from '../../../../../utils/EventEmitter';
import EmitterKey from '../../../../../data/EmitterKey';
import { useNavigate } from 'react-router-dom';
import { ROUTE_PATHS } from '@actiontech/shared/lib/data/routePaths';
import * as useClearRecoilState from 'provision/src/hooks/useClearRecoilState';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn()
}));

describe('AvailabilityZoneSelector', () => {
  const mockZoneTips: IUidWithName[] = [
    { uid: 'zone1', name: 'Zone 1' },
    { uid: 'zone2', name: 'Zone 2' },
    { uid: 'zone3', name: 'Zone 3' }
  ];

  const navigateSpy = jest.fn();
  const emitSpy = jest.spyOn(EventEmitter, 'emit');

  const mockClearRecoilState = jest.fn();

  beforeEach(() => {
    mockUseRecentlySelectedZone({
      availabilityZone: mockZoneTips[0]
    });
    (useNavigate as jest.Mock).mockImplementation(() => navigateSpy);
    jest
      .spyOn(useClearRecoilState, 'default')
      .mockImplementation(() => ({ clearRecoilState: mockClearRecoilState }));
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
    cleanup();
  });

  it('renders with current availability zone', () => {
    const { baseElement } = baseSuperRender(
      <AvailabilityZoneSelector zoneTips={mockZoneTips} />
    );

    expect(screen.getByText('Zone 1')).toBeInTheDocument();
    expect(baseElement).toMatchSnapshot();
  });

  it('renders placeholder when no zone is selected', () => {
    mockUseRecentlySelectedZone({
      availabilityZone: undefined
    });

    baseSuperRender(<AvailabilityZoneSelector zoneTips={mockZoneTips} />);
    expect(screen.getByText('请选择')).toBeInTheDocument();
  });

  it('opens dropdown when clicked and displays zones', async () => {
    const { baseElement } = baseSuperRender(
      <AvailabilityZoneSelector zoneTips={mockZoneTips} />
    );

    const selector = getBySelector('.text', baseElement);
    fireEvent.click(selector);

    await act(async () => jest.advanceTimersByTime(300));

    expect(baseElement).toMatchSnapshot();
  });

  it('filters zones based on search input', async () => {
    const { baseElement } = baseSuperRender(
      <AvailabilityZoneSelector zoneTips={mockZoneTips} />
    );

    const selector = getBySelector('.text', baseElement);
    fireEvent.click(selector);

    await act(async () => jest.advanceTimersByTime(300));

    const searchInput = getBySelector('.ant-input');
    fireEvent.change(searchInput, { target: { value: '2' } });

    await act(async () => jest.advanceTimersByTime(300));

    expect(screen.getByText('Zone 2')).toBeInTheDocument();
  });

  it('displays empty state when no zones match search', async () => {
    const { baseElement } = baseSuperRender(
      <AvailabilityZoneSelector zoneTips={mockZoneTips} />
    );

    const selector = getBySelector('.text', baseElement);
    fireEvent.click(selector);

    await act(async () => jest.advanceTimersByTime(300));

    const searchInput = getBySelector('.ant-input');
    fireEvent.change(searchInput, { target: { value: 'nonexistent' } });

    await act(async () => jest.advanceTimersByTime(300));

    const emptyContainer = baseElement.querySelector('.empty-container');
    expect(emptyContainer).toBeInTheDocument();
  });

  it('handles empty zoneTips array', async () => {
    const { baseElement } = baseSuperRender(
      <AvailabilityZoneSelector zoneTips={[]} />
    );

    const selector = getBySelector('.text', baseElement);
    fireEvent.click(selector);

    await act(async () => jest.advanceTimersByTime(300));

    const emptyContainer = baseElement.querySelector('.empty-container');
    expect(emptyContainer).toBeInTheDocument();
  });

  it('selects a different zone and calls updateRecentlySelectedZone', async () => {
    const { baseElement } = baseSuperRender(
      <AvailabilityZoneSelector zoneTips={mockZoneTips} />
    );

    const selector = getBySelector('.text', baseElement);
    fireEvent.click(selector);

    await act(async () => jest.advanceTimersByTime(300));

    const zoneItems = baseElement.querySelectorAll('.zone-item');
    expect(zoneItems).toHaveLength(mockZoneTips.length);

    fireEvent.click(zoneItems[1]);

    await act(async () => jest.advanceTimersByTime(0));
    expect(
      screen.getByText('切换可用区将重新加载数据，是否确认？')
    ).toBeInTheDocument();
    const okButton = screen.getByText('确 定');
    fireEvent.click(okButton);

    await act(async () => jest.advanceTimersByTime(0));

    expect(
      mockUseRecentlySelectedZoneData.updateRecentlySelectedZone
    ).toHaveBeenCalledWith(mockZoneTips[1]);
    expect(emitSpy).toHaveBeenCalledWith(
      EmitterKey.DMS_Sync_Project_Archived_Status
    );
    expect(emitSpy).toHaveBeenCalledWith(EmitterKey.DMS_Reload_Initial_Data);
    expect(navigateSpy).toHaveBeenCalledWith(ROUTE_PATHS.BASE.HOME);
    expect(mockClearRecoilState).toHaveBeenCalled();
  });

  it('does not trigger popconfirm for currently selected zone', async () => {
    const { baseElement } = baseSuperRender(
      <AvailabilityZoneSelector zoneTips={mockZoneTips} />
    );

    const selector = getBySelector('.text', baseElement);
    fireEvent.click(selector);

    await act(async () => jest.advanceTimersByTime(300));

    const zoneItems = baseElement.querySelectorAll('.zone-item');

    fireEvent.click(zoneItems[0]);

    await act(async () => jest.advanceTimersByTime(100));
    expect(
      screen.queryByText('切换可用区将重新加载数据，是否确认？')
    ).not.toBeInTheDocument();
    expect(screen.queryByText('确 定')).not.toBeInTheDocument();

    expect(
      mockUseRecentlySelectedZoneData.updateRecentlySelectedZone
    ).not.toHaveBeenCalled();
    expect(emitSpy).not.toHaveBeenCalled();
    expect(navigateSpy).not.toHaveBeenCalled();
    expect(mockClearRecoilState).not.toHaveBeenCalled();
  });
});
