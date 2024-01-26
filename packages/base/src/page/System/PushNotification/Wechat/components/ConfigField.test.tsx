import { renderWithTheme } from '@actiontech/shared/lib/testUtil/customRender';
import { cleanup, fireEvent, act, screen } from '@testing-library/react';
import { getBySelector } from '@actiontech/shared/lib/testUtil/customQuery';

import { Form } from 'antd';
import ConfigField from './ConfigField';

describe('base/System/PushNotification/Wechat/ConfigField', () => {
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

  it('render validate agent_id item', async () => {
    const { baseElement } = customRender();

    fireEvent.change(getBySelector('#agent_id', baseElement), {
      target: {
        value: 'agent_id'
      }
    });
    await act(async () => jest.advanceTimersByTime(500));
    expect(baseElement).toMatchSnapshot();

    fireEvent.change(getBySelector('#agent_id', baseElement), {
      target: {
        value: '123'
      }
    });
    await act(async () => jest.advanceTimersByTime(500));
    expect(baseElement).toMatchSnapshot();
  });
});
