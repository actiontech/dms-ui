import { useTranslation } from 'react-i18next';
import { useEffect } from 'react';

import { Space, message, Form, Spin } from 'antd5';
import { useDispatch } from 'react-redux';
import { useBoolean } from 'ahooks';
import { useSelector } from 'react-redux';
import { IReduxState } from '../../../../../../../../base/src/store';
import { useForm } from 'antd5/es/form/Form';
import { BasicButton, BasicModal, BasicSelect } from '@actiontech/shared';
import { ModalName } from '../../../../../../data/ModalName';
import {
  updateSqleManagementModalStatus,
  updateSqleManagement
} from '../../../../../../store/sqleManagement';
import { FormItemLabelStyleWrapper } from '@actiontech/shared/lib/components/FormCom/FormItemCom/style';

const ChangeStatus = () => {
  const { t } = useTranslation();
  const [messageApi, contextMessageHolder] = message.useMessage();
  const dispatch = useDispatch();

  const open = useSelector<IReduxState, boolean>(
    (state) => state.sqleManagement.modalStatus[ModalName.Change_Status_Single]
  );
  const [submitLoading, { setTrue: startSubmit, setFalse: submitFinish }] =
    useBoolean();
  const [form] = useForm<{ status: '' }>();

  const handleReset = () => {
    form.resetFields();
    submitFinish();
  };

  useEffect(() => {
    if (open) {
      handleReset();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const onCloseModal = () => {
    dispatch(
      updateSqleManagementModalStatus({
        modalName: ModalName.Change_Status_Single,
        status: false
      })
    );
    dispatch(updateSqleManagement(null));
    handleReset();
  };

  const onSubmit = () => {
    /*
    SqlManage.BatchUpdateSqlManage({
        project_name: projectName,
        sql_manage_id_list: [id],
        status,
      })
        .then((res) => {
          if (res.data.code === ResponseCode.SUCCESS) {
            message.success(
              t('sqlManagement.table.actions.signalUpdateStatusSuccessTips')
            );
            refresh();
          }
        })
        .finally(() => {
          finishSignalAction();
        });
    */
  };

  return (
    <>
      {contextMessageHolder}
      <BasicModal
        open={open}
        title={t('sqlManagement.table.action.single.updateStatus.triggerText')}
        closable={false}
        onCancel={onCloseModal}
        footer={
          <Space>
            <BasicButton onClick={onCloseModal}>
              {t('common.cancel')}
            </BasicButton>
            <BasicButton
              onClick={onSubmit}
              disabled={!submitLoading}
              type="primary"
            >
              {t('common.ok')}
            </BasicButton>
          </Space>
        }
      >
        <Form form={form}>
          <FormItemLabelStyleWrapper
            label={t('sqlManagement.table.action.single.updateStatus.label')}
            name="status"
          >
            <BasicSelect options={[]}></BasicSelect>
          </FormItemLabelStyleWrapper>
        </Form>
      </BasicModal>
    </>
  );
};

export default ChangeStatus;
