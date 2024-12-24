import { BasicButton, EmptyBox } from '@actiontech/shared';
import { IRewriteSuggestion } from '@actiontech/shared/lib/api/sqle/service/common';
import { RewriteSuggestionTypeEnum } from '@actiontech/shared/lib/api/sqle/service/common.enum';
import { useRequest } from 'ahooks';
import { CollapseProps } from 'antd';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import BusinessRewrittenSuggestion from './components/BusinessRewrittenSuggestion';
import CustomLoadingIndicator from './components/CustomLoadingIndicator';
import DependDatabaseStructure from './components/DependDatabaseStructure';
import OverallRewrittenSuggestion from './components/OverallRewrittenSuggestion';
import RewrittenSuggestionDetails from './components/RewrittenSuggestionDetails';
import { SqlRewrittenDrawerProps } from './index.type';
import {
  ModuleHeaderTitleStyleWrapper,
  RewrittenSqlCollapseStyleWrapper
} from './style';
import TaskService from '@actiontech/shared/lib/api/sqle/service/task';

type Props = Omit<SqlRewrittenDrawerProps, 'onClose'> & {
  enableStructureOptimize: boolean;
  toggleEnableStructureOptimize: () => void;
};

enum CollapseItemKeyEnum {
  rewritten_sql_details,
  business_rewritten_suggestions,
  overall_rewritten_suggestion,
  depend_database_structure_optimization
}

const SqlRewrittenDrawerEE: React.FC<Props> = ({
  open,
  taskID,
  originSqlInfo,
  enableStructureOptimize,
  toggleEnableStructureOptimize
}) => {
  const { t } = useTranslation();
  const { loading, data } = useRequest(
    () =>
      TaskService.RewriteSQL({
        task_id: taskID,
        number: originSqlInfo!.number,
        enable_structure_type: enableStructureOptimize
      }).then((res) => res.data.data),
    {
      ready: open && !!originSqlInfo,
      refreshDeps: [enableStructureOptimize]
    }
  );

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
        label: t('sqlRewrite.overallRewriteSuggestions'),
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

            <BasicButton onClick={toggleEnableStructureOptimize}>
              {t('sqlRewrite.enableDatabaseStructureOptimization')}
            </BasicButton>
          </div>
        ),
        children: (
          <DependDatabaseStructure
            dataSource={remainingSuggestions}
            toggleEnableStructureOptimize={toggleEnableStructureOptimize}
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
    originSqlInfo?.number,
    originSqlInfo?.sql,
    t,
    taskID,
    toggleEnableStructureOptimize
  ]);

  return (
    <EmptyBox if={!loading} defaultNode={<CustomLoadingIndicator />}>
      <RewrittenSqlCollapseStyleWrapper
        defaultActiveKey={[CollapseItemKeyEnum.overall_rewritten_suggestion]}
        items={collapseItems}
      />
    </EmptyBox>
  );
};

export default SqlRewrittenDrawerEE;
