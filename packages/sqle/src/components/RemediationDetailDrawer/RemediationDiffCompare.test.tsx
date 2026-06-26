import { screen, within } from '@testing-library/react';
import { renderWithTheme } from '../../testUtils/customRender';
import RemediationDiffCompare from './RemediationDiffCompare';

describe('sqle/components/RemediationDetailDrawer/RemediationDiffCompare', () => {
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
});
