import { useRequest } from 'ahooks';
import { Button, message, Modal, Space, Typography } from 'antd';
import json2md, { DataObject } from 'json2md';
import { useTranslation } from 'react-i18next';
import { ModalName } from '~/data/enum';
import useModalStatus from '~/hooks/useModalStatus';
import { AuthListModalStatus, AuthListSelectData } from '~/store/auth/list';

import {
  authTableColumns,
  connectionTableColumns,
  customConfig
} from './TableColumns';
import { useRecoilState } from 'recoil';
import ProvisionTable from '~/components/ProvisionTable';
import { useEffect } from 'react';
import { ModalSize } from '~/data/common';
import copy from '~/utils/Copy';
import auth from '@actiontech/shared/lib/api/provision/service/auth';

const AuthDetails = () => {
  const { t } = useTranslation();
  const [selectData, updateSelectData] = useRecoilState(AuthListSelectData);
  const {
    data: authDetails,
    loading,
    run: getConnection,
    mutate
  } = useRequest(
    () =>
      auth
        .AuthGetAuthorization({
          authorization_uid: selectData?.uid ?? ''
        })
        .then((res) => {
          return res.data.data;
        }),
    {
      manual: true
    }
  );

  const { toggleModal, visible } = useModalStatus(
    AuthListModalStatus,
    ModalName.GetConnection
  );

  useEffect(() => {
    if (visible && selectData?.uid) {
      getConnection();
    }
  }, [getConnection, selectData?.uid, visible]);

  const closeModal = () => {
    toggleModal(ModalName.GetConnection, false);
    updateSelectData({});
    mutate();
  };

  const handleCopy = () => {
    const jsonData: DataObject = [];
    customConfig.forEach((item) => {
      if (item.type === 'p') {
        const val = authDetails?.[item.key];
        jsonData.push({ blockquote: `${item.prefix}: ${val}` });
      } else if (item.type === 'table') {
        let rows: string[][];
        jsonData.push({ blockquote: `${item.prefix}:` });
        if (item.key === 'data_permissions') {
          rows =
            authDetails?.data_permissions?.map((data) => {
              return [
                data.service_name ?? '',
                data.data_objects?.map((obj) => obj.name).join('，') ?? '',
                data.data_operation_sets
                  ?.map((operation) => operation.name)
                  .join('，') ?? ''
              ];
            }) ?? [];
        } else {
          rows =
            authDetails?.db_accounts?.map((data) => {
              return [
                data.data_object_service_dns ?? '',
                data.user ?? '',
                data.hostname ?? '',
                data.password ?? '',
                data.explanation ?? ''
              ];
            }) ?? [];
        }
        jsonData.push({
          table: {
            headers: item.headers,
            rows
          }
        });
      }
    });
    copy.copyTextByTextarea(json2md(jsonData));
    message.success(t('common.copySuccess'));
  };
  return (
    <Modal
      title={t('auth.connectionDetails.title')}
      className="view-connection-details-modal"
      closable={false}
      width={ModalSize.mid}
      open={visible}
      footer={
        <>
          <Button onClick={closeModal}>{t('common.close')}</Button>
        </>
      }
    >
      <Space direction="vertical" className="full-width-element" size={16}>
        <Space>
          <Typography.Text strong>
            {t('auth.addAuth.steps.purpose')}：
          </Typography.Text>
          <Typography.Text copyable>{authDetails?.purpose}</Typography.Text>
        </Space>
        <Space>
          <Typography.Text strong>
            {t('auth.connectionDetails.business')}：
          </Typography.Text>
          <Typography.Text copyable>{authDetails?.businesses}</Typography.Text>
        </Space>
        <Space>
          <Typography.Text strong>
            {t('auth.columns.permissionUser')}：
          </Typography.Text>
          <Typography.Text copyable>
            {authDetails?.permission_user}
          </Typography.Text>
        </Space>
        <div>
          <Typography.Text strong>
            {t('auth.template.columns.template_details')}：
          </Typography.Text>
          <ProvisionTable
            rowKey={(record) =>
              `${record.service_name}${JSON.stringify(record.data_objects[0])}`
            }
            columns={authTableColumns}
            dataSource={authDetails?.data_permissions}
            loading={loading}
            scroll={{ x: 'max-content' }}
            pagination={{ position: [] }}
          />
        </div>
        <div>
          <Typography.Text strong>
            {t('auth.connectionDetails.accountInfo')}：
          </Typography.Text>
          <ProvisionTable
            rowKey="uid"
            columns={connectionTableColumns}
            dataSource={authDetails?.db_accounts}
            loading={loading}
            scroll={{ x: 'max-content' }}
            pagination={{ position: [] }}
          />
        </div>
        <Button type="primary" style={{ float: 'right' }} onClick={handleCopy}>
          {t('auth.button.copy')}
        </Button>
      </Space>
    </Modal>
  );
};

export default AuthDetails;
