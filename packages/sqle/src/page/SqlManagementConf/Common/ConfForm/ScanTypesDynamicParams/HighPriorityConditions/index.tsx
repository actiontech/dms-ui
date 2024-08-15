import {
  BasicInput,
  BasicSelect,
  BasicSwitch,
  BasicTag,
  EmptyBox
} from '@actiontech/shared';
import { IHighPriorityCondition } from '@actiontech/shared/lib/api/sqle/service/common';
import {
  FormItemLabel,
  FormItemNoLabel
} from '@actiontech/shared/lib/components/FormCom';
import { formItemLayout } from '@actiontech/shared/lib/components/FormCom/style';
import { Col, Divider, Form, Row } from 'antd';
import { useTranslation } from 'react-i18next';
import {
  HighPriorityConditionParams,
  PrioritySqlConditionsParams,
  SqlManagementConfFormFields
} from '../../index.type';

type Props = {
  prefixPath: string;
  submitLoading: boolean;
  conditions: IHighPriorityCondition[];
};

const HighPriorityConditions: React.FC<Props> = ({
  prefixPath,
  submitLoading,
  conditions
}) => {
  const { t } = useTranslation();
  const form = Form.useFormInstance<SqlManagementConfFormFields>();

  const conditionsValues: PrioritySqlConditionsParams = Form.useWatch(
    [prefixPath, 'prioritySqlConditions'],
    form
  );

  const isMarkHighPrioritySql = Form.useWatch(
    [prefixPath, 'markHighPrioritySql'],
    form
  );

  const generatePriorityConditionsFieldName = (
    key: string,
    name: keyof HighPriorityConditionParams
  ) => {
    return [prefixPath, 'prioritySqlConditions', key, name];
  };

  const getEnabledStatusByKey = (key: string) => {
    return conditionsValues?.[key]?.checked;
  };
  return (
    <>
      <FormItemLabel
        className="has-required-style"
        label={t(
          'managementConf.create.scanTypeParams.hightPriorityConditions.mark'
        )}
        {...formItemLayout.spaceBetween}
        name={[prefixPath, 'markHighPrioritySql']}
        valuePropName="checked"
      >
        <BasicSwitch disabled={submitLoading} />
      </FormItemLabel>
      <EmptyBox if={isMarkHighPrioritySql}>
        {conditions.map((item) => {
          return (
            <Row gutter={12} key={item.key}>
              <Col span={5} offset={9}>
                <BasicTag color="blue" style={{ height: 36 }}>
                  {item.desc}
                </BasicTag>
              </Col>
              <Col span={3}>
                <FormItemNoLabel
                  name={generatePriorityConditionsFieldName(
                    item.key!,
                    'booleanOperator'
                  )}
                  {...formItemLayout.fullLine}
                  label=""
                  initialValue={item.boolean_operator?.boolean_operator_value}
                  rules={[
                    {
                      required: getEnabledStatusByKey(item.key!),
                      message: t('common.form.placeholder.select', {
                        name: t(
                          'managementConf.create.scanTypeParams.hightPriorityConditions.operator'
                        )
                      })
                    }
                  ]}
                >
                  {item.boolean_operator?.boolean_operator_enums_value ? (
                    <BasicSelect
                      options={item.boolean_operator.boolean_operator_enums_value.map(
                        (v) => ({ label: v.value, value: v.value })
                      )}
                      disabled={
                        !getEnabledStatusByKey(item.key!) || submitLoading
                      }
                      placeholder=""
                    />
                  ) : (
                    <BasicInput
                      disabled={
                        !getEnabledStatusByKey(item.key!) || submitLoading
                      }
                      placeholder=""
                    />
                  )}
                </FormItemNoLabel>
              </Col>
              <Col span={5}>
                <FormItemNoLabel
                  name={generatePriorityConditionsFieldName(item.key!, 'value')}
                  {...formItemLayout.fullLine}
                  label=""
                  rules={[
                    {
                      required: getEnabledStatusByKey(item.key!),
                      message: t('common.form.placeholder.select', {
                        name: t(
                          'managementConf.create.scanTypeParams.hightPriorityConditions.threshold'
                        )
                      })
                    }
                  ]}
                  initialValue={item.value}
                >
                  {item.enums_value ? (
                    <BasicSelect
                      disabled={
                        !getEnabledStatusByKey(item.key!) || submitLoading
                      }
                      options={item.enums_value.map((v) => ({
                        label: v.desc,
                        value: v.value
                      }))}
                      placeholder={t('common.form.placeholder.select', {
                        name: t(
                          'managementConf.create.scanTypeParams.hightPriorityConditions.threshold'
                        )
                      })}
                    />
                  ) : (
                    <BasicInput
                      disabled={!getEnabledStatusByKey(item.key!)}
                      placeholder={t('common.form.placeholder.input', {
                        name: t(
                          'managementConf.create.scanTypeParams.hightPriorityConditions.threshold'
                        )
                      })}
                    />
                  )}
                </FormItemNoLabel>
              </Col>

              <Divider
                type="vertical"
                style={{ height: 36, marginLeft: 6, marginRight: 12 }}
              />

              <FormItemNoLabel
                name={generatePriorityConditionsFieldName(item.key!, 'checked')}
                {...formItemLayout.fullLine}
                label=""
                valuePropName="checked"
                initialValue={true}
              >
                <BasicSwitch
                  disabled={submitLoading}
                  size="small"
                  onChange={(open) => {
                    if (!open) {
                      form.setFieldValue(
                        generatePriorityConditionsFieldName(
                          item.key!,
                          'booleanOperator'
                        ),
                        undefined
                      );
                      form.setFieldValue(
                        generatePriorityConditionsFieldName(item.key!, 'value'),
                        undefined
                      );
                    } else {
                      form.setFieldValue(
                        generatePriorityConditionsFieldName(
                          item.key!,
                          'booleanOperator'
                        ),
                        item.boolean_operator?.boolean_operator_value
                      );
                      form.setFieldValue(
                        generatePriorityConditionsFieldName(item.key!, 'value'),
                        item.value
                      );
                    }
                  }}
                />
              </FormItemNoLabel>
            </Row>
          );
        })}
      </EmptyBox>
    </>
  );
};

export default HighPriorityConditions;
