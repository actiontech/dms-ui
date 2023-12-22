import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useBoolean } from 'ahooks';
import { Form, message, Upload } from 'antd';
import { useForm } from 'antd/es/form/Form';
import { RcFile } from 'antd/es/upload';
import { useDispatch, useSelector } from 'react-redux';
import { ActiontechTable } from '@actiontech/shared/lib/components/ActiontechTable';
import { BasicButton, BasicModal } from '@actiontech/shared';
import { getFileFromUploadChangeEvent } from '@actiontech/shared/lib/utils/Common';
import EmitterKey from '../../../../data/EmitterKey';
import { ModalName } from '../../../../data/ModalName';
import { IReduxState } from '../../../../store';
import { updateSystemModalStatus } from '../../../../store/system';
import EventEmitter from '../../../../utils/EventEmitter';
import { ILicenseItem } from '@actiontech/shared/lib/api/sqle/service/common';
import { ModalSize, ResponseCode } from '@actiontech/shared/lib/enum';
import { LicenseColumn } from '../index.data';
import dms from '@actiontech/shared/lib/api/base/service/dms';

const ImportModal = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [messageApi, messageContextHolder] = message.useMessage();

  const visible = useSelector(
    (state: IReduxState) =>
      state.system.modalStatus[ModalName.DMS_Import_License]
  );

  const [licenseData, setLicenseData] = useState<ILicenseItem[]>([]);
  const [prepareLoading, { setTrue: startPrepare, setFalse: prepareFinish }] =
    useBoolean();
  const [form] = useForm();

  const fileChange = (currentFile: RcFile) => {
    startPrepare();
    dms
      .CheckLicense({
        license_file: currentFile
      })
      .then((res) => {
        if (res.data.code === ResponseCode.SUCCESS) {
          setLicenseData(res.data.license ?? []);
        } else {
          setLicenseData([]);
        }
      })
      .catch(() => {
        setLicenseData([]);
      })
      .finally(() => {
        prepareFinish();
      });
    return false;
  };

  const close = () => {
    form.resetFields();
    dispatch(
      updateSystemModalStatus({
        modalName: ModalName.DMS_Import_License,
        status: false
      })
    );
  };

  const [importLoading, { setTrue: startImport, setFalse: importFinish }] =
    useBoolean();

  const submit = async () => {
    const values = await form.validateFields();
    startImport();
    try {
      const res = await dms.SetLicense({
        license_file: values.file?.[0]
      });
      if (res.data.code === ResponseCode.SUCCESS) {
        close();
        EventEmitter.emit(EmitterKey.DMS_Refresh_License_List);
        messageApi.success(t('dmsSystem.license.importSuccessTips'));
      }
    } finally {
      importFinish();
    }
  };

  return (
    <BasicModal
      title={t('dmsSystem.license.import')}
      open={visible}
      closable={false}
      width={ModalSize.big}
      footer={
        <>
          <BasicButton onClick={close} disabled={importLoading}>
            {t('common.close')}
          </BasicButton>
          <BasicButton type="primary" onClick={submit} loading={importLoading}>
            {t('common.submit')}
          </BasicButton>
        </>
      }
    >
      {messageContextHolder}
      <Form form={form}>
        <Form.Item
          label={t('dmsSystem.license.form.licenseFile')}
          valuePropName="fileList"
          name="file"
          rules={[
            {
              required: true,
              message: t('common.form.rule.selectFile')
            }
          ]}
          getValueFromEvent={getFileFromUploadChangeEvent}
        >
          <Upload beforeUpload={fileChange}>
            <BasicButton>{t('common.upload')}</BasicButton>
          </Upload>
        </Form.Item>
      </Form>
      <ActiontechTable
        rowKey="name"
        columns={LicenseColumn}
        loading={prepareLoading}
        dataSource={licenseData}
      />
    </BasicModal>
  );
};

export default ImportModal;
