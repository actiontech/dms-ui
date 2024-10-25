import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useRequest } from 'ahooks';
import {
  AuthTemplateListActions,
  AuthTemplateListTableColumns
} from './TableColumns';
import {
  useTableRequestError,
  ActiontechTable,
  useTableRequestParams,
  TableToolbar
} from '@actiontech/shared/lib/components/ActiontechTable';
import useRemoveTemplate from './hooks/useRemoveTemplate';
import useModalStatus from '~/hooks/useModalStatus';
import {
  AuthTemplateListSelectData,
  AuthTemplateModalStatus
} from '~/store/auth/templateList';
import { EventEmitterKey, ModalName } from '~/data/enum';
import AuthTemplateModal from './Modal';
import { useSetRecoilState } from 'recoil';
import EventEmitter from '~/utils/EventEmitter';
import { useCurrentProject } from '@actiontech/shared/lib/global';
import auth from '@actiontech/shared/lib/api/provision/service/auth';
import { IListDataPermissionTemplate } from '@actiontech/shared/lib/api/provision/service/common';
import { BasicButton, PageHeader } from '@actiontech/shared';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Spin } from 'antd';
import { IEditTemplateActionTypeEnum } from '../EditTemplate/index.type';
import { PlusOutlined } from '@actiontech/icons';

const AuthTemplateList = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { projectID } = useCurrentProject();
  const { name } = useParams<{ name: string }>();
  const {
    tableChange,
    pagination,
    searchKeyword,
    setSearchKeyword,
    refreshBySearchKeyword
  } = useTableRequestParams<IListDataPermissionTemplate>();
  const { requestErrorMessage, handleTableRequestError } =
    useTableRequestError();

  const {
    data: dataSource,
    loading,
    refresh
  } = useRequest(
    () => {
      return handleTableRequestError(
        auth.AuthListDataPermissionTemplate({
          page_index: pagination.page_index,
          page_size: pagination.page_size,
          filter_by_namespace_uid: projectID ?? '',
          keyword: searchKeyword,
          filter_by_name: name
        })
      );
    },
    {
      refreshDeps: [pagination, projectID]
    }
  );

  const { toggleModal, initModalStatus } = useModalStatus(
    AuthTemplateModalStatus
  );
  const updateSelectData = useSetRecoilState(AuthTemplateListSelectData);
  const openModal = (
    modalName: ModalName,
    record?: IListDataPermissionTemplate
  ) => {
    toggleModal(modalName, true);
    if (record) {
      updateSelectData(record);
    }
  };
  const onNavigateToUpdateTemplate = (record: IListDataPermissionTemplate) => {
    navigate(
      `/provision/project/${projectID}/auth/template/edit-template/?id=${record?.uid}&name=${record.name}`
    );
  };
  const { removeTemplate, messageContextHolder } = useRemoveTemplate(refresh);

  const onNavigateToAuthList = (record: IListDataPermissionTemplate) => {
    navigate(`/provision/project/${projectID}/auth/list/add?id=${record.uid}`);
  };

  useEffect(() => {
    initModalStatus({
      [ModalName.CopyTemplate]: false
    });
  }, [initModalStatus]);

  useEffect(() => {
    const { unsubscribe } = EventEmitter.subscribe(
      EventEmitterKey.Refresh_Auth_Template_List_Table,
      () => {
        refresh();
      }
    );
    return unsubscribe;
  }, [refresh]);

  return (
    <section>
      {messageContextHolder}
      <PageHeader
        title={t('auth.template.title')}
        extra={
          <Link
            to={`/provision/project/${projectID}/auth/template/edit-template`}
          >
            <BasicButton
              type="primary"
              icon={
                <PlusOutlined color="currentColor" width={12} height={12} />
              }
            >
              {t('auth.button.addTemplate')}
            </BasicButton>
          </Link>
        }
      />
      <Spin spinning={loading}>
        <TableToolbar
          refreshButton={{ refresh, disabled: loading }}
          searchInput={{
            onChange: setSearchKeyword,
            onSearch: () => {
              refreshBySearchKeyword();
            }
          }}
        />
        <ActiontechTable
          rowKey="uid"
          className="table-row-cursor"
          dataSource={dataSource?.list ?? []}
          columns={AuthTemplateListTableColumns(projectID)}
          pagination={{
            total: dataSource?.total ?? 0,
            current: pagination.page_index
          }}
          errorMessage={requestErrorMessage}
          onChange={tableChange}
          actions={AuthTemplateListActions(
            onNavigateToUpdateTemplate,
            removeTemplate,
            onNavigateToAuthList,
            openModal
          )}
          onRow={(record) => {
            return {
              onClick() {
                navigate(
                  `/provision/project/${projectID}/auth/template/edit-template/?id=${record?.uid}&name=${record.name}&action=${IEditTemplateActionTypeEnum.view}`
                );
              }
            };
          }}
        />
      </Spin>

      <AuthTemplateModal />
    </section>
  );
};

export default AuthTemplateList;
