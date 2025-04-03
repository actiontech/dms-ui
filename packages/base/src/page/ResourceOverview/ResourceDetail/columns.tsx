import { t } from '../../../locale';
import { IListGlobalDBService } from '@actiontech/shared/lib/api/base/service/common';
import {
  ActiontechTableColumn,
  PageInfoWithoutIndexAndSize
} from '@actiontech/shared/lib/components/ActiontechTable';
import { IListGlobalDBServicesParams } from '@actiontech/shared/lib/api/base/service/DBService/index.d';
import { DatabaseTypeLogo } from '@actiontech/shared';

export type GLobalDataSourceListParamType = PageInfoWithoutIndexAndSize<
  IListGlobalDBServicesParams & { page_index: number }
>;

export const GlobalDataSourceColumns = (
  getLogoUrlByDbType: (dbType: string) => string
): ActiontechTableColumn<
  IListGlobalDBService,
  GLobalDataSourceListParamType,
  'address'
> => {
  return [
    {
      dataIndex: 'name',
      title: t('dmsGlobalDataSource.list.instanceName')
    },
    {
      dataIndex: 'project_name',
      title: t('dmsGlobalDataSource.list.projectName'),
      filterCustomType: 'select',
      filterKey: 'filter_by_project_uid'
    },
    {
      dataIndex: 'business',
      title: t('dmsGlobalDataSource.list.business')
    },
    {
      dataIndex: 'db_type',
      title: t('dmsGlobalDataSource.list.type'),
      filterCustomType: 'select',
      filterKey: 'filter_by_db_type',
      render: (dbType) => {
        if (!dbType) return '-';

        return (
          <DatabaseTypeLogo
            dbType={dbType}
            logoUrl={getLogoUrlByDbType(dbType)}
          />
        );
      }
    }
  ];
};
