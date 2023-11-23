import {
  ActiontechTable,
  ActiontechTableActionMeta,
  ColumnsSettingProps,
  TableRefreshButton,
  useTableRequestError,
  useTableRequestParams
} from '@actiontech/shared/lib/components/ActiontechTable';
import { useCallback, useEffect, useMemo } from 'react';
import { useRequest } from 'ahooks';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import {
  useCurrentProject,
  useCurrentUser
} from '@actiontech/shared/lib/global';
import { WhitelistColumn } from './columns';
import { ModalName } from '../../../data/ModalName';
import { Space, message } from 'antd';
import { ResponseCode } from '@actiontech/shared/lib/enum';
import {
  updateSelectWhitelist,
  updateWhitelistModalStatus
} from '../../../store/whitelist';
import EventEmitter from '../../../utils/EventEmitter';
import EmitterKey from '../../../data/EmitterKey';
import { BasicButton, EmptyBox, PageHeader } from '@actiontech/shared';
import { IconAdd } from '@actiontech/shared/lib/Icon/common';
import WhitelistDrawer from '../Drawer';
import { IAuditWhitelistResV1 } from '@actiontech/shared/lib/api/sqle/service/common';
import { IGetAuditWhitelistV1Params } from '@actiontech/shared/lib/api/sqle/service/audit_whitelist/index.d';
import audit_whitelist from '@actiontech/shared/lib/api/sqle/service/audit_whitelist';

const WhitelistList = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [messageApi, messageContextHolder] = message.useMessage();
  const { projectName, projectArchive } = useCurrentProject();
  const { isAdmin, isProjectManager, username } = useCurrentUser();
  const actionPermission = useMemo(() => {
    return isAdmin || isProjectManager(projectName);
  }, [isAdmin, isProjectManager, projectName]);

  const { tableChange, pagination } =
    useTableRequestParams<IAuditWhitelistResV1>();

  const columns = useMemo(() => WhitelistColumn(), []);

  const tableSetting = useMemo<ColumnsSettingProps>(
    () => ({
      tableName: 'whitelist_list',
      username: username
    }),
    [username]
  );

  const { requestErrorMessage, handleTableRequestError } =
    useTableRequestError();

  const {
    data: whitelistList,
    loading,
    refresh
  } = useRequest(
    () => {
      const params: IGetAuditWhitelistV1Params = {
        page_index: String(pagination.page_index),
        page_size: String(pagination.page_size),
        project_name: projectName
      };

      return handleTableRequestError(
        audit_whitelist.getAuditWhitelistV1(params)
      );
    },
    {
      refreshDeps: [pagination]
    }
  );

  const openAddWhitelistModal = useCallback(() => {
    if (!actionPermission) {
      return;
    }
    dispatch(
      updateWhitelistModalStatus({
        modalName: ModalName.Add_Whitelist,
        status: true
      })
    );
  }, [actionPermission, dispatch]);

  const openUpdateWhitelistModal = useCallback(
    (whitelist: IAuditWhitelistResV1) => {
      if (!actionPermission) {
        return;
      }
      dispatch(
        updateSelectWhitelist({
          whitelist
        })
      );
      dispatch(
        updateWhitelistModalStatus({
          modalName: ModalName.Update_Whitelist,
          status: true
        })
      );
    },
    [actionPermission, dispatch]
  );

  const removeWhitelist = useCallback(
    (whitelistId: number) => {
      if (!actionPermission) {
        return;
      }
      const hide = messageApi.loading(t('whitelist.operate.deleting'));
      audit_whitelist
        .deleteAuditWhitelistByIdV1({
          audit_whitelist_id: `${whitelistId}`,
          project_name: projectName
        })
        .then((res) => {
          if (res.data.code === ResponseCode.SUCCESS) {
            messageApi.success(t('whitelist.operate.deleteSuccess'));
            refresh();
          }
        })
        .finally(() => {
          hide();
        });
    },
    [actionPermission, messageApi, projectName, refresh, t]
  );

  const whitelistActionsInTable: ActiontechTableActionMeta<IAuditWhitelistResV1>[] =
    [
      {
        key: 'edit-whitelist',
        text: t('common.edit'),
        buttonProps: (record) => ({
          onClick: openUpdateWhitelistModal.bind(null, record ?? {})
        })
      },
      {
        key: 'remove-whitelist',
        text: t('common.delete'),
        buttonProps: () => ({ danger: true }),
        confirm: (record) => ({
          title: t('whitelist.operate.confirmDelete'),
          onConfirm: removeWhitelist.bind(null, record?.audit_whitelist_id ?? 0)
        })
      }
    ];

  useEffect(() => {
    const scopeRefresh = () => {
      refresh();
    };
    const { unsubscribe } = EventEmitter.subscribe(
      EmitterKey.Refresh_Whitelist_List,
      scopeRefresh
    );
    return unsubscribe;
  }, [refresh]);

  return (
    <>
      {messageContextHolder}
      <PageHeader
        title={
          <Space>
            {t('whitelist.pageTitle')}

            <TableRefreshButton refresh={refresh} />
          </Space>
        }
        extra={[
          <EmptyBox
            if={actionPermission && !projectArchive}
            key="add-whitelist"
          >
            <BasicButton
              type="primary"
              icon={<IconAdd />}
              onClick={openAddWhitelistModal}
            >
              {t('whitelist.operate.addWhitelist')}
            </BasicButton>
          </EmptyBox>
        ]}
      />

      <ActiontechTable
        setting={tableSetting}
        dataSource={whitelistList?.list}
        rowKey={(record: IAuditWhitelistResV1) => {
          return `${record?.audit_whitelist_id}`;
        }}
        pagination={{
          total: whitelistList?.total ?? 0
        }}
        loading={loading}
        columns={columns}
        actions={
          !projectArchive && actionPermission
            ? whitelistActionsInTable
            : undefined
        }
        errorMessage={requestErrorMessage}
        onChange={tableChange}
      />
      <WhitelistDrawer />
    </>
  );
};

export default WhitelistList;
