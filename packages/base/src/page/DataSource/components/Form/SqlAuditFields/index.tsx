import { useTranslation } from 'react-i18next';
import { Form, Typography } from 'antd';
import {
  BasicInput,
  BasicSelect,
  BasicSwitch,
  EmptyBox
} from '@actiontech/dms-kit';
import { FormAreaBlockStyleWrapper } from '@actiontech/dms-kit/es/components/CustomForm/style';
import {
  FormItemLabel,
  FormItemSubTitle,
  CustomLabelContent
} from '@actiontech/dms-kit';
import Select, { SelectProps, BaseOptionType } from 'antd/es/select';
import { SQLQueryConfigAllowQueryWhenLessThanAuditLevelEnum } from '@actiontech/shared/lib/api/base/service/common.enum';
import { FaLessThanEqualOutlined } from '@actiontech/icons';
import ConfirmSwitch from './ConfirmSwitch';
import {
  SqlAuditFieldsSubTitleWrapper,
  DataSourceSqlAuditConfigurationStyleWrapper
} from '../style';
type SqlAuditFieldsValue = {
  needSqlAuditService: boolean;
  ruleTemplateId: string;
  ruleTemplateName: string;
  dataExportRuleTemplateId: string;
  dataExportRuleTemplateName: string;
  needAuditForSqlQuery: boolean;
  workbenchTemplateId: string;
  workbenchTemplateName: string;
  allowQueryWhenLessThanAuditLevel: string;
};
type SqlAuditFieldsProps = {
  getTemplateOptionsLoading: boolean;
  ruleTemplateOptions: SelectProps['options'];
  onNeedAuditForSqlQueryChange: (value: boolean) => void;
};
const SqlAuditFields: React.FC<SqlAuditFieldsProps> = ({
  getTemplateOptionsLoading,
  ruleTemplateOptions,
  onNeedAuditForSqlQueryChange
}) => {
  const { t } = useTranslation();
  const form = Form.useFormInstance();
  const needSqlAuditService = Form.useWatch('needSqlAuditService');
  const needAuditForSqlQuery = Form.useWatch('needAuditForSqlQuery');
  const changeRuleTemplate = (
    value: string,
    option: BaseOptionType,
    key: keyof SqlAuditFieldsValue
  ) => {
    form.setFieldsValue({
      [key]: option.key
    });
  };
  return (
    <FormAreaBlockStyleWrapper>
      <SqlAuditFieldsSubTitleWrapper direction="vertical">
        <FormItemSubTitle>
          {t('dmsDataSource.dataSourceForm.sqlConfig')}
        </FormItemSubTitle>
        <Typography.Text type="secondary">
          {t('dmsDataSource.dataSourceForm.sqlConfigTips')}
        </Typography.Text>
      </SqlAuditFieldsSubTitleWrapper>
      <DataSourceSqlAuditConfigurationStyleWrapper>
        <FormItemLabel
          className="has-label-tip top-switch no-margin-field"
          label={
            <CustomLabelContent
              title={t('dmsDataSource.dataSourceForm.needAuditSqlService')}
              tips={t('dmsDataSource.dataSourceForm.needAuditSqlServiceTips')}
            />
          }
          name="needSqlAuditService"
          valuePropName="checked"
        >
          <ConfirmSwitch />
        </FormItemLabel>
        <EmptyBox if={needSqlAuditService}>
          <div className="audit-configuration-wrapper">
            <div className="audit-fields-wrapper">
              <FormItemLabel name="ruleTemplateId" hidden={true}>
                <BasicInput />
              </FormItemLabel>
              <FormItemLabel
                label={
                  <CustomLabelContent
                    title={t('dmsDataSource.dataSourceForm.ruleTemplate')}
                    tips={t('dmsDataSource.dataSourceForm.ruleTemplateTips')}
                  />
                }
                name="ruleTemplateName"
                className="has-required-style has-label-tip"
                rules={[
                  {
                    required: true,
                    message: t('common.form.placeholder.select', {
                      name: t('dmsDataSource.dataSourceForm.ruleTemplate')
                    })
                  }
                ]}
              >
                <BasicSelect
                  showSearch
                  allowClear
                  loading={getTemplateOptionsLoading}
                  placeholder={t('common.form.placeholder.select', {
                    name: t('dmsDataSource.dataSourceForm.ruleTemplate')
                  })}
                  onChange={(value, option) =>
                    changeRuleTemplate(value, option, 'ruleTemplateId')
                  }
                  options={ruleTemplateOptions}
                />
              </FormItemLabel>
              {/* #if [ee] */}
              <FormItemLabel name="dataExportRuleTemplateId" hidden={true}>
                <BasicInput />
              </FormItemLabel>
              <FormItemLabel
                label={
                  <CustomLabelContent
                    title={t(
                      'dmsDataSource.dataSourceForm.dataExportAuditRuleTemplate'
                    )}
                    tips={t(
                      'dmsDataSource.dataSourceForm.dataExportAuditRuleTemplateTips'
                    )}
                  />
                }
                name="dataExportRuleTemplateName"
                className="has-required-style has-label-tip"
                rules={[
                  {
                    required: true,
                    message: t('common.form.placeholder.select', {
                      name: t(
                        'dmsDataSource.dataSourceForm.dataExportAuditRuleTemplate'
                      )
                    })
                  }
                ]}
              >
                <BasicSelect
                  showSearch
                  allowClear
                  loading={getTemplateOptionsLoading}
                  placeholder={t('common.form.placeholder.select', {
                    name: t(
                      'dmsDataSource.dataSourceForm.dataExportAuditRuleTemplate'
                    )
                  })}
                  onChange={(value, option) =>
                    changeRuleTemplate(
                      value,
                      option,
                      'dataExportRuleTemplateId'
                    )
                  }
                  options={ruleTemplateOptions}
                />
              </FormItemLabel>
              {/* #endif */}
            </div>
            <div className="workbench-audit-fields">
              <FormItemLabel
                label={
                  <CustomLabelContent
                    title={t(
                      'dmsDataSource.dataSourceForm.needAuditForSqlQuery'
                    )}
                    tips={t(
                      'dmsDataSource.dataSourceForm.needAuditForSqlQueryTips'
                    )}
                  />
                }
                name="needAuditForSqlQuery"
                valuePropName="checked"
                className="has-label-tip last-switch no-margin-field"
              >
                <BasicSwitch onChange={onNeedAuditForSqlQueryChange} />
              </FormItemLabel>
              <EmptyBox if={needAuditForSqlQuery}>
                <div className="workbench-audit-content">
                  <FormItemLabel name="workbenchTemplateId" hidden={true}>
                    <BasicInput />
                  </FormItemLabel>
                  <FormItemLabel
                    label={t(
                      'dmsDataSource.dataSourceForm.workbenchAuditRuleTemplate'
                    )}
                    name="workbenchTemplateName"
                    rules={[
                      {
                        required: true
                      }
                    ]}
                    className="has-required-style"
                  >
                    <BasicSelect
                      showSearch
                      allowClear
                      loading={getTemplateOptionsLoading}
                      placeholder={t('common.form.placeholder.select', {
                        name: t(
                          'dmsDataSource.dataSourceForm.workbenchAuditRuleTemplate'
                        )
                      })}
                      onChange={(value, option) =>
                        changeRuleTemplate(value, option, 'workbenchTemplateId')
                      }
                      options={ruleTemplateOptions}
                    />
                  </FormItemLabel>
                  <FormItemLabel
                    label={
                      <CustomLabelContent
                        title={t(
                          'dmsDataSource.dataSourceForm.allowQueryWhenLessThanAuditLevel'
                        )}
                        tips={t(
                          'dmsDataSource.dataSourceForm.allowQueryWhenLessThanAuditLevelTips'
                        )}
                      />
                    }
                    name="allowQueryWhenLessThanAuditLevel"
                    rules={[
                      {
                        required: true,
                        message: t('common.form.placeholder.select', {
                          name: t(
                            'dmsDataSource.dataSourceForm.allowQueryWhenLessThanAuditLevel'
                          )
                        })
                      }
                    ]}
                    className="has-required-style has-label-tip no-margin-field"
                  >
                    <BasicSelect prefix={<FaLessThanEqualOutlined />}>
                      {Object.values(
                        SQLQueryConfigAllowQueryWhenLessThanAuditLevelEnum
                      ).map((v) => {
                        return (
                          <Select.Option key={v} value={v}>
                            {v}
                          </Select.Option>
                        );
                      })}
                    </BasicSelect>
                  </FormItemLabel>
                </div>
              </EmptyBox>
            </div>
          </div>
        </EmptyBox>
      </DataSourceSqlAuditConfigurationStyleWrapper>
    </FormAreaBlockStyleWrapper>
  );
};
export default SqlAuditFields;
