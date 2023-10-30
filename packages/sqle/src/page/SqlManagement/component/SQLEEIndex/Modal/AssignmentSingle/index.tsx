import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { ModalName } from '../../../../../../data/ModalName';
import {
  updateSqleManagementModalStatus,
  updateSqleManagement
} from '../../../../../../store/sqleManagement';

import { Space, message, Form } from 'antd5';
import { useBoolean } from 'ahooks';
import { useSelector } from 'react-redux';
import { IReduxState } from '../../../../../../../../base/src/store';
import { useForm } from 'antd5/es/form/Form';
import { BasicButton, BasicModal, BasicSelect } from '@actiontech/shared';
import { FormItemLabelStyleWrapper } from '@actiontech/shared/lib/components/FormCom/FormItemCom/style';
import useUsername from '../../../../../../hooks/useUsername';
import { filterOptionByLabel } from '@actiontech/shared/lib/components/BasicSelect/utils';
import { useCurrentProject } from '@actiontech/shared/lib/global';
import { IBatchUpdateSqlManageParams } from '@actiontech/shared/lib/api/sqle/service/SqlManage/index.d';
import SqlManage from '@actiontech/shared/lib/api/sqle/service/SqlManage';
import { ResponseCode } from '@actiontech/shared/lib/enum';
import EmitterKey from '../../../../../../data/EmitterKey';
import EventEmitter from '../../../../../../utils/EventEmitter';

const AssignmentSingle = () => {
  const { t } = useTranslation();

  const dispatch = useDispatch();

  const [messageApi, contextMessageHolder] = message.useMessage();
  const open = useSelector<IReduxState, boolean>(
    (state) =>
      state.sqleManagement.modalStatus[ModalName.Assignment_Member_Single]
  );
  const currentSelected = useSelector<IReduxState, any | null>(
    (state) => state.sqleManagement.selectSqleManagement
  );
  const { projectName } = useCurrentProject();
  const { loading, updateUsernameList, generateUsernameSelectOption } =
    useUsername();
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
      updateUsernameList(projectName);
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
    const params: IBatchUpdateSqlManageParams = {
      project_name: projectName,
      sql_manage_id_list: [currentSelected.id],
      assignees: [values.assignees]
    };
    SqlManage.BatchUpdateSqlManage(params)
      .then((res) => {
        if (res.data.code === ResponseCode.SUCCESS) {
          messageApi.success(
            t('sqlManagement.table.action.single.assignmentSuccessTips')
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
              disabled={submitLoading}
              type="primary"
            >
              {t('common.ok')}
            </BasicButton>
          </Space>
        }
      >
        <Form form={form}>
          <FormItemLabelStyleWrapper label="" name="assignees">
            <BasicSelect
              loading={loading}
              showSearch
              filterOption={filterOptionByLabel}
            >
              {generateUsernameSelectOption()}
            </BasicSelect>
          </FormItemLabelStyleWrapper>
        </Form>
      </BasicModal>
    </>
  );
};

export default AssignmentSingle;
