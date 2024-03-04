import SystemEEPage from './';
import { useDispatch } from 'react-redux';

import { cleanup, act, fireEvent } from '@testing-library/react';
import { superRender } from '../../testUtils/customRender';

import system from '../../testUtils/mockApi/system';
import dms from '../../testUtils/mockApi/global';

import { DMS_DEFAULT_WEB_TITLE } from '@actiontech/shared/lib/data/common';
import { ModalName } from '../../data/ModalName';
import {
  getAllBySelector,
  getBySelector
} from '@actiontech/shared/lib/testUtil/customQuery';

jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useDispatch: jest.fn()
}));

describe('base/System-ee', () => {
  const dispatchSpy = jest.fn();
  const customRender = () => {
    return superRender(<SystemEEPage />, undefined, {
      initStore: {
        system: {
          modalStatus: {},
          webTitle: DMS_DEFAULT_WEB_TITLE,
          webLogoUrl: ''
        }
      }
    });
  };

  beforeEach(() => {
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
    expect(segmentedEle.length).toBe(6);
    fireEvent.click(segmentedEle[1]);
    await act(async () => jest.advanceTimersByTime(500));
    expect(baseElement).toMatchSnapshot();
  });
});
