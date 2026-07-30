import { ListDBServicesFilterLastConnectionTestStatusEnum } from '@actiontech/shared/lib/api/base/service/DBService/index.enum';
import { t } from '../../locale';

type IStaticEnumDictionary<T extends string> = {
  [key in T]: string;
};

/** AC-012 / S1 §5.6：过滤选项仅连通三态文案，与列表列「连通性测试成功/失败」对齐；不含权限语义 */
export const databaseTestConnectionStatusDictionary: IStaticEnumDictionary<ListDBServicesFilterLastConnectionTestStatusEnum> =
  {
    [ListDBServicesFilterLastConnectionTestStatusEnum.connect_failed]: t(
      'dmsDataSource.databaseList.connectFailed'
    ),
    [ListDBServicesFilterLastConnectionTestStatusEnum.connect_success]: t(
      'dmsDataSource.databaseList.connectSucceed'
    )
  };
