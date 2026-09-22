import { RuleResV1LevelEnum } from '@actiontech/shared/lib/api/sqle/service/common.enum';
import AuditResultTag, { AuditResultTagProps } from '../AuditResultTag';
import { superRender } from '../../../../../../../../../../testUtils/customRender';
import { screen } from '@testing-library/react';

describe('sqle/ExecWorkflow/AuditDetail/AuditResultTag', () => {
  const customRender = (params: AuditResultTagProps = {}) => {
    return superRender(<AuditResultTag {...params} />);
  };

  it('render tag is audit success', () => {
    const { baseElement } = customRender();
    expect(baseElement).toMatchSnapshot();
  });

  it('render tag is notice & warn & error', () => {
    const { baseElement } = customRender({
      auditResult: [
        {
          level: RuleResV1LevelEnum.notice
        },
        {
          level: RuleResV1LevelEnum.error
        },
        {
          level: RuleResV1LevelEnum.warn
        }
      ]
    });
    expect(baseElement).toMatchSnapshot();
  });

  it('render tag is error', () => {
    const { baseElement } = customRender({
      auditResult: [
        {
          level: RuleResV1LevelEnum.error
        }
      ]
    });
    expect(baseElement).toMatchSnapshot();
    expect(screen.getByText('错误')).toBeInTheDocument();
  });

  it('render tag splits error P0 and P1', () => {
    customRender({
      auditResult: [
        {
          level: RuleResV1LevelEnum.error,
          error_priority: 'P0'
        },
        {
          level: RuleResV1LevelEnum.error,
          error_priority: 'P1'
        },
        {
          level: RuleResV1LevelEnum.error,
          error_priority: 'P0'
        }
      ] as unknown as AuditResultTagProps['auditResult']
    });
    expect(screen.getByText('错误(P0)')).toBeInTheDocument();
    expect(screen.getByText('错误(P1)')).toBeInTheDocument();
    expect(screen.getByLabelText('错误(P0)')).toHaveAttribute(
      'data-error-priority',
      'P0'
    );
    expect(screen.getByLabelText('错误(P1)')).toHaveAttribute(
      'data-error-priority',
      'P1'
    );
  });

  it('render tag is notice', () => {
    const { baseElement } = customRender({
      auditResult: [
        {
          level: RuleResV1LevelEnum.notice
        }
      ]
    });
    expect(baseElement).toMatchSnapshot();
  });

  it('render tag is warn', () => {
    const { baseElement } = customRender({
      auditResult: [
        {
          level: RuleResV1LevelEnum.warn
        }
      ]
    });
    expect(baseElement).toMatchSnapshot();
  });
});
