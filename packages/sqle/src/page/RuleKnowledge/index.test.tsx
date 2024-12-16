import RuleKnowledge from '.';
import { superRender } from '../../testUtils/customRender';
import {
  ruleKnowledgeData,
  ruleType as dbType,
  ruleNameFirst,
  ruleNameSecond
} from '../../testUtils/mockApi/rule_template/data';
import { getBySelector } from '@actiontech/shared/lib/testUtil/customQuery';
import { act, fireEvent, screen } from '@testing-library/react';
import rule_template from '../../testUtils/mockApi/rule_template';
import {
  ignoreConsoleErrors,
  UtilsConsoleErrorStringsEnum
} from '@actiontech/shared/lib/testUtil/common';
import { useParams } from 'react-router-dom';
import { mockUseCurrentUser } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentUser';
import { mockUsePermission } from '@actiontech/shared/lib/testUtil/mockHook/mockUsePermission';

jest.mock('react-redux', () => {
  return {
    ...jest.requireActual('react-redux'),
    useSelector: jest.fn()
  };
});

jest.mock('react-router-dom', () => {
  return {
    ...jest.requireActual('react-router-dom'),
    useParams: jest.fn()
  };
});

describe('page/RuleKnowledge', () => {
  ignoreConsoleErrors([UtilsConsoleErrorStringsEnum.INVALID_CUSTOM_ATTRIBUTE]);

  const useParamsMock: jest.Mock = useParams as jest.Mock;

  beforeEach(() => {
    useParamsMock.mockReturnValue({
      ruleName: ruleNameFirst,
      dbType
    });
    rule_template.mockAllApi();
    mockUseCurrentUser();
    mockUsePermission(undefined, { mockSelector: true });
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  const customRender = () => {
    return superRender(<RuleKnowledge />);
  };

  it('request rule info and not custom rule knowledge', async () => {
    const request = rule_template.getRuleList();
    const knowledgeRequest = rule_template.getRuleKnowledge();
    const { baseElement } = customRender();
    await act(async () => jest.advanceTimersByTime(3000));
    expect(request).toHaveBeenCalledWith({
      filter_rule_names: ruleNameFirst,
      filter_db_type: dbType
    });
    await act(async () => jest.advanceTimersByTime(3000));
    expect(knowledgeRequest).toHaveBeenCalledWith({
      rule_name: ruleNameFirst,
      db_type: dbType
    });
    await act(async () => jest.advanceTimersByTime(3000));
    expect(baseElement).toMatchSnapshot();
    expect(screen.getByText('知识库')).toBeInTheDocument();
    expect(screen.getByText(ruleKnowledgeData.rule.desc)).toBeInTheDocument();
  });

  it('update rule and refresh', async () => {
    const request = rule_template.getRuleList();
    const knowledgeRequest = rule_template.getRuleKnowledge();
    const submitRequest = rule_template.updateRuleKnowledge();
    const { baseElement } = customRender();
    await act(async () => jest.advanceTimersByTime(3000));
    expect(request).toHaveBeenCalledWith({
      filter_rule_names: ruleNameFirst,
      filter_db_type: dbType
    });
    await act(async () => jest.advanceTimersByTime(3000));
    expect(knowledgeRequest).toHaveBeenCalledWith({
      rule_name: ruleNameFirst,
      db_type: dbType
    });
    await act(async () => jest.advanceTimersByTime(3000));
    expect(baseElement).toMatchSnapshot();
    fireEvent.click(screen.getByText('编 辑'));
    await act(async () => jest.advanceTimersByTime(3000));
    expect(getBySelector('input')).toBeInTheDocument();
    await act(async () => {
      fireEvent.change(getBySelector('input'), {
        target: {
          value: '1'
        }
      });
    });
    await act(async () => jest.advanceTimersByTime(3000));
    fireEvent.click(screen.getByText('提 交'));
    await act(async () => jest.advanceTimersByTime(3000));
    expect(submitRequest).toHaveBeenCalledWith({
      rule_name: ruleNameFirst,
      knowledge_content: '1',
      db_type: dbType
    });
    expect(screen.getByText('规则理解修改成功')).toBeInTheDocument();
    expect(knowledgeRequest).toHaveBeenCalledWith({
      rule_name: ruleNameFirst,
      db_type: dbType
    });
  });

  it('request rule info and custom rule knowledge', async () => {
    useParamsMock.mockReturnValue({
      ruleName: ruleNameSecond,
      dbType
    });
    const request = rule_template.getRuleList();
    const customKnowledgeRequest = rule_template.getCustomRuleKnowledge();
    const { baseElement } = customRender();
    await act(async () => jest.advanceTimersByTime(3000));
    expect(request).toHaveBeenCalledWith({
      filter_rule_names: ruleNameSecond,
      filter_db_type: dbType
    });
    await act(async () => jest.advanceTimersByTime(3000));
    expect(customKnowledgeRequest).toHaveBeenCalledWith({
      rule_name: ruleNameSecond,
      db_type: dbType
    });
    await act(async () => jest.advanceTimersByTime(3000));
    expect(baseElement).toMatchSnapshot();
    expect(screen.getByText('知识库')).toBeInTheDocument();
    expect(screen.getByText(ruleKnowledgeData.rule.desc)).toBeInTheDocument();
  });
});
