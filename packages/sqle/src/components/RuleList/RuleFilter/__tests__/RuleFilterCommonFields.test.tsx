import { act, cleanup, screen } from '@testing-library/react';
import RuleFilterCommonFields from '../RuleFilterCommonFields';
import { Form } from 'antd';
import { superRender } from '../../../../testUtils/customRender';
import ruleTemplate from '../../../../testUtils/mockApi/rule_template';
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
    return superRender(
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
    expect(screen.getByText('质量控制目的')).toBeInTheDocument();
    expect(screen.getByText('SQL分类')).toBeInTheDocument();
    expect(screen.getByText('审核模式')).toBeInTheDocument();
  });
});
