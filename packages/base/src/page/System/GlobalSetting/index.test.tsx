import GlobalSetting from '.';

import system from '../../../testUtils/mockApi/system';

import { cleanup, fireEvent, act, screen } from '@testing-library/react';
import { superRender } from '@actiontech/shared/lib/testUtil/customRender';
import {
  getAllBySelector,
  getBySelector
} from '@actiontech/shared/lib/testUtil/customQuery';

describe('base/System/GlobalSetting', () => {
  let requestGetSystemVariables: jest.SpyInstance;
  let requestUpdateSystemVariables: jest.SpyInstance;

  const customRender = () => {
    return superRender(<GlobalSetting />);
  };

  beforeEach(() => {
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
    expect(requestGetSystemVariables).toBeCalled();
    expect(baseElement).toMatchSnapshot();
  });

  describe('render form validate error', () => {
    it('render workflow_expired_hours', async () => {
      const { baseElement } = customRender();

      await act(async () => jest.advanceTimersByTime(3200));

      expect(screen.getByText('7211')).toBeInTheDocument();
      fireEvent.mouseOver(screen.getByText('7211'));
      await act(async () => jest.advanceTimersByTime(500));

      const editBtn = getAllBySelector(
        '.config-item-filed-edit-button',
        baseElement
      );
      expect(editBtn.length).toBe(3);
      fireEvent.click(editBtn[0]);
      await act(async () => jest.advanceTimersByTime(500));

      const inputNumEle = getBySelector('.ant-input-number-input', baseElement);
      fireEvent.change(inputNumEle, {
        target: {
          value: 'abc'
        }
      });
      await act(async () => jest.advanceTimersByTime(500));
      expect(baseElement).toMatchSnapshot();

      fireEvent.change(inputNumEle, {
        target: {
          value: '8866'
        }
      });
      await act(async () => jest.advanceTimersByTime(500));

      fireEvent.keyDown(inputNumEle, {
        key: 'Enter',
        keyCode: 13
      });
      await act(async () => jest.advanceTimersByTime(500));
      expect(requestUpdateSystemVariables).toBeCalled();
      await act(async () => jest.advanceTimersByTime(2600));
      expect(requestUpdateSystemVariables).toBeCalledWith({
        operation_record_expired_hours: 3161,
        url: 'http://demo.com',
        workflow_expired_hours: 8866
      });
      await act(async () => jest.advanceTimersByTime(3000));
      expect(requestGetSystemVariables).toBeCalled();
    });

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
      expect(requestUpdateSystemVariables).toBeCalled();
      await act(async () => jest.advanceTimersByTime(2600));
      expect(requestUpdateSystemVariables).toBeCalledWith({
        operation_record_expired_hours: 9988,
        url: 'http://demo.com',
        workflow_expired_hours: 7211
      });
      await act(async () => jest.advanceTimersByTime(3000));
      expect(requestGetSystemVariables).toBeCalled();
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
      expect(requestUpdateSystemVariables).toBeCalled();
      await act(async () => jest.advanceTimersByTime(2600));
      expect(requestUpdateSystemVariables).toBeCalledWith({
        operation_record_expired_hours: 3161,
        url: 'this is a url string',
        workflow_expired_hours: 7211
      });
      await act(async () => jest.advanceTimersByTime(3000));
      expect(requestGetSystemVariables).toBeCalled();
    });
  });
});
