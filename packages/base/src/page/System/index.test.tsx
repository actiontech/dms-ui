import SystemEEPage from './';
import { useDispatch } from 'react-redux';
import { cleanup, act, fireEvent, screen } from '@testing-library/react';
import { superRender } from '../../testUtils/customRender';
import system from '../../testUtils/mockApi/system';
import dms from '../../testUtils/mockApi/global';
import { DMS_DEFAULT_WEB_TITLE } from '@actiontech/shared/lib/data/common';
import { ModalName } from '../../data/ModalName';
import { getAllBySelector } from '@actiontech/shared/lib/testUtil/customQuery';
import { mockUseCurrentUser } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentUser';

jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useDispatch: jest.fn()
}));

describe('base/System-ee', () => {
  const dispatchSpy = jest.fn();
  const customRender = (initialEntry: string[] = ['/system']) => {
    return superRender(<SystemEEPage />, undefined, {
      initStore: {
        system: {
          modalStatus: {},
          webTitle: DMS_DEFAULT_WEB_TITLE,
          webLogoUrl: ''
        }
      },
      routerProps: {
        initialEntries: initialEntry
      }
    });
  };

  beforeEach(() => {
    mockUseCurrentUser();
    jest.useFakeTimers();
    (useDispatch as jest.Mock).mockImplementation(() => dispatchSpy);
    dms.mockAllApi();
    system.mockAllApi();
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
    cleanup();
  });

  it('render snap', async () => {
    const { baseElement } = customRender();

    await act(async () => jest.advanceTimersByTime(500));
    expect(baseElement).toMatchSnapshot();
    await act(async () => jest.advanceTimersByTime(2600));
    expect(baseElement).toMatchSnapshot();

    expect(dispatchSpy).toHaveBeenCalled();
    expect(dispatchSpy).toHaveBeenCalledWith({
      payload: { modalStatus: { [ModalName.DMS_Import_License]: false } },
      type: 'system/initModalStatus'
    });

    const segmentedEle = getAllBySelector(
      '.ant-segmented-item-label',
      baseElement
    );
    expect(segmentedEle.length).toBe(7);
    fireEvent.click(segmentedEle[1]);
    await act(async () => jest.advanceTimersByTime(500));
    expect(baseElement).toMatchSnapshot();
  });

  it('should changed current active tab when url params is exist "active_tab"', async () => {
    const { baseElement } = customRender([
      '/system?active_tab=process_connection'
    ]);
    await act(async () => jest.advanceTimersByTime(500));
    expect(screen.getByTitle('流程对接').parentElement).toHaveClass(
      'ant-segmented-item-selected'
    );
    expect(baseElement).toMatchSnapshot();
  });
});
