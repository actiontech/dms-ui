import { cleanup } from '@testing-library/react';
import { WorkflowRecordResV2StatusEnum } from '@actiontech/shared/lib/api/sqle/service/common.enum';
import { superRender } from '../../../../../../testUtils/customRender';
import { WorkflowBasicInfoProps } from '../index.type';
import WorkflowBasicInfo from '../components/WorkflowBasicInfo';

describe('sqle/SqlExecWorkflow/Detail/WorkflowBasicInfo', () => {
  const customRender = (workflowStatus?: WorkflowRecordResV2StatusEnum) => {
    const params: WorkflowBasicInfoProps = {
      createTime: '2024-01-05T11:00:33Z',
      createUserName: 'admin'
    };
    return superRender(
      <WorkflowBasicInfo {...params} workflowStatus={workflowStatus} />
    );
  };

  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.clearAllTimers();
    cleanup();
  });

  it('render snap when workflow is undefined', () => {
    const { baseElement } = customRender();
    expect(baseElement).toMatchSnapshot();
  });

  it('render snap when workflow is normal', () => {
    const { baseElement } = customRender(
      WorkflowRecordResV2StatusEnum.executing
    );
    expect(baseElement).toMatchSnapshot();
  });
});
