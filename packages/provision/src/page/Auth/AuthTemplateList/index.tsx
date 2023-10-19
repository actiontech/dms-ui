import { Box } from '@mui/system';
import useTablePagination from '~/components/ProvisionTable/hooks/useTablePagination';
import { useRequest } from 'ahooks';
import { SyncOutlined } from '@ant-design/icons';
import { Button, Card, Space } from 'antd';
import { useTranslation } from 'react-i18next';
import ProvisionTable from '~/components/ProvisionTable';
import { authTemplateListTableColumns } from './TableColumns';
import AuthTemplateListFilterForm, {
  IFilteredInfo
} from './AuthTemplateListFilterForm';
import { useEffect, useState } from 'react';
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
import { Link } from '../../../components/Link';
import { useCurrentProject } from '@actiontech/shared/lib/global';
import auth from '@actiontech/shared/lib/api/provision/service/auth';
import { IListDataPermissionTemplate } from '@actiontech/shared/lib/api/provision/service/common';

const AuthTemplateList = () => {
  const { t } = useTranslation();

  const { pageIndex, pageSize, total, setTotal, handleTablePaginationChange } =
    useTablePagination();
  const [filteredInfo, setFilteredInfo] = useState<IFilteredInfo | null>(null);
  const { projectID } = useCurrentProject();
  const {
    data: dataSource,
    loading,
    refresh
  } = useRequest(
    () =>
      auth
        .AuthListDataPermissionTemplate({
          page_index: pageIndex,
          page_size: pageSize,
          filter_by_namespace_uid: projectID ?? '',
          ...filteredInfo
        })
        .then((res) => {
          setTotal(res.data.total_nums ?? 0);
          return res.data.data;
        }),
    {
      refreshDeps: [pageIndex, pageSize, filteredInfo, projectID]
    }
  );

  const { toggleModal, initModalStatus } = useModalStatus(
    AuthTemplateModalStatus
  );
  const updateSelectData = useSetRecoilState(AuthTemplateListSelectData);
  const openModal = (name: ModalName, record?: IListDataPermissionTemplate) => {
    toggleModal(name, true);
    if (record) {
      updateSelectData(record);
    }
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
  const { removeTemplate } = useRemoveTemplate(refresh);
  return (
    <Box
      sx={{
        padding: (theme) => theme.layout.padding
      }}
    >
      <Card
        title={
          <Space>
            {t('auth.template.title')}
            <Button onClick={refresh} data-testid="refresh">
              <SyncOutlined spin={loading} />
            </Button>
          </Space>
        }
        extra={
          <Link to={`${projectID}/auth/template/edit_template`}>
            <Button type="primary">{t('auth.button.addTemplate')}</Button>
          </Link>
        }
      >
        <Space direction="vertical" className="full-width-element">
          <AuthTemplateListFilterForm setFilteredInfo={setFilteredInfo} />
          <ProvisionTable
            rowKey="uid"
            className="auth-template-table"
            loading={loading}
            columns={authTemplateListTableColumns(
              openModal,
              removeTemplate,
              projectID ?? ''
            )}
            dataSource={dataSource ?? []}
            pagination={{ total }}
            onChange={handleTablePaginationChange}
          />
        </Space>
      </Card>
      <AuthTemplateModal />
    </Box>
  );
};

export default AuthTemplateList;
