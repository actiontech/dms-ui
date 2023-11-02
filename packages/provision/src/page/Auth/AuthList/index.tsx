import { useEffect, useState } from 'react';
import { useSetRecoilState } from 'recoil';
import { Box } from '@mui/system';
import useTablePagination from '~/components/ProvisionTable/hooks/useTablePagination';
import { useRequest } from 'ahooks';
import { SyncOutlined } from '@ant-design/icons';
import { Button, Card, Space } from 'antd';
import { useTranslation } from 'react-i18next';
import ProvisionTable from '~/components/ProvisionTable';
import { authListTableColumns } from './TableColumns';
import AuthListModal from './Modal';
import useModalStatus from '~/hooks/useModalStatus';
import useRemoveAuth from './hooks/useRemoveAuth';
import { AuthListModalStatus, AuthListSelectData } from '~/store/auth/list';
import { EventEmitterKey, ModalName } from '~/data/enum';
import AuthListFilterForm from '~/page/Auth/AuthList/AuthListFilterForm';
import EventEmitter from '~/utils/EventEmitter';
import { IFilteredInfo } from './AuthListFilterForm';
import { Link } from '../../../components/Link';
import { useCurrentProject } from '@actiontech/shared/lib/global';
import auth from '@actiontech/shared/lib/api/provision/service/auth';
import { IListAuthorization } from '@actiontech/shared/lib/api/provision/service/common';

const AuthList = () => {
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
        .AuthListAuthorization({
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

  const { toggleModal, initModalStatus } = useModalStatus(AuthListModalStatus);
  const updateSelectData = useSetRecoilState(AuthListSelectData);
  const openModal = (record: IListAuthorization, name: ModalName) => {
    toggleModal(name, true);
    updateSelectData(record);
  };

  const { removeAuth } = useRemoveAuth(refresh);

  useEffect(() => {
    initModalStatus({
      [ModalName.GetConnection]: false,
      [ModalName.UpdateTemplateInAuth]: false,
      [ModalName.UpdateUserInAuth]: false,
      [ModalName.UpdateExpirationInAuth]: false
    });
  }, [initModalStatus]);

  useEffect(() => {
    const { unsubscribe } = EventEmitter.subscribe(
      EventEmitterKey.Refresh_Auth_List_Table,
      () => {
        refresh();
      }
    );
    return unsubscribe;
  }, [refresh]);
  return (
    <Box
      sx={{
        padding: (theme) => theme.layout.padding
      }}
    >
      <Card
        title={
          <Space>
            {t('auth.list.title')}
            <Button onClick={refresh} data-testid="refresh">
              <SyncOutlined spin={loading} />
            </Button>
          </Space>
        }
        extra={
          <Link to={`${projectID}/auth/list/add`}>
            <Button type="primary">{t('auth.button.addAuth')}</Button>
          </Link>
        }
      >
        <Space direction="vertical" className="full-width-element">
          <AuthListFilterForm setFilteredInfo={setFilteredInfo} />
          <ProvisionTable
            rowKey="uid"
            loading={loading}
            columns={authListTableColumns(
              openModal,
              removeAuth,
              projectID ?? ''
            )}
            dataSource={dataSource ?? []}
            pagination={{ total }}
            onChange={handleTablePaginationChange}
            scroll={{ x: 'max-content' }}
          />
        </Space>
        <AuthListModal />
      </Card>
    </Box>
  );
};

export default AuthList;
