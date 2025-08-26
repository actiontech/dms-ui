import { darkThemeUI } from '@actiontech/dms-kit/es/theme/dark/basic';
import { DataExportTheme } from '../type';
import { WorkflowRecordStatusEnum } from '@actiontech/shared/lib/api/base/service/common.enum';

export const dataExportTheme: DataExportTheme = {
  create: {
    form: {
      baseInfoTitleIconColor: darkThemeUI.uiToken.colorTextQuaternary
    }
  },
  statistics: {
    auditResultStatusColor: {
      [WorkflowRecordStatusEnum.wait_for_approve]: '#7453DA',
      [WorkflowRecordStatusEnum.wait_for_export]: '#7470ED',
      [WorkflowRecordStatusEnum.exporting]: '#6094FC',
      [WorkflowRecordStatusEnum.finish]: '#41BF9A',
      [WorkflowRecordStatusEnum.failed]: '#F59957',
      [WorkflowRecordStatusEnum.rejected]: '#EBAD1C',
      [WorkflowRecordStatusEnum.cancel]: '#7D8CA8'
    }
  }
};
