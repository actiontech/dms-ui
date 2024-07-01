import {
  FormItemLabel,
  FormItemNoLabel
} from '@actiontech/shared/lib/components/FormCom';
import { useTranslation } from 'react-i18next';
import { DatabaseSelectionItemProps } from '../../index.type';
import { Divider, Form, Space } from 'antd';
import { useEffect } from 'react';
import { useCurrentProject } from '@actiontech/shared/lib/global';
import useInstance from '../../../../../../../../hooks/useInstance';
import { getInstanceTipListV1FunctionalModuleEnum } from '@actiontech/shared/lib/api/sqle/service/instance/index.enum';
import useTestDatabaseConnect from './hooks/useTestDatabaseConnect';
import { SqlAuditInfoFormFields } from '../../../../../index.type';
import { CustomSelect } from '@actiontech/shared/lib/components/CustomSelect';
import useRenderDatabaseSelectionItems from './hooks/useRenderDatabaseSelectionItems';
import { BasicButton } from '@actiontech/shared';
import {
  DatabaseSchemaFilled,
  RingPieFilled,
  DatabaseFilled
} from '@actiontech/icons';
import { CommonIconStyleWrapper } from '@actiontech/shared/lib/styleWrapper/element';
import useThemeStyleData from '../../../../../../../../hooks/useThemeStyleData';

const DatabaseSelectionItem: React.FC<DatabaseSelectionItemProps> = ({
  handleInstanceNameChange,
  ...sharedStepDetail
}) => {
  const { t } = useTranslation();
  const form = Form.useFormInstance<SqlAuditInfoFormFields>();
  const { projectName } = useCurrentProject();

  const { sqleTheme } = useThemeStyleData();

  const {
    testDatabaseConnect,
    testLoading,
    renderTestDatabasesConnectInfo,
    disabledTestConnect
  } = useTestDatabaseConnect({
    databaseInfo: Form.useWatch('databaseInfo', form),
    instanceTestConnectResults: sharedStepDetail.instanceTestConnectResults
  });

  const {
    handleInstanceChange,
    handleInstanceSchemaChange,
    getInstanceSchemaOptions,
    getInstanceSchemaLoading,
    renderRuleTemplateDisplay,
    renderDeleteItemButton,
    renderAddItemButton
  } = useRenderDatabaseSelectionItems({
    dbSourceInfoCollection: sharedStepDetail.dbSourceInfoCollection,
    sqlStatementTabActiveKey: sharedStepDetail.sqlStatementTabActiveKey
  });

  const {
    loading: instanceTipsLoading,
    updateInstanceList,
    instanceOptions
  } = useInstance();

  useEffect(() => {
    updateInstanceList({
      project_name: projectName,
      functional_module:
        getInstanceTipListV1FunctionalModuleEnum.create_workflow
    });
  }, [projectName, updateInstanceList]);

  return (
    <>
      <FormItemLabel
        className="has-required-style form-item-label-mb-16"
        label={
          <>
            <RingPieFilled className="custom-icon-ellipse" />
            <span>{t('execWorkflow.create.form.sqlInfo.instanceName')}</span>
          </>
        }
      />

      <Form.List name="databaseInfo" initialValue={[{}]}>
        {(fields, { remove, add }) => {
          return (
            <>
              {fields.map((field, index) => {
                const fieldKey = field.key.toString();
                return (
                  <Space key={field.key} align="start" size={12}>
                    <FormItemNoLabel
                      extra={renderTestDatabasesConnectInfo(
                        form.getFieldValue([
                          'databaseInfo',
                          field.name,
                          'instanceName'
                        ])
                      )}
                      name={[field.name, 'instanceName']}
                      rules={[
                        {
                          required: true,
                          message: t('common.form.placeholder.input', {
                            name: t(
                              'execWorkflow.create.form.sqlInfo.instanceName'
                            )
                          })
                        }
                      ]}
                    >
                      <CustomSelect
                        allowClear={false}
                        popupMatchSelectWidth
                        className="data-source-row-select"
                        prefix={
                          <CommonIconStyleWrapper>
                            <DatabaseFilled width={18} height={18} />
                          </CommonIconStyleWrapper>
                        }
                        valuePrefix={
                          <CommonIconStyleWrapper>
                            <DatabaseFilled
                              width={18}
                              height={18}
                              color={sqleTheme.icon.execWorkFlow.databaseFilled}
                            />
                          </CommonIconStyleWrapper>
                        }
                        size="middle"
                        loading={instanceTipsLoading}
                        options={instanceOptions}
                        onChange={(name) => {
                          form.setFieldValue(
                            ['databaseInfo', field.name, 'instanceSchema'],
                            undefined
                          );
                          handleInstanceNameChange?.(name);
                          handleInstanceChange(fieldKey, name);
                        }}
                      />
                    </FormItemNoLabel>

                    <FormItemNoLabel name={[field.name, 'instanceSchema']}>
                      <CustomSelect
                        className="data-source-row-select"
                        disabled={
                          !form.getFieldValue('databaseInfo')?.[index]
                            ?.instanceName
                        }
                        onChange={(value) =>
                          handleInstanceSchemaChange(fieldKey, value)
                        }
                        prefix={
                          <CommonIconStyleWrapper>
                            <DatabaseSchemaFilled width={18} height={18} />
                          </CommonIconStyleWrapper>
                        }
                        valuePrefix={
                          <CommonIconStyleWrapper>
                            <DatabaseSchemaFilled
                              width={18}
                              height={18}
                              color={sqleTheme.icon.execWorkFlow.schemaFilled}
                            />
                          </CommonIconStyleWrapper>
                        }
                        size="middle"
                        options={getInstanceSchemaOptions(fieldKey)}
                        placeholder={t(
                          'execWorkflow.create.form.sqlInfo.schemaPlaceholder'
                        )}
                        loading={!!getInstanceSchemaLoading(fieldKey)}
                      />
                    </FormItemNoLabel>

                    <Divider
                      className="data-source-row-divider"
                      type="vertical"
                    />

                    {renderRuleTemplateDisplay(fieldKey)}

                    {/* #if [ee] */}
                    {renderDeleteItemButton(
                      fields,
                      fieldKey,
                      remove.bind(null, field.name)
                    )}
                    {/* #endif */}
                  </Space>
                );
              })}

              <FormItemNoLabel>
                <Space size={12} align="start">
                  {/* #if [ee] */}
                  {renderAddItemButton(fields, add.bind(null, {}))}
                  {/* #endif */}

                  <BasicButton
                    loading={testLoading}
                    onClick={testDatabaseConnect}
                    disabled={testLoading || disabledTestConnect}
                  >
                    {t(
                      'common.testDatabaseConnectButton.testDatabaseConnection'
                    )}
                  </BasicButton>
                </Space>
              </FormItemNoLabel>
            </>
          );
        }}
      </Form.List>
    </>
  );
};

export default DatabaseSelectionItem;
