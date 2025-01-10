import { BasicButton, BasicDrawer, EmptyBox } from '@actiontech/shared';
import { IRewriteSuggestion } from '@actiontech/shared/lib/api/sqle/service/common';
import { RewriteSuggestionTypeEnum } from '@actiontech/shared/lib/api/sqle/service/common.enum';
import { useRequest } from 'ahooks';
import { CollapseProps } from 'antd';
import { useCallback, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import BusinessRewrittenSuggestion from './components/BusinessRewrittenSuggestion';
import CustomLoadingIndicator from './components/CustomLoadingIndicator';
import DependDatabaseStructure from './components/DependDatabaseStructure';
import OverallRewrittenSuggestion from './components/OverallRewrittenSuggestion';
import RewrittenSuggestionDetails from './components/RewrittenSuggestionDetails';
import { SqlRewrittenDrawerWithBaseProps } from './index.type';
import {
  ModuleHeaderTitleStyleWrapper,
  RewrittenSqlCollapseStyleWrapper
} from './style';
import TaskService from '@actiontech/shared/lib/api/sqle/service/task';
import { useEffect } from 'react';
import { ResponseCode } from '@actiontech/shared/lib/enum';

enum CollapseItemKeyEnum {
  rewritten_sql_details,
  business_rewritten_suggestions,
  overall_rewritten_suggestion,
  depend_database_structure_optimization
}

const SqlRewrittenDrawerEE: React.FC<SqlRewrittenDrawerWithBaseProps> = ({
  open,
  taskID,
  originSqlInfo,
  ...props
}) => {
  const { t } = useTranslation();
  const sqlNumberToRewriteStatusMap = useRef<Map<number, boolean>>(new Map());
  const [enableStructureOptimize, updateEnableStructureOptimize] =
    useState(false);

  const {
    loading,
    data,
    run: rewriteSQLAction
  } = useRequest(
    (sqlNumber: number, enable: boolean) =>
      TaskService.RewriteSQL({
        task_id: taskID,
        number: sqlNumber,
        enable_structure_type: enable
      }).then((res) => {
        if (res.data.code === ResponseCode.SUCCESS) {
          sqlNumberToRewriteStatusMap.current.set(sqlNumber, true);
          return res.data.data;
        }
      }),
    {
      manual: true
    }
  );

  const toggleEnableStructureOptimizeAction = useCallback(() => {
    updateEnableStructureOptimize(!enableStructureOptimize);
    rewriteSQLAction(originSqlInfo.number, !enableStructureOptimize);
  }, [
    enableStructureOptimize,
    originSqlInfo.number,
    rewriteSQLAction,
    updateEnableStructureOptimize
  ]);

  const collapseItems = useMemo<CollapseProps['items']>(() => {
    const statementTypeSuggestion: IRewriteSuggestion[] = [];
    const structureTypeSuggestion: IRewriteSuggestion[] = [];
    const otherTypeSuggestion: IRewriteSuggestion[] = [];

    data?.suggestions?.forEach((item) => {
      if (item.type === RewriteSuggestionTypeEnum.statement) {
        statementTypeSuggestion.push(item);
      } else if (item.type === RewriteSuggestionTypeEnum.structure) {
        structureTypeSuggestion.push(item);
      } else if (item.type === RewriteSuggestionTypeEnum.other) {
        otherTypeSuggestion.push(item);
      }
    });

    const optimizedSuggestions = enableStructureOptimize
      ? [...statementTypeSuggestion, ...structureTypeSuggestion]
      : statementTypeSuggestion;
    const remainingSuggestions = enableStructureOptimize
      ? []
      : structureTypeSuggestion;
    const businessSuggestions = otherTypeSuggestion;

    return [
      {
        key: CollapseItemKeyEnum.overall_rewritten_suggestion,
        label: (
          <ModuleHeaderTitleStyleWrapper>
            <span className="title">
              {t('sqlRewrite.overallRewriteSuggestions')}
            </span>
          </ModuleHeaderTitleStyleWrapper>
        ),
        children: (
          <OverallRewrittenSuggestion
            originalSql={originSqlInfo?.sql ?? ''}
            businessNonEquivalentDesc={data?.business_non_equivalent_desc}
            rewrittenSql={data?.rewritten_sql}
            suggestions={data?.suggestions ?? []}
            optimizedCount={optimizedSuggestions.length}
            remainingCount={remainingSuggestions.length}
            businessCount={businessSuggestions.length}
            businessDesc={data?.business_desc ?? ''}
            sqlLogicDesc={data?.logic_desc ?? ''}
            rewrittenSqlLogicDesc={data?.rewritten_sql_logic_desc ?? ''}
          />
        )
      },
      {
        key: CollapseItemKeyEnum.rewritten_sql_details,
        label: (
          <ModuleHeaderTitleStyleWrapper>
            <span className="title">
              {t('sqlRewrite.alreadyRewrittenRules')}
            </span>
            <span className="optimized-count count">
              {optimizedSuggestions.length}
            </span>
          </ModuleHeaderTitleStyleWrapper>
        ),
        children: (
          <RewrittenSuggestionDetails
            taskID={taskID}
            sqlNumber={originSqlInfo?.number ?? 0}
            originalSql={originSqlInfo?.sql ?? ''}
            dataSource={optimizedSuggestions}
          />
        )
      },
      {
        key: CollapseItemKeyEnum.depend_database_structure_optimization,
        label: (
          <div className="flex-space-between">
            <ModuleHeaderTitleStyleWrapper>
              <span className="title">
                {t('sqlRewrite.pendingRewriteRules')}
              </span>
              <span className="remaining-count count">
                {remainingSuggestions.length}
              </span>
            </ModuleHeaderTitleStyleWrapper>

            <BasicButton onClick={toggleEnableStructureOptimizeAction}>
              {t('sqlRewrite.enableDatabaseStructureOptimization')}
            </BasicButton>
          </div>
        ),
        children: (
          <DependDatabaseStructure
            dataSource={remainingSuggestions}
            toggleEnableStructureOptimizeAction={
              toggleEnableStructureOptimizeAction
            }
          />
        )
      },
      {
        key: CollapseItemKeyEnum.business_rewritten_suggestions,
        label: (
          <ModuleHeaderTitleStyleWrapper>
            <span className="title">
              {t('sqlRewrite.businessInterventionRequired')}
            </span>
            <span className="business-count count">
              {businessSuggestions.length}
            </span>
          </ModuleHeaderTitleStyleWrapper>
        ),
        children: (
          <BusinessRewrittenSuggestion dataSource={businessSuggestions} />
        )
      }
    ].filter((item) => {
      if (remainingSuggestions.length === 0) {
        return (
          item.key !==
          CollapseItemKeyEnum.depend_database_structure_optimization
        );
      }
      return true;
    });
  }, [
    data?.business_desc,
    data?.business_non_equivalent_desc,
    data?.logic_desc,
    data?.rewritten_sql,
    data?.rewritten_sql_logic_desc,
    data?.suggestions,
    enableStructureOptimize,
    toggleEnableStructureOptimizeAction,
    originSqlInfo?.number,
    originSqlInfo?.sql,
    t,
    taskID
  ]);

  useEffect(() => {
    if (
      open &&
      originSqlInfo &&
      !sqlNumberToRewriteStatusMap.current.has(originSqlInfo.number)
    ) {
      //初次加载数据重置该状态
      updateEnableStructureOptimize(false);
      rewriteSQLAction(originSqlInfo.number, false);
    }
  }, [open, originSqlInfo, rewriteSQLAction]);

  return (
    <BasicDrawer
      {...props}
      open={open}
      extra={
        <EmptyBox
          if={
            !!originSqlInfo &&
            !!sqlNumberToRewriteStatusMap.current.has(originSqlInfo!.number)
          }
        >
          <BasicButton
            loading={loading}
            type="primary"
            onClick={() => {
              updateEnableStructureOptimize(false);
              rewriteSQLAction(originSqlInfo.number, false);
            }}
          >
            {t('sqlRewrite.updateRewrittenResult')}
          </BasicButton>
        </EmptyBox>
      }
    >
      <EmptyBox if={!loading} defaultNode={<CustomLoadingIndicator />}>
        <RewrittenSqlCollapseStyleWrapper
          defaultActiveKey={[CollapseItemKeyEnum.overall_rewritten_suggestion]}
          items={collapseItems}
        />
      </EmptyBox>
    </BasicDrawer>
  );
};

export default SqlRewrittenDrawerEE;
