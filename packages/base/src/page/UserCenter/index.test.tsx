import { renderWithReduxAndTheme } from '@actiontech/shared/lib/testUtil/customRender';
import { useSegmentedPageParams } from '@actiontech/shared/lib/components/BasicSegmentedPage';
import UserCenter from './index';
import { screen, cleanup, fireEvent, act } from '@testing-library/react';
import EventEmitter from '../../utils/EventEmitter';
import { getBySelector } from '@actiontech/shared/lib/testUtil/customQuery';
import EmitterKey from '../../data/EmitterKey';

jest.mock('@actiontech/shared/lib/components/BasicSegmentedPage', () => ({
  ...jest.requireActual('@actiontech/shared/lib/components/BasicSegmentedPage'),
  useSegmentedPageParams: jest.fn()
}));

describe('base/UserCenter', () => {
  const updateSegmentedPageDataSpy = jest.fn();
  const renderContentSpy = jest.fn();
  const renderExtraButton = jest.fn();
  const onChangeSPy = jest.fn();
  beforeEach(() => {
    jest.useFakeTimers();
    (useSegmentedPageParams as jest.Mock).mockReturnValue({
      value: 'test_id_1',
      onChange: onChangeSPy,
      renderContent: renderContentSpy,
      options: [
        {
          label: 'test1',
          value: 'test_id_1'
        },
        {
          label: 'test2',
          value: 'test_id_2'
        }
      ],
      renderExtraButton: renderExtraButton,
      updateSegmentedPageData: updateSegmentedPageDataSpy
    });
  });

  afterEach(() => {
    jest.useRealTimers();
    cleanup();
  });

  it('should render user list when it first entered the user center', async () => {
    const { baseElement } = renderWithReduxAndTheme(<UserCenter />);
    expect(baseElement).toMatchSnapshot();
    expect(updateSegmentedPageDataSpy).toBeCalledTimes(1);
    expect(screen.getByText('test1')).toBeInTheDocument();
    expect(
      getBySelector('.custom-icon-refresh', baseElement)
    ).toBeInTheDocument();
    expect(
      getBySelector('.ant-segmented-group', baseElement)
    ).toBeInTheDocument();
  });

  it('should receive "DMS_Refresh_User_Center_List" event when click refresh icon', async () => {
    const eventEmitSpy = jest.spyOn(EventEmitter, 'emit');
    const { baseElement } = renderWithReduxAndTheme(<UserCenter />);
    fireEvent.click(getBySelector('.custom-icon-refresh', baseElement));
    await act(async () => jest.advanceTimersByTime(3000));
    expect(eventEmitSpy).toBeCalledTimes(1);
    expect(eventEmitSpy).toBeCalledWith(
      EmitterKey.DMS_Refresh_User_Center_List
    );
  });

  it('should update content when change segmented value', async () => {
    renderWithReduxAndTheme(<UserCenter />);
    fireEvent.click(screen.getByText('test2'));
    await act(async () => jest.advanceTimersByTime(3000));
    expect(onChangeSPy).toBeCalledTimes(1);
    expect(renderContentSpy).toBeCalledTimes(1);
    expect(renderExtraButton).toBeCalledTimes(1);
  });
});
