import { ReactNode, useCallback, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  BasicButton,
  BasicDrawer,
  BasicInput,
  BasicSelect,
  EmptyBox
} from '@actiontech/dms-kit';
import { IRuleResV1 } from '@actiontech/shared/lib/api/sqle/service/common';
import { Form, Space } from 'antd';
import useStaticStatus from '../../../hooks/useStaticStatus';
import { AutoCreatedFormItemByApi, useAsyncParams } from '@actiontech/shared';
import { IRuleTemplateForm } from './index.type';
import { IRuleParamResV1 } from '@actiontech/shared/lib/api/sqle/service/common';
import RuleBaseInfo from '../../../components/RuleList/RuleDetailModal/RuleBaseInfo';
export type IEditRuleTemplate = {
  visible: boolean;
  title: string | ReactNode;
  dataSource: IRuleResV1 | undefined;
  onClosed: () => void;
  onSubmit: (values: IRuleResV1) => void;
  submitLoading?: boolean;
};
const EditRuleTemplate = (props: IEditRuleTemplate) => {
  const { t } = useTranslation();
  const { visible, title, dataSource, onClosed, submitLoading } = props;
  const [form] = Form.useForm<IRuleTemplateForm>();
  const { getRuleLevelStatusSelectOption } = useStaticStatus();
  const { generateFormValueByParams } = useAsyncParams();
  useEffect(() => {
    if (!!dataSource) {
      if (!!dataSource.params && dataSource.params.length > 0) {
        form.setFieldsValue({
          params: generateFormValueByParams(dataSource.params),
          level: dataSource?.level,
          desc: dataSource?.desc ?? '',
          type: dataSource?.type ?? '',
          rule_name: dataSource?.rule_name ?? '',
          db_type: dataSource?.db_type ?? '',
          annotation: dataSource?.annotation ?? ''
        });
      } else {
        form.setFieldsValue({
          level: dataSource?.level,
          desc: dataSource?.desc ?? '',
          type: dataSource?.type ?? '',
          rule_name: dataSource?.rule_name ?? '',
          db_type: dataSource?.db_type ?? '',
          annotation: dataSource?.annotation ?? ''
        });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form, dataSource, visible]);
  const onCancel = () => {
    form?.resetFields();
    onClosed();
  };
  const onPreSubmit = useCallback(async () => {
    const values: IRuleTemplateForm = await form.validateFields();
    const params = props.dataSource?.params?.map((item) => {
      const temp: IRuleParamResV1 = {
        key: item.key,
        value: item.value,
        type: item.type,
        desc: item.desc
      };
      if (
        item.key &&
        Object.prototype.hasOwnProperty.call(values.params, item.key)
      ) {
        const tempVal = values.params[item.key];
        if (typeof tempVal === 'boolean') {
          temp.value = tempVal ? 'true' : 'false';
        } else {
          temp.value = String(tempVal);
        }
      }
      return temp;
    });
    props.onSubmit({
      ...props.dataSource,
      params,
      level: values.level
    });
  }, [form, props]);
  return (
    <BasicDrawer
      open={visible}
      title={title}
      showClosedIcon
      closable={false}
      onClose={onCancel}
      footer={
        <Space size={12}>
          <BasicButton
            type="primary"
            onClick={onPreSubmit}
            loading={submitLoading}
          >
            {t('common.save')}
          </BasicButton>
          <BasicButton onClick={onCancel} disabled={submitLoading}>
            {t('common.cancel')}
          </BasicButton>
        </Space>
      }
    >
      <Form form={form} layout="vertical">
        <Form.Item hidden={true} name="rule_name">
          <BasicInput />
        </Form.Item>
        <RuleBaseInfo dataSource={props.dataSource} />
        <Form.Item
          label={t('ruleTemplate.editModal.ruleLevelLabel')}
          name="level"
          validateFirst
          rules={[
            {
              required: true
            }
          ]}
        >
          <BasicSelect
            placeholder={t('ruleTemplate.editModal.ruleLevelLabelPlace')}
          >
            {getRuleLevelStatusSelectOption()}
          </BasicSelect>
        </Form.Item>
        <EmptyBox if={!!dataSource?.params && dataSource.params.length > 0}>
          <AutoCreatedFormItemByApi
            isFullLine
            params={dataSource?.params ?? []}
          />
        </EmptyBox>
      </Form>
    </BasicDrawer>
  );
};
export default EditRuleTemplate;
