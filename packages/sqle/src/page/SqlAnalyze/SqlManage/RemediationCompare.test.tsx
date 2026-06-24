import { screen } from '@testing-library/react';
import { renderWithTheme } from '../../../testUtils/customRender';
import RemediationCompare from './RemediationCompare';

describe('sqle/page/SqlAnalyze/SqlManage/RemediationCompare', () => {
  it('renders multiple first and latest audit results by rule name', () => {
    renderWithTheme(
      <RemediationCompare
        data={{
          remediation_status: 'partially_fixed',
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

    expect(screen.getAllByText('first_rule_without_primary_key')).toHaveLength(2);
    expect(screen.getByText('first_rule_without_comment')).toBeInTheDocument();
    expect(screen.getAllByText('latest_rule_without_index')).toHaveLength(2);
    expect(screen.getAllByText('latest_rule_without_limit')).toHaveLength(2);
    expect(screen.queryByText('首次命中：建表建议设置主键')).toBeNull();
    expect(screen.queryByText('最末次命中：查询建议添加 LIMIT')).toBeNull();
  });
});
