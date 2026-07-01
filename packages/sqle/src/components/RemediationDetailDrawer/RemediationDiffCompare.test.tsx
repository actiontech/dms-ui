import { screen, within } from '@testing-library/react';
import { renderWithTheme } from '../../testUtils/customRender';
import RemediationDiffCompare from './RemediationDiffCompare';
import { IAuditResultWithExemption } from '../../page/RuleException/index.type';
import { mockUseCurrentUser } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentUser';

jest.mock('../RuleException', () => {
  const React = require('react');
  return {
    AuditResultWithRuleException: ({ auditResult }) =>
      React.createElement('span', null, auditResult?.message),
    ExemptedAuditResultWithActions: ({ auditResult }) =>
      React.createElement(
        'span',
        null,
        auditResult?.message,
        React.createElement('button', { type: 'button' }, '查看例外详情')
      )
  };
});

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => jest.fn()
}));

describe('sqle/components/RemediationDetailDrawer/RemediationDiffCompare', () => {
  beforeEach(() => {
    mockUseCurrentUser({
      isAdmin: true,
      isProjectManager: jest.fn().mockReturnValue(true)
    });
  });
  it('renders side-by-side audit results grouped into diff sections', () => {
    renderWithTheme(
      <RemediationDiffCompare
        data={{
          first_audit_result: [
            {
              level: 'warn',
              rule_name: 'first_rule_without_primary_key',
              message: '首次命中：建表建议设置主键'
            },
            {
              level: 'error',
              rule_name: 'first_rule_without_comment',
              message: '首次命中：字段建议添加注释'
            }
          ],
          latest_audit_result: [
            {
              level: 'warn',
              rule_name: 'latest_rule_without_index',
              message: '最末次命中：查询条件建议添加索引'
            },
            {
              level: 'error',
              rule_name: 'latest_rule_without_limit',
              message: '最末次命中：查询建议添加 LIMIT'
            }
          ],
          rule_diff: {
            resolved: [{ rule_name: 'first_rule_without_primary_key' }],
            new: [{ rule_name: 'latest_rule_without_limit' }],
            unchanged: [{ rule_name: 'latest_rule_without_index' }]
          }
        }}
      />
    );

    const leftColumn = screen
      .getByText('最初审核结果')
      .closest('.diff-column') as HTMLElement;

    expect(
      within(leftColumn).getByText('首次命中：建表建议设置主键')
    ).toBeInTheDocument();
    expect(
      within(leftColumn).getByText('首次命中：字段建议添加注释')
    ).toBeInTheDocument();
    expect(
      within(leftColumn)
        .getByText('首次命中：建表建议设置主键')
        .closest('.diff-item-optimized')
    ).toBeInTheDocument();
    expect(
      within(leftColumn)
        .getByText('首次命中：字段建议添加注释')
        .closest('.diff-item-optimized')
    ).not.toBeInTheDocument();
    expect(
      screen.getByText('最末次命中：查询条件建议添加索引')
    ).toBeInTheDocument();
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

  it('groups is_exempted audit results into a separate collapsible section', () => {
    renderWithTheme(
      <RemediationDiffCompare
        data={{
          latest_audit_result: [
            {
              level: 'warn',
              rule_name: 'active_rule',
              message: 'active'
            },
            {
              level: 'error',
              rule_name: 'exempted_rule',
              message: 'exempted',
              is_exempted: true
            }
          ] as IAuditResultWithExemption[],
          rule_diff: {
            unchanged: [
              { rule_name: 'active_rule' },
              { rule_name: 'exempted_rule' }
            ]
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
