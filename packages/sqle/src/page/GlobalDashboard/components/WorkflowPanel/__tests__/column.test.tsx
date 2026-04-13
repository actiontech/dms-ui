import { screen } from '@testing-library/react';
import { superRender } from '@actiontech/shared/lib/testUtil/superRender';
import { workflowPanelColumns } from '../column';
import { GlobalWorkflowListItemWorkflowTypeEnum } from '@actiontech/shared/lib/api/sqle/service/common.enum';

describe('GlobalDashboard/WorkflowPanel/column', () => {
  it('should render fallback priority tag for unknown priority', () => {
    const columns = workflowPanelColumns();
    const priorityRender = columns[5].render as (value?: string) => any;

    superRender(<>{priorityRender('urgent')}</>);

    expect(screen.getByText('urgent')).toBeInTheDocument();
    expect(document.querySelector('.basic-tag-wrapper')).toBeInTheDocument();
  });

  it('should render fallback status tag for unknown status', () => {
    const columns = workflowPanelColumns();
    const statusRender = columns[6].render as (value?: string) => any;

    superRender(<>{statusRender('unknown_status')}</>);

    expect(screen.getByText('-')).toBeInTheDocument();
    expect(document.querySelector('.basic-tag-wrapper')).toBeInTheDocument();
  });

  it('should render fallback workflow type tag for unknown workflow type', () => {
    const columns = workflowPanelColumns();
    const workflowTypeRender = columns[1].render as (value?: string) => any;

    superRender(<>{workflowTypeRender('custom_type')}</>);

    expect(document.querySelector('.basic-tag-wrapper')).toBeInTheDocument();
  });

  it('should render name link with empty workflow id fallback', () => {
    const columns = workflowPanelColumns();
    const nameRender = columns[0].render as (name: string, record: any) => any;

    superRender(
      <>
        {nameRender('Workflow Without Id', {
          workflow_type: GlobalWorkflowListItemWorkflowTypeEnum.data_export,
          project_uid: 'project-1'
        })}
      </>
    );

    expect(screen.getByText('Workflow Without Id')).toBeInTheDocument();
  });

  it('should render dash when workflow type is empty', () => {
    const columns = workflowPanelColumns();
    const workflowTypeRender = columns[1].render as (value?: string) => any;

    superRender(<>{workflowTypeRender(undefined)}</>);

    expect(screen.getByText('-')).toBeInTheDocument();
  });
});
