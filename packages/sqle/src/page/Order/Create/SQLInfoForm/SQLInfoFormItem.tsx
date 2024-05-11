import { useTranslation } from 'react-i18next';
import DatabaseInfo from './DatabaseInfo';
import { SQLInfoFormItemProps } from './index.type';
import { useCallback, useEffect, useMemo, useRef } from 'react';
import {
  CreateAuditTasksGroupReqV1ExecModeEnum,
  WorkflowResV2ModeEnum
} from '@actiontech/shared/lib/api/sqle/service/common.enum';
import {
  FormItemLabel,
  FormItemNoLabel,
  FormItemSubTitle
} from '@actiontech/shared/lib/components/FormCom';
import {
  BasicButton,
  BasicSwitch,
  BasicToolTips,
  EmptyBox,
  ModeSwitcher
} from '@actiontech/shared';
import { Space, SwitchProps } from 'antd';
import SQLStatementFormTabs from '../../SQLStatementForm/SQLStatementFormTabs';
import {
  SQLInputType,
  SQLStatementFields,
  SQLStatementFormTabsRefType
} from '../../SQLStatementForm';
import instance from '@actiontech/shared/lib/api/sqle/service/instance';
import SQLStatementForm from '../../SQLStatementForm/SQLStatementForm';
import { IconTipGray } from '@actiontech/shared/lib/Icon';
import EventEmitter from '../../../../utils/EventEmitter';
import EmitterKey from '../../../../data/EmitterKey';
import { IconEllipse } from '@actiontech/shared/lib/Icon/common';
import {
  FormatLanguageSupport,
  formatterSQL
} from '@actiontech/shared/lib/utils/FormatterSQL';
import { sqlExecuteModeOptions } from './index.data';

const SQLInfoFormItem: React.FC<SQLInfoFormItemProps> = ({
  form,
  projectID,
  projectName,
  setInstanceInfo,
  instanceNameChange,
  instanceInfo,
  submit,
  auditLoading,
  changeSqlModeDisabled,
  setChangeSqlModeDisabled,
  currentSqlMode,
  setCurrentSqlMode,
  isSupportFileModeExecuteSQL,
  setIsSupportFileModeExecuteSQL,
  sqlInputTypeMap,
  setSqlInputTypeMap,
  differentModeActiveKey,
  setDifferentModeActiveKey,
  ...otherProps
}) => {
  const { t } = useTranslation();

  const internalSubmit = useCallback(async () => {
    const params = await form.validateFields();
    submit(params);
  }, [form, submit]);

  const SQLStatementInfo = useMemo(() => {
    return Array.from(instanceInfo)
      .filter(([_, { instanceName }]) => !!instanceName)
      .map(([key, { instanceName, instanceSchemaName }]) => {
        return {
          key: `${key}`,
          instanceName: instanceName,
          instanceSchemaName: instanceSchemaName
        };
      });
  }, [instanceInfo]);
  const sqlStatementFormTabsRef = useRef<SQLStatementFormTabsRefType>(null);

  const setChangeSqlModeDisabledAndSetValue = useCallback(
    (disabled: boolean) => {
      setChangeSqlModeDisabled(disabled);
      if (disabled) {
        form.setFieldsValue({
          isSameSqlOrder: false
        });
        setCurrentSqlMode(WorkflowResV2ModeEnum.different_sqls);
      }
    },
    [form, setChangeSqlModeDisabled, setCurrentSqlMode]
  );

  const currentOrderModeChange: SwitchProps['onChange'] = (flag) => {
    setCurrentSqlMode(
      flag
        ? WorkflowResV2ModeEnum.same_sqls
        : WorkflowResV2ModeEnum.different_sqls
    );
  };

  const formatSql = async () => {
    const params = await form.getFieldsValue();
    const getInstanceType = (name: string) => {
      return instance
        .getInstanceV2({
          project_name: projectName,
          instance_name: name
        })
        .then((res) => res.data.data);
    };
    if (currentSqlMode === WorkflowResV2ModeEnum.same_sqls) {
      const SQLStatementValue = params['0'] as SQLStatementFields;
      const instanceName = params.dataBaseInfo[0].instanceName;
      if (SQLStatementValue?.sqlInputType !== SQLInputType.manualInput) {
        return;
      }
      if (instanceName) {
        getInstanceType(instanceName).then((res) => {
          form.setFields([
            {
              name: ['0', 'sql'],
              value: formatterSQL(SQLStatementValue.sql, res?.db_type)
            }
          ]);
        });
      } else {
        form.setFields([
          {
            name: ['0', 'sql'],
            value: formatterSQL(SQLStatementValue.sql)
          }
        ]);
      }
    } else {
      const SQLStatementValue = params[
        sqlStatementFormTabsRef.current?.activeKey ?? ''
      ] as SQLStatementFields;

      const instanceName = params.dataBaseInfo.filter((v) => v.instanceName)[
        sqlStatementFormTabsRef.current?.activeIndex ?? 0
      ].instanceName;
      if (SQLStatementValue?.sqlInputType !== SQLInputType.manualInput) {
        return;
      }

      if (instanceName) {
        getInstanceType(instanceName).then((res) => {
          form.setFields([
            {
              name: [sqlStatementFormTabsRef.current?.activeKey ?? '', 'sql'],
              value: formatterSQL(SQLStatementValue.sql, res?.db_type)
            }
          ]);
        });
      } else {
        form.setFields([
          {
            name: [sqlStatementFormTabsRef.current?.activeKey ?? '', 'sql'],
            value: formatterSQL(SQLStatementValue.sql)
          }
        ]);
      }
    }
  };
  const currentSQLInputType = useMemo(() => {
    return sqlInputTypeMap.get(differentModeActiveKey || '0');
  }, [differentModeActiveKey, sqlInputTypeMap]);

  useEffect(() => {
    const resetAlreadySubmit = () => {
      setInstanceInfo(new Map([[0, { instanceName: '' }]]));
      setCurrentSqlMode(WorkflowResV2ModeEnum.same_sqls);
      setChangeSqlModeDisabled(false);
      setIsSupportFileModeExecuteSQL(false);
    };
    EventEmitter.subscribe(
      EmitterKey.Reset_Create_Order_Form,
      resetAlreadySubmit
    );
    return () => {
      EventEmitter.unsubscribe(
        EmitterKey.Reset_Create_Order_Form,
        resetAlreadySubmit
      );
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <DatabaseInfo
        form={form}
        projectID={projectID}
        projectName={projectName}
        setInstanceInfo={setInstanceInfo}
        instanceNameChange={instanceNameChange}
        setChangeSqlModeDisabled={setChangeSqlModeDisabledAndSetValue}
        setIsSupportFileModeExecuteSQL={setIsSupportFileModeExecuteSQL}
        setSqlInputTypeMap={setSqlInputTypeMap}
        {...otherProps}
      />
      <FormItemLabel
        // #if [ce]
        hidden={true}
        // #endif
        name="isSameSqlOrder"
        valuePropName="checked"
        initialValue={!changeSqlModeDisabled}
        className="has-label-tip"
        label={
          <div className="label-cont-custom">
            <div>
              <IconEllipse />
              <span>{t('order.sqlInfo.isSameSqlOrder')}</span>
            </div>
            <div className="tip-content-box">
              {t('order.sqlInfo.orderModeTips')}
            </div>
          </div>
        }
        labelCol={{ span: 22 }}
        wrapperCol={{ span: 2 }}
      >
        <BasicSwitch
          onChange={currentOrderModeChange}
          disabled={changeSqlModeDisabled}
        />
      </FormItemLabel>

      <FormItemLabel
        label={
          <>
            <IconEllipse />
            <span>{t('order.sqlInfo.uploadType')}</span>
          </>
        }
        style={{ marginBottom: 16 }}
      />

      {/* #if [ee] */}
      <EmptyBox
        if={WorkflowResV2ModeEnum.same_sqls === currentSqlMode}
        defaultNode={
          <SQLStatementFormTabs
            ref={sqlStatementFormTabsRef}
            form={form}
            isClearFormWhenChangeSqlType={true}
            SQLStatementInfo={SQLStatementInfo}
            sqlInputTypeMap={sqlInputTypeMap}
            setSqlInputTypeMap={setSqlInputTypeMap}
            tabsChangeHandle={setDifferentModeActiveKey}
            activeKey={differentModeActiveKey}
          />
        }
      >
        <SQLStatementForm
          form={form}
          isClearFormWhenChangeSqlType={true}
          setSqlInputTypeMap={setSqlInputTypeMap}
          sqlInputTypeMap={sqlInputTypeMap}
        />
      </EmptyBox>

      <EmptyBox
        if={
          isSupportFileModeExecuteSQL &&
          currentSQLInputType !== SQLInputType.manualInput
        }
      >
        <FormItemSubTitle>
          {t('order.sqlInfo.selectExecuteMode')}
        </FormItemSubTitle>
        <FormItemNoLabel
          name="executeMode"
          initialValue={CreateAuditTasksGroupReqV1ExecModeEnum.sqls}
        >
          <ModeSwitcher
            rowProps={{ gutter: 10 }}
            options={sqlExecuteModeOptions}
          />
        </FormItemNoLabel>
      </EmptyBox>

      {/* #else */}
      <SQLStatementForm
        form={form}
        isClearFormWhenChangeSqlType={true}
        setSqlInputTypeMap={setSqlInputTypeMap}
        sqlInputTypeMap={sqlInputTypeMap}
      />

      {/* #endif */}

      <FormItemNoLabel>
        <Space size={12}>
          <BasicButton
            onClick={internalSubmit}
            type="primary"
            loading={auditLoading}
          >
            {t('order.sqlInfo.audit')}
          </BasicButton>
          <BasicButton
            hidden={currentSQLInputType !== SQLInputType.manualInput}
            onClick={formatSql}
            loading={auditLoading}
          >
            {t('order.sqlInfo.format')}
          </BasicButton>
          {currentSQLInputType === SQLInputType.manualInput && (
            <BasicToolTips
              prefixIcon={<IconTipGray />}
              title={t('order.sqlInfo.formatTips', {
                supportType: Object.keys(FormatLanguageSupport).join('、')
              })}
            />
          )}
        </Space>
      </FormItemNoLabel>
    </>
  );
};

export default SQLInfoFormItem;
