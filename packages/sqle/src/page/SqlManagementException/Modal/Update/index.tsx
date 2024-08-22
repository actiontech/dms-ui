import { useCallback, useEffect } from 'react';
import { useBoolean } from 'ahooks';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import blacklist from '@actiontech/shared/lib/api/sqle/service/blacklist';
import { Space, message, Form } from 'antd';
import { BasicButton, BasicDrawer } from '@actiontech/shared';
import { ResponseCode } from '@actiontech/shared/lib/enum';
import { useCurrentProject } from '@actiontech/shared/lib/global';
import EmitterKey from '../../../../data/EmitterKey';
import { ModalName } from '../../../../data/ModalName';
import { IReduxState } from '../../../../store';
import {
  updateSqlManagementExceptModalStatus,
  updateSelectSqlManagementException
} from '../../../../store/sqlManagementException';
import EventEmitter from '../../../../utils/EventEmitter';
import SqlManagementExceptionForm from '../../Common/Form';
import { IBlacklistResV1 } from '@actiontech/shared/lib/api/sqle/service/common';
import {
  IUpdateBlacklistReqV1,
  ICreateBlacklistReqV1
} from '@actiontech/shared/lib/api/sqle/service/common.d';
import { SqlManagementExceptionFormFieldType } from '../../index.type';
import { CreateBlacklistReqV1TypeEnum } from '@actiontech/shared/lib/api/sqle/service/common.enum';
import { BlacklistResV1TypeEnum } from '@actiontech/shared/lib/api/sqle/service/common.enum';

const UpdateSqlManagementException = () => {
  const { t } = useTranslation();

  const [messageApi, messageContextHolder] = message.useMessage();

  const [form] = Form.useForm<SqlManagementExceptionFormFieldType>();

  const visible = useSelector<IReduxState, boolean>(
    (state) =>
      !!state.sqlManagementException.modalStatus[
        ModalName.Update_Sql_Management_Exception
      ]
  );

  const { projectName } = useCurrentProject();

  const currentSqlManagementExceptionRecord = useSelector<
    IReduxState,
    IBlacklistResV1 | null
  >((state) => state.sqlManagementException.selectSqlManagementExceptionRecord);

  const dispatch = useDispatch();

  const [createLoading, { setTrue: startCreate, setFalse: createFinish }] =
    useBoolean();

  const closeModal = useCallback(() => {
    form.resetFields();
    dispatch(
      updateSqlManagementExceptModalStatus({
        modalName: ModalName.Update_Sql_Management_Exception,
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
      .updateBlacklistV1({
        project_name: projectName,
        blacklist_id: `${currentSqlManagementExceptionRecord?.blacklist_id}`,
        content: content(),
        desc: values.desc,
        // list\create\update 接口type枚举相同 但是生成了三种枚举类型 所以这里需要做了断言
        type: values.type as unknown as IUpdateBlacklistReqV1['type']
      })
      .then((res) => {
        if (res.data.code === ResponseCode.SUCCESS) {
          EventEmitter.emit(EmitterKey.Refresh_Sql_management_Exception_List);
          closeModal();
          messageApi.success(t('sqlManagementException.modal.update.success'));
        }
      })
      .finally(() => {
        createFinish();
      });
  }, [
    closeModal,
    createFinish,
    currentSqlManagementExceptionRecord,
    form,
    projectName,
    startCreate,
    messageApi,
    t
  ]);

  useEffect(() => {
    if (visible) {
      form.setFieldsValue({
        desc: currentSqlManagementExceptionRecord?.desc,
        type: currentSqlManagementExceptionRecord?.type as ICreateBlacklistReqV1['type']
      });
      if (
        currentSqlManagementExceptionRecord?.type ===
          BlacklistResV1TypeEnum.sql ||
        currentSqlManagementExceptionRecord?.type ===
          BlacklistResV1TypeEnum.fp_sql
      ) {
        form.setFieldsValue({
          sql: currentSqlManagementExceptionRecord?.content
        });
      } else if (currentSqlManagementExceptionRecord?.type) {
        form.setFieldsValue({
          [currentSqlManagementExceptionRecord.type]:
            currentSqlManagementExceptionRecord?.content
        });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible]);

  return (
    <>
      {messageContextHolder}
      <BasicDrawer
        size="large"
        title={t('sqlManagementException.modal.update.title')}
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

export default UpdateSqlManagementException;
