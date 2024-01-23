import { useTranslation } from 'react-i18next';
import { ModalName } from '../../../../../../data/ModalName';

import { Space, message } from 'antd';
import AssignmentForm from '../AssignmentForm';

import { useBoolean } from 'ahooks';
import { useForm } from 'antd/es/form/Form';
import { BasicButton, BasicModal } from '@actiontech/shared';
import { useCurrentProject } from '@actiontech/shared/lib/global';
import { IBatchUpdateSqlManageParams } from '@actiontech/shared/lib/api/sqle/service/SqlManage/index.d';
import SqlManage from '@actiontech/shared/lib/api/sqle/service/SqlManage';
import { ResponseCode } from '@actiontech/shared/lib/enum';
import EmitterKey from '../../../../../../data/EmitterKey';
import EventEmitter from '../../../../../../utils/EventEmitter';
import { AssignmentFormField } from '../AssignmentForm/index.type';
import useTableRedux from '../../hooks/useTableRedux';

const AssignmentBatch = () => {
  const { t } = useTranslation();

  const {
    open,
    selectedSqlIdList: currentSelected,
    updateIdList,
    updateModalStatus
  } = useTableRedux(ModalName.Assignment_Member_Batch);

  const [messageApi, contextMessageHolder] = message.useMessage();

  const { projectName } = useCurrentProject();
  const [submitLoading, { setTrue: startSubmit, setFalse: submitFinish }] =
    useBoolean();
  const [form] = useForm<AssignmentFormField>();

  const handleReset = () => {
    form.resetFields();
    submitFinish();
  };

  const onCloseModal = () => {
    updateModalStatus(ModalName.Assignment_Member_Batch, false);
    updateIdList(null);
  };

  const onSubmit = async () => {
    const values = await form.validateFields();
    startSubmit();
    const params: IBatchUpdateSqlManageParams = {
      project_name: projectName,
      sql_manage_id_list: currentSelected
        ?.filter((item) => item?.id)
        .map((item) => Number(item?.id)),
      assignees: values.assignees
    };
    SqlManage.BatchUpdateSqlManage(params)
      .then((res) => {
        if (res.data.code === ResponseCode.SUCCESS) {
          messageApi.success(
            t('sqlManagement.table.action.batch.assignmentSuccessTips')
          );
          EventEmitter.emit(EmitterKey.Refresh_SQL_Management);
          onCloseModal();
        }
      })
      .finally(() => {
        submitFinish();
      });
  };
  return (
    <>
      {contextMessageHolder}
      <BasicModal
        size="small"
        open={open}
        title={t('sqlManagement.table.action.batch.assignment')}
        closable={false}
        onCancel={onCloseModal}
        destroyOnClose
        afterClose={handleReset}
        footer={
          <Space>
            <BasicButton onClick={onCloseModal}>
              {t('common.cancel')}
            </BasicButton>
            <BasicButton
              onClick={onSubmit}
              disabled={submitLoading}
              type="primary"
            >
              {t('common.ok')}
            </BasicButton>
          </Space>
        }
      >
        <AssignmentForm form={form} submitLoading={submitLoading} init={open} />
      </BasicModal>
    </>
  );
};

export default AssignmentBatch;
