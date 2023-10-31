import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { ModalName } from '../../../../../../data/ModalName';

import { Space, message } from 'antd5';
import AssignmentForm from '../AssignmentForm';

import { useBoolean } from 'ahooks';
import { useSelector } from 'react-redux';
import { IReduxState } from '../../../../../../../../base/src/store';
import {
  updateSqleManagementModalStatus,
  updateSqleManagement
} from '../../../../../../store/sqleManagement';
import { useForm } from 'antd5/es/form/Form';
import { BasicButton, BasicModal } from '@actiontech/shared';
import { useCurrentProject } from '@actiontech/shared/lib/global';
import { IBatchUpdateSqlManageParams } from '@actiontech/shared/lib/api/sqle/service/SqlManage/index.d';
import SqlManage from '@actiontech/shared/lib/api/sqle/service/SqlManage';
import { ResponseCode } from '@actiontech/shared/lib/enum';
import EmitterKey from '../../../../../../data/EmitterKey';
import EventEmitter from '../../../../../../utils/EventEmitter';
import { AssignmentFormField } from '../AssignmentForm/index.type';
import { ISqlManage } from '@actiontech/shared/lib/api/sqle/service/common';

const AssignmentBatch = () => {
  const { t } = useTranslation();

  const dispatch = useDispatch();

  const [messageApi, contextMessageHolder] = message.useMessage();
  const open = useSelector<IReduxState, boolean>(
    (state) =>
      state.sqleManagement.modalStatus[ModalName.Assignment_Member_Batch]
  );
  const currentSelected = useSelector<IReduxState, ISqlManage[] | null>(
    (state) => state.sqleManagement.selectSqlIdList
  );
  const { projectName } = useCurrentProject();
  const [submitLoading, { setTrue: startSubmit, setFalse: submitFinish }] =
    useBoolean();
  const [form] = useForm<AssignmentFormField>();

  const handleReset = () => {
    form.resetFields();
    submitFinish();
  };

  const onCloseModal = () => {
    dispatch(
      updateSqleManagementModalStatus({
        modalName: ModalName.Assignment_Member_Batch,
        status: false
      })
    );
    dispatch(updateSqleManagement(null));
  };

  const onSubmit = async () => {
    const values = await form.validateFields();
    startSubmit();
    const params: IBatchUpdateSqlManageParams = {
      project_name: projectName,
      sql_manage_id_list: currentSelected?.map((item) => Number(item?.id)),
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
