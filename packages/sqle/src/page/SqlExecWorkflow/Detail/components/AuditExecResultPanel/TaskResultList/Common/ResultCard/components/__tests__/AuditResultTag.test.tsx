import { RuleResV1LevelEnum } from '@actiontech/shared/lib/api/sqle/service/common.enum';
import AuditResultTag, { AuditResultTagProps } from '../AuditResultTag';
import { superRender } from '../../../../../../../../../../testUtils/customRender';

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
