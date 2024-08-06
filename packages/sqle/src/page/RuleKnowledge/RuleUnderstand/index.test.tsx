import RuleUnderstand from '.';
import { superRender } from '../../../testUtils/customRender';
import {
  ruleKnowledgeData,
  ruleType as dbType,
  ruleNameFirst as ruleName
} from '../../../testUtils/mockApi/rule_template/data';
import { RuleUnderstandProps } from './index.type';
import { getBySelector } from '@actiontech/shared/lib/testUtil/customQuery';
import { act, fireEvent, screen } from '@testing-library/react';
import rule_template from '../../../testUtils/mockApi/rule_template';
import { createSpySuccessResponse } from '@actiontech/shared/lib/testUtil/mockApi';
import {
  ignoreConsoleErrors,
  UtilsConsoleErrorStringsEnum
} from '@actiontech/shared/lib/testUtil/common';

jest.mock('rehype-sanitize', () => () => jest.fn());

describe('page/RuleUnderstand', () => {
  ignoreConsoleErrors([UtilsConsoleErrorStringsEnum.INVALID_CUSTOM_ATTRIBUTE]);

  const mockRefresh = jest.fn();

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
    rule_template.mockAllApi();
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
    expect(screen.getByText('暂无数据, 请编辑')).toBeInTheDocument();
    expect(screen.getByText('规则理解')).toBeInTheDocument();
    expect(screen.getByText('编 辑')).toBeInTheDocument();
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

  it('update custom rule and submit data', async () => {
    const submitRequest = rule_template.updateCustomRuleKnowledge();
    const { baseElement } = customRender(ruleUnderstandProps);
    expect(baseElement).toMatchSnapshot();
    expect(screen.getByText('编 辑')).toBeInTheDocument();
    fireEvent.click(screen.getByText('编 辑'));
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
    await act(async () => jest.advanceTimersByTime(3000));
    fireEvent.click(screen.getByText('提 交'));
    await act(async () => jest.advanceTimersByTime(3000));
    expect(submitRequest).toHaveBeenCalledTimes(1);
    expect(submitRequest).toHaveBeenCalledWith({
      rule_name: ruleName,
      knowledge_content: '1',
      db_type: dbType
    });
    expect(screen.getByText('规则理解修改成功')).toBeInTheDocument();
    expect(mockRefresh).toHaveBeenCalled();
  });

  it('update rule and submit data failed', async () => {
    const submitRequest = rule_template.updateRuleKnowledge();
    submitRequest.mockImplementation(() =>
      createSpySuccessResponse({
        code: 500,
        message: 'error'
      })
    );
    const { baseElement } = customRender({
      ...ruleUnderstandProps,
      isCustomRule: false
    });
    expect(baseElement).toMatchSnapshot();
    expect(screen.getByText('编 辑')).toBeInTheDocument();
    fireEvent.click(screen.getByText('编 辑'));
    await act(async () => jest.advanceTimersByTime(3000));
    expect(getBySelector('input')).toBeInTheDocument();
    expect(getBySelector('input')).toHaveAttribute(
      'value',
      ruleKnowledgeData.knowledge_content
    );
    await act(async () => {
      fireEvent.change(getBySelector('input'), {
        target: {
          value: '12'
        }
      });
    });
    await act(async () => jest.advanceTimersByTime(3000));
    fireEvent.click(screen.getByText('提 交'));
    await act(async () => jest.advanceTimersByTime(3000));
    expect(submitRequest).toHaveBeenCalledTimes(1);
    expect(submitRequest).toHaveBeenCalledWith({
      rule_name: ruleName,
      knowledge_content: '12',
      db_type: dbType
    });
  });

  it('start edit and cancel', async () => {
    const { baseElement } = customRender(ruleUnderstandProps);
    expect(baseElement).toMatchSnapshot();
    expect(screen.getByText('编 辑')).toBeInTheDocument();
    fireEvent.click(screen.getByText('编 辑'));
    await act(async () => jest.advanceTimersByTime(3000));
    expect(getBySelector('input')).toBeInTheDocument();
    expect(getBySelector('input')).toHaveAttribute(
      'value',
      ruleKnowledgeData.knowledge_content
    );
    fireEvent.click(screen.getByText('取 消'));
    await act(async () => jest.advanceTimersByTime(3000));
  });

  it('update rule and cancel update change', async () => {
    const { baseElement } = customRender(ruleUnderstandProps);
    expect(baseElement).toMatchSnapshot();
    expect(screen.getByText('编 辑')).toBeInTheDocument();
    fireEvent.click(screen.getByText('编 辑'));
    await act(async () => jest.advanceTimersByTime(3000));
    expect(getBySelector('input')).toBeInTheDocument();
    expect(getBySelector('input')).toHaveAttribute(
      'value',
      ruleKnowledgeData.knowledge_content
    );
    await act(async () => {
      fireEvent.change(getBySelector('input'), {
        target: {
          value: '12'
        }
      });
    });
    await act(async () => jest.advanceTimersByTime(3000));
    fireEvent.click(screen.getByText('取 消'));
    await act(async () => jest.advanceTimersByTime(3000));
    expect(
      screen.getByText('当前内容已经发生更改，是否确认取消修改？')
    ).toBeInTheDocument();
    fireEvent.click(screen.getByText('确 认'));
    await act(async () => jest.advanceTimersByTime(3000));
    expect(
      screen.getByText(ruleKnowledgeData.knowledge_content)
    ).toBeInTheDocument();
  });
});
