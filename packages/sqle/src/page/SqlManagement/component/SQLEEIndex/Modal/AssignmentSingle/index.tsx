import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { ModalName } from '../../../../../../data/ModalName';
import {
  updateSqleManagementModalStatus,
  updateSqleManagement
} from '../../../../../../store/sqleManagement';

import { Space, message, Form, Spin } from 'antd5';
import { useBoolean } from 'ahooks';
import { useSelector } from 'react-redux';
import { IReduxState } from '../../../../../../../../base/src/store';
import { useForm } from 'antd5/es/form/Form';
import { BasicButton, BasicModal, BasicSelect } from '@actiontech/shared';
import { FormItemLabelStyleWrapper } from '@actiontech/shared/lib/components/FormCom/FormItemCom/style';

const AssignmentSingle = () => {
  const { t } = useTranslation();

  const dispatch = useDispatch();
  // useEffect(() => {
  //   dispatch(
  //     updateSqleManagementModalStatus({
  //       modalName: ModalName.Assignment_Member_Single,
  //       status: false
  //     })
  //   );
  // }, [dispatch]);

  const [messageApi, contextMessageHolder] = message.useMessage();
  const open = useSelector<IReduxState, boolean>(
    (state) =>
      state.sqleManagement.modalStatus[ModalName.Assignment_Member_Single]
  );
  const currentSelected = useSelector<IReduxState, any | null>(
    (state) => state.sqleManagement.selectSqleManagement
  );
  const [submitLoading, { setTrue: startSubmit, setFalse: submitFinish }] =
    useBoolean();
  const [form] = useForm<any>();

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
        modalName: ModalName.Assignment_Member_Single,
        status: false
      })
    );
    dispatch(updateSqleManagement(null));
    handleReset();
  };

  const onSubmit = async () => {
    const values = await form.validateFields();
    startSubmit();
    const params = {};
    // todo: api
    /**
    if (res.data.code === ResponseCode.SUCCESS) {

    messageApi.open({
            type: 'success',
            content: t('auditPlan.subscribeNotice.form.testSuccess')
          });
     */
    submitFinish();
  };

  return (
    <>
      {contextMessageHolder}
      <BasicModal
        open={open}
        title={t('sqlManagement.table.action.single.assignment')}
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
          <FormItemLabelStyleWrapper label="" name="">
            <BasicSelect options={[]}></BasicSelect>
          </FormItemLabelStyleWrapper>
        </Form>
      </BasicModal>
    </>
  );
};

export default AssignmentSingle;
