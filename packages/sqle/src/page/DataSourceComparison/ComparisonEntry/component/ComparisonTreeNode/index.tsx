import { Tree } from 'antd';
import {
  ComparisonTreeContainerStyleWrapper,
  ComparisonTreeItemStyleWrapper,
  ComparisonTreeTitleStyleWrapper
} from './style';
import { ISchemaObject } from '@actiontech/shared/lib/api/sqle/service/common';
import { DownOutlined, RightOutlined } from '@actiontech/icons';
import { AntTreeNodeProps } from 'antd/es/tree';
import useComparisonResultTree from '../../hooks/useComparisonResultTree';
import {
  useEffect,
  useMemo,
  useRef,
  UIEventHandler,
  Key,
  forwardRef,
  useImperativeHandle
} from 'react';
import ComparisonDetailDrawer from './ComparisonDetailDrawer';
import { generateTreeDefaultExpandedKeys } from '../../utils/TreeNode';
import { SelectedInstanceInfo } from '../../index.type';
import { useTranslation } from 'react-i18next';

type Props = {
  comparisonResults: ISchemaObject[];
  selectedBaselineInstanceInfo?: SelectedInstanceInfo;
  selectedComparisonInstanceInfo?: SelectedInstanceInfo;
  comparisonObjectTreeOnCheck: (keys: string[]) => void;
  comparisonObjectCheckKeys: string[];
  treeExpandedKeys: Key[];
  setTreeExpandedKeys: (keys: Key[]) => void;
};
export type ComparisonTreeNodeRef = {
  scrollToNode: (params: {
    key: string | number;
    align?: 'top' | 'bottom' | 'auto';
    offset?: number;
  }) => void;
};

const TREE_HEIGHT = 1200;

const ComparisonTreeNode = forwardRef<ComparisonTreeNodeRef, Props>(
  (props, ref) => {
    const {
      comparisonResults,
      selectedBaselineInstanceInfo,
      selectedComparisonInstanceInfo,
      comparisonObjectTreeOnCheck,
      comparisonObjectCheckKeys,
      treeExpandedKeys,
      setTreeExpandedKeys
    } = props;

    const { t } = useTranslation();
    const isFirstRenderTreeNode = useRef(true);
    const baselineTreeRef = useRef<HTMLDivElement>(null);
    const comparisonTreeRef = useRef<HTMLDivElement>(null);
    const isScrolling = useRef(false);
    const baselineTreeInstanceRef =
      useRef<React.ComponentRef<typeof Tree>>(null);
    const comparisonTreeInstanceRef =
      useRef<React.ComponentRef<typeof Tree>>(null);

    useImperativeHandle(ref, () => ({
      scrollToNode: (params) => {
        baselineTreeInstanceRef.current?.scrollTo(params);
        comparisonTreeInstanceRef.current?.scrollTo(params);
      }
    }));

    const handleTreeScroll: UIEventHandler<HTMLDivElement> = (e) => {
      if (isScrolling.current) {
        return;
      }

      isScrolling.current = true;
      const currentTarget = e.target as HTMLDivElement;
      const scrollTop = currentTarget.scrollTop;

      const baselineTree = baselineTreeRef.current?.querySelector(
        '.ant-tree-list-holder'
      ) as HTMLDivElement;
      const comparisonTree = comparisonTreeRef.current?.querySelector(
        '.ant-tree-list-holder'
      ) as HTMLDivElement;

      if (!baselineTree || !comparisonTree) {
        isScrolling.current = false;
        return;
      }

      // 计算滚动百分比
      const currentMaxScroll =
        currentTarget.scrollHeight - currentTarget.clientHeight;
      const scrollPercentage =
        currentMaxScroll > 0 ? scrollTop / currentMaxScroll : 0;

      requestAnimationFrame(() => {
        try {
          if (currentTarget === baselineTree) {
            const targetScroll = Math.round(
              scrollPercentage *
                (comparisonTree.scrollHeight - comparisonTree.clientHeight)
            );
            comparisonTree.scrollTop = targetScroll;
          } else {
            const targetScroll = Math.round(
              scrollPercentage *
                (baselineTree.scrollHeight - baselineTree.clientHeight)
            );
            baselineTree.scrollTop = targetScroll;
          }
        } finally {
          requestAnimationFrame(() => {
            isScrolling.current = false;
          });
        }
      });
    };

    const {
      assemblingBaselineTreeData,
      assemblingComparisonTreeData,
      selectedObjectNodeKey,
      resetStateAndCloseComparisonDetailDrawer,
      comparisonDetailDrawerOpen,
      generateGetComparisonDetailParams,
      generateModifiedSqlParams
    } = useComparisonResultTree(comparisonResults);

    const baselineTreeData = useMemo(() => {
      if (!selectedBaselineInstanceInfo) {
        return [];
      }
      return assemblingBaselineTreeData(
        selectedBaselineInstanceInfo.instanceName
      );
    }, [assemblingBaselineTreeData, selectedBaselineInstanceInfo]);

    const comparisonTreeData = useMemo(() => {
      if (!selectedComparisonInstanceInfo) {
        return [];
      }
      return assemblingComparisonTreeData(
        selectedComparisonInstanceInfo.instanceName
      );
    }, [assemblingComparisonTreeData, selectedComparisonInstanceInfo]);

    const commonSwitcherIcon = ({ expanded }: AntTreeNodeProps) => {
      if (expanded) {
        return <DownOutlined color="currentColor" />;
      }
      return <RightOutlined />;
    };

    useEffect(() => {
      if (isFirstRenderTreeNode.current) {
        setTreeExpandedKeys(generateTreeDefaultExpandedKeys(baselineTreeData));
        isFirstRenderTreeNode.current = false;
      }
    }, [baselineTreeData, setTreeExpandedKeys]);

    return (
      <ComparisonTreeContainerStyleWrapper>
        <ComparisonTreeItemStyleWrapper
          title={
            <ComparisonTreeTitleStyleWrapper>
              <span>{t('dataSourceComparison.entry.baselineEnvironment')}</span>
              <span>{`(${selectedBaselineInstanceInfo?.instanceName}) `}</span>
            </ComparisonTreeTitleStyleWrapper>
          }
          ref={baselineTreeRef}
          bordered={false}
          hoverable
        >
          <Tree
            ref={baselineTreeInstanceRef}
            height={TREE_HEIGHT}
            selectable={false}
            onScroll={handleTreeScroll}
            expandedKeys={treeExpandedKeys}
            onExpand={setTreeExpandedKeys}
            switcherIcon={commonSwitcherIcon}
            treeData={baselineTreeData}
            showLine
          />
        </ComparisonTreeItemStyleWrapper>
        <ComparisonTreeItemStyleWrapper
          title={
            <ComparisonTreeTitleStyleWrapper>
              <span>
                {t('dataSourceComparison.entry.comparisonEnvironment')}
              </span>
              <span>{`(${selectedComparisonInstanceInfo?.instanceName})`}</span>
            </ComparisonTreeTitleStyleWrapper>
          }
          ref={comparisonTreeRef}
          bordered={false}
          hoverable
        >
          <Tree
            ref={comparisonTreeInstanceRef}
            height={TREE_HEIGHT}
            selectable={false}
            checkable
            onScroll={handleTreeScroll}
            expandedKeys={treeExpandedKeys}
            onExpand={setTreeExpandedKeys}
            checkedKeys={comparisonObjectCheckKeys}
            onCheck={(checkedKeys) => {
              comparisonObjectTreeOnCheck(checkedKeys as string[]);
            }}
            switcherIcon={commonSwitcherIcon}
            treeData={comparisonTreeData}
            showLine
          />
        </ComparisonTreeItemStyleWrapper>

        {!!selectedObjectNodeKey ? (
          <ComparisonDetailDrawer
            open={comparisonDetailDrawerOpen}
            selectedObjectNodeKey={selectedObjectNodeKey}
            onClose={resetStateAndCloseComparisonDetailDrawer}
            comparisonResults={comparisonResults}
            selectedBaselineInstanceInfo={selectedBaselineInstanceInfo}
            selectedComparisonInstanceInfo={selectedComparisonInstanceInfo}
            getDetailParams={generateGetComparisonDetailParams(
              selectedObjectNodeKey,
              selectedBaselineInstanceInfo?.instanceId,
              selectedComparisonInstanceInfo?.instanceId,
              selectedBaselineInstanceInfo?.schemaName,
              selectedComparisonInstanceInfo?.schemaName
            )}
            genModifiedSqlParams={generateModifiedSqlParams(
              selectedObjectNodeKey,
              selectedBaselineInstanceInfo?.instanceId,
              selectedComparisonInstanceInfo?.instanceId,
              selectedBaselineInstanceInfo?.schemaName,
              selectedComparisonInstanceInfo?.schemaName
            )}
          />
        ) : null}
      </ComparisonTreeContainerStyleWrapper>
    );
  }
);

export default ComparisonTreeNode;
