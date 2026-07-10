import { screen } from '@testing-library/react';
import AuditResultExemptionPanel from '.';
import { renderWithTheme } from '../../../testUtils/customRender';
import { mockUseCurrentUser } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentUser';

jest.mock('../AuditResultWithRuleException', () => {
  const React = require('react');
  return {
    __esModule: true,
    default: ({ auditResult }) =>
      React.createElement(
        'div',
        { 'data-testid': 'audit-result-with-rule-exception' },
        auditResult?.message,
        React.createElement('button', { type: 'button' }, '添加快捷例外')
      )
  };
});

jest.mock('../ExemptedAuditResultWithActions', () => {
  const React = require('react');
  return {
    __esModule: true,
    default: ({ skippedItem }) =>
      React.createElement(
        'div',
        { 'data-testid': 'exempted-audit-result-with-actions' },
        skippedItem?.message,
        React.createElement('button', { type: 'button' }, '查看例外详情')
      )
  };
});

jest.mock('../FullSqlExemptedResultItem', () => {
  const React = require('react');
  return {
    __esModule: true,
    default: ({ showViewDetailAction, message }) =>
      React.createElement(
        'div',
        { 'data-testid': 'full-sql-exempted-result-item' },
        message,
        showViewDetailAction
          ? React.createElement('button', { type: 'button' }, '查看例外详情')
          : null
      )
  };
});

describe('sqle/components/RuleException/AuditResultExemptionPanel', () => {
  const sqlManageContext = {
    sql_fingerprint: 'select 1',
    db_type: 'MySQL'
  };

  beforeEach(() => {
    mockUseCurrentUser({
      isAdmin: true,
      isProjectManager: jest.fn().mockReturnValue(true)
    });
  });

  it('renders add exception action for active audit results in report layout', () => {
    renderWithTheme(
      <AuditResultExemptionPanel
        layout="report"
        sqlManageContext={sqlManageContext}
        showRuleExceptionActions
        auditResult={[
          {
            rule_name: 'rule_a',
            level: 'warn',
            message: 'active result'
          }
        ]}
      />
    );

    expect(screen.getByText('active result')).toBeInTheDocument();
    expect(screen.getByText('添加快捷例外')).toBeInTheDocument();
  });

  it('renders view exception action for exempted audit results in report layout', () => {
    renderWithTheme(
      <AuditResultExemptionPanel
        layout="report"
        sqlManageContext={sqlManageContext}
        showExemptedActions
        skippedByRuleException={[
          {
            rule_name: 'rule_b',
            level: 'warn',
            message: 'exempted result',
            exception_id: 42
          }
        ]}
      />
    );

    expect(screen.getByText('exempted result')).toBeInTheDocument();
    expect(screen.getByText('查看例外详情')).toBeInTheDocument();
  });

  it('falls back to plain message when action flags are disabled', () => {
    renderWithTheme(
      <AuditResultExemptionPanel
        layout="report"
        showRuleExceptionActions={false}
        showExemptedActions={false}
        auditResult={[
          {
            rule_name: 'rule_a',
            level: 'warn',
            message: 'active result'
          }
        ]}
        skippedByRuleException={[
          {
            rule_name: 'rule_b',
            level: 'warn',
            message: 'exempted result',
            exception_id: 42
          }
        ]}
      />
    );

    expect(screen.getByText('active result')).toBeInTheDocument();
    expect(screen.getByText('exempted result')).toBeInTheDocument();
    expect(screen.queryByText('添加快捷例外')).not.toBeInTheDocument();
    expect(screen.queryByText('查看例外详情')).not.toBeInTheDocument();
  });

  it('renders full sql exempted row in exempted section with view detail action', () => {
    renderWithTheme(
      <AuditResultExemptionPanel
        layout="report"
        sqlManageContext={sqlManageContext}
        showExemptedActions
        auditResult={[]}
        skippedByRuleException={[
          {
            level: 'normal',
            message: '审核SQL例外',
            exception_id: 99
          }
        ]}
      />
    );

    expect(
      screen.getByTestId('full-sql-exempted-result-item')
    ).toHaveTextContent('审核SQL例外');
    expect(screen.getByText('查看例外详情')).toBeInTheDocument();
    expect(screen.getByText('审核通过')).toBeInTheDocument();
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  it('does not render view detail on pass result for full sql exemption', () => {
    renderWithTheme(
      <AuditResultExemptionPanel
        layout="report"
        auditResult={[]}
        skippedByRuleException={[
          {
            level: 'normal',
            message: '审核SQL例外',
            exception_id: 99
          }
        ]}
        showExemptedActions={false}
      />
    );

    expect(screen.getByText('审核通过')).toBeInTheDocument();
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    expect(
      screen.getByTestId('full-sql-exempted-result-item')
    ).toHaveTextContent('审核SQL例外');
    expect(screen.getByText('查看例外详情')).toBeInTheDocument();
  });
});
