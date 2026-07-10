import { screen, within } from '@testing-library/react';
import type { ReactNode } from 'react';
import { renderWithTheme } from '../../testUtils/customRender';
import RemediationDiffCompare from './RemediationDiffCompare';
import { mockUseCurrentUser } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentUser';

type MockAuditResultProps = {
  auditResult?: { message?: string };
};

type MockExemptedAuditResultProps = {
  skippedItem?: { message?: string };
};

type MockCollapsibleExemptedSectionProps = {
  title: string;
  count: number;
  children?: ReactNode;
};

jest.mock('../RuleException/AuditResultWithRuleException', () => {
  const React = require('react');
  return {
    __esModule: true,
    default: ({ auditResult }: MockAuditResultProps) =>
      React.createElement('span', null, auditResult?.message)
  };
});

jest.mock('../RuleException/ExemptedAuditResultWithActions', () => {
  const React = require('react');
  return {
    __esModule: true,
    default: ({ skippedItem }: MockExemptedAuditResultProps) =>
      React.createElement(
        'span',
        null,
        skippedItem?.message,
        React.createElement('button', { type: 'button' }, '查看例外详情')
      )
  };
});

jest.mock(
  '../RuleException/AuditResultExemptionPanel/CollapsibleExemptedSection',
  () => {
    const React = require('react');
    return {
      __esModule: true,
      default: ({
        title,
        count,
        children
      }: MockCollapsibleExemptedSectionProps) =>
        React.createElement(
          'div',
          { className: 'diff-section diff-section-exempted' },
          React.createElement('span', null, title),
          React.createElement('span', null, count),
          children
        )
    };
  }
);

describe('sqle/components/RemediationDetailDrawer/RemediationDiffCompare', () => {
  beforeEach(() => {
    mockUseCurrentUser();
  });

  it('renders first and latest audit columns with sectioned latest results', () => {
    renderWithTheme(
      <RemediationDiffCompare
        data={{
          first_audit_time: '2024-01-01T00:00:00Z',
          latest_audit_time: '2024-01-02T00:00:00Z',
          first_audit_result: [
            {
              level: 'error',
              rule_name: 'old_rule',
              message: '最初命中：表建议添加主键'
            },
            {
              level: 'warn',
              rule_name: 'shared_rule',
              message: '最初命中：查询建议添加 LIMIT'
            }
          ],
          latest_audit_result: [
            {
              level: 'warn',
              rule_name: 'shared_rule',
              message: '最末次命中：查询建议添加 LIMIT'
            },
            {
              level: 'error',
              rule_name: 'new_rule',
              message: '最末次命中：禁止使用 SELECT *'
            }
          ],
          rule_diff: {
            resolved: [{ rule_name: 'old_rule' }],
            new: [{ rule_name: 'new_rule' }],
            unchanged: [{ rule_name: 'shared_rule' }]
          }
        }}
      />
    );

    expect(screen.getByText('最初审核结果')).toBeInTheDocument();
    expect(screen.getByText('最末次审核结果')).toBeInTheDocument();
    expect(screen.getByText('最初命中：表建议添加主键')).toBeInTheDocument();
    expect(
      screen.getByText('最末次命中：查询建议添加 LIMIT')
    ).toBeInTheDocument();
    expect(screen.getByText('已优化')).toBeInTheDocument();
    expect(screen.getByText('新增')).toBeInTheDocument();
    expect(screen.getAllByText('未变动')).toHaveLength(1);
    expect(
      screen.queryByText('对比最初审核与当前审核结果，展示规则整改变化')
    ).not.toBeInTheDocument();
    expect(screen.queryByText('规则差异')).not.toBeInTheDocument();
    expect(screen.queryByText('新发现')).not.toBeInTheDocument();
  });

  it('groups skipped_by_rule_exception into a separate collapsible section', () => {
    renderWithTheme(
      <RemediationDiffCompare
        data={{
          latest_audit_result: [
            {
              level: 'warn',
              rule_name: 'active_rule',
              message: 'active'
            }
          ],
          skipped_by_rule_exception: [
            {
              level: 'error',
              rule_name: 'exempted_rule',
              message: 'exempted',
              exception_id: 1
            }
          ],
          rule_diff: {
            unchanged: [{ rule_name: 'active_rule' }]
          }
        }}
      />
    );

    const unchangedSection = screen
      .getByText('未变动')
      .closest('.diff-section') as HTMLElement;
    const exemptedSection = screen
      .getByText('已例外')
      .closest('.diff-section') as HTMLElement;

    expect(within(unchangedSection).getByText('1')).toBeInTheDocument();
    expect(within(unchangedSection).getByText('active')).toBeInTheDocument();
    expect(
      within(unchangedSection).queryByText('exempted')
    ).not.toBeInTheDocument();
    expect(exemptedSection).toHaveClass('diff-section-exempted');
    expect(within(exemptedSection).getByText('1')).toBeInTheDocument();
    expect(within(exemptedSection).getByText('exempted')).toBeInTheDocument();
    expect(document.querySelector('.ant-tag')).not.toBeInTheDocument();
    expect(
      within(exemptedSection).getByText('查看例外详情')
    ).toBeInTheDocument();
    expect(
      within(exemptedSection).queryByText('取消例外')
    ).not.toBeInTheDocument();
  });
});
