import { useTranslation } from 'react-i18next';
import { Space, message, Form, Radio } from 'antd';
import { useBoolean } from 'ahooks';
import { useForm } from 'antd/es/form/Form';
import { BasicButton, BasicModal } from '@actiontech/dms-kit';
import { ModalName } from '../../../../../../data/ModalName';
import { IBatchUpdateSqlManageParams } from '@actiontech/shared/lib/api/sqle/service/SqlManage/index.d';
import { useCurrentProject } from '@actiontech/shared/lib/features';
import { BatchUpdateSqlManageReqStatusEnum } from '@actiontech/shared/lib/api/sqle/service/common.enum';
import SqlManage from '@actiontech/shared/lib/api/sqle/service/SqlManage';
import { ResponseCode } from '@actiontech/dms-kit';
import EmitterKey from '../../../../../../data/EmitterKey';
import EventEmitter from '../../../../../../utils/EventEmitter';
import useSqlManagementRedux from '../../hooks/useSqlManagementRedux';
import { FormItemLabelStyleWrapper } from '@actiontech/dms-kit/es/components/CustomForm/FormItem/style';
export type ChangeStatusFields = {
  status: BatchUpdateSqlManageReqStatusEnum;
};
const ChangeStatus = () => {
  const { t } = useTranslation();
  const [messageApi, contextMessageHolder] = message.useMessage();
  const {
    open,
    selectSqlManagement: currentSelected,
    setSelectData,
    updateModalStatus
  } = useSqlManagementRedux(ModalName.Change_Status_Single);
  const [submitLoading, { setTrue: startSubmit, setFalse: submitFinish }] =
    useBoolean(false);
  const [form] = useForm<ChangeStatusFields>();
  const { projectName } = useCurrentProject();
  const handleReset = () => {
    form.resetFields();
    submitFinish();
  };
  const onCloseModal = () => {
    updateModalStatus(ModalName.Change_Status_Single, false);
    setSelectData(null);
    handleReset();
  };
  const onSubmit = async () => {
    const values = await form.validateFields();
    startSubmit();
    const params: IBatchUpdateSqlManageParams = {
      project_name: projectName,
      sql_manage_id_list: [currentSelected?.id as number],
      status: values.status
    };
    SqlManage.BatchUpdateSqlManage(params)
      .then((res) => {
        if (res.data.code === ResponseCode.SUCCESS) {
          messageApi.success(
            t(
              'sqlManagement.table.action.single.updateStatus.signalUpdateStatusSuccessTips'
            )
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
        title={t('sqlManagement.table.action.single.updateStatus.triggerText')}
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
        <Form form={form}>
          <FormItemLabelStyleWrapper
            label={t('sqlManagement.table.action.single.updateStatus.label')}
            name="status"
            rules={[
              {
                required: true
              }
            ]}
            initialValue={BatchUpdateSqlManageReqStatusEnum.solved}
          >
            <Radio.Group>
              <Space direction="vertical" size={0}>
                {[
                  {
                    label: t(
                      'sqlManagement.table.action.single.updateStatus.solve'
                    ),
                    value: BatchUpdateSqlManageReqStatusEnum.solved
                  },
                  {
                    label: t(
                      'sqlManagement.table.action.single.updateStatus.ignore'
                    ),
                    value: BatchUpdateSqlManageReqStatusEnum.ignored
                  },
                  {
                    label: t(
                      'sqlManagement.table.action.single.updateStatus.manualAudit'
                    ),
                    value: BatchUpdateSqlManageReqStatusEnum.manual_audited
                  }
                ].map((item) => {
                  return (
                    <Radio
                      key={item.value}
                      style={{
                        lineHeight: '32px'
                      }}
                      value={item.value}
                    >
                      {item.label}
                    </Radio>
                  );
                })}
              </Space>
            </Radio.Group>
          </FormItemLabelStyleWrapper>
        </Form>
      </BasicModal>
    </>
  );
};
export default ChangeStatus;
