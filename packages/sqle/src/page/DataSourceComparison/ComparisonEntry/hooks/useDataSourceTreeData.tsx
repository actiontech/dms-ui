import instance from '@actiontech/shared/lib/api/sqle/service/instance';
import { ResponseCode } from '@actiontech/shared/lib/enum';
import { useCurrentProject } from '@actiontech/shared/lib/global';
import { useBoolean } from 'ahooks';
import { TreeSelectProps } from 'antd';
import { Key, ReactNode, useEffect, useRef, useState } from 'react';
import useInstance from '../../../../hooks/useInstance';
import { DatabaseFilled, DatabaseSchemaFilled } from '@actiontech/icons';
import useThemeStyleData from '../../../../hooks/useThemeStyleData';
import { DatabaseSelectorTitleStyleWrapper } from '../style';
import useDatabaseType from '../../../../hooks/useDatabaseType';
import { DatabaseTypeLogo } from '@actiontech/shared';
import { INSTANCE_SCHEMA_SEPARATOR } from '../utils';

type DefaultOptionType = {
  id: string;
  pId: string;
  value: string;
  label: string;
  title: ReactNode;
  isLeaf?: boolean;
  disabled?: boolean;
};

const useDataSourceTreeData = () => {
  const { getLogoUrlByDbType } = useDatabaseType();
  const currentInstanceId = useRef('');
  const [treeData, setTreeData] = useState<DefaultOptionType[]>([]);
  const { projectName } = useCurrentProject();
  const [treeExpandedKeys, setTreeExpandedKeys] = useState<Key[]>([]);
  const [treeLoadedKeys, setTreeLoadedKeys] = useState<Key[]>([]);
  const { sharedTheme } = useThemeStyleData();
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
    currentInstanceId.current = id;
    setTreeLoadedKeys((keys) => [...keys, id]);
    const instanceName = instanceList.find(
      (v) => v.instance_id === id
    )?.instance_name;

    startGetInstanceSchema();
    return instance
      .getInstanceSchemasV1({
        instance_name: instanceName!,
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

    if (selectedItem.isLeaf) {
      return treeData.map((item) => ({
        ...item,
        disabled: !item.isLeaf || item.value === otherValue
      }));
    }

    return treeData.map((item) => ({
      ...item,
      disabled: item.value === otherValue || item.isLeaf
    }));
  };

  useEffect(() => {
    updateInstanceList(
      { project_name: projectName },
      {
        onSuccess: (data) => {
          const dbTypes = new Set(data.map((v) => v.instance_type) as string[]);
          setTreeExpandedKeys((keys) => [...keys, ...dbTypes]);
          setTreeLoadedKeys((keys) => [...keys, ...dbTypes]);
          setTreeData([
            ...Array.from(dbTypes).map((type) => ({
              id: type,
              pId: '0',
              value: type,
              label: type,
              disabled: true,
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
    onLoadTreeData,
    treeExpandedKeys,
    onTreeExpand,
    disableTreeNodesBasedOnSelection,
    treeLoadedKeys,
    getTreeDataPending: instanceLoading || getInstanceSchemaPending
  };
};

export default useDataSourceTreeData;
