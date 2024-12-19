import CustomSearchInput from './CustomInput';
import { Form, Space } from 'antd';
import { useTranslation } from 'react-i18next';
import { CustomSelect } from '@actiontech/shared/lib/components/CustomSelect';
import ruleTemplate from '@actiontech/shared/lib/api/sqle/service/rule_template';
import { useRequest } from 'ahooks';
import { ResponseCode } from '@actiontech/shared/lib/enum';
import { RuleCategoryDictionaryGroup } from './index.data';
import { ReactNode } from 'react';

const RuleFilterCommonFields = () => {
  const { t } = useTranslation();

  const { data, loading } = useRequest(() =>
    ruleTemplate.getCategoryStatistics().then((res) => {
      if (res.data.code === ResponseCode.SUCCESS) {
        const optionGroup: {
          [key: string]: Array<{ label: ReactNode; value: string }> | undefined;
        } = {};
        Object.keys(res.data.data ?? {}).forEach((key) => {
          const dictionary = RuleCategoryDictionaryGroup[key];
          optionGroup[key] = res.data.data?.[key]?.map((i) => ({
            label: ` ${i.tag ? dictionary[i.tag] : i.tag} ${i.count}`,
            value: i.tag ?? ''
          }));
        });
        return optionGroup;
      }
    })
  );

  return (
    <Space size={12}>
      <Form.Item noStyle name="fuzzy_keyword">
        <CustomSearchInput
          placeholder={t('rule.form.fuzzy_text_placeholder')}
          allowClear
        />
      </Form.Item>
      <Form.Item noStyle name="operand">
        <CustomSelect
          prefix={t('rule.category.operand')}
          allowClear
          suffixIcon={null}
          loading={loading}
          options={data?.operand}
          // labelInValue
        />
      </Form.Item>
      <Form.Item noStyle name="audit_purpose">
        <CustomSelect
          prefix={t('rule.category.auditPurpose')}
          suffixIcon={null}
          allowClear
          bordered={false}
          loading={loading}
          options={data?.audit_purpose}
        />
      </Form.Item>
      <Form.Item noStyle name="sql">
        <CustomSelect
          prefix={t('rule.category.sql')}
          suffixIcon={null}
          bordered={false}
          loading={loading}
          allowClear
          options={data?.sql}
        />
      </Form.Item>
      <Form.Item noStyle name="audit_accuracy">
        <CustomSelect
          prefix={t('rule.category.auditAccuracy')}
          suffixIcon={null}
          bordered={false}
          allowClear
          loading={loading}
          options={data?.audit_accuracy}
        />
      </Form.Item>
    </Space>
  );
};

export default RuleFilterCommonFields;
