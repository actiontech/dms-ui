import GlobalSetting from '.';

import system from '../../../testUtils/mockApi/system';

import { cleanup, fireEvent, act, screen } from '@testing-library/react';
import { superRender } from '@actiontech/shared/lib/testUtil/customRender';
import {
  getAllBySelector,
  getBySelector
} from '@actiontech/shared/lib/testUtil/customQuery';
import { createSpySuccessResponse } from '@actiontech/shared/lib/testUtil/mockApi';
import { mockUseCurrentUser } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentUser';

describe('base/System/GlobalSetting', () => {
  let requestGetSystemVariables: jest.SpyInstance;
  let requestUpdateSystemVariables: jest.SpyInstance;

  const customRender = () => {
    return superRender(<GlobalSetting />);
  };

  beforeEach(() => {
    mockUseCurrentUser();
    jest.useFakeTimers();
    requestGetSystemVariables = system.getSystemVariables();
    requestUpdateSystemVariables = system.updateSystemVariables();
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
    expect(requestGetSystemVariables).toHaveBeenCalled();
    expect(baseElement).toMatchSnapshot();
  });

  it('render hide form element node when click white place', async () => {
    const { baseElement } = customRender();

    await act(async () => jest.advanceTimersByTime(3200));

    const editBtn = getAllBySelector(
      '.config-item-filed-edit-button',
      baseElement
    );
    expect(editBtn.length).toBe(3);
    expect(editBtn[0]).toHaveAttribute('hidden');

    fireEvent.click(editBtn[1]);
    await act(async () => jest.advanceTimersByTime(500));
    fireEvent.mouseDown(screen.getByText('CB工作台操作审计过期时间(小时)'));
    await act(async () => jest.advanceTimersByTime(300));

    fireEvent.click(editBtn[2]);
    await act(async () => jest.advanceTimersByTime(500));
    fireEvent.mouseDown(screen.getByText('URL地址前缀'));
    await act(async () => jest.advanceTimersByTime(300));
  });

  it('render api return no data', async () => {
    requestGetSystemVariables.mockImplementation(() =>
      createSpySuccessResponse({})
    );
    const { baseElement } = customRender();
    await act(async () => jest.advanceTimersByTime(3100));
    expect(baseElement).toMatchSnapshot();
  });

  it('should hidden edit button when user is not admin', async () => {
    mockUseCurrentUser({ isAdmin: false });
    const { baseElement } = customRender();

    await act(async () => jest.advanceTimersByTime(3200));

    const editBtn = getAllBySelector(
      '.config-item-filed-edit-button',
      baseElement
    );
    expect(editBtn.length).toBe(3);
    expect(editBtn[0]).toHaveAttribute('hidden');
  });

  describe('render form validate error', () => {
    it('render operation_record_expired_hours', async () => {
      const { baseElement } = customRender();

      await act(async () => jest.advanceTimersByTime(3200));
      expect(screen.getByText('3161')).toBeInTheDocument();
      fireEvent.mouseOver(screen.getByText('3161'));
      await act(async () => jest.advanceTimersByTime(500));

      const editBtn = getAllBySelector(
        '.config-item-filed-edit-button',
        baseElement
      );
      fireEvent.click(editBtn[0]);
      await act(async () => jest.advanceTimersByTime(500));

      const inputNumEle = getBySelector('.ant-input-number-input', baseElement);
      fireEvent.change(inputNumEle, {
        target: {
          value: 'cef'
        }
      });
      await act(async () => jest.advanceTimersByTime(500));

      fireEvent.change(inputNumEle, {
        target: {
          value: '9988'
        }
      });
      await act(async () => jest.advanceTimersByTime(500));

      fireEvent.keyDown(inputNumEle, {
        key: 'Enter',
        keyCode: 13
      });
      await act(async () => jest.advanceTimersByTime(500));
      expect(requestUpdateSystemVariables).toHaveBeenCalled();
      await act(async () => jest.advanceTimersByTime(2600));
      expect(requestUpdateSystemVariables).toHaveBeenCalledWith({
        operation_record_expired_hours: 9988,
        url: 'http://demo.com',
        cb_operation_logs_expired_hours: 2160
      });
      await act(async () => jest.advanceTimersByTime(3000));
      expect(requestGetSystemVariables).toHaveBeenCalled();
    });

    it('render cb_operation_logs_expired_hours', async () => {
      const { baseElement } = customRender();

      await act(async () => jest.advanceTimersByTime(3200));
      expect(screen.getByText('2160')).toBeInTheDocument();
      fireEvent.mouseOver(screen.getByText('2160'));
      await act(async () => jest.advanceTimersByTime(500));

      const editBtn = getAllBySelector(
        '.config-item-filed-edit-button',
        baseElement
      );
      fireEvent.click(editBtn[1]);
      await act(async () => jest.advanceTimersByTime(500));

      const inputNumEle = getBySelector('.ant-input-number-input', baseElement);
      fireEvent.change(inputNumEle, {
        target: {
          value: 'cef'
        }
      });
      await act(async () => jest.advanceTimersByTime(500));

      fireEvent.change(inputNumEle, {
        target: {
          value: '9988'
        }
      });
      await act(async () => jest.advanceTimersByTime(500));

      fireEvent.keyDown(inputNumEle, {
        key: 'Enter',
        keyCode: 13
      });
      await act(async () => jest.advanceTimersByTime(500));
      expect(requestUpdateSystemVariables).toHaveBeenCalled();
      await act(async () => jest.advanceTimersByTime(2600));
      expect(requestUpdateSystemVariables).toHaveBeenCalledWith({
        operation_record_expired_hours: 3161,
        url: 'http://demo.com',
        cb_operation_logs_expired_hours: 9988
      });
      await act(async () => jest.advanceTimersByTime(3000));
      expect(requestGetSystemVariables).toHaveBeenCalled();
    });

    it('render url', async () => {
      const { baseElement } = customRender();

      await act(async () => jest.advanceTimersByTime(3200));
      expect(screen.getByText('http://demo.com')).toBeInTheDocument();
      fireEvent.mouseOver(screen.getByText('http://demo.com'));
      await act(async () => jest.advanceTimersByTime(500));

      const editBtn = getAllBySelector(
        '.config-item-filed-edit-button',
        baseElement
      );
      fireEvent.click(editBtn[2]);
      await act(async () => jest.advanceTimersByTime(500));

      const inputEle = getBySelector('#editInput', baseElement);
      fireEvent.change(inputEle, {
        target: {
          value: 'this is a url string'
        }
      });
      await act(async () => jest.advanceTimersByTime(500));

      fireEvent.keyDown(inputEle, {
        key: 'Enter',
        keyCode: 13
      });
      await act(async () => jest.advanceTimersByTime(500));
      expect(requestUpdateSystemVariables).toHaveBeenCalled();
      await act(async () => jest.advanceTimersByTime(2600));
      expect(requestUpdateSystemVariables).toHaveBeenCalledWith({
        operation_record_expired_hours: 3161,
        url: 'this is a url string',
        cb_operation_logs_expired_hours: 2160
      });
      await act(async () => jest.advanceTimersByTime(3000));
      expect(requestGetSystemVariables).toHaveBeenCalled();
    });
  });
});
