import { act, fireEvent, renderHook } from '@testing-library/react';
import { Form } from 'antd';
import HighPriorityConditions from '..';
import { IHighPriorityCondition } from '@actiontech/shared/lib/api/sqle/service/common';
import { superRender } from '../../../../../../../testUtils/customRender';

describe('test HighPriorityConditions', () => {
  const prefixPath = 'prefixPath';
  const conditionsValue: IHighPriorityCondition[] = [
    {
      boolean_operator: {
        boolean_operator_enums_value: [
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
        boolean_operator_value: '>'
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
      boolean_operator: {
        boolean_operator_enums_value: undefined,
        boolean_operator_value: '>'
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
    const { container, getByLabelText } = customRender();

    expect(container).toMatchSnapshot();

    fireEvent.click(getByLabelText('标记高优先级SQL'));

    await act(async () => jest.advanceTimersByTime(3000));

    expect(container).toMatchSnapshot();
  });
});
