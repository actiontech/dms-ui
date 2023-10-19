import { useTranslation } from 'react-i18next';
import DatabaseInfo from './DatabaseInfo';
import { SQLInfoFormItemProps } from './index.type';
import { useCallback, useEffect, useMemo, useRef } from 'react';
import { WorkflowResV2ModeEnum } from '@actiontech/shared/lib/api/sqle/service/common.enum';
import {
  FormItemLabel,
  FormItemNoLabel
} from '@actiontech/shared/lib/components/FormCom';
import {
  BasicButton,
  BasicSwitch,
  BasicToolTips,
  EmptyBox
} from '@actiontech/shared';
import { Space, SwitchProps } from 'antd5';
import SQLStatementFormTabs from '../../SQLStatementForm/SQLStatementFormTabs';
import {
  SQLInputType,
  SQLStatementFields,
  SQLStatementFormTabsRefType
} from '../../SQLStatementForm';
import instance from '@actiontech/shared/lib/api/sqle/service/instance';
import {
  FormatLanguageSupport,
  formatterSQL
} from '../../../../utils/FormatterSQL';
import SQLStatementForm from '../../SQLStatementForm/SQLStatementForm';
import { IconTipGray } from '@actiontech/shared/lib/Icon';
import EventEmitter from '../../../../utils/EventEmitter';
import EmitterKey from '../../../../data/EmitterKey';
import { IconEllipse } from '@actiontech/shared/lib/Icon/common';

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
      const SQLStatementInfo = params['0'] as SQLStatementFields;
      const instanceName = params.dataBaseInfo[0].instanceName;
      if (SQLStatementInfo?.sqlInputType !== SQLInputType.manualInput) {
        return;
      }
      if (instanceName) {
        getInstanceType(instanceName).then((res) => {
          form.setFields([
            {
              name: ['0', 'sql'],
              value: formatterSQL(SQLStatementInfo.sql, res?.db_type)
            }
          ]);
        });
      } else {
        form.setFields([
          {
            name: ['0', 'sql'],
            value: formatterSQL(SQLStatementInfo.sql)
          }
        ]);
      }
    } else {
      const SQLStatementInfo = params[
        sqlStatementFormTabsRef.current?.activeKey ?? ''
      ] as SQLStatementFields;

      const instanceName = params.dataBaseInfo.filter((v) => v.instanceName)[
        sqlStatementFormTabsRef.current?.activeIndex ?? 0
      ].instanceName;
      if (SQLStatementInfo?.sqlInputType !== SQLInputType.manualInput) {
        return;
      }

      if (instanceName) {
        getInstanceType(instanceName).then((res) => {
          form.setFields([
            {
              name: [sqlStatementFormTabsRef.current?.activeKey ?? '', 'sql'],
              value: formatterSQL(SQLStatementInfo.sql, res?.db_type)
            }
          ]);
        });
      } else {
        form.setFields([
          {
            name: [sqlStatementFormTabsRef.current?.activeKey ?? '', 'sql'],
            value: formatterSQL(SQLStatementInfo.sql)
          }
        ]);
      }
    }
  };

  useEffect(() => {
    const resetAlreadySubmit = () => {
      setInstanceInfo(new Map([[0, { instanceName: '' }]]));
      setCurrentSqlMode(WorkflowResV2ModeEnum.same_sqls);
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
        {...otherProps}
      />
      <FormItemLabel
        /* IFTRUE_isCE */
        hidden={true}
        /* FITRUE_isCE */
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

      {/* IFTRUE_isEE */}
      <EmptyBox
        if={WorkflowResV2ModeEnum.same_sqls === currentSqlMode}
        defaultNode={
          <SQLStatementFormTabs
            ref={sqlStatementFormTabsRef}
            form={form}
            isClearFormWhenChangeSqlType={true}
            SQLStatementInfo={SQLStatementInfo}
          />
        }
      >
        {/* FITRUE_isEE */}

        <SQLStatementForm form={form} isClearFormWhenChangeSqlType={true} />

        {/* IFTRUE_isEE */}
      </EmptyBox>
      {/* FITRUE_isEE */}

      <FormItemNoLabel>
        <Space size={12}>
          <BasicButton
            onClick={internalSubmit}
            type="primary"
            loading={auditLoading}
          >
            {t('order.sqlInfo.audit')}
          </BasicButton>
          <BasicButton onClick={formatSql} loading={auditLoading}>
            {t('order.sqlInfo.format')}
          </BasicButton>
          <BasicToolTips
            prefixIcon={<IconTipGray />}
            title={t('order.sqlInfo.formatTips', {
              supportType: Object.keys(FormatLanguageSupport).join('、')
            })}
          />
        </Space>
      </FormItemNoLabel>
    </>
  );
};

export default SQLInfoFormItem;
