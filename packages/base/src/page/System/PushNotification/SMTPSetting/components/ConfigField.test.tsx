import { cleanup, fireEvent, act } from '@testing-library/react';
import { renderWithTheme } from '@actiontech/shared/lib/testUtil/customRender';
import { getBySelector } from '@actiontech/shared/lib/testUtil/customQuery';

import { Form } from 'antd';
import ConfigField from './ConfigField';

describe('base/System/PushNotification/SMTPSetting/ConfigField', () => {
  const customRender = () => {
    return renderWithTheme(
      <Form>
        <ConfigField />
      </Form>
    );
  };

  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
    cleanup();
  });

  it('render snap', () => {
    const { baseElement } = customRender();
    expect(baseElement).toMatchSnapshot();
  });

  it('render validator Port', async () => {
    const { baseElement } = customRender();

    const portEle = getBySelector('#port', baseElement);

    fireEvent.change(portEle, {
      target: {
        value: 'a'
      }
    });
    await act(async () => jest.advanceTimersByTime(500));
    expect(baseElement).toMatchSnapshot();

    fireEvent.change(portEle, {
      target: {
        value: '0'
      }
    });
    await act(async () => jest.advanceTimersByTime(500));
    expect(baseElement).toMatchSnapshot();

    fireEvent.change(portEle, {
      target: {
        value: '65536'
      }
    });
    await act(async () => jest.advanceTimersByTime(500));
    expect(baseElement).toMatchSnapshot();

    fireEvent.change(portEle, {
      target: {
        value: '8080'
      }
    });
    await act(async () => jest.advanceTimersByTime(500));
    expect(baseElement).toMatchSnapshot();
  });

  it('render pwd must be same', async () => {
    const { baseElement } = customRender();

    const pwdEle = getBySelector('#password', baseElement);
    const pwdConfirmEle = getBySelector('#passwordConfirm', baseElement);

    fireEvent.change(pwdEle, {
      target: {
        value: '1'
      }
    });
    await act(async () => jest.advanceTimersByTime(500));

    fireEvent.change(pwdConfirmEle, {
      target: {
        value: '12'
      }
    });
    await act(async () => jest.advanceTimersByTime(500));
    expect(baseElement).toMatchSnapshot();

    fireEvent.change(pwdConfirmEle, {
      target: {
        value: '1'
      }
    });
    await act(async () => jest.advanceTimersByTime(500));
    expect(baseElement).toMatchSnapshot();
  });
});
