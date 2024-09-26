import { PageHeader, BasicButton } from '@actiontech/shared';
import { useTranslation } from 'react-i18next';
import { PlusOutlined } from '@actiontech/icons';
import { Link, useNavigate } from 'react-router-dom';
import { useCurrentProject } from '@actiontech/shared/lib/global';
import {
  VersionManagementTableFilterParamType,
  VersionManagementTableColumns,
  VersionManagementTableActions
} from './column';
import { useRequest } from 'ahooks';
import {
  ActiontechTable,
  useTableRequestError,
  useTableRequestParams,
  TableToolbar,
  TableFilterContainer,
  useTableFilterContainer
} from '@actiontech/shared/lib/components/ActiontechTable';
import { message } from 'antd';
import { ISqlVersionResV1 } from '@actiontech/shared/lib/api/sqle/service/common';
import sqlVersion from '@actiontech/shared/lib/api/sqle/service/sql_version';
import { IGetSqlVersionListV1Params } from '@actiontech/shared/lib/api/sqle/service/sql_version/index.d';
import { ResponseCode } from '@actiontech/shared/lib/enum';

const VersionManagementList = () => {
  const { t } = useTranslation();

  const navigate = useNavigate();

  const { projectID, projectName } = useCurrentProject();

  const [messageApi, messageContextHolder] = message.useMessage();

  const {
    tableFilterInfo,
    updateTableFilterInfo,
    tableChange,
    pagination,
    searchKeyword,
    setSearchKeyword,
    refreshBySearchKeyword
  } = useTableRequestParams<
    ISqlVersionResV1,
    VersionManagementTableFilterParamType
  >();

  const { requestErrorMessage, handleTableRequestError } =
    useTableRequestError();

  const {
    data: versionData,
    loading,
    refresh
  } = useRequest(
    () => {
      const params: IGetSqlVersionListV1Params = {
        ...tableFilterInfo,
        page_index: pagination.page_index,
        page_size: pagination.page_size,
        project_name: projectName,
        fuzzy_search: searchKeyword
      };

      return handleTableRequestError(sqlVersion.getSqlVersionListV1(params));
    },
    {
      refreshDeps: [pagination, tableFilterInfo]
    }
  );

  const { filterButtonMeta, filterContainerMeta, updateAllSelectedFilterItem } =
    useTableFilterContainer(
      VersionManagementTableColumns(projectID),
      updateTableFilterInfo
    );

  const onEdit = (id?: number) => {
    navigate(`/sqle/project/${projectID}/version-management/update/${id}`);
  };

  const onDelete = (id?: number) => {
    const hide = messageApi.loading(
      t('versionManagement.list.action.deleting')
    );
    sqlVersion
      .deleteSqlVersionV1({
        sql_version_id: `${id}`,
        project_name: projectName
      })
      .then((res) => {
        if (res.data.code === ResponseCode.SUCCESS) {
          messageApi.success(
            t('versionManagement.list.action.deleteSuccessTip')
          );
          refresh();
        }
      })
      .finally(() => {
        hide();
      });
  };

  const onLock = (id?: number) => {
    const hide = messageApi.loading(t('versionManagement.list.action.locking'));
    sqlVersion
      .lockSqlVersionV1({
        sql_version_id: `${id}`,
        project_name: projectName
      })
      .then((res) => {
        if (res.data.code === ResponseCode.SUCCESS) {
          messageApi.success(t('versionManagement.list.action.lockSuccessTip'));
          refresh();
        }
      })
      .finally(() => {
        hide();
      });
  };

  return (
    <>
      {messageContextHolder}
      <PageHeader
        title={t('versionManagement.pageTitle')}
        extra={
          <Link to={`/sqle/project/${projectID}/version-management/create`}>
            <BasicButton
              type="primary"
              icon={
                <PlusOutlined width={10} height={10} color="currentColor" />
              }
            >
              {t('versionManagement.operation.add')}
            </BasicButton>
          </Link>
        }
      />
      <TableToolbar
        refreshButton={{ refresh, disabled: loading }}
        filterButton={{
          filterButtonMeta,
          updateAllSelectedFilterItem
        }}
        searchInput={{
          onChange: setSearchKeyword,
          onSearch: () => {
            refreshBySearchKeyword();
          }
        }}
        loading={loading}
      />
      <TableFilterContainer
        filterContainerMeta={filterContainerMeta}
        updateTableFilterInfo={updateTableFilterInfo}
        disabled={loading}
      />
      <ActiontechTable
        dataSource={versionData?.list}
        rowKey={(record: ISqlVersionResV1) => {
          return `${record?.version}`;
        }}
        pagination={{
          total: versionData?.total ?? 0
        }}
        columns={VersionManagementTableColumns(projectID)}
        loading={loading}
        errorMessage={requestErrorMessage}
        onChange={tableChange}
        actions={VersionManagementTableActions(onEdit, onDelete, onLock)}
      />
    </>
  );
};

export default VersionManagementList;
