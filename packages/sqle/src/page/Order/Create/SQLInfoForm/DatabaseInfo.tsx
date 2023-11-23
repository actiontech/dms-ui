import { useTranslation } from 'react-i18next';
import { DatabaseInfoProps } from './index.type';
import { Divider, Form, FormListFieldData, Space } from 'antd';
import { FormItemLabel } from '@actiontech/shared/lib/components/FormCom';
import { FormItemNoLabel } from '@actiontech/shared/lib/components/FormCom';
import {
  CustomSelect,
  CustomSelectProps
} from '@actiontech/shared/lib/components/CustomSelect';
import useInstance from '../../../../hooks/useInstance';
import { useCallback, useEffect, useRef, useState } from 'react';
import {
  IconDatabase,
  IconDatabaseActive,
  IconDatabaseSchema,
  IconDatabaseSchemaActive,
  IconDelete,
  IconDeleteActive,
  IconEllipse,
  IconFillList,
  IconFillListActive
} from '@actiontech/shared/lib/Icon/common';
import { cloneDeep } from 'lodash';
import instance from '@actiontech/shared/lib/api/sqle/service/instance';
import { ResponseCode } from '@actiontech/shared/lib/enum';
import { BasicButton, BasicToolTips } from '@actiontech/shared';
import { Link } from 'react-router-dom';
import EventEmitter from '../../../../utils/EventEmitter';
import EmitterKey from '../../../../data/EmitterKey';
import useTestDatabaseConnect from '../hooks/useTestDatabaseConnect';

const DatabaseInfo: React.FC<DatabaseInfoProps> = ({
  form,
  projectID,
  projectName,
  setInstanceInfo,
  instanceNameChange,
  setChangeSqlModeDisabled,
  schemaList,
  setSchemaList,
  ruleTemplates,
  setRuleTemplates
}) => {
  const { t } = useTranslation();
  const [getSchemaListLoading, setGetSchemaListLoading] = useState<
    Map<number, boolean>
  >(new Map([]));

  const {
    testDatabaseConnect,
    testLoading,
    renderTestDatabasesConnectInfo,
    disabledTestConnect
  } = useTestDatabaseConnect({ projectName, form });

  const instanceTypeMap = useRef<Map<number, string>>(new Map());

  const {
    loading: instanceTipsLoading,
    updateInstanceList,
    instanceOptions,
    instanceList
  } = useInstance();

  const instanceSchemaOptions: (index: number) => CustomSelectProps['options'] =
    useCallback(
      (index: number) => {
        return schemaList.get(index)?.map((v) => {
          return {
            label: v,
            value: v
          };
        });
      },
      [schemaList]
    );

  const updateSchemaList = (name: string, fieldKey: number) => {
    setGetSchemaListLoading((values) => {
      values.set(fieldKey, true);
      return new Map(values);
    });
    instance
      .getInstanceSchemasV1({
        instance_name: name,
        project_name: projectName
      })
      .then((res) => {
        if (res.data.code === ResponseCode.SUCCESS) {
          setSchemaList((values) => {
            const cloneValue = cloneDeep(values);
            cloneValue.set(fieldKey, res.data.data?.schema_name_list ?? []);
            return cloneValue;
          });
        }
      })
      .finally(() => {
        setGetSchemaListLoading((values) => {
          values.set(fieldKey, false);
          return new Map(values);
        });
      });
  };

  const updateRuleTemplateName = (name: string, fieldKey: number) => {
    instance
      .getInstanceV2({ instance_name: name, project_name: projectName })
      .then((res) => {
        if (res.data.code === ResponseCode.SUCCESS) {
          setRuleTemplates((values) => {
            const cloneValue = cloneDeep(values);
            cloneValue.set(fieldKey, {
              dbType: res.data.data?.db_type ?? '',
              ...res.data.data?.rule_template
            });
            return cloneValue;
          });
        }
      });
  };

  const getInstanceTypeWithAction = (
    key: number,
    type: 'add' | 'remove',
    instanceType = ''
  ) => {
    if (type === 'add') {
      instanceTypeMap.current.set(key, instanceType);
    } else if (type === 'remove') {
      instanceTypeMap.current.delete(key);
    }
    const instanceTypeSet = new Set(instanceTypeMap.current.values());
    const isExistDifferentInstanceType = instanceTypeSet.size > 1;
    setChangeSqlModeDisabled(isExistDifferentInstanceType);
  };

  const handleInstanceNameChange = (name: string, fieldKey: number) => {
    setInstanceInfo((values) => {
      const cloneValue = cloneDeep(values);
      cloneValue.set(fieldKey, { instanceName: name });
      return cloneValue;
    });

    instanceNameChange?.(name);
    updateSchemaList(name, fieldKey);
    updateRuleTemplateName(name, fieldKey);
    const currentInstance = instanceList.find((v) => v.instance_name === name);

    getInstanceTypeWithAction(fieldKey, 'add', currentInstance?.instance_type);
  };

  const handleInstanceSchemaChange = (name: string, fieldKey: number) => {
    setInstanceInfo((values) => {
      const cloneValue = cloneDeep(values);
      const currentInstanceName = values.get(fieldKey)?.instanceName ?? '';
      cloneValue.set(fieldKey, {
        instanceName: currentInstanceName,
        instanceSchemaName: name
      });
      return cloneValue;
    });
  };

  const renderRuleTemplateDisplay = useCallback(
    (fieldKey: number) => {
      const rule = ruleTemplates.get(fieldKey);
      if (!rule) {
        return (
          <BasicButton style={{ width: 36, height: 36 }}>
            <IconFillList />
          </BasicButton>
        );
      }

      const path = rule.is_global_rule_template
        ? `/sqle/ruleManager/globalDetail/${rule.name}/${rule.dbType}`
        : `/sqle/project/${projectID}/rule/template/detail/${rule.name}/${rule.dbType}`;

      return (
        <BasicToolTips
          title={
            <Link to={path}>
              {t('rule.form.ruleTemplate')}: {rule.name}
            </Link>
          }
        >
          <BasicButton style={{ width: 36, height: 36 }}>
            <IconFillListActive />
          </BasicButton>
        </BasicToolTips>
      );
    },
    [projectID, ruleTemplates, t]
  );

  const addDataSource = (fields: FormListFieldData[]) => {
    form.setFieldsValue({
      dataBaseInfo: [...(form.getFieldValue('dataBaseInfo') ?? []), {}]
    });
    setInstanceInfo((values) => {
      const cloneValue = cloneDeep(values);
      cloneValue.set(fields[fields.length - 1].key + 1, { instanceName: '' });
      return cloneValue;
    });
  };

  useEffect(() => {
    updateInstanceList({ project_name: projectName });
  }, [projectName, updateInstanceList]);

  useEffect(() => {
    const resetState = () => {
      setRuleTemplates(new Map([[0, undefined]]));
      setSchemaList(new Map([[0, []]]));
    };
    const { unsubscribe } = EventEmitter.subscribe(
      EmitterKey.Reset_Create_Order_Form,
      resetState
    );

    return unsubscribe;
  }, [setRuleTemplates, setSchemaList]);

  return (
    <>
      <FormItemLabel
        className="has-required-style"
        label={
          <>
            <IconEllipse />
            <span>{t('order.order.dataSource')}</span>
          </>
        }
        style={{ marginBottom: 16 }}
      />

      <Form.List name="dataBaseInfo" initialValue={[{}]}>
        {(fields, { remove }) => {
          const removeItem = (field: FormListFieldData, index: number) => {
            if (fields.length <= 1) {
              return;
            }
            setInstanceInfo((values) => {
              const cloneValue = cloneDeep(values);
              cloneValue.delete(field.key);
              return cloneValue;
            });
            getInstanceTypeWithAction(field.key, 'remove');
            remove(index);
            setSchemaList((values) => {
              const cloneValue = cloneDeep(values);
              cloneValue.delete(field.key);
              return cloneValue;
            });
            setRuleTemplates((values) => {
              const cloneValue = cloneDeep(values);
              cloneValue.delete(field.key);
              return cloneValue;
            });
          };
          return (
            <>
              {fields.map((field, index) => {
                return (
                  <Space key={field.key} align="start" size={12}>
                    <FormItemNoLabel
                      extra={renderTestDatabasesConnectInfo(
                        form.getFieldValue('dataBaseInfo')?.[index]
                          ?.instanceName ?? ''
                      )}
                      name={[field.name, 'instanceName']}
                      rules={[
                        {
                          required: true,
                          message: t('common.form.placeholder.input', {
                            name: t('order.order.dataSource')
                          })
                        }
                      ]}
                    >
                      <CustomSelect
                        className="data-source-row-select"
                        allowClear={false}
                        prefix={<IconDatabase />}
                        valuePrefix={<IconDatabaseActive />}
                        size="middle"
                        loading={instanceTipsLoading}
                        options={instanceOptions}
                        onChange={(value) =>
                          handleInstanceNameChange(value, field.key)
                        }
                      />
                    </FormItemNoLabel>

                    <FormItemNoLabel name={[field.name, 'instanceSchema']}>
                      <CustomSelect
                        className="data-source-row-select"
                        disabled={
                          !form.getFieldValue('dataBaseInfo')?.[index]
                            ?.instanceName
                        }
                        onChange={(value) =>
                          handleInstanceSchemaChange(value, field.key)
                        }
                        prefix={<IconDatabaseSchema />}
                        valuePrefix={<IconDatabaseSchemaActive />}
                        size="middle"
                        options={instanceSchemaOptions(field.name)}
                        placeholder={t('order.order.schemaPlaceholder')}
                        loading={!!getSchemaListLoading.get(field.key)}
                      />
                    </FormItemNoLabel>

                    <Divider
                      className="data-source-row-divider"
                      type="vertical"
                    />

                    {renderRuleTemplateDisplay(field.key)}

                    {/* IFTRUE_isEE */}
                    <BasicButton
                      className="data-source-row-button data-source-col-delete-button"
                      onClick={() => removeItem(field, index)}
                    >
                      {fields.length > 1 ? (
                        <IconDeleteActive />
                      ) : (
                        <IconDelete />
                      )}
                    </BasicButton>
                    {/* FITRUE_isEE */}
                  </Space>
                );
              })}

              <FormItemNoLabel>
                <Space size={12} align="start">
                  {/* IFTRUE_isEE */}
                  <BasicButton
                    onClick={() => addDataSource(fields)}
                    type="primary"
                    disabled={fields.length >= 10}
                  >
                    {t('order.sqlInfo.addInstance')}
                  </BasicButton>
                  {/* FITRUE_isEE */}

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

export default DatabaseInfo;
