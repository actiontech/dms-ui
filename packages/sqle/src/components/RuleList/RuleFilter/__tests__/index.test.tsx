import { act, cleanup, renderHook, screen } from '@testing-library/react';
import RuleFilter from '../index';
import { Form } from 'antd';
import { superRender } from '../../../../testUtils/customRender';
import ruleTemplate from '../../../../testUtils/mockApi/rule_template';
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

    return superRender(<RuleFilter form={result.current[0]} />);
  };

  it('render init snap shot', async () => {
    const { baseElement } = customRender();
    await act(async () => jest.advanceTimersByTime(3000));
    expect(getCategoryStatisticsSpy).toHaveBeenCalledTimes(1);
    expect(baseElement).toMatchSnapshot();
    expect(getBySelector('#fuzzy_keyword')).toBeInTheDocument();
    expect(screen.getByText('操作对象')).toBeInTheDocument();
    expect(screen.getByText('质量控制目的')).toBeInTheDocument();
    expect(screen.getByText('SQL分类')).toBeInTheDocument();
    expect(screen.getByText('审核模式')).toBeInTheDocument();
  });
});
