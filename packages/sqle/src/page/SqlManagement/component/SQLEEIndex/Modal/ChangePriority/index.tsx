import { Form, Radio, Space, message } from 'antd';
import { useTranslation } from 'react-i18next';
import { ModalName } from '../../../../../../data/ModalName';
import useSqlManagementRedux from '../../hooks/useSqlManagementRedux';
import { useBoolean } from 'ahooks';
import { useForm } from 'antd/es/form/Form';
import { useCurrentProject } from '@actiontech/shared/lib/global';
import { IBatchUpdateSqlManageParams } from '@actiontech/shared/lib/api/sqle/service/SqlManage/index.d';
import { BatchUpdateSqlManageReqPriorityEnum } from '@actiontech/shared/lib/api/sqle/service/common.enum';
import { ResponseCode } from '@actiontech/shared/lib/enum';
import SqlManage from '@actiontech/shared/lib/api/sqle/service/SqlManage';
import EventEmitter from '../../../../../../utils/EventEmitter';
import EmitterKey from '../../../../../../data/EmitterKey';
import { BasicButton, BasicModal } from '@actiontech/shared';
import { useEffect } from 'react';
import { FormItemLabelStyleWrapper } from '@actiontech/shared/lib/components/CustomForm/FormItem/style';

enum SqlManagePriority {
  high = 'high',
  low = 'low'
}
type FormFields = {
  priority: SqlManagePriority;
};

const ChangePriority: React.FC = () => {
  const { t } = useTranslation();
  const [messageApi, contextMessageHolder] = message.useMessage();

  const {
    open,
    selectSqlManagement: currentSelected,
    setSelectData,
    updateModalStatus
  } = useSqlManagementRedux(ModalName.Change_SQL_Priority);

  const [submitLoading, { setTrue: startSubmit, setFalse: submitFinish }] =
    useBoolean(false);
  const [form] = useForm<FormFields>();
  const { projectName } = useCurrentProject();

  const handleReset = () => {
    form.resetFields();
    submitFinish();
  };

  const onCloseModal = () => {
    updateModalStatus(ModalName.Change_SQL_Priority, false);
    setSelectData(null);
    handleReset();
  };

  const onSubmit = async () => {
    const values = await form.validateFields();
    startSubmit();
    const params: IBatchUpdateSqlManageParams = {
      project_name: projectName,
      sql_manage_id_list: [currentSelected?.id as number],
      priority:
        values.priority === SqlManagePriority.high
          ? BatchUpdateSqlManageReqPriorityEnum.high
          : BatchUpdateSqlManageReqPriorityEnum.UNKNOWN
    };
    SqlManage.BatchUpdateSqlManage(params)
      .then((res) => {
        if (res.data.code === ResponseCode.SUCCESS) {
          messageApi.success(
            t('sqlManagement.table.action.single.updatePriority.successTips')
          );
          EventEmitter.emit(EmitterKey.Refresh_SQL_Management);
          onCloseModal();
        }
      })
      .finally(() => {
        submitFinish();
      });
  };

  useEffect(() => {
    if (open) {
      form.setFieldValue(
        'priority',
        currentSelected?.priority === BatchUpdateSqlManageReqPriorityEnum.high
          ? SqlManagePriority.high
          : SqlManagePriority.low
      );
    }
  }, [currentSelected?.priority, form, open]);

  return (
    <>
      {contextMessageHolder}
      <BasicModal
        open={open}
        size="small"
        title={t(
          'sqlManagement.table.action.single.updatePriority.triggerText'
        )}
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
            label={t('sqlManagement.table.action.single.updatePriority.label')}
            name="priority"
            rules={[{ required: true }]}
          >
            <Radio.Group>
              <Space direction="vertical" size={0}>
                {[
                  {
                    label: t(
                      'sqlManagement.table.action.single.updatePriority.high'
                    ),
                    value: SqlManagePriority.high
                  },
                  {
                    label: t(
                      'sqlManagement.table.action.single.updatePriority.low'
                    ),
                    value: SqlManagePriority.low
                  }
                ].map((item) => {
                  return (
                    <Radio
                      key={item.value}
                      style={{ lineHeight: '32px' }}
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

export default ChangePriority;
