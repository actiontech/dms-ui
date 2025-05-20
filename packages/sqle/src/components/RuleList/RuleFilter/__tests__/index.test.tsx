import { act, cleanup, renderHook, screen } from '@testing-library/react';
import RuleFilter from '../index';
import { Form } from 'antd';
import { sqleSuperRender } from '../../../../testUtils/superRender';
import ruleTemplate from '@actiontech/shared/lib/testUtil/mockApi/sqle/rule_template';
import { getBySelector } from '@actiontech/shared/lib/testUtil/customQuery';

describe('sqle/components/RuleList/RuleFilter', () => {
  let getCategoryStatisticsSpy: jest.SpyInstance;
  beforeEach(() => {
    jest.useFakeTimers();
    getCategoryStatisticsSpy = ruleTemplate.getCategoryStatistics();
  });

  afterEach(() => {
    jest.useRealTimers();
    cleanup();
  });

  const customRender = () => {
    const { result } = renderHook(() => {
      return Form.useForm();
    });

    return sqleSuperRender(<RuleFilter form={result.current[0]} />);
  };

  it('render init snap shot', async () => {
    const { baseElement } = customRender();
    await act(async () => jest.advanceTimersByTime(3000));
    expect(getCategoryStatisticsSpy).toHaveBeenCalledTimes(1);
    expect(baseElement).toMatchSnapshot();
    expect(getBySelector('#fuzzy_keyword')).toBeInTheDocument();
    expect(screen.getByText('操作对象')).toBeInTheDocument();
    expect(screen.getByText('审核目的')).toBeInTheDocument();
    expect(screen.getByText('SQL分类')).toBeInTheDocument();
    expect(screen.getByText('审核精度')).toBeInTheDocument();
    expect(screen.getByText('性能消耗')).toBeInTheDocument();
  });
});
