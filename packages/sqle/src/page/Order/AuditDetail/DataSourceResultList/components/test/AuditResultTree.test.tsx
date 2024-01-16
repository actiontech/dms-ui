import { renderWithTheme } from '../../../../../../testUtils/customRender';
import { act, cleanup, fireEvent } from '@testing-library/react';

import AuditResultTree, { AuditResultTreeProps } from '../AuditResultTree';

import rule_template from '../../../../../../testUtils/mockApi/rule_template';
import { getBySelector } from '@actiontech/shared/lib/testUtil/customQuery';

describe('sqle/Order/AuditDetail/AuditResultTree', () => {
  let requestRuleList: jest.SpyInstance;

  const customRender = (params: AuditResultTreeProps = {}) => {
    return renderWithTheme(<AuditResultTree {...params} />);
  };

  beforeEach(() => {
    jest.useFakeTimers();
    requestRuleList = rule_template.getRuleList();
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
    cleanup();
  });

  it('render tree when auditResult is null', () => {
    const { baseElement } = customRender({
      auditResult: []
    });
    expect(baseElement).toMatchSnapshot();
  });

  it('render tree snap', async () => {
    const { baseElement } = customRender({
      auditResult: [
        {
          rule_name: 'rule name a'
        },
        {
          rule_name: 'rule name b'
        }
      ]
    });
    expect(baseElement).toMatchSnapshot();

    const iconArrow = getBySelector('.custom-icon-arrow-down', baseElement);
    fireEvent.click(iconArrow);
    await act(async () => jest.advanceTimersByTime(1000));
    expect(baseElement).toMatchSnapshot();
    await act(async () => jest.advanceTimersByTime(2300));
    expect(requestRuleList).toBeCalled();
    expect(requestRuleList).toBeCalledWith({
      filter_rule_names: 'rule name a,rule name b'
    });
    expect(baseElement).toMatchSnapshot();
  });
});
