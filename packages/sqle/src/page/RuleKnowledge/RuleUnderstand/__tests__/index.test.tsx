import RuleUnderstand from '..';
import { sqleSuperRender } from '../../../../testUtils/superRender';
import {
  ruleNameFirst as ruleName,
  mockMarkdownWithCustomCodeBlock
} from '../../../../testUtils/mockApi/rule_template/data';
import { RuleUnderstandProps } from '../index.type';
import { screen, act } from '@testing-library/react';
import {
  ignoreConsoleErrors,
  UtilsConsoleErrorStringsEnum
} from '@actiontech/shared/lib/testUtil/common';
import knowledgeBase from '../../../../testUtils/mockApi/knowledgeBase';

jest.mock('react-redux', () => {
  return {
    ...jest.requireActual('react-redux'),
    useSelector: jest.fn()
  };
});

jest.mock('rehype-rewrite', () => {
  return {
    getCodeString: jest.fn()
  };
});

describe('page/RuleUnderstand', () => {
  let getKnowledgeGraphSpy: jest.SpyInstance;
  ignoreConsoleErrors([UtilsConsoleErrorStringsEnum.INVALID_CUSTOM_ATTRIBUTE]);

  const ruleUnderstandProps: RuleUnderstandProps = {
    ruleName,
    content: mockMarkdownWithCustomCodeBlock,
    loading: false,
    isModifying: false,
    editValue: '',
    setEditValue: jest.fn(),
    setHasDirtyData: jest.fn()
  };

  beforeEach(() => {
    jest.useFakeTimers();
    getKnowledgeGraphSpy = knowledgeBase.getKnowledgeGraph();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  const customRender = (data: RuleUnderstandProps) => {
    return sqleSuperRender(<RuleUnderstand {...data} />);
  };

  it('render empty data', () => {
    const { baseElement } = customRender({
      ...ruleUnderstandProps,
      content: undefined
    });
    expect(baseElement).toMatchSnapshot();
    expect(screen.getByText('暂无数据, 请编辑')).toBeInTheDocument();
  });

  it('render content data', async () => {
    const { baseElement } = customRender({ ...ruleUnderstandProps });
    await act(async () => jest.advanceTimersByTime(3000));
    expect(getKnowledgeGraphSpy).toHaveBeenCalledTimes(1);
    expect(getKnowledgeGraphSpy).toHaveBeenCalledWith({
      filter_by_rule_name: ruleName
    });
    expect(baseElement).toMatchSnapshot();
  });
});
