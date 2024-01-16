import { Form } from 'antd';
import { ReactNode } from 'react';
import { cleanup, act, fireEvent } from '@testing-library/react';
import { renderWithTheme } from '../../../../testUtils/customRender';
import { getBySelector } from '@actiontech/shared/lib/testUtil/customQuery';

import BaseInfoFormItem from './BaseInfoFormItem';

describe('sqle/Order/CreateOrder/BaseInfoFormItem', () => {
  const customRender = (params: { slot?: ReactNode } = {}) => {
    return renderWithTheme(
      <Form>
        <BaseInfoFormItem slot={params?.slot} />
      </Form>
    );
  };

  beforeEach(() => {
    jest.useFakeTimers();
    // ignore error: Warning: `NaN` is an invalid value for the `height` css style property.
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.clearAllTimers();
    (console.error as jest.Mock).mockRestore();
    cleanup();
  });

  it('render snap when render default item', () => {
    const { baseElement } = customRender();
    expect(baseElement).toMatchSnapshot();
  });

  it('render workflow_subject check validator', async () => {
    const { baseElement } = customRender();

    const subjectEle = getBySelector('#workflow_subject', baseElement);

    fireEvent.input(subjectEle, {
      target: {
        value: '1234'
      }
    });
    await act(async () => jest.advanceTimersByTime(1000));
    expect(baseElement).toMatchSnapshot();

    fireEvent.change(subjectEle, {
      target: {
        value: '='
      }
    });
    await act(async () => jest.advanceTimersByTime(1000));
    expect(baseElement).toMatchSnapshot();
  });

  it('render when has slot', () => {
    const { baseElement } = customRender({ slot: <span>111</span> });
    expect(baseElement).toMatchSnapshot();
  });
});
