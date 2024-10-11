import { t } from '../../locale';
import { SqlVersionResV1StatusEnum } from '@actiontech/shared/lib/api/sqle/service/common.enum';

export const VersionStatusDictionary: {
  [key in SqlVersionResV1StatusEnum]: string;
} = {
  [SqlVersionResV1StatusEnum.locked]: t('versionManagement.list.locked'),
  [SqlVersionResV1StatusEnum.is_being_released]: t(
    'versionManagement.list.releasing'
  )
};
