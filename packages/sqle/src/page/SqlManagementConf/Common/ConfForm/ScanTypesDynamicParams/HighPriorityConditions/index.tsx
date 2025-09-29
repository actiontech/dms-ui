import {
  BasicInput,
  BasicSelect,
  BasicSwitch,
  EmptyBox
} from '@actiontech/dms-kit';
import { BasicTypographyEllipsis } from '@actiontech/shared';
import { IHighPriorityConditionResV1 } from '@actiontech/shared/lib/api/sqle/service/common';
import {
  CustomLabelContent,
  FormItemLabel,
  FormItemNoLabel
} from '@actiontech/dms-kit';
import { formItemLayout } from '@actiontech/dms-kit/es/components/CustomForm/style';
import { Col, Divider, Form, Row } from 'antd';
import { useTranslation } from 'react-i18next';
import {
  HighPriorityConditionParams,
  PrioritySqlConditionsParams,
  SqlManagementConfFormFields
} from '../../index.type';
import { MenuSquareFilled } from '@actiontech/icons';
import { HighPriorityConditionDescTagStyleWrapper } from './style';
type Props = {
  prefixPath: string;
  submitLoading: boolean;
  conditions: IHighPriorityConditionResV1[];
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
        className="has-label-tip"
        label={
          <CustomLabelContent
            tips={t(
              'managementConf.create.scanTypeParams.hightPriorityConditions.markTips'
            )}
            title={t(
              'managementConf.create.scanTypeParams.hightPriorityConditions.mark'
            )}
          />
        }
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
                <HighPriorityConditionDescTagStyleWrapper
                  icon={<MenuSquareFilled />}
                  bordered={false}
                  color="blue"
                >
                  <BasicTypographyEllipsis
                    tooltipsMaxWidth={200}
                    copyable={false}
                    textCont={item.desc ?? ''}
                  />
                </HighPriorityConditionDescTagStyleWrapper>
              </Col>
              <Col span={3}>
                <FormItemNoLabel
                  name={generatePriorityConditionsFieldName(
                    item.key!,
                    'operator'
                  )}
                  {...formItemLayout.fullLine}
                  label=""
                  initialValue={item.operator?.operator_value}
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
                  {item.operator?.operator_enums_value ? (
                    <BasicSelect
                      data-testid={`${item.key}_operator`}
                      options={item.operator.operator_enums_value.map((v) => ({
                        label: v.value,
                        value: v.value
                      }))}
                      disabled={
                        !getEnabledStatusByKey(item.key!) || submitLoading
                      }
                      placeholder=""
                    />
                  ) : (
                    <BasicInput
                      data-testid={`${item.key}_operator`}
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
                      data-testid={`${item.key}_value`}
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
                      data-testid={`${item.key}_value`}
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
                style={{
                  height: 36,
                  marginLeft: 6,
                  marginRight: 12
                }}
              />

              <FormItemNoLabel
                name={generatePriorityConditionsFieldName(item.key!, 'checked')}
                {...formItemLayout.fullLine}
                label=""
                valuePropName="checked"
                initialValue={true}
              >
                <BasicSwitch
                  data-testid={`${item.key}_switch`}
                  disabled={submitLoading}
                  size="small"
                  onChange={(open) => {
                    if (!open) {
                      form.setFieldValue(
                        generatePriorityConditionsFieldName(
                          item.key!,
                          'operator'
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
                          'operator'
                        ),
                        item.operator?.operator_value
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
