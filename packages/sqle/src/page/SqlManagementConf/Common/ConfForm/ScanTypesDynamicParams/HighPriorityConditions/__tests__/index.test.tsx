import { act, fireEvent, renderHook } from '@testing-library/react';
import { Form } from 'antd';
import HighPriorityConditions from '..';
import { IHighPriorityConditionResV1 } from '@actiontech/shared/lib/api/sqle/service/common';
import { superRender } from '../../../../../../../testUtils/customRender';

describe('test HighPriorityConditions', () => {
  const prefixPath = 'prefixPath';
  const conditionsValue: IHighPriorityConditionResV1[] = [
    {
      operator: {
        operator_enums_value: [
          { desc: '大于', value: '>' },
          {
            desc: '等于',
            value: '='
          },
          {
            desc: '小于',
            value: '<'
          }
        ],
        operator_value: '>'
      },
      desc: '审核等级',
      enums_value: [
        { desc: '警告', value: 'warn' },
        { desc: '错误', value: 'error' }
      ],
      key: 'audit_level',
      value: 'warn'
    },
    {
      operator: {
        operator_enums_value: undefined,
        operator_value: '>'
      },
      desc: '审核时间',
      enums_value: undefined,
      key: 'audit_time',
      value: '10'
    }
  ];
  const customRender = (conditions = conditionsValue, loading = false) => {
    const { result } = renderHook(() => Form.useForm());

    return superRender(
      <Form form={result.current[0]}>
        <HighPriorityConditions
          prefixPath={prefixPath}
          submitLoading={loading}
          conditions={conditions}
        />
      </Form>
    );
  };

  beforeEach(() => {
    jest.useFakeTimers();
  });
  afterEach(() => {
    jest.clearAllMocks();
    jest.clearAllTimers();
    jest.useRealTimers();
  });

  it('should match snapshot', async () => {
    const { container, getByText } = customRender();

    expect(container).toMatchSnapshot();

    fireEvent.click(getByText('标记高优先级SQL'));

    await act(async () => jest.advanceTimersByTime(0));

    expect(container).toMatchSnapshot();
  });

  it('should match snapshot when submitLoading is equal true', async () => {
    const { container } = customRender(conditionsValue, true);

    expect(container).toMatchSnapshot();
  });

  it('should disable input fields when switch is not enabled', async () => {
    const { getByText, getByTestId } = customRender();

    fireEvent.click(getByText('标记高优先级SQL'));

    await act(async () => jest.advanceTimersByTime(0));

    expect(getByTestId('audit_level_switch')).toBeChecked();
    expect(getByTestId('audit_level_operator')).not.toHaveClass(
      'ant-select-disabled'
    );
    expect(getByTestId('audit_level_value')).not.toHaveClass(
      'ant-select-disabled'
    );

    fireEvent.click(getByTestId('audit_level_switch'));
    await act(async () => jest.advanceTimersByTime(0));

    expect(getByTestId('audit_level_operator')).toHaveClass(
      'ant-select-disabled'
    );
    expect(getByTestId('audit_level_value')).toHaveClass('ant-select-disabled');

    expect(getByTestId('audit_time_switch')).toBeChecked();
    expect(getByTestId('audit_time_operator')).not.toHaveClass(
      'ant-input-disabled'
    );
    expect(getByTestId('audit_time_value')).not.toHaveClass(
      'ant-input-disabled'
    );

    fireEvent.click(getByTestId('audit_time_switch'));
    await act(async () => jest.advanceTimersByTime(0));

    expect(getByTestId('audit_time_operator')).toHaveClass(
      'ant-input-disabled'
    );
    expect(getByTestId('audit_time_value')).toHaveClass('ant-input-disabled');
  });

  it('should clear input fields value when disabled switch', async () => {
    const { getByText, getByTestId } = customRender();

    fireEvent.click(getByText('标记高优先级SQL'));

    await act(async () => jest.advanceTimersByTime(0));

    expect(getByTestId('audit_time_operator')).toHaveValue('>');
    expect(getByTestId('audit_time_value')).toHaveValue('10');

    fireEvent.click(getByTestId('audit_time_switch'));
    expect(getByTestId('audit_time_operator')).toHaveValue('');
    expect(getByTestId('audit_time_value')).toHaveValue('');

    fireEvent.click(getByTestId('audit_time_switch'));
    expect(getByTestId('audit_time_operator')).toHaveValue('>');
    expect(getByTestId('audit_time_value')).toHaveValue('10');
  });
});
