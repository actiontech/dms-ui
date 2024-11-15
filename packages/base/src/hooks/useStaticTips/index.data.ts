import { ListDBServicesFilterLastConnectionTestStatusEnum } from '@actiontech/shared/lib/api/base/service/DBService/index.enum';
import { t } from '../../locale';

type IStaticEnumDictionary<T extends string> = {
  [key in T]: string;
};

export const databaseTestConnectionStatusDictionary: IStaticEnumDictionary<ListDBServicesFilterLastConnectionTestStatusEnum> =
  {
    [ListDBServicesFilterLastConnectionTestStatusEnum.connect_failed]: t(
      'dmsDataSource.batchTestConnection.connectFailed'
    ),
    [ListDBServicesFilterLastConnectionTestStatusEnum.connect_success]: t(
      'dmsDataSource.batchTestConnection.connectSucceed'
    )
  };
