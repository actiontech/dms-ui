import { ReactNode, useCallback, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  BasicButton,
  BasicDrawer,
  BasicInput,
  BasicSelect,
  EmptyBox
} from '@actiontech/shared';
import { IRuleResV1 } from '@actiontech/shared/lib/api/sqle/service/common';
import { Form, Space } from 'antd';
import useStaticStatus from '../../../hooks/useStaticStatus';
import AutoCreatedFormItemByApi from '../../../components/BackendForm/AutoCreatedFormItemByApi';
import useAsyncParams from '../../../components/BackendForm/useAsyncParams';
import { IRuleTemplateForm } from './index.type';
import { IRuleParamResV1 } from '@actiontech/shared/lib/api/sqle/service/common';
import RuleBaseInfo from '../../../components/RuleList/RuleDetailModal/RuleBaseInfo';
import { RuleResV1LevelEnum } from '@actiontech/shared/lib/api/sqle/service/common.enum';
import { resolveRuleConfigErrorPriority } from '../../../components/AuditResultMessage/errorPriorityDisplay';

export type IEditRuleTemplate = {
  visible: boolean;
  title: string | ReactNode;
  dataSource: IRuleResV1 | undefined;
  onClosed: () => void;
  onSubmit: (values: IRuleResV1) => void;
  submitLoading?: boolean;
};

const ERROR_PRIORITY_OPTIONS = [
  { label: 'P0', value: 'P0' },
  { label: 'P1', value: 'P1' }
];

const EditRuleTemplate = (props: IEditRuleTemplate) => {
  const { t } = useTranslation();

  const { visible, title, dataSource, onClosed, submitLoading } = props;
  const [form] = Form.useForm<IRuleTemplateForm>();
  const { getRuleLevelStatusSelectOption } = useStaticStatus();
  const { generateFormValueByParams } = useAsyncParams();
  const currentLevel = Form.useWatch('level', form);

  useEffect(() => {
    if (!!dataSource) {
      const errorPriority = resolveRuleConfigErrorPriority(
        dataSource.level,
        dataSource.error_priority
      );
      if (!!dataSource.params && dataSource.params.length > 0) {
        form.setFieldsValue({
          params: generateFormValueByParams(dataSource.params),
          level: dataSource?.level,
          error_priority: errorPriority || undefined,
          desc: dataSource?.desc ?? '',
          type: dataSource?.type ?? '',
          rule_name: dataSource?.rule_name ?? '',
          db_type: dataSource?.db_type ?? '',
          annotation: dataSource?.annotation ?? ''
        });
      } else {
        form.setFieldsValue({
          level: dataSource?.level,
          error_priority: errorPriority || undefined,
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

  const onLevelChange = (level: RuleResV1LevelEnum) => {
    if (level === RuleResV1LevelEnum.error) {
      const current = form.getFieldValue('error_priority');
      form.setFieldsValue({
        error_priority: current || 'P1'
      });
    } else {
      form.setFieldsValue({ error_priority: undefined });
    }
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
    const isError = values.level === RuleResV1LevelEnum.error;
    props.onSubmit({
      ...props.dataSource,
      params,
      level: values.level,
      error_priority: isError
        ? resolveRuleConfigErrorPriority(values.level, values.error_priority)
        : ''
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
            onChange={onLevelChange}
          >
            {getRuleLevelStatusSelectOption()}
          </BasicSelect>
        </Form.Item>
        <EmptyBox if={currentLevel === RuleResV1LevelEnum.error}>
          <Form.Item
            label={t('ruleTemplate.editModal.errorPriorityLabel')}
            name="error_priority"
            rules={[
              {
                required: true,
                message: t('common.form.placeholder.select', {
                  name: t('ruleTemplate.editModal.errorPriorityLabel')
                })
              }
            ]}
            initialValue="P1"
          >
            <BasicSelect
              placeholder={t('ruleTemplate.editModal.errorPriorityPlace')}
              options={ERROR_PRIORITY_OPTIONS}
            />
          </Form.Item>
        </EmptyBox>
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
