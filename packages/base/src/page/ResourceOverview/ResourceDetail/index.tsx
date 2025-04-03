import React, { useState, useMemo, useEffect } from 'react';
import { BasicButton } from '@actiontech/shared';
import { Card, Row, Col, Tree, Space } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import {
  FlagFilled,
  DatabaseFilled,
  DatabaseSchemaFilled
} from '@actiontech/icons';
import useThemeStyleData from '../../../hooks/useThemeStyleData';
import {
  ActiontechTable,
  useTableRequestError,
  useTableRequestParams,
  useTableFilterContainer,
  FilterCustomProps,
  TableToolbar,
  TableFilterContainer
} from '@actiontech/shared/lib/components/ActiontechTable';
import {
  GlobalDataSourceColumns,
  GLobalDataSourceListParamType
} from './columns';
import { useDbServiceDriver } from '@actiontech/shared/lib/features';
import { DBServiceService } from '@actiontech/shared/lib/api';
import { useRequest } from 'ahooks';
import useGlobalDataSourceType from '../../GlobalDataSource/hooks/useGlobalDataSourceType';
import useProjectTips from '../../../hooks/useProjectTips';
import { IListGlobalDBService } from '@actiontech/shared/lib/api/base/service/common';
import { ResourceDetailWrapper } from '../style';
import { useTranslation } from 'react-i18next';
import { ResourceDetailToolbarActions } from './actions';

// 类型定义
type DataSourceType =
  | 'mysql'
  | 'redis'
  | 'mongodb'
  | 'postgresql'
  | 'api'
  | 'file'
  | 'cloud';

interface StatsData {
  total: number;
  change: number;
}

interface TreeNodeData {
  key: string;
  title: string;
  type: 'business' | 'project' | DataSourceType;
  children?: TreeNodeData[];
}

interface MockData {
  stats: {
    business: StatsData;
    project: StatsData;
    datasource: StatsData;
  };
  treeData: TreeNodeData[];
}

// 模拟数据
const mockData: MockData = {
  stats: {
    business: { total: 24, change: 0.12 },
    project: { total: 156, change: 0.08 },
    datasource: { total: 892, change: -0.03 }
  },
  treeData: [
    {
      key: 'b1',
      title: '业务线A',
      type: 'business',
      children: [
        {
          key: 'p1',
          title: '项目A1',
          type: 'project',
          children: [
            { key: 'd1', title: 'MySQL-生产', type: 'mysql' },
            {
              key: 'd2',
              title: 'Redis-测试',
              type: 'redis'
            },
            { key: 'd3', title: 'API-生产', type: 'api' }
          ]
        },
        {
          key: 'p2',
          title: '项目A2',
          type: 'project',
          children: [
            {
              key: 'd4',
              title: 'MongoDB-生产',
              type: 'mongodb'
            },
            { key: 'd5', title: '文件存储', type: 'file' }
          ]
        }
      ]
    },
    {
      key: 'b2',
      title: '业务线B',
      type: 'business',
      children: [
        {
          key: 'p3',
          title: '项目B1',
          type: 'project',
          children: [
            {
              key: 'd6',
              title: 'PostgreSQL',
              type: 'postgresql'
            },
            { key: 'd7', title: '云存储', type: 'cloud' }
          ]
        }
      ]
    }
  ]
};

const ResourceManagementPage: React.FC = () => {
  const { t } = useTranslation();
  const { baseTheme } = useThemeStyleData();
  const [expandedKeys, setExpandedKeys] = useState<string[]>([
    'b1',
    'p1',
    'b2',
    'p3'
  ]);
  const [autoExpandParent, setAutoExpandParent] = useState<boolean>(true);
  const [selectedNode, setSelectedNode] = useState<string>('d1');

  const { getLogoUrlByDbType, updateDriverList } = useDbServiceDriver();

  const {
    updateDbTypeList,
    dbTypeOptions,
    loading: getDbTypeListLoading
  } = useGlobalDataSourceType();

  const {
    projectIDOptions,
    updateProjects,
    loading: getProjectsLoading
  } = useProjectTips();

  const {
    tableFilterInfo,
    updateTableFilterInfo,
    tableChange,
    pagination,
    refreshBySearchKeyword,
    searchKeyword,
    setSearchKeyword
  } = useTableRequestParams<
    IListGlobalDBService,
    GLobalDataSourceListParamType
  >();

  const { requestErrorMessage, handleTableRequestError } =
    useTableRequestError();

  const {
    data: dataSourceList,
    loading,
    refresh
  } = useRequest(
    () => {
      return handleTableRequestError(
        DBServiceService.ListGlobalDBServices({
          ...tableFilterInfo,
          page_index: pagination.page_index,
          page_size: pagination.page_size,
          fuzzy_keyword: searchKeyword
        })
      );
    },
    {
      refreshDeps: [pagination, tableFilterInfo]
    }
  );

  const columns = useMemo(
    () => GlobalDataSourceColumns(getLogoUrlByDbType),
    [getLogoUrlByDbType]
  );

  const { filterButtonMeta, filterContainerMeta, updateAllSelectedFilterItem } =
    useTableFilterContainer(columns, updateTableFilterInfo);

  const filterCustomProps = useMemo(() => {
    return new Map<keyof IListGlobalDBService, FilterCustomProps>([
      ['db_type', { options: dbTypeOptions, loading: getDbTypeListLoading }],
      [
        'project_name',
        { options: projectIDOptions, loading: getProjectsLoading }
      ]
    ]);
  }, [
    dbTypeOptions,
    getDbTypeListLoading,
    projectIDOptions,
    getProjectsLoading
  ]);

  useEffect(() => {
    updateDriverList();
    updateProjects();
    updateDbTypeList();
  }, [updateDbTypeList, updateDriverList, updateProjects]);

  // 处理树节点展开
  const onExpand = (keys: React.Key[]) => {
    setExpandedKeys(keys as string[]);
    setAutoExpandParent(false);
  };

  // 处理树节点选择
  const onSelect = (selectedKeys: React.Key[]) => {
    if (selectedKeys.length > 0) {
      const key = selectedKeys[0] as string;
      // 只处理数据源节点的选择
      if (key.startsWith('d')) {
        setSelectedNode(key);
      }
    }
  };

  // 展开/折叠所有节点
  const toggleExpandAll = (expand: boolean) => {
    if (expand) {
      const allKeys: string[] = [];
      const traverse = (nodes: TreeNodeData[]) => {
        nodes.forEach((node) => {
          allKeys.push(node.key);
          if (node.children) {
            traverse(node.children);
          }
        });
      };
      traverse(mockData.treeData);
      setExpandedKeys(allKeys);
    } else {
      setExpandedKeys([]);
    }
    setAutoExpandParent(true);
  };

  const renderTreeNodes = (data: TreeNodeData[]): React.ReactNode =>
    data.map((item) => {
      const { key, title, type, children } = item;

      // 添加图标和状态标记
      let icon: React.ReactNode;
      if (type === 'business') {
        icon = (
          <DatabaseSchemaFilled
            color={baseTheme.icon.resourceOverview.schemaFilled}
          />
        );
      } else if (type === 'project') {
        icon = <FlagFilled />;
      } else {
        icon = (
          <DatabaseFilled
            color={baseTheme.icon.resourceOverview.databaseFilled}
          />
        );
      }

      return (
        <Tree.TreeNode
          key={key}
          title={
            <span>
              {/* <Badge color={statusColor[status]} /> {icon} {titleNode} */}
              {icon} {title}
            </span>
          }
          // dataRef={item}
        >
          {children && renderTreeNodes(children)}
        </Tree.TreeNode>
      );
    });

  return (
    <ResourceDetailWrapper>
      <TableToolbar
        filterButton={{
          filterButtonMeta,
          updateAllSelectedFilterItem
        }}
        searchInput={{
          onChange: setSearchKeyword,
          defaultValue: searchKeyword,
          onSearch: () => {
            refreshBySearchKeyword();
          }
        }}
        actions={ResourceDetailToolbarActions(() => {
          console.log('export');
        }, false)}
      />
      <TableFilterContainer
        filterContainerMeta={filterContainerMeta}
        updateTableFilterInfo={updateTableFilterInfo}
        disabled={loading}
        filterCustomProps={filterCustomProps}
      />
      <Row gutter={16} className="resource-detail-wrapper">
        <Col span={6}>
          <Card
            title={t('resourceOverview.resourceTopology')}
            extra={
              <Space>
                <BasicButton onClick={() => toggleExpandAll(true)}>
                  {t('resourceOverview.expandAll')}
                </BasicButton>
                <BasicButton onClick={() => toggleExpandAll(false)}>
                  {t('resourceOverview.collapseAll')}
                </BasicButton>
              </Space>
            }
          >
            <Tree
              showLine
              showIcon
              expandedKeys={expandedKeys}
              autoExpandParent={autoExpandParent}
              onExpand={onExpand}
              onSelect={onSelect}
              selectedKeys={[selectedNode]}
              switcherIcon={<DownOutlined />}
            >
              {renderTreeNodes(mockData.treeData)}
            </Tree>
          </Card>
        </Col>
        <Col span={18}>
          <Card
            className="resource-detail-table-card"
            title={t('resourceOverview.resourceDetail')}
          >
            <ActiontechTable
              dataSource={dataSourceList?.list}
              rowKey={(record: IListGlobalDBService) => {
                return `${record?.uid}`;
              }}
              pagination={{
                total: dataSourceList?.total ?? 0,
                current: pagination.page_index
              }}
              loading={loading}
              columns={columns}
              errorMessage={requestErrorMessage}
              onChange={tableChange}
            />
          </Card>
        </Col>
      </Row>
    </ResourceDetailWrapper>
  );
};

export default ResourceManagementPage;
