import { useRequest } from 'ahooks';
import { Button, Modal } from 'antd';
import { useTranslation } from 'react-i18next';
import { useRecoilState } from 'recoil';
import ProvisionTable from '~/components/ProvisionTable';
import { ModalSize } from '~/data/common';
import { ModalName } from '~/data/enum';
import useModalStatus from '~/hooks/useModalStatus';
import { accountTableColumns } from './TableColumns';
import {
  DataObjectModalStatus,
  DataObjectSelectedData
} from '~/store/data/object';
import { useEffect } from 'react';
import auth from '@actiontech/shared/lib/api/provision/service/auth';

const ViewAccount = () => {
  const { t } = useTranslation();

  const { visible, toggleModal } = useModalStatus(
    DataObjectModalStatus,
    ModalName.ViewAccount
  );

  const closeModal = () => {
    toggleModal(ModalName.ViewAccount, false);
    updateSelectData(null);
  };

  const [selectData, updateSelectData] = useRecoilState(DataObjectSelectedData);

  const {
    data: accountList,
    loading,
    run: getAccount
  } = useRequest(
    (id: string) =>
      auth
        .AuthGetUsersFromDBService({
          service_uid: id
        })
        .then((res) => {
          return res.data.data;
        }),
    {
      manual: true
    }
  );

  useEffect(() => {
    if (visible && selectData?.uid) {
      getAccount(selectData.uid);
    }
  }, [getAccount, selectData?.uid, visible]);

  return (
    <Modal
      open={visible}
      title={t('dataObject.viewAccount.title')}
      closable={false}
      width={ModalSize.mid}
      footer={
        <>
          <Button onClick={closeModal}>{t('common.close')}</Button>
        </>
      }
    >
      <ProvisionTable
        rowKey={(record) => record.user + record.host}
        columns={accountTableColumns}
        dataSource={accountList}
        loading={loading}
        scroll={{ x: 'max-content', y: 500 }}
        pagination={{ defaultPageSize: 10 }}
      />
    </Modal>
  );
};

export default ViewAccount;
