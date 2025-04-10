import instance from '@actiontech/shared/lib/api/sqle/service/instance';
import { ResponseCode } from '@actiontech/shared/lib/enum';
import { useCurrentProject } from '@actiontech/shared/lib/features';
import { useBoolean } from 'ahooks';
import { Form, TreeSelectProps } from 'antd';
import { Key, ReactNode, useCallback, useEffect, useState } from 'react';
import useInstance from '../../../../hooks/useInstance';
import { DatabaseFilled, DatabaseSchemaFilled } from '@actiontech/icons';
import useThemeStyleData from '../../../../hooks/useThemeStyleData';
import { DatabaseSelectorTitleStyleWrapper } from '../style';
import useDatabaseType from '../../../../hooks/useDatabaseType';
import { DatabaseTypeLogo } from '@actiontech/shared';
import { IDatabaseComparisonObject } from '@actiontech/shared/lib/api/sqle/service/common';
import {
  DatabaseComparisonFromFields,
  SelectedInstanceInfo
} from '../index.type';
import { getInstanceTipListV2FunctionalModuleEnum } from '@actiontech/shared/lib/api/sqle/service/instance/index.enum';
import { FormValidatorRule } from '@actiontech/shared/lib/types/common.type';
import { useTranslation } from 'react-i18next';

type DefaultOptionType = {
  id: string;
  pId: string;
  value: string;
  label: string;
  title: ReactNode;
  isLeaf?: boolean;
  disabled?: boolean;
  dbType: string;
};

const TREE_DATA_PARENT_NODE_ID = 'TREE_DATA_PARENT_NODE_ID';

const INSTANCE_SCHEMA_SEPARATOR = '_INSTANCE_SCHEMA_SEPARATOR_';

const useDataSourceSelectorTree = () => {
  const { t } = useTranslation();
  const { getLogoUrlByDbType } = useDatabaseType();

  const [treeData, setTreeData] = useState<DefaultOptionType[]>([]);
  const { projectName } = useCurrentProject();
  const [treeExpandedKeys, setTreeExpandedKeys] = useState<Key[]>([]);
  const [treeLoadedKeys, setTreeLoadedKeys] = useState<Key[]>([]);
  const { sharedTheme } = useThemeStyleData();
  const [form] = Form.useForm<DatabaseComparisonFromFields>();
  const selectedBaselineInstanceValue = Form.useWatch('baselineInstance', form);
  const selectedComparisonInstanceValue = Form.useWatch(
    'comparisonInstance',
    form
  );
  const {
    updateInstanceList,
    loading: instanceLoading,
    instanceList
  } = useInstance();

  const [
    getInstanceSchemaPending,
    { setTrue: startGetInstanceSchema, setFalse: getInstanceSchemaDone }
  ] = useBoolean();

  const onLoadTreeData: TreeSelectProps<
    string,
    DefaultOptionType
  >['loadData'] = ({ id }) => {
    if (treeExpandedKeys.includes(id)) {
      return Promise.resolve();
    }

    setTreeLoadedKeys((keys) => [...keys, id]);
    const instanceInfo = instanceList.find((v) => v.instance_id === id);

    startGetInstanceSchema();

    return instance
      .getInstanceSchemasV1({
        instance_name: instanceInfo?.instance_name!,
        project_name: projectName
      })
      .then((res) => {
        if (res.data.code === ResponseCode.SUCCESS) {
          const schemas = res.data.data?.schema_name_list ?? [];
          setTreeData([
            ...treeData,
            ...schemas.map((schema) => ({
              id: schema,
              pId: id,
              value: `${id}${INSTANCE_SCHEMA_SEPARATOR}${schema}`,
              label: schema,
              dbType: instanceInfo?.instance_type!,
              title: (
                <DatabaseSelectorTitleStyleWrapper>
                  <DatabaseSchemaFilled
                    width={18}
                    height={18}
                    color={sharedTheme.uiToken.colorPrimary}
                  />
                  <span className="content">{schema}</span>
                </DatabaseSelectorTitleStyleWrapper>
              ),
              isLeaf: true
            }))
          ]);
        }
      })
      .finally(() => {
        getInstanceSchemaDone();
      });
  };
  const onTreeExpand: TreeSelectProps['onTreeExpand'] = (keys) => {
    setTreeExpandedKeys(keys);
  };

  const disableTreeNodesBasedOnSelection = (
    otherValue?: string
  ): TreeSelectProps<string, DefaultOptionType>['treeData'] => {
    if (!otherValue) {
      return treeData;
    }
    const selectedItem = treeData.find((item) => item.value === otherValue);
    if (!selectedItem) {
      return treeData;
    }
    return treeData.map((item) => {
      if (item.pId === TREE_DATA_PARENT_NODE_ID) {
        return item;
      }
      return {
        ...item,
        disabled:
          item.value === otherValue || item.dbType !== selectedItem.dbType
      };
    });
  };

  const parse2DatabaseCompareObject = (
    value?: string
  ): IDatabaseComparisonObject => {
    if (!value) {
      return {};
    }
    if (value.includes(INSTANCE_SCHEMA_SEPARATOR)) {
      const [instanceId, schemaName] = value.split(INSTANCE_SCHEMA_SEPARATOR);
      return {
        instance_id: instanceId,
        schema_name: schemaName
      };
    }
    return {
      instance_id: value
    };
  };

  const getInstanceInfoBySelectedValue = (
    value?: string
  ): SelectedInstanceInfo | undefined => {
    if (!value) {
      return undefined;
    }
    if (value.includes(INSTANCE_SCHEMA_SEPARATOR)) {
      const [instanceId, schemaName] = value.split(INSTANCE_SCHEMA_SEPARATOR);
      const instanceInfo = instanceList.find(
        (v) => v.instance_id === instanceId
      );

      return {
        instanceId,
        schemaName,
        instanceName: instanceInfo?.instance_name ?? '',
        instanceType: instanceInfo?.instance_type ?? ''
      };
    }

    const instanceInfo = instanceList.find((v) => v.instance_id === value);

    return {
      instanceId: value,
      instanceName: instanceInfo?.instance_name ?? '',
      instanceType: instanceInfo?.instance_type ?? ''
    };
  };

  const validatorDataSourceTreeSelector = useCallback((): FormValidatorRule => {
    const getSelectionLevel = (value: string): 'data-source' | 'schema' => {
      return value.includes(INSTANCE_SCHEMA_SEPARATOR)
        ? 'schema'
        : 'data-source';
    };
    return () => {
      if (!selectedBaselineInstanceValue || !selectedComparisonInstanceValue) {
        return Promise.resolve();
      }

      const baselineLevel = getSelectionLevel(selectedBaselineInstanceValue);

      const comparisonLevel = getSelectionLevel(
        selectedComparisonInstanceValue
      );

      if (baselineLevel !== comparisonLevel) {
        const errorMessage =
          baselineLevel === 'schema'
            ? t('dataSourceComparison.entry.selectorValidatorSchemaMessage')
            : t(
                'dataSourceComparison.entry.selectorValidatorDataSourceMessage'
              );

        return Promise.reject(errorMessage);
      }

      return Promise.resolve();
    };
  }, [selectedBaselineInstanceValue, selectedComparisonInstanceValue, t]);

  useEffect(() => {
    updateInstanceList(
      {
        project_name: projectName,
        functional_module:
          getInstanceTipListV2FunctionalModuleEnum.create_workflow
      },
      {
        onSuccess: (data) => {
          const dbTypes = new Set(data.map((v) => v.instance_type) as string[]);
          setTreeExpandedKeys((keys) => [...keys, ...dbTypes]);
          setTreeLoadedKeys((keys) => [...keys, ...dbTypes]);
          setTreeData([
            ...Array.from(dbTypes).map((type) => ({
              id: type,
              pId: TREE_DATA_PARENT_NODE_ID,
              value: type,
              label: type,
              disabled: true,
              dbType: type,
              title: (
                <DatabaseTypeLogo
                  dbType={type}
                  logoUrl={getLogoUrlByDbType(type)}
                />
              )
            })),
            ...data.map((item) => {
              return {
                id: item.instance_id ?? '',
                pId: item.instance_type ?? '',
                value: item.instance_id ?? '',
                label: item.instance_name ?? '',
                dbType: item.instance_type ?? '',
                title: (
                  <DatabaseSelectorTitleStyleWrapper>
                    <DatabaseFilled
                      width={18}
                      height={18}
                      color={sharedTheme.uiToken.colorPrimary}
                    />
                    <span className="content">
                      {`${item.instance_name}(${item.host}:${item.port})`}
                    </span>
                  </DatabaseSelectorTitleStyleWrapper>
                )
              };
            })
          ]);
        }
      }
    );
  }, [
    getLogoUrlByDbType,
    projectName,
    sharedTheme.uiToken.colorPrimary,
    updateInstanceList
  ]);

  return {
    form,
    selectedBaselineInstanceValue,
    selectedComparisonInstanceValue,
    treeData,
    onLoadTreeData,
    treeExpandedKeys,
    onTreeExpand,
    disableTreeNodesBasedOnSelection,
    treeLoadedKeys,
    parse2DatabaseCompareObject,
    getInstanceInfoBySelectedValue,
    validatorDataSourceTreeSelector,
    getTreeDataPending: instanceLoading || getInstanceSchemaPending
  };
};

export default useDataSourceSelectorTree;
