import { act, cleanup, screen } from '@testing-library/react';
import RuleFilterCommonFields from '../RuleFilterCommonFields';
import { Form } from 'antd';
import { sqleSuperRender } from '../../../../testUtils/superRender';
import ruleTemplate from '@actiontech/shared/lib/testUtil/mockApi/sqle/rule_template';
import { getBySelector } from '@actiontech/shared/lib/testUtil/customQuery';

describe('sqle/components/RuleList/RuleFilterCommonFields', () => {
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
    return sqleSuperRender(
      <Form>
        <RuleFilterCommonFields />
      </Form>
    );
  };

  it('render int snap shot', async () => {
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
