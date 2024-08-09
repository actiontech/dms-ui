import instance from '@actiontech/shared/lib/api/sqle/service/instance';
import { DatabaseSelectionItemProps } from '../../../index.type';
import { useCurrentProject } from '@actiontech/shared/lib/global';
import { ResponseCode } from '@actiontech/shared/lib/enum';
import { BasicButton, BasicToolTips } from '@actiontech/shared';
import { MinusCircleFilled, ProfileSquareFilled } from '@actiontech/icons';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FormListFieldData } from 'antd';
import system from '@actiontech/shared/lib/api/sqle/service/system';
import {
  getSystemModuleStatusDbTypeEnum,
  getSystemModuleStatusModuleNameEnum
} from '@actiontech/shared/lib/api/sqle/service/system/index.enum';
import useThemeStyleData from '../../../../../../../../../hooks/useThemeStyleData';
import useCreationMode from '../../../../../../hooks/useCreationMode';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { IReduxState } from '../../../../../../../../../store';

const useRenderDatabaseSelectionItems = ({
  dbSourceInfoCollection,
  sqlStatementTabActiveKey
}: Pick<
  DatabaseSelectionItemProps,
  'dbSourceInfoCollection' | 'sqlStatementTabActiveKey'
>) => {
  const { t } = useTranslation();
  const { projectName, projectID } = useCurrentProject();
  const { sqleTheme } = useThemeStyleData();

  const { isCloneMode } = useCreationMode();

  const sqlExecWorkflowReduxState = useSelector((state: IReduxState) => {
    return {
      clonedExecWorkflowSqlAuditInfo:
        state.sqlExecWorkflow.clonedExecWorkflowSqlAuditInfo
    };
  });

  useEffect(() => {
    if (isCloneMode) {
      sqlExecWorkflowReduxState.clonedExecWorkflowSqlAuditInfo?.databaseInfo?.forEach(
        (database, index) => {
          const key = `${index}`;
          handleInstanceChange(key, database.instanceName);
          handleInstanceSchemaChange(key, database.instanceSchema);
        }
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const updateSchemaList = async (key: string, instanceName: string) => {
    instance
      .getInstanceSchemasV1({
        instance_name: instanceName,
        project_name: projectName
      })
      .then((res) => {
        if (res.data.code === ResponseCode.SUCCESS) {
          dbSourceInfoCollection.set(key, {
            schemaList: res.data.data?.schema_name_list
          });
        }
      })
      .finally(() => {
        dbSourceInfoCollection.set(key, {
          getSchemaLoading: false
        });
      });
  };

  const getSupportedFileModeByInstanceType = (key: string, dbType: string) => {
    system
      .getSystemModuleStatus({
        db_type: dbType as getSystemModuleStatusDbTypeEnum,
        module_name: getSystemModuleStatusModuleNameEnum.execute_sql_file_mode
      })
      .then((res) => {
        if (res.data.code === ResponseCode.SUCCESS) {
          dbSourceInfoCollection.set(key, {
            isSupportFileModeExecuteSql: !!res.data.data?.is_supported
          });
        }
      });
  };

  const updateRuleTemplateNameAndDbType = (
    key: string,
    instanceName: string
  ) => {
    instance
      .getInstanceV2({ instance_name: instanceName, project_name: projectName })
      .then(async (res) => {
        if (res.data.code === ResponseCode.SUCCESS) {
          dbSourceInfoCollection.set(key, {
            dbType: res.data.data?.db_type,
            ruleTemplate: res.data.data?.rule_template
          });

          getSupportedFileModeByInstanceType(key, res.data.data?.db_type ?? '');
        }
      });
  };

  const handleInstanceChange = (key: string, instanceName?: string) => {
    if (instanceName) {
      dbSourceInfoCollection.set(key, {
        instanceName,
        schemaName: undefined,
        getSchemaLoading: true,
        schemaList: [],
        ruleTemplate: undefined,
        dbType: undefined,
        testConnectResult: undefined,
        isSupportFileModeExecuteSql: true
      });
      updateSchemaList(key, instanceName);
      updateRuleTemplateNameAndDbType(key, instanceName);
      sqlStatementTabActiveKey.set(key);
    }
  };

  const handleInstanceSchemaChange = (key: string, schemaName?: string) => {
    dbSourceInfoCollection.set(key, {
      schemaName
    });
  };

  const getInstanceSchemaOptions = (key: string) => {
    return (
      dbSourceInfoCollection.value?.[key]?.schemaList?.map((item) => {
        return {
          label: item,
          value: item
        };
      }) ?? []
    );
  };

  const getInstanceSchemaLoading = (key: string) => {
    return dbSourceInfoCollection.value?.[key]?.getSchemaLoading;
  };

  const renderRuleTemplateDisplay = (key: string) => {
    const rule = dbSourceInfoCollection.value?.[key]?.ruleTemplate;
    const dbType = dbSourceInfoCollection.value?.[key]?.dbType;

    if (!rule || !dbType) {
      return (
        <BasicButton
          className="data-source-row-rule-template"
          icon={<ProfileSquareFilled width="18" height="18" />}
        />
      );
    }

    const path = rule.is_global_rule_template
      ? `/sqle/rule-manager/global-detail/${rule.name}/${dbType}`
      : `/sqle/project/${projectID}/rule/template/detail/${rule.name}/${dbType}`;

    return (
      <BasicToolTips
        title={
          <Link to={path} target="_blank">
            {t('rule.form.ruleTemplate')}: {rule.name}
          </Link>
        }
      >
        <BasicButton
          className="data-source-row-rule-template"
          icon={
            <ProfileSquareFilled
              width="18"
              height="18"
              color={sqleTheme.icon.execWorkFlow.profileSquareFilled}
            />
          }
        />
      </BasicToolTips>
    );
  };

  const renderDeleteItemButton = (
    fields: FormListFieldData[],
    key: string,
    handleClick: () => void
  ) => {
    const removeItem = () => {
      dbSourceInfoCollection.set(key, undefined);
      sqlStatementTabActiveKey.set(
        Object.keys(dbSourceInfoCollection.value).filter(
          (v) => v !== key
        )?.[0] ?? ''
      );
    };

    return (
      <BasicButton
        className="data-source-row-button data-source-col-delete-button"
        onClick={() => {
          if (fields.length <= 1) {
            return;
          }
          handleClick();
          removeItem();
        }}
        icon={
          fields.length > 1 ? (
            <MinusCircleFilled width="18" height="18" />
          ) : (
            <MinusCircleFilled
              width="18"
              height="18"
              color={sqleTheme.icon.execWorkFlow.minusCircleFilledDisabled}
            />
          )
        }
      />
    );
  };

  const renderAddItemButton = (
    fields: FormListFieldData[],
    handleClick: () => void
  ) => {
    /**
     * 新增时为什么没有同步更新 dbSourceInfoCollection
     * 由于无法获取最新的 key，所以无法直接在这里新增。只能通过选择数据源时更新 dbSourceInfoCollection 数据
     */
    const addAction = () => {
      handleClick();
    };
    return (
      <BasicButton
        onClick={addAction}
        type="primary"
        disabled={fields.length >= 10}
      >
        {t('execWorkflow.create.form.sqlInfo.addInstance')}
      </BasicButton>
    );
  };

  return {
    handleInstanceChange,
    handleInstanceSchemaChange,
    getInstanceSchemaOptions,
    getInstanceSchemaLoading,
    renderRuleTemplateDisplay,
    renderDeleteItemButton,
    renderAddItemButton
  };
};

export default useRenderDatabaseSelectionItems;
