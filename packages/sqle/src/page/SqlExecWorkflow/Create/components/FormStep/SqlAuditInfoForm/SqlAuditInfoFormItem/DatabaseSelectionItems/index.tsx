import {
  FormItemLabel,
  FormItemNoLabel
} from '@actiontech/shared/lib/components/CustomForm';
import { useTranslation } from 'react-i18next';
import { DatabaseSelectionItemProps } from '../../index.type';
import { Divider, Form, Space, SelectProps } from 'antd';
import { useEffect, useMemo } from 'react';
import { useCurrentProject } from '@actiontech/shared/lib/features';
import useInstance from '../../../../../../../../hooks/useInstance';
import { getInstanceTipListV2FunctionalModuleEnum } from '@actiontech/shared/lib/api/sqle/service/instance/index.enum';
import useTestDatabaseConnect from './hooks/useTestDatabaseConnect';
import {
  SqlAuditInfoFormFields,
  SqlStatementFields
} from '../../../../../index.type';
import { CustomSelect } from '@actiontech/shared/lib/components/CustomSelect';
import useRenderDatabaseSelectionItems from './hooks/useRenderDatabaseSelectionItems';
import { BasicButton, useTypedQuery } from '@actiontech/shared';
import {
  DatabaseSchemaFilled,
  RingPieFilled,
  DatabaseFilled
} from '@actiontech/icons';
import { CommonIconStyleWrapper } from '@actiontech/shared/lib/styleWrapper/element';
import useThemeStyleData from '../../../../../../../../hooks/useThemeStyleData';
import { useSelector } from 'react-redux';
import { IReduxState } from '../../../../../../../../store';
import useCreationMode from '../../../../../hooks/useCreationMode';
import { SAME_SQL_MODE_DEFAULT_FIELD_KEY } from '../../../../../../Common/SqlStatementFormController/SqlStatementFormItem/index.data';
import { TRANSIT_FROM_CONSTANT } from '@actiontech/shared/lib/data/common';
import { decompressFromEncodedURIComponent } from 'lz-string';
import { jsonParse } from '@actiontech/shared/lib/utils/Common';
import useSetFormValuesWithGenModifiedSqlParams from './hooks/useSetFormValuesWithGenModifiedSqlParams';
import { ROUTE_PATHS } from '@actiontech/shared/lib/data/routePaths';

const DatabaseSelectionItem: React.FC<DatabaseSelectionItemProps> = ({
  handleInstanceNameChange,
  ...sharedStepDetail
}) => {
  const { t } = useTranslation();
  const form = Form.useFormInstance<SqlAuditInfoFormFields>();
  const { projectName } = useCurrentProject();
  const extractQueries = useTypedQuery();

  const { sqleTheme } = useThemeStyleData();

  const { isAssociationVersionMode } = useCreationMode();

  const { versionFirstStageInstances } = useSelector((state: IReduxState) => {
    return {
      versionFirstStageInstances:
        state.sqlExecWorkflow.versionFirstStageInstances
    };
  });

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
    loading: instanceTipsLoading,
    updateInstanceList,
    instanceOptions,
    instanceList
  } = useInstance();

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
    sqlStatementTabActiveKey: sharedStepDetail.sqlStatementTabActiveKey,
    instanceList
  });

  useSetFormValuesWithGenModifiedSqlParams({
    form,
    handleInstanceChange,
    handleInstanceSchemaChange,
    handleInstanceNameChange,
    setGetModifiedSQLsPending: sharedStepDetail.getModifiedSQLsPending.set
  });

  const versionFirstStageInstanceOptions = useMemo(() => {
    const newOptions: SelectProps['options'] = [];
    instanceOptions.forEach((item) => {
      if (
        item.options.some((i) =>
          versionFirstStageInstances?.some(
            (instance) => instance.instances_name === i.value
          )
        )
      ) {
        newOptions.push({
          ...item,
          options: item.options.filter((i) =>
            versionFirstStageInstances?.some(
              (instance) => instance.instances_name === i.value
            )
          )
        });
      }
    });
    return newOptions;
  }, [instanceOptions, versionFirstStageInstances]);

  useEffect(() => {
    updateInstanceList({
      project_name: projectName,
      functional_module:
        getInstanceTipListV2FunctionalModuleEnum.create_workflow
    });
  }, [projectName, updateInstanceList]);

  useEffect(() => {
    const searchParams = extractQueries(
      ROUTE_PATHS.SQLE.SQL_EXEC_WORKFLOW.create
    );
    if (searchParams) {
      const compressionData = searchParams?.compression_data;
      const from = searchParams?.from;

      // 处理从 cloud_beaver 跳转至创建工单的情况
      if (
        from &&
        compressionData &&
        Object.values(TRANSIT_FROM_CONSTANT).includes(from)
      ) {
        try {
          // 存在即使压缩后的字符长度依旧超出浏览器地址栏的长度限制，导致解压缩失败的场景。
          const { instanceName, schema, sql } = jsonParse<{
            instanceName: string;
            schema: string;
            sql: string;
          }>(decompressFromEncodedURIComponent(compressionData));

          form.setFieldsValue({
            databaseInfo: [{ instanceName, instanceSchema: schema }],
            [SAME_SQL_MODE_DEFAULT_FIELD_KEY]: {
              form_data: sql
            } as SqlStatementFields
          });
          handleInstanceNameChange?.(instanceName);
          handleInstanceChange(SAME_SQL_MODE_DEFAULT_FIELD_KEY, instanceName);
          if (schema) {
            handleInstanceSchemaChange(SAME_SQL_MODE_DEFAULT_FIELD_KEY, schema);
          }
        } catch (error) {
          // eslint-disable-next-line no-console
          console.error(error);
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [extractQueries, form]);

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
                  <Space
                    className="database-list-item"
                    key={field.key}
                    direction="vertical"
                    size={0}
                  >
                    <Space align="start" size={12}>
                      <FormItemNoLabel
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
                                color={
                                  sqleTheme.icon.execWorkFlow.databaseFilled
                                }
                              />
                            </CommonIconStyleWrapper>
                          }
                          size="middle"
                          loading={instanceTipsLoading}
                          options={
                            isAssociationVersionMode
                              ? versionFirstStageInstanceOptions
                              : instanceOptions
                          }
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
                    <section className="database-connection-info">
                      {renderTestDatabasesConnectInfo(
                        form.getFieldValue([
                          'databaseInfo',
                          field.name,
                          'instanceName'
                        ])
                      )}
                    </section>
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
