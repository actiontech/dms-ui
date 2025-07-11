import { sqleSuperRender } from '../../../../../../../../../../testUtils/superRender';
import ExecStatusTag, { ExecStatusTagProps } from '../ExecStatusTag';
import { getAuditTaskSQLsV2FilterExecStatusEnum } from '@actiontech/shared/lib/api/sqle/service/task/index.enum';

describe('sqle/ExecWorkflow/AuditDetail/execStatusMap', () => {
  const customRender = (
    params: ExecStatusTagProps = {
      status: getAuditTaskSQLsV2FilterExecStatusEnum.initialized
    }
  ) => {
    return sqleSuperRender(<ExecStatusTag {...params} />);
  };

  it('render initialized tag', () => {
    const { baseElement } = customRender();
    expect(baseElement).toMatchSnapshot();
  });

  it('render failed tag', () => {
    const { baseElement } = customRender({
      status: getAuditTaskSQLsV2FilterExecStatusEnum.failed
    });
    expect(baseElement).toMatchSnapshot();
  });

  it('render succeeded tag', () => {
    const { baseElement } = customRender({
      status: getAuditTaskSQLsV2FilterExecStatusEnum.succeeded
    });
    expect(baseElement).toMatchSnapshot();
  });

  it('render doing tag', () => {
    const { baseElement } = customRender({
      status: getAuditTaskSQLsV2FilterExecStatusEnum.doing
    });
    expect(baseElement).toMatchSnapshot();
  });

  it('render manually_executed tag', () => {
    const { baseElement } = customRender({
      status: getAuditTaskSQLsV2FilterExecStatusEnum.manually_executed
    });
    expect(baseElement).toMatchSnapshot();
  });

  it('render terminate_failed tag', () => {
    const { baseElement } = customRender({
      status: getAuditTaskSQLsV2FilterExecStatusEnum.terminate_failed
    });
    expect(baseElement).toMatchSnapshot();
  });

  it('render terminate_succeeded tag', () => {
    const { baseElement } = customRender({
      status: getAuditTaskSQLsV2FilterExecStatusEnum.terminate_succeeded
    });
    expect(baseElement).toMatchSnapshot();
  });

  it('render terminating tag', () => {
    const { baseElement } = customRender({
      status: getAuditTaskSQLsV2FilterExecStatusEnum.terminating
    });
    expect(baseElement).toMatchSnapshot();
  });
});
