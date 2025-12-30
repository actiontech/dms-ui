import { WorkflowRecordResV2StatusEnum } from '@actiontech/shared/lib/api/sqle/service/common.enum';
import { StatisticsTheme } from '../type';

export const rectColorName = {
  color1: '#7470ED',
  color2: '#6094FC',
  color3: '#3DB5F1',
  color4: '#1ACEDB',
  color5: '#4BCCA6',
  color6: '#7453DA',
  color7: '#F3B628',
  color8: '#F59957',
  color9: '#7D8CA8',
  color10: '#EBAD1C',
  color11: '#F66074',
  color12: '#1cb889',
  color13: '#41BF9A'
};

export const statisticsTheme: StatisticsTheme = {
  rectColor: [
    rectColorName.color1,
    rectColorName.color2,
    rectColorName.color3,
    rectColorName.color4,
    rectColorName.color5
  ],
  rectColorName,
  auditRateStatus: {
    success: {
      color: rectColorName.color12,
      bg: 'rgba(28, 184, 137, 0.2)'
    },
    warning: {
      color: rectColorName.color10,
      bg: 'rgba(235, 173, 28, 0.2)'
    },
    error: {
      color: rectColorName.color11,
      bg: 'rgba(246, 96, 116, 0.2)'
    },
    tip: {
      color: rectColorName.color2,
      bg: 'rgba(96, 148, 252, 0.2)'
    }
  },
  auditResultStatusColor: {
    [WorkflowRecordResV2StatusEnum.wait_for_audit]: '#7453DA',
    [WorkflowRecordResV2StatusEnum.wait_for_execution]: '#7470ED',
    [WorkflowRecordResV2StatusEnum.executing]: '#6094FC',
    [WorkflowRecordResV2StatusEnum.finished]: '#41BF9A',
    [WorkflowRecordResV2StatusEnum.exec_failed]: '#F59957',
    [WorkflowRecordResV2StatusEnum.rejected]: '#EBAD1C',
    [WorkflowRecordResV2StatusEnum.canceled]: '#7D8CA8'
  }
};
