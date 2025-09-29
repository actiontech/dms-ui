import { useTranslation } from 'react-i18next';
import {
  ComparisonActionStyleWrapper,
  ComparisonEntryStyleWrapper,
  ComparisonSelectorFormStyleWrapper,
  ComparisonCardStyleWrapper,
  TimeInfo
} from './style';
import {
  BasicButton,
  BasicToolTip,
  EmptyBox,
  formatTime
} from '@actiontech/dms-kit';
import { message } from 'antd';
import { ToggleButtonStyleWrapper } from '@actiontech/dms-kit';
import { useCurrentProject } from '@actiontech/shared/lib/features';
import { useBoolean, useRequest, useToggle } from 'ahooks';
import databaseCompareService from '@actiontech/shared/lib/api/sqle/service/database_comparison';
import EnvironmentSelector from './component/EnvironmentSelector';
import ComparisonTreeNode, {
  ComparisonTreeNodeRef
} from './component/ComparisonTreeNode';
import ComparisonOverview from './component/ComparisonOverview';
import useDataSourceSelectorTree from './hooks/useDataSourceSelectorTree';
import {
  filterSchemasInDatabase,
  filteredWithoutParentNodeKey,
  generateAllMatchStatusExpandedKeys,
  getComparisonResultByNodeKey,
  getFirstMatchNodeKey,
  isValidChildNodeKey,
  parseTreeNodeKey
} from './utils/TreeNode';
import {
  DatabaseObjectObjectTypeEnum,
  ObjectDiffResultComparisonResultEnum,
  SchemaObjectComparisonResultEnum
} from '@actiontech/shared/lib/api/sqle/service/common.enum';
import ModifiedSqlDrawer from './component/ModifiedSqlDrawer';
import { Key, useMemo, useState, useRef } from 'react';
import { IGenDatabaseDiffModifySQLsV1Params } from '@actiontech/shared/lib/api/sqle/service/database_comparison/index.d';
const ComparisonEntry: React.FC = () => {
  const { t } = useTranslation();
  const { projectName } = useCurrentProject();
  const [messageApi, messageContextHolder] = message.useMessage();
  const treeRef = useRef<ComparisonTreeNodeRef>(null);
  const [
    showDifferencesOnly,
    { toggle: toggleShowDifferencesOnly, setLeft: resetShowDifferencesOnly }
  ] = useToggle(false);
  const [
    modifiedSqlDrawerOpen,
    { setTrue: openModifiedSqlDrawer, setFalse: closeOpenModifiedSqlDrawer }
  ] = useBoolean();
  const [checkedObjectNodeKeys, setCheckedObjectNodeKeys] = useState<string[]>(
    []
  );
  const [treeExpandedKeys, setTreeExpandedKeys] = useState<Key[]>([]);
  const [comparisonStartTime, setComparisonStartTime] = useState<string>();
  const [comparisonEndTime, setComparisonEndTime] = useState<string>();
  const [filterType, setFilterType] = useState<
    ObjectDiffResultComparisonResultEnum | undefined
  >();
  const {
    form,
    selectedBaselineInstanceValue,
    selectedComparisonInstanceValue,
    parse2DatabaseCompareObject,
    getInstanceInfoBySelectedValue,
    ...otherHookValues
  } = useDataSourceSelectorTree();
  const {
    data: comparisonResults,
    run: executeComparisonApi,
    loading: executeComparisonPending,
    mutate: updateComparisonResult
  } = useRequest(
    (baseLineValue: string, comparisonValue: string) => {
      setComparisonStartTime(formatTime(new Date()));
      return databaseCompareService
        .executeDatabaseComparisonV1({
          project_name: projectName,
          base_db_object: parse2DatabaseCompareObject(baseLineValue),
          comparison_db_object: parse2DatabaseCompareObject(comparisonValue)
        })
        .then((res) => {
          setComparisonEndTime(formatTime(new Date()));
          return res.data.data;
        });
    },
    {
      manual: true
    }
  );
  const filteredComparisonResults = useMemo(() => {
    if (!showDifferencesOnly && !filterType) {
      return comparisonResults ?? [];
    }
    if (
      showDifferencesOnly &&
      filterType === ObjectDiffResultComparisonResultEnum.same
    ) {
      return [];
    }
    return (comparisonResults ?? [])
      .filter((item) => {
        if (showDifferencesOnly) {
          return (
            item.comparison_result !== SchemaObjectComparisonResultEnum.same
          );
        }
        return true;
      })
      .map((item) => {
        const filteredDiffObjects = item.database_diff_objects?.map(
          (diffObject) => {
            const filteredObjects = diffObject.objects_diff_result?.filter(
              (result) => {
                if (showDifferencesOnly) {
                  return (
                    result.comparison_result !==
                    ObjectDiffResultComparisonResultEnum.same
                  );
                }
                return true;
              }
            );
            const typeFilteredObjects = filterType
              ? filteredObjects?.filter(
                  (result) => result.comparison_result === filterType
                )
              : filteredObjects;
            return {
              ...diffObject,
              objects_diff_result: typeFilteredObjects
            };
          }
        );
        return {
          ...item,
          database_diff_objects: filteredDiffObjects
        };
      });
  }, [comparisonResults, showDifferencesOnly, filterType]);
  const selectedBaselineInstanceInfo = getInstanceInfoBySelectedValue(
    selectedBaselineInstanceValue
  );
  const selectedComparisonInstanceInfo = getInstanceInfoBySelectedValue(
    selectedComparisonInstanceValue
  );
  const genDatabaseDiffModifiedSQLsParams:
    | IGenDatabaseDiffModifySQLsV1Params
    | undefined = useMemo(() => {
    if (filteredComparisonResults.length === 0) {
      return undefined;
    }
    return {
      project_name: projectName,
      base_instance_id: selectedBaselineInstanceInfo?.instanceId,
      comparison_instance_id: selectedComparisonInstanceInfo?.instanceId,
      database_schema_objects: (() => {
        const parseResults = filteredWithoutParentNodeKey(
          checkedObjectNodeKeys
        ).map((key) => {
          const { comparisonSchemaName, baselineSchemaName } = parseTreeNodeKey(
            key,
            filteredComparisonResults
          );
          return {
            base_schema_name:
              selectedBaselineInstanceInfo?.schemaName ?? baselineSchemaName,
            comparison_schema_name:
              selectedComparisonInstanceInfo?.schemaName ??
              comparisonSchemaName,
            key
          };
        });
        const groupedResults = parseResults.reduce(
          (acc, curr) => {
            const key = `${curr.base_schema_name}_${curr.comparison_schema_name}`;
            if (!acc[key]) {
              acc[key] = {
                base_schema_name: curr.base_schema_name!,
                comparison_schema_name: curr.comparison_schema_name!,
                keys: []
              };
            }
            if (isValidChildNodeKey(curr.key)) {
              acc[key].keys.push(curr.key);
            }
            return acc;
          },
          {} as Record<
            string,
            {
              base_schema_name: string;
              comparison_schema_name: string;
              keys: string[];
            }
          >
        );
        return Object.values(groupedResults).map(
          ({ base_schema_name, comparison_schema_name, keys }) => ({
            base_schema_name,
            comparison_schema_name,
            database_objects: keys.map((key) => {
              const parseNodeKeyResult = parseTreeNodeKey(
                key,
                filteredComparisonResults
              );
              return {
                object_name: parseNodeKeyResult.objectName,
                object_type:
                  parseNodeKeyResult.objectType as DatabaseObjectObjectTypeEnum
              };
            })
          })
        );
      })()
    };
  }, [
    checkedObjectNodeKeys,
    filteredComparisonResults,
    projectName,
    selectedBaselineInstanceInfo?.instanceId,
    selectedBaselineInstanceInfo?.schemaName,
    selectedComparisonInstanceInfo?.instanceId,
    selectedComparisonInstanceInfo?.schemaName
  ]);
  const {
    loading: generateModifySqlPending,
    data: databaseDiffModifiedSqlInfos,
    run: generateModifiedSqlInfoApi,
    mutate: updateModifiedSqlInfos
  } = useRequest(
    () => {
      return databaseCompareService
        .genDatabaseDiffModifySQLsV1(genDatabaseDiffModifiedSQLsParams!)
        .then((res) => res.data.data);
    },
    {
      manual: true
    }
  );
  const executeComparison = async () => {
    const values = await form.validateFields();
    updateComparisonResult(undefined);
    setCheckedObjectNodeKeys([]);
    setFilterType(undefined);
    setTreeExpandedKeys([]);
    resetShowDifferencesOnly();
    setComparisonStartTime(undefined);
    setComparisonEndTime(undefined);
    executeComparisonApi(values.baselineInstance, values.comparisonInstance);
  };
  const onCloseModifiedSqlDrawer = () => {
    updateModifiedSqlInfos(undefined);
    closeOpenModifiedSqlDrawer();
  };
  const generateModifiedSqlEvent = () => {
    if (filteredComparisonResults && genDatabaseDiffModifiedSQLsParams) {
      const comparisonResultsWithCheckNodeKeys = filteredWithoutParentNodeKey(
        checkedObjectNodeKeys
      ).map((key) =>
        getComparisonResultByNodeKey(filteredComparisonResults, key)
      );
      if (
        comparisonResultsWithCheckNodeKeys.includes(
          ObjectDiffResultComparisonResultEnum.same
        )
      ) {
        messageApi.error(t('dataSourceComparison.entry.generateSQLErrorTips'));
        return;
      }
      openModifiedSqlDrawer();
      generateModifiedSqlInfoApi();
    }
  };
  const noDifferencesFound = useMemo(() => {
    return filteredComparisonResults.every(
      (item) => item.comparison_result === SchemaObjectComparisonResultEnum.same
    );
  }, [filteredComparisonResults]);
  const handleCardClick = (type: ObjectDiffResultComparisonResultEnum) => {
    setFilterType(type === filterType ? undefined : type);
    const allMatchStatusExpandedKeys = generateAllMatchStatusExpandedKeys(
      type,
      filteredComparisonResults
    );
    if (!allMatchStatusExpandedKeys) return;
    setTreeExpandedKeys((keys) => {
      return [...keys, ...allMatchStatusExpandedKeys];
    });
    setTimeout(() => {
      const nodeKey = getFirstMatchNodeKey(filteredComparisonResults, type);
      if (nodeKey) {
        // 先滚动外层容器到底部
        window.scrollTo({
          top: document.documentElement.scrollHeight,
          behavior: 'smooth'
        });

        // 等待外层滚动完成后再滚动 Tree
        setTimeout(() => {
          treeRef.current?.scrollToNode({
            key: nodeKey,
            align: 'top'
          });
          const waitForScroll = () => {
            requestAnimationFrame(() => {
              const getHighlightClass = (
                comparisonType: ObjectDiffResultComparisonResultEnum
              ) => {
                switch (comparisonType) {
                  case ObjectDiffResultComparisonResultEnum.inconsistent:
                    return '.inconsistent';
                  case ObjectDiffResultComparisonResultEnum.comparison_not_exist:
                    return '.missing-comparison';
                  case ObjectDiffResultComparisonResultEnum.base_not_exist:
                    return '.new-comparison';
                  default:
                    return '.object-comparison-result-pass';
                }
              };
              const highlightClass = getHighlightClass(type);
              if (highlightClass) {
                const nodes = document.querySelectorAll(highlightClass);
                if (nodes.length > 0) {
                  nodes.forEach((node) => {
                    node.classList.add('highlight');
                    setTimeout(() => {
                      node.classList.remove('highlight');
                    }, 2000);
                  });
                } else {
                  waitForScroll();
                }
              }
            });
          };
          waitForScroll();
        }, 300);
      }
    }, 100);
  };
  return (
    <ComparisonEntryStyleWrapper>
      {messageContextHolder}

      <ComparisonCardStyleWrapper bordered={false}>
        <ComparisonSelectorFormStyleWrapper form={form}>
          <EnvironmentSelector
            {...otherHookValues}
            updateComparisonResult={updateComparisonResult}
            comparisonObjectTreeOnCheck={setCheckedObjectNodeKeys}
            executeComparisonPending={executeComparisonPending}
          />
        </ComparisonSelectorFormStyleWrapper>

        <BasicButton
          size="large"
          className="full-width-element"
          type="primary"
          onClick={executeComparison}
          disabled={executeComparisonPending}
          loading={executeComparisonPending}
          style={{
            marginTop: 16
          }}
        >
          {t('dataSourceComparison.entry.executeComparison')}
        </BasicButton>
      </ComparisonCardStyleWrapper>

      <EmptyBox
        if={
          filteredComparisonResults.length > 0 &&
          !!selectedBaselineInstanceValue &&
          !!selectedComparisonInstanceValue
        }
      >
        <ComparisonCardStyleWrapper
          bordered={false}
          title={t('dataSourceComparison.entry.overview.title')}
          extra={
            (comparisonStartTime || comparisonEndTime) && (
              <TimeInfo>
                {comparisonStartTime && (
                  <div>
                    {t('dataSourceComparison.overview.startTime')}:{' '}
                    {comparisonStartTime}
                  </div>
                )}
                {comparisonEndTime && (
                  <div>
                    {t('dataSourceComparison.overview.endTime')}:{' '}
                    {comparisonEndTime}
                  </div>
                )}
              </TimeInfo>
            )
          }
        >
          <ComparisonOverview
            comparisonResults={comparisonResults}
            onCardClick={handleCardClick}
            selectedType={filterType}
          />
        </ComparisonCardStyleWrapper>

        <ComparisonCardStyleWrapper
          bordered={false}
          title={t('dataSourceComparison.entry.details.title')}
          extra={
            <ComparisonActionStyleWrapper size={12}>
              {noDifferencesFound ? (
                <BasicToolTip
                  title={t('dataSourceComparison.entry.noDifferencesFound')}
                >
                  <ToggleButtonStyleWrapper
                    disabled={true}
                    active={showDifferencesOnly}
                    onClick={() => {
                      toggleShowDifferencesOnly();
                      setCheckedObjectNodeKeys([]);
                    }}
                  >
                    {t('dataSourceComparison.entry.showDifferencesOnly')}
                  </ToggleButtonStyleWrapper>
                </BasicToolTip>
              ) : (
                <ToggleButtonStyleWrapper
                  active={showDifferencesOnly}
                  onClick={() => {
                    toggleShowDifferencesOnly();
                    setCheckedObjectNodeKeys([]);
                  }}
                >
                  {t('dataSourceComparison.entry.showDifferencesOnly')}
                </ToggleButtonStyleWrapper>
              )}

              {filteredWithoutParentNodeKey(checkedObjectNodeKeys).length ===
              0 ? (
                <BasicToolTip
                  title={t(
                    'dataSourceComparison.entry.generateSQLDisabledTips'
                  )}
                >
                  <BasicButton disabled={true}>
                    {t('dataSourceComparison.entry.generateSQL')}
                  </BasicButton>
                </BasicToolTip>
              ) : (
                <BasicButton onClick={generateModifiedSqlEvent}>
                  {t('dataSourceComparison.entry.generateSQL')}
                </BasicButton>
              )}
            </ComparisonActionStyleWrapper>
          }
        >
          <ComparisonTreeNode
            ref={treeRef}
            comparisonResults={filteredComparisonResults}
            selectedBaselineInstanceInfo={selectedBaselineInstanceInfo}
            selectedComparisonInstanceInfo={selectedComparisonInstanceInfo}
            comparisonObjectTreeOnCheck={setCheckedObjectNodeKeys}
            comparisonObjectCheckKeys={checkedObjectNodeKeys}
            treeExpandedKeys={treeExpandedKeys}
            setTreeExpandedKeys={setTreeExpandedKeys}
          />
        </ComparisonCardStyleWrapper>

        <ModifiedSqlDrawer
          open={modifiedSqlDrawerOpen}
          onClose={onCloseModifiedSqlDrawer}
          instanceType={selectedBaselineInstanceInfo?.instanceType!}
          databaseDiffModifiedSqlInfos={databaseDiffModifiedSqlInfos}
          generateModifySqlPending={generateModifySqlPending}
          comparisonInstanceInfo={selectedComparisonInstanceInfo}
          genDatabaseDiffModifiedSQLsParams={genDatabaseDiffModifiedSQLsParams!}
          dbExistingSchemas={filterSchemasInDatabase(
            checkedObjectNodeKeys,
            filteredComparisonResults
          )}
        />
      </EmptyBox>
    </ComparisonEntryStyleWrapper>
  );
};
export default ComparisonEntry;
