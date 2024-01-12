import { mockUseCurrentUser } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentUser';
import RuleUnderstand from '.';
import { superRender } from '../../../testUtils/customRender';
import { ruleKnowledgeData } from '../../../testUtils/mockApi/rule_template/data';
import { RuleUnderstandProps } from './index.type';
import { getBySelector } from '@actiontech/shared/lib/testUtil/customQuery';
import { act, fireEvent, screen } from '@testing-library/react';

describe('page/RuleUnderstand', () => {
  const ruleName = 'testRule';
  const mockRefresh = jest.fn();
  const dbType = 'MySQL';

  const ruleUnderstandProps = {
    ruleName,
    content: ruleKnowledgeData.knowledge_content,
    refresh: mockRefresh,
    dbType,
    loading: false,
    isAdmin: true,
    isCustomRule: true
  };

  beforeEach(() => {
    // mockUseCurrentUser();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  const customRender = (data: RuleUnderstandProps) => {
    return superRender(<RuleUnderstand {...data} />);
  };

  it('render empty data', () => {
    const { baseElement } = customRender({
      ...ruleUnderstandProps,
      content: undefined
    });
    expect(baseElement).toMatchSnapshot();
    expect(screen.getByText('暂无数据，请编辑')).toBeInTheDocument();
    expect(screen.getByText('规则理解')).toBeInTheDocument();
    expect(screen.getByText('编辑')).toBeInTheDocument();
  });

  it('render content data and no edit permission for not admin', () => {
    const { baseElement } = customRender({
      ...ruleUnderstandProps,
      isAdmin: false
    });
    expect(baseElement).toMatchSnapshot();
    expect(
      screen.getByText(ruleKnowledgeData.knowledge_content)
    ).toBeInTheDocument();
  });

  it('update rule and submit data', async () => {
    const { baseElement } = customRender(ruleUnderstandProps);
    expect(baseElement).toMatchSnapshot();
    expect(screen.getByText('编辑')).toBeInTheDocument();
    fireEvent.click(screen.getByText('编辑'));
    await act(async () => jest.advanceTimersByTime(3000));
    expect(getBySelector('input')).toBeInTheDocument();
    expect(getBySelector('input')).toHaveAttribute(
      'value',
      ruleKnowledgeData.knowledge_content
    );
    await act(async () => {
      fireEvent.change(getBySelector('input'), {
        target: {
          value: '1'
        }
      });
    });
  });
});
