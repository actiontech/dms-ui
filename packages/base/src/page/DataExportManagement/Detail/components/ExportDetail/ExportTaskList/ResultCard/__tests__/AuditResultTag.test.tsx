import { RuleResV1LevelEnum } from '@actiontech/shared/lib/api/sqle/service/common.enum';
import { superRender } from '../../../../../../../../testUtils/customRender';
import { screen } from '@testing-library/react';
import AuditResultTag, { AuditResultTagProps } from '../AuditResultTag';

describe('test base/DataExport/Detail/ExportDetail/ExportTaskList/AuditResultTag', () => {
  it('should match snapshot', () => {
    expect(superRender(<AuditResultTag />)).toMatchSnapshot();
    expect(
      superRender(
        <AuditResultTag auditResult={[{ level: RuleResV1LevelEnum.error }]} />
      )
    ).toMatchSnapshot();

    expect(
      superRender(
        <AuditResultTag auditResult={[{ level: RuleResV1LevelEnum.normal }]} />
      )
    ).toMatchSnapshot();

    expect(
      superRender(
        <AuditResultTag auditResult={[{ level: RuleResV1LevelEnum.notice }]} />
      )
    ).toMatchSnapshot();

    expect(
      superRender(
        <AuditResultTag auditResult={[{ level: RuleResV1LevelEnum.warn }]} />
      )
    ).toMatchSnapshot();

    expect(
      superRender(
        <AuditResultTag
          auditResult={[
            { level: RuleResV1LevelEnum.warn },
            { level: RuleResV1LevelEnum.error },
            { level: RuleResV1LevelEnum.notice }
          ]}
        />
      )
    ).toMatchSnapshot();
  });

  it('render tag splits error P0 and P1', () => {
    superRender(
      <AuditResultTag
        auditResult={
          [
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
        }
      />
    );
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
});
