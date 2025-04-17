import React, { useCallback, useEffect, useState } from 'react';
import { BasicButton } from '@actiontech/shared';
import { Card, Tree, Space, type TreeDataNode } from 'antd';
import { useTranslation } from 'react-i18next';
import { DownOutlined, RightOutlined } from '@actiontech/icons';
import { AntTreeNodeProps } from 'antd/es/tree';
import classNames from 'classnames';

interface TreeNodeData extends TreeDataNode {
  key: string;
  children?: TreeNodeData[];
}

interface ResourceTopologyProps {
  topology: TreeNodeData[];
  selectedKey?: string;
  setSelectedKey: (keys: string) => void;
  expandedKeys: string[];
  setExpandedKeys: (keys: string[]) => void;
}

const ResourceTopology: React.FC<ResourceTopologyProps> = ({
  topology,
  selectedKey,
  setSelectedKey,
  expandedKeys,
  setExpandedKeys
}) => {
  const { t } = useTranslation();
  const [autoExpandParent, setAutoExpandParent] = useState<boolean>(true);
  const [allKeys, setAllKeys] = useState<string[]>([]);

  const onExpand = (keys: React.Key[]) => {
    setExpandedKeys(keys as string[]);
    setAutoExpandParent(false);
  };

  const onSelect = (keys: React.Key[]) => {
    setSelectedKey(keys[0] as string);
  };

  const getAllKeys = useCallback(() => {
    const keys: string[] = [];
    const traverse = (nodes: TreeNodeData[]) => {
      nodes.forEach((node) => {
        keys.push(node.key);
        if (node.children) {
          traverse(node.children);
        }
      });
    };
    traverse(topology ?? []);
    return keys;
  }, [topology]);

  const toggleExpandAll = useCallback(
    (expand: boolean) => {
      if (expand) {
        setExpandedKeys(allKeys);
      } else {
        setExpandedKeys([]);
      }
      setAutoExpandParent(true);
    },
    [setExpandedKeys, allKeys]
  );

  useEffect(() => {
    if (topology.length > 0) {
      const keys = getAllKeys();
      setAllKeys(keys);
      setExpandedKeys(keys);
    }
  }, [topology, getAllKeys, setExpandedKeys]);

  return (
    <Card
      title={t('resourceOverview.resourceTopology')}
      extra={
        <Space>
          <BasicButton
            className={classNames({
              'btn-active': expandedKeys.length === allKeys.length
            })}
            onClick={() => toggleExpandAll(true)}
          >
            {t('resourceOverview.expandAll')}
          </BasicButton>
          <BasicButton
            className={classNames({
              'btn-active': !expandedKeys.length
            })}
            onClick={() => toggleExpandAll(false)}
          >
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
        selectedKeys={selectedKey ? [selectedKey] : []}
        treeData={topology}
        switcherIcon={({ expanded }: AntTreeNodeProps) => {
          if (expanded) {
            return <DownOutlined color="currentColor" />;
          }
          return <RightOutlined />;
        }}
      />
    </Card>
  );
};

export default ResourceTopology;
