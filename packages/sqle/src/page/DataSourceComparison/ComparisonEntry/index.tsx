import { useTranslation } from 'react-i18next';
import {
  ComparisonActionStyleWrapper,
  ComparisonEntryStyleWrapper,
  ComparisonSelectorFormStyleWrapper
} from './style';
import { BasicButton, BasicToolTips, EmptyBox } from '@actiontech/shared';
import { message } from 'antd';
import { ToggleButtonStyleWrapper } from '@actiontech/shared/lib/styleWrapper/element';
import { useCurrentProject } from '@actiontech/shared/lib/global';
import { useBoolean, useRequest, useToggle } from 'ahooks';
import databaseCompareService from '@actiontech/shared/lib/api/sqle/service/database_comparison';
import EnvironmentSelector from './component/EnvironmentSelector';
import ComparisonTreeNode from './component/ComparisonTreeNode';
import useDataSourceSelectorTree from './hooks/useDataSourceSelectorTree';
import {
  filterSchemasInDatabase,
  filteredWithoutParentNodeKey,
  getComparisonResultByNodeKey,
  parseTreeNodeKey
} from './utils/TreeNode';
import {
  DatabaseObjectObjectTypeEnum,
  ObjectDiffResultComparisonResultEnum,
  SchemaObjectComparisonResultEnum
} from '@actiontech/shared/lib/api/sqle/service/common.enum';
import ModifiedSqlDrawer from './component/ModifiedSqlDrawer';
import { useMemo, useState } from 'react';
import { IGenDatabaseDiffModifySQLsV1Params } from '@actiontech/shared/lib/api/sqle/service/database_comparison/index.d';

const ComparisonEntry: React.FC = () => {
  const { t } = useTranslation();
  const { projectName } = useCurrentProject();
  const [messageApi, messageContextHolder] = message.useMessage();

  const [showDifferencesOnly, { toggle: toggleShowDifferencesOnly }] =
    useToggle(false);

  const [
    modifiedSqlDrawerOpen,
    { setTrue: openModifiedSqlDrawer, setFalse: closeOpenModifiedSqlDrawer }
  ] = useBoolean();

  const [checkedObjectNodeKeys, setCheckedObjectNodeKeys] = useState<string[]>(
    []
  );

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
    (baseLineValue: string, comparisonValue: string) =>
      databaseCompareService
        .executeDatabaseComparisonV1({
          project_name: projectName,
          base_db_object: parse2DatabaseCompareObject(baseLineValue),
          comparison_db_object: parse2DatabaseCompareObject(comparisonValue)
        })
        .then((res) => res.data.data),
    {
      manual: true
    }
  );

  const filteredComparisonResultsWithoutSame = useMemo(() => {
    if (!showDifferencesOnly) {
      return comparisonResults ?? [];
    }

    return (comparisonResults ?? [])
      .filter(
        (item) =>
          item.comparison_result !== SchemaObjectComparisonResultEnum.same
      )
      .map((item) => ({
        ...item,
        database_diff_objects: item.database_diff_objects?.map(
          (diffObject) => ({
            ...diffObject,
            objects_diff_result: diffObject.objects_diff_result?.filter(
              (result) =>
                result.comparison_result !==
                ObjectDiffResultComparisonResultEnum.same
            )
          })
        )
      }));
  }, [comparisonResults, showDifferencesOnly]);

  const selectedBaselineInstanceInfo = getInstanceInfoBySelectedValue(
    selectedBaselineInstanceValue
  );
  const selectedComparisonInstanceInfo = getInstanceInfoBySelectedValue(
    selectedComparisonInstanceValue
  );

  const genDatabaseDiffModifiedSQLsParams:
    | IGenDatabaseDiffModifySQLsV1Params
    | undefined = useMemo(() => {
    if (filteredComparisonResultsWithoutSame.length === 0) {
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
            filteredComparisonResultsWithoutSame
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
            acc[key].keys.push(curr.key);
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
                filteredComparisonResultsWithoutSame
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
    filteredComparisonResultsWithoutSame,
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
    setCheckedObjectNodeKeys([]);
    executeComparisonApi(values.baselineInstance, values.comparisonInstance);
  };

  const onCloseModifiedSqlDrawer = () => {
    updateModifiedSqlInfos(undefined);
    closeOpenModifiedSqlDrawer();
  };

  const generateModifiedSqlEvent = () => {
    if (
      filteredComparisonResultsWithoutSame &&
      genDatabaseDiffModifiedSQLsParams
    ) {
      const comparisonResultsWithCheckNodeKeys = filteredWithoutParentNodeKey(
        checkedObjectNodeKeys
      ).map((key) =>
        getComparisonResultByNodeKey(filteredComparisonResultsWithoutSame, key)
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
  return (
    <ComparisonEntryStyleWrapper>
      {messageContextHolder}
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
      >
        {t('dataSourceComparison.entry.executeComparison')}
      </BasicButton>

      <EmptyBox
        if={
          filteredComparisonResultsWithoutSame.length > 0 &&
          !!selectedBaselineInstanceValue &&
          !!selectedComparisonInstanceValue
        }
      >
        <ComparisonActionStyleWrapper size={12}>
          <ToggleButtonStyleWrapper
            active={showDifferencesOnly}
            onClick={() => {
              toggleShowDifferencesOnly();
              setCheckedObjectNodeKeys([]);
            }}
          >
            {t('dataSourceComparison.entry.showDifferencesOnly')}
          </ToggleButtonStyleWrapper>

          {/* <BasicButton disabled={executeComparisonPending}>
          {t('dataSourceComparison.entry.modifyMappings')}
        </BasicButton> */}

          {filteredWithoutParentNodeKey(checkedObjectNodeKeys).length === 0 ? (
            <BasicToolTips
              title={t('dataSourceComparison.entry.generateSQLDisabledTips')}
            >
              <BasicButton disabled={true}>
                {t('dataSourceComparison.entry.generateSQL')}
              </BasicButton>
            </BasicToolTips>
          ) : (
            <BasicButton onClick={generateModifiedSqlEvent}>
              {t('dataSourceComparison.entry.generateSQL')}
            </BasicButton>
          )}
        </ComparisonActionStyleWrapper>

        <ComparisonTreeNode
          comparisonResults={filteredComparisonResultsWithoutSame ?? []}
          selectedBaselineInstanceInfo={selectedBaselineInstanceInfo}
          selectedComparisonInstanceInfo={selectedComparisonInstanceInfo}
          comparisonObjectTreeOnCheck={setCheckedObjectNodeKeys}
          comparisonObjectCheckKeys={checkedObjectNodeKeys}
        />

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
            filteredComparisonResultsWithoutSame ?? []
          )}
        />
      </EmptyBox>
    </ComparisonEntryStyleWrapper>
  );
};

export default ComparisonEntry;
