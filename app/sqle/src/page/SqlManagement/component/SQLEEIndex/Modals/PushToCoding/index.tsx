import { Form, Space, message } from 'antd';
import { useTranslation } from 'react-i18next';
import { ModalName } from '../../../../../../data/ModalName';
import useSqlManagementRedux from '../../hooks/useSqlManagementRedux';
import { useBoolean } from 'ahooks';
import { useForm } from 'antd/es/form/Form';
import { useCurrentProject } from '@actiontech/shared/lib/features';
import { ISendSqlManageParams } from '@actiontech/shared/lib/api/sqle/service/SqlManage/index.d';
import { ResponseCode } from '@actiontech/dms-kit';
import SqlManage from '@actiontech/shared/lib/api/sqle/service/SqlManage';
import EventEmitter from '../../../../../../utils/EventEmitter';
import EmitterKey from '../../../../../../data/EmitterKey';
import {
  BasicButton,
  BasicModal,
  BasicSelect,
  BasicInput
} from '@actiontech/dms-kit';
import {
  SqlManageCodingReqTypeEnum,
  SqlManageCodingReqPriorityEnum
} from '@actiontech/shared/lib/api/sqle/service/common.enum';
import {
  CodingIssueUrgencyOptions,
  CodingIssueTypeOptions
} from './index.data';
type PushToCodingModalFormFields = {
  codingProjectName: string;
  type: string;
  priority: string;
};
const PushToCodingModal: React.FC = () => {
  const { t } = useTranslation();
  const [messageApi, contextMessageHolder] = message.useMessage();
  const {
    open,
    batchSelectSqlManagement,
    updateModalStatus,
    setBatchSelectData
  } = useSqlManagementRedux(ModalName.Push_To_Coding);
  const [submitLoading, { setTrue: startSubmit, setFalse: submitFinish }] =
    useBoolean(false);
  const [form] = useForm<PushToCodingModalFormFields>();
  const { projectName } = useCurrentProject();
  const handleReset = () => {
    form.resetFields();
    submitFinish();
  };
  const onCloseModal = () => {
    updateModalStatus(ModalName.Push_To_Coding, false);
    setBatchSelectData(null);
    handleReset();
  };
  const onSubmit = async () => {
    const values = await form.validateFields();
    startSubmit();
    const params: ISendSqlManageParams = {
      project_name: projectName,
      sql_manage_id_list: batchSelectSqlManagement?.map((item) => item.id ?? 0),
      coding_project_name: values.codingProjectName,
      type: values.type as SqlManageCodingReqTypeEnum,
      priority: values.priority as SqlManageCodingReqPriorityEnum
    };
    SqlManage.SendSqlManage(params)
      .then((res) => {
        if (res.data.code === ResponseCode.SUCCESS) {
          messageApi.success(
            t('sqlManagement.table.action.pushToCodingForm.successTips')
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
        open={open}
        size="small"
        title={t('sqlManagement.table.action.batch.pushToCoding')}
        closable={false}
        onCancel={onCloseModal}
        footer={
          <Space>
            <BasicButton onClick={onCloseModal} disabled={submitLoading}>
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
        <Form form={form} layout="vertical">
          <Form.Item
            label={t('sqlManagement.table.action.pushToCodingForm.project')}
            name="codingProjectName"
            initialValue={projectName}
          >
            <BasicInput />
          </Form.Item>
          <Form.Item
            label={t('sqlManagement.table.action.pushToCodingForm.type')}
            name="type"
            rules={[
              {
                required: true
              }
            ]}
            initialValue={SqlManageCodingReqTypeEnum.MISSION}
          >
            <BasicSelect options={CodingIssueTypeOptions}></BasicSelect>
          </Form.Item>
          <Form.Item
            label={t('sqlManagement.table.action.pushToCodingForm.urgency')}
            name="priority"
            rules={[
              {
                required: true
              }
            ]}
            initialValue={SqlManageCodingReqPriorityEnum.LOW}
          >
            <BasicSelect options={CodingIssueUrgencyOptions}></BasicSelect>
          </Form.Item>
        </Form>
      </BasicModal>
    </>
  );
};
export default PushToCodingModal;
