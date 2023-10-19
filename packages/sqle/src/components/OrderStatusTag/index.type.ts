import { TagProps } from 'antd';
import { I18nKey } from '../../locale';
import { WorkflowRecordResV2StatusEnum } from '@actiontech/shared/lib/api/sqle/service/common.enum';

export type OrderStatus = {
  [key in WorkflowRecordResV2StatusEnum | 'unknown']: {
    color: TagProps['color'];
    label: I18nKey;
  };
};
