import { act } from '@testing-library/react';
import ExportGlobalWorkflowButton from '..';
import { superRender } from '@actiontech/shared/lib/testUtil/superRender';
import { sqleMockApi } from '@actiontech/shared/lib/testUtil/mockApi';
import { GetGlobalWorkflowListV2FilterCardEnum } from '@actiontech/shared/lib/api/sqle/service/GlobalDashboard/index.enum';
import { GetAuditPlanSQLExportReqV1ExportFormatEnum } from '@actiontech/shared/lib/api/sqle/service/common.enum';
import EventEmitter from '../../../../../../utils/EventEmitter';
import EmitterKey from '../../../../../../data/EmitterKey';

describe('ExportGlobalWorkflowButton', () => {
  let exportGlobalWorkflowsSpy: jest.SpyInstance;

  beforeEach(() => {
    jest.useFakeTimers();
    exportGlobalWorkflowsSpy =
      sqleMockApi.globalDashboard.exportGlobalWorkflows();
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
  });

  it('should include filter_by_ops_type_uid when table filter has ops type', async () => {
    superRender(
      <ExportGlobalWorkflowButton
        filterCard={GetGlobalWorkflowListV2FilterCardEnum.pending_for_me}
        workflowType={null}
        tableFilterInfo={{ filter_by_ops_type_uid: 'ops-type-uid-1' }}
      />
    );

    act(() => {
      EventEmitter.emit(
        EmitterKey.Export_Global_Dashboard_Workflow_List,
        GetAuditPlanSQLExportReqV1ExportFormatEnum.csv
      );
    });
    await act(async () => jest.advanceTimersByTime(3000));

    expect(exportGlobalWorkflowsSpy).toHaveBeenCalledTimes(1);
    expect(exportGlobalWorkflowsSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        filter_by_ops_type_uid: 'ops-type-uid-1',
        export_format: 'csv'
      }),
      expect.objectContaining({ responseType: 'blob' })
    );
  });

  it('should leave filter_by_ops_type_uid undefined when ops type is not filtered', async () => {
    superRender(
      <ExportGlobalWorkflowButton
        filterCard={GetGlobalWorkflowListV2FilterCardEnum.pending_for_me}
        workflowType={null}
        tableFilterInfo={{}}
      />
    );

    act(() => {
      EventEmitter.emit(
        EmitterKey.Export_Global_Dashboard_Workflow_List,
        GetAuditPlanSQLExportReqV1ExportFormatEnum.csv
      );
    });
    await act(async () => jest.advanceTimersByTime(3000));

    expect(exportGlobalWorkflowsSpy).toHaveBeenCalledTimes(1);
    expect(
      exportGlobalWorkflowsSpy.mock.calls[0][0].filter_by_ops_type_uid
    ).toBeUndefined();
  });
});
