import CustomSearchInput from './CustomInput';
import { Form, Space } from 'antd';
import { useTranslation } from 'react-i18next';
import { CustomSelect } from '@actiontech/shared/lib/components/CustomSelect';
import useRuleCategories from '../../../../hooks/useRuleCategories';
import { InfoCircleOutlined } from '@actiontech/icons';
import { BasicToolTip } from '@actiontech/shared';
import { RuleFilterCommonFieldSelectStyleWrapper } from '../../style';

type Props = {
  withoutFuzzyKeywordFilterItem?: boolean;
};

const RuleFilterCommonFields: React.FC<Props> = ({
  withoutFuzzyKeywordFilterItem = false
}) => {
  const { t } = useTranslation();

  const {
    getRuleCategoriesLoading,
    auditAccuracyOptions,
    operandOptions,
    sqlOptions,
    auditPurposeOptions,
    performanceLevelOptions
  } = useRuleCategories();

  return (
    <Space size={12}>
      {!withoutFuzzyKeywordFilterItem && (
        <Form.Item noStyle name="fuzzy_keyword">
          <CustomSearchInput
            placeholder={t('rule.form.fuzzy_text_placeholder')}
            allowClear
          />
        </Form.Item>
      )}
      <Form.Item noStyle name="operand">
        <CustomSelect
          prefix={t('rule.category.operand')}
          allowClear
          suffixIcon={null}
          loading={getRuleCategoriesLoading}
          options={operandOptions}
        />
      </Form.Item>
      <Form.Item noStyle name="audit_purpose">
        <CustomSelect
          prefix={t('rule.category.auditPurpose')}
          suffixIcon={null}
          allowClear
          bordered={false}
          loading={getRuleCategoriesLoading}
          options={auditPurposeOptions}
        />
      </Form.Item>
      <Form.Item noStyle name="sql">
        <CustomSelect
          prefix={t('rule.category.sql')}
          suffixIcon={null}
          bordered={false}
          loading={getRuleCategoriesLoading}
          allowClear
          options={sqlOptions}
        />
      </Form.Item>
      <Form.Item noStyle name="audit_accuracy">
        <CustomSelect
          prefix={t('rule.category.auditAccuracy')}
          suffixIcon={null}
          bordered={false}
          allowClear
          loading={getRuleCategoriesLoading}
          options={auditAccuracyOptions}
        />
      </Form.Item>
      <RuleFilterCommonFieldSelectStyleWrapper size={4}>
        <Form.Item noStyle name="performance_cost">
          <CustomSelect
            prefix={t('rule.category.performanceCost')}
            suffixIcon={null}
            bordered={false}
            allowClear
            loading={getRuleCategoriesLoading}
            options={performanceLevelOptions}
          />
        </Form.Item>
        <BasicToolTip
          title={t('rule.category.performanceLevelTips')}
          suffixIcon={<InfoCircleOutlined />}
        ></BasicToolTip>
      </RuleFilterCommonFieldSelectStyleWrapper>
    </Space>
  );
};

export default RuleFilterCommonFields;
