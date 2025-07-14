import { superRender } from '@actiontech/shared/lib/testUtil/superRender';
import { act, cleanup, fireEvent } from '@testing-library/react';
import { getBySelector } from '@actiontech/shared/lib/testUtil/customQuery';

import { Form } from 'antd';
import ConfigField from './ConfigField';

describe('base/System/PushNotification/WebhookSetting/ConfigField', () => {
  const customRender = () => {
    return superRender(
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

  it('render validate url', async () => {
    const { baseElement } = customRender();

    fireEvent.change(getBySelector('#url', baseElement));
    await act(async () => jest.advanceTimersByTime(500));
    expect(baseElement).toMatchSnapshot();
  });
});
