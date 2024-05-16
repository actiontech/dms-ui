import { useRequest } from 'ahooks';
import { useMemo, useEffect } from 'react';
import { useCurrentProject } from '@actiontech/shared/lib/global';
import {
  ActiontechTable,
  useTableRequestError,
  TableToolbar,
  useTableRequestParams
} from '@actiontech/shared/lib/components/ActiontechTable';
import { useTranslation } from 'react-i18next';
import passwordSecurityPolicy from '@actiontech/shared/lib/api/provision/service/password_secury_policy/index';
import { IAuthListPasswordSecurityPolicysParams } from '@actiontech/shared/lib/api/provision/service/password_secury_policy/index.d';
import { IPasswordSecurityPolicy } from '@actiontech/shared/lib/api/provision/service/common';
import { PasswordPolicyListColumns, PasswordPolicyListActions } from './column';
import useModalStatus from '~/hooks/useModalStatus';
import { useSetRecoilState } from 'recoil';
import {
  PasswordSecurityPolicyModalStatus,
  PasswordSecurityPolicySelectData
} from '../../../store/databaseAccountPassword';
import EventEmitter from '~/utils/EventEmitter';
import { EventEmitterKey, ModalName } from '~/data/enum';
import { ResponseCode } from '@actiontech/shared/lib/enum';
import { message } from 'antd';

const PolicyList = () => {
  const { t } = useTranslation();

  const [messageApi, contextHolder] = message.useMessage();

  const { projectID } = useCurrentProject();

  const {
    pagination,
    tableChange,
    setSearchKeyword,
    refreshBySearchKeyword,
    searchKeyword
  } = useTableRequestParams<IPasswordSecurityPolicy>();

  const { requestErrorMessage, handleTableRequestError } =
    useTableRequestError();

  const { data, loading, refresh } = useRequest(
    () => {
      const params: IAuthListPasswordSecurityPolicysParams = {
        ...pagination,
        project_uid: projectID,
        keyword: searchKeyword
      };
      return handleTableRequestError(
        passwordSecurityPolicy.AuthListPasswordSecurityPolicys(params)
      );
    },
    {
      refreshDeps: [pagination, projectID]
    }
  );

  const { toggleModal } = useModalStatus(PasswordSecurityPolicyModalStatus);

  const updateSelectData = useSetRecoilState(PasswordSecurityPolicySelectData);

  const actions = useMemo(() => {
    const onEdit = (record?: IPasswordSecurityPolicy) => {
      if (record) {
        updateSelectData(record);
        toggleModal(ModalName.UpdatePasswordSecurityPolicyModal, true);
      }
    };
    const onDelete = (record?: IPasswordSecurityPolicy) => {
      if (record) {
        passwordSecurityPolicy
          .AuthDelPasswordSecurityPolicy({
            project_uid: projectID,
            uid: record?.uid ?? ''
          })
          .then((res) => {
            if (res.data.code === ResponseCode.SUCCESS) {
              EventEmitter.emit(
                EventEmitterKey.Refresh_Password_Management_list_Table
              );
              messageApi.success(
                t('passwordSecurityPolicy.policy.deleteSuccessTips')
              );
            }
          });
      }
    };
    return PasswordPolicyListActions(onEdit, onDelete);
  }, [toggleModal, updateSelectData, projectID, messageApi, t]);

  useEffect(() => {
    const { unsubscribe } = EventEmitter.subscribe(
      EventEmitterKey.Refresh_Password_Management_list_Table,
      refresh
    );
    return unsubscribe;
  }, [refresh]);

  return (
    <>
      {contextHolder}
      <TableToolbar
        refreshButton={{ refresh, disabled: loading }}
        searchInput={{
          onChange: setSearchKeyword,
          onSearch: () => {
            refreshBySearchKeyword();
          }
        }}
        loading={loading}
      />
      <ActiontechTable
        dataSource={data?.list}
        rowKey="uid"
        pagination={{
          total: data?.total ?? 0,
          current: pagination.page_index
        }}
        loading={loading}
        columns={PasswordPolicyListColumns}
        errorMessage={requestErrorMessage}
        onChange={tableChange}
        actions={actions}
      />
    </>
  );
};

export default PolicyList;
