import { Form } from 'antd';
import { ReactNode } from 'react';
import { cleanup, act, fireEvent } from '@testing-library/react';
import { renderWithTheme } from '../../../../testUtils/customRender';
import { getBySelector } from '@actiontech/shared/lib/testUtil/customQuery';
import { ignoreInvalidValueForCSSStyleProperty } from '@actiontech/shared/lib/testUtil/common';
import BaseInfoFormItem from './BaseInfoFormItem';

describe('sqle/Order/CreateOrder/BaseInfoFormItem', () => {
  const customRender = (params: { slot?: ReactNode } = {}) => {
    return renderWithTheme(
      <Form>
        <BaseInfoFormItem slot={params?.slot} />
      </Form>
    );
  };

  ignoreInvalidValueForCSSStyleProperty();

  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.clearAllTimers();
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
