import { useCallback, useEffect } from 'react';
import { useBoolean } from 'ahooks';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import blacklist from '@actiontech/shared/lib/api/sqle/service/blacklist';
import { Space, message, Form } from 'antd';
import { BasicButton, BasicDrawer } from '@actiontech/shared';
import { useCurrentProject } from '@actiontech/shared/lib/features';
import { ResponseCode } from '@actiontech/shared/lib/enum';
import { ModalName } from '../../../../data/ModalName';
import EmitterKey from '../../../../data/EmitterKey';
import EventEmitter from '../../../../utils/EventEmitter';
import { IReduxState } from '../../../../store';
import {
  updateSqlManagementExceptModalStatus,
  initSqlManagementExceptModalStatus,
  updateSelectSqlManagementException
} from '../../../../store/sqlManagementException';
import SqlManagementExceptionForm from '../../Common/Form';
import { SqlManagementExceptionFormFieldType } from '../../index.type';
import { CreateBlacklistReqV1TypeEnum } from '@actiontech/shared/lib/api/sqle/service/common.enum';
import { IBlacklistResV1 } from '@actiontech/shared/lib/api/sqle/service/common';

const CreateSqlManagementException: React.FC<{
  onCreated?: () => void;
}> = ({ onCreated }) => {
  const { t } = useTranslation();

  const [messageApi, messageContextHolder] = message.useMessage();

  const [form] = Form.useForm<SqlManagementExceptionFormFieldType>();

  const visible = useSelector<IReduxState, boolean>(
    (state) =>
      !!state.sqlManagementException.modalStatus[
        ModalName.Create_Sql_Management_Exception
      ]
  );

  const currentSqlManagementExceptionRecord = useSelector<
    IReduxState,
    IBlacklistResV1 | null
  >((state) => state.sqlManagementException.selectSqlManagementExceptionRecord);

  const dispatch = useDispatch();

  const [createLoading, { setTrue: startCreate, setFalse: createFinish }] =
    useBoolean();

  const { projectName } = useCurrentProject();

  const closeModal = useCallback(() => {
    form.resetFields();
    dispatch(
      updateSqlManagementExceptModalStatus({
        modalName: ModalName.Create_Sql_Management_Exception,
        status: false
      })
    );
    dispatch(updateSelectSqlManagementException({ selectRow: null }));
  }, [dispatch, form]);

  const submit = useCallback(async () => {
    const values = await form.validateFields();
    startCreate();
    const content = () => {
      if (
        values.type === CreateBlacklistReqV1TypeEnum.sql ||
        values.type === CreateBlacklistReqV1TypeEnum.fp_sql
      ) {
        return values.sql;
      }

      return values[values.type];
    };
    blacklist
      .createBlacklistV1({
        content: content(),
        desc: values.desc,
        type: values.type,
        project_name: projectName
      })
      .then((res) => {
        if (res.data.code === ResponseCode.SUCCESS) {
          onCreated?.();
          EventEmitter.emit(EmitterKey.Refresh_Sql_management_Exception_List);
          closeModal();
          messageApi.success(t('sqlManagementException.modal.add.success'));
        }
      })
      .finally(() => {
        createFinish();
      });
  }, [
    closeModal,
    createFinish,
    form,
    projectName,
    startCreate,
    onCreated,
    messageApi,
    t
  ]);

  useEffect(() => {
    const modalStatus = {
      [ModalName.Create_Sql_Management_Exception]: false
    };
    dispatch(initSqlManagementExceptModalStatus({ modalStatus }));
  }, [dispatch]);

  useEffect(() => {
    if (visible && !!currentSqlManagementExceptionRecord?.content) {
      form.setFieldsValue({
        sql: currentSqlManagementExceptionRecord?.content
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible]);

  return (
    <>
      {messageContextHolder}
      <BasicDrawer
        size="large"
        title={t('sqlManagementException.modal.add.title')}
        open={visible}
        onClose={closeModal}
        footer={
          <Space>
            <BasicButton onClick={closeModal} disabled={createLoading}>
              {t('common.close')}
            </BasicButton>
            <BasicButton
              type="primary"
              onClick={submit}
              loading={createLoading}
            >
              {t('common.submit')}
            </BasicButton>
          </Space>
        }
      >
        <SqlManagementExceptionForm form={form} />
      </BasicDrawer>
    </>
  );
};

export default CreateSqlManagementException;
