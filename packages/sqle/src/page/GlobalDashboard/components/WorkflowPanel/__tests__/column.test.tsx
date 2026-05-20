import { screen } from '@testing-library/react';
import { superRender } from '@actiontech/shared/lib/testUtil/superRender';
import { workflowPanelColumns } from '../column';
import { GlobalWorkflowListItemWorkflowTypeEnum } from '@actiontech/shared/lib/api/sqle/service/common.enum';
import MockDate from 'mockdate';

describe('GlobalDashboard/WorkflowPanel/column', () => {
  beforeEach(() => {
    MockDate.set('2026-04-13 12:00:00');
  });

  afterEach(() => {
    MockDate.reset();
  });

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

  describe('create_user_name column (index 7)', () => {
    it('should render CustomAvatar when create_user_name is provided', () => {
      const columns = workflowPanelColumns();
      const render = columns[7].render as (name: string | undefined) => any;

      superRender(<>{render('admin')}</>);

      // CustomAvatar renders the uppercased first letter of the name
      expect(screen.getByText('A')).toBeInTheDocument();
    });

    it('should render dash when create_user_name is empty', () => {
      const columns = workflowPanelColumns();
      const render = columns[7].render as (name: string | undefined) => any;

      superRender(<>{render(undefined)}</>);

      expect(screen.getByText('-')).toBeInTheDocument();
    });

    it('should have filterCustomType select and correct filterKey', () => {
      const columns = workflowPanelColumns();
      const col = columns[7];

      expect(col.filterCustomType).toBe('select');
      expect(col.filterKey).toBe('filter_create_user_id');
      expect(col.filterLabel).toBe('发起人');
    });
  });

  describe('created_at column (index 8)', () => {
    it('should render formatted time when created_at is provided', () => {
      const columns = workflowPanelColumns();
      const render = columns[8].render as (time: string | undefined) => any;

      superRender(<>{render('2026-04-13 10:00:00')}</>);

      expect(screen.getByText('2026-04-13 10:00:00')).toBeInTheDocument();
    });

    it('should render dash when created_at is empty', () => {
      const columns = workflowPanelColumns();
      const render = columns[8].render as (time: string | undefined) => any;

      superRender(<>{render(undefined)}</>);

      expect(screen.getByText('-')).toBeInTheDocument();
    });

    it('should have filterCustomType date-range and correct filterKey array', () => {
      const columns = workflowPanelColumns();
      const col = columns[8];

      expect(col.filterCustomType).toBe('date-range');
      expect(col.filterKey).toEqual([
        'filter_create_time_from',
        'filter_create_time_to'
      ]);
      expect(col.filterLabel).toBe('创建时间');
    });
  });

  describe('updated_at column (index 9)', () => {
    it('should render formatted time when updated_at is provided', () => {
      const columns = workflowPanelColumns();
      const render = columns[9].render as (time: string | undefined) => any;

      superRender(<>{render('2026-04-13 16:00:00')}</>);

      expect(screen.getByText('2026-04-13 16:00:00')).toBeInTheDocument();
    });

    it('should render dash when updated_at is empty', () => {
      const columns = workflowPanelColumns();
      const render = columns[9].render as (time: string | undefined) => any;

      superRender(<>{render(undefined)}</>);

      expect(screen.getByText('-')).toBeInTheDocument();
    });

    it('should have filterCustomType date-range and correct filterKey array', () => {
      const columns = workflowPanelColumns();
      const col = columns[9];

      expect(col.filterCustomType).toBe('date-range');
      expect(col.filterKey).toEqual([
        'filter_update_time_from',
        'filter_update_time_to'
      ]);
      expect(col.filterLabel).toBe('最后操作时间');
    });
  });
});
