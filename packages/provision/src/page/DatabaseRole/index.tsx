import { PageHeader } from '@actiontech/shared';
import {
  ActiontechTable,
  TableToolbar,
  useTableRequestError,
  useTableRequestParams
} from '@actiontech/shared/lib/components/ActiontechTable';
import { useTranslation } from 'react-i18next';
import { DatabaseRoleTableColumns } from './column';
import {
  useCurrentProject,
  usePermission
} from '@actiontech/shared/lib/global';
import { CreateDatabaseRoleAction, DatabaseRoleTableActions } from './action';
import { message } from 'antd';
import DbRoleService from '@actiontech/shared/lib/api/provision/service/db_role';
import { useRequest } from 'ahooks';
import { IListDBRole } from '@actiontech/shared/lib/api/provision/service/common';
import { IDatabaseRoleTableParams } from './index.type';
import { IAuthListDBRoleParams } from '@actiontech/shared/lib/api/provision/service/db_role/index.d';
import { useEffect } from 'react';
import useServiceOptions from '../../hooks/useServiceOptions';
import DatabaseRoleModal from './Modal';
import useModalStatus from '../../hooks/useModalStatus';
import {
  DatabaseRoleFilteredDBServiceID,
  DatabaseRoleModalStatus,
  DatabaseRoleSelectData
} from '../../store/databaseRole';
import { ModalName } from '../../data/enum';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { CustomSelect } from '@actiontech/shared/lib/components/CustomSelect';
import { ResponseCode } from '@actiontech/shared/lib/enum';

const DatabaseRole: React.FC = () => {
  const { t } = useTranslation();
  const { parse2TableActionPermissions } = usePermission();
  const { projectID } = useCurrentProject();
  const [messageApi, messageContextHolder] = message.useMessage();
  const { toggleModal, initModalStatus } = useModalStatus(
    DatabaseRoleModalStatus
  );
  const updateSelectData = useSetRecoilState(DatabaseRoleSelectData);
  const [filteredByDBServiceID, setFilteredByDBServiceID] = useRecoilState(
    DatabaseRoleFilteredDBServiceID
  );

  const tableColumns = DatabaseRoleTableColumns();

  const { requestErrorMessage, handleTableRequestError } =
    useTableRequestError();
  const {
    updateServiceList,
    loading: getServiceOptionsPending,
    serviceOptions
  } = useServiceOptions();

  const {
    tableChange,
    pagination,
    createSortParams,
    setSearchKeyword,
    refreshBySearchKeyword,
    searchKeyword
  } = useTableRequestParams<IListDBRole, IDatabaseRoleTableParams>();

  const onCreateRole = () => {
    toggleModal(ModalName.DatabaseRoleCreateModal, true);
  };

  const editAction = (record: IListDBRole) => {
    toggleModal(ModalName.DatabaseRoleUpdateModal, true);
    updateSelectData(record);
  };

  const deleteAction = (record: IListDBRole) => {
    DbRoleService.AuthDelDBRole({
      project_uid: projectID,
      db_role_uid: record.db_role?.uid ?? '',
      db_service_uid: filteredByDBServiceID ?? ''
    }).then((res) => {
      if (res.data.code === ResponseCode.SUCCESS) {
        refresh();
        messageApi.success(t('databaseRole.actions.delete.succeedTips'));
      }
    });
  };

  const {
    refresh,
    loading,
    data: databaseRoles
  } = useRequest(
    () => {
      const params: IAuthListDBRoleParams = {
        db_service_uid: filteredByDBServiceID!,
        project_uid: projectID,
        page_index: pagination.page_index,
        page_size: pagination.page_size,
        filter_by_name: searchKeyword
      };
      createSortParams(params);
      return handleTableRequestError(DbRoleService.AuthListDBRole(params));
    },
    {
      ready: !!filteredByDBServiceID,
      refreshDeps: [filteredByDBServiceID, pagination]
    }
  );

  useEffect(() => {
    updateServiceList(undefined, (data) => {
      setFilteredByDBServiceID(data?.[0].uid ?? null);
    });
  }, [setFilteredByDBServiceID, updateServiceList]);

  useEffect(() => {
    initModalStatus({
      [ModalName.DatabaseRoleCreateModal]: false,
      [ModalName.DatabaseRoleUpdateModal]: false,
      [ModalName.DatabaseRoleDetailModal]: false
    });
  }, [initModalStatus]);

  return (
    <section>
      {messageContextHolder}
      <PageHeader
        title={t('databaseRole.title')}
        extra={CreateDatabaseRoleAction(onCreateRole)}
      />

      <TableToolbar
        refreshButton={{ refresh, disabled: loading }}
        searchInput={{
          onChange: setSearchKeyword,
          onSearch: () => {
            refreshBySearchKeyword();
          }
        }}
      >
        <CustomSelect
          allowClear={false}
          options={serviceOptions}
          value={filteredByDBServiceID}
          onChange={setFilteredByDBServiceID}
          loading={getServiceOptionsPending}
          prefix={t('databaseRole.tableFilters.dbService')}
        />
      </TableToolbar>

      <ActiontechTable
        errorMessage={requestErrorMessage}
        columns={tableColumns}
        actions={parse2TableActionPermissions(
          DatabaseRoleTableActions({ editAction, deleteAction })
        )}
        pagination={{
          total: databaseRoles?.total
        }}
        dataSource={databaseRoles?.list}
        loading={loading}
        onChange={tableChange}
      />

      <DatabaseRoleModal />
    </section>
  );
};

export default DatabaseRole;
