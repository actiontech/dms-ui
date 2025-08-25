import { IRewriteSuggestion } from '@actiontech/shared/lib/api/sqle/service/common';
import {
  RewrittenSuggestionDetailsStyleWrapper,
  OptimizationDescriptionStyleWrapper,
  OptimizationRuleItemStyleWrapper,
  MarkdownPreviewModeStyleWrapper
} from '../Common/style';
import { EmptyBox, LazyLoadComponent } from '@actiontech/dms-kit';
import { BasicTypographyEllipsis, TypedLink } from '@actiontech/shared';
import RuleLevelIcon from '../../../RuleList/RuleLevelIcon';
import { useToggle } from 'ahooks';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import rehypeSanitize from 'rehype-sanitize';
import { ROUTE_PATHS } from '@actiontech/dms-kit';
import { useCurrentProject } from '@actiontech/shared/lib/features';
import { CopySqlAction, ShowSqlDifferenceAction } from '../Common/actions';
import RewrittenSqlCommonEditor from '../Common/RewrittenSqlCommonEditor';
type Props = {
  dataSource: IRewriteSuggestion;
  originalSql: string;
  taskID: string;
  sqlNumber: number;
};
const RewrittenSuggestionItem: React.FC<Props> = ({
  dataSource,
  originalSql,
  taskID,
  sqlNumber
}) => {
  const { t } = useTranslation();
  const { rule_name, desc, rewritten_sql, audit_level, ddl_dcl } = dataSource;
  const [showSqlDifference, { toggle: toggleShowSqlDifference }] =
    useToggle(true);
  const [showDetails, { toggle: toggleShowDetails }] = useToggle();
  const { projectID } = useCurrentProject();
  const displaySQL = useMemo(() => {
    if (!ddl_dcl) {
      return rewritten_sql;
    }
    return `${ddl_dcl}\n\n${rewritten_sql}`;
  }, [ddl_dcl, rewritten_sql]);
  return (
    <>
      <OptimizationRuleItemStyleWrapper
        onClick={toggleShowDetails}
        isActive={showDetails}
      >
        <RuleLevelIcon ruleLevel={audit_level} onlyShowIcon iconFontSize={18} />
        <BasicTypographyEllipsis
          className="rule-name"
          copyable={false}
          textCont={rule_name ?? ''}
        />
      </OptimizationRuleItemStyleWrapper>

      <LazyLoadComponent open={showDetails} animation={false}>
        <RewrittenSuggestionDetailsStyleWrapper>
          <div className="action-items-wrapper">
            <CopySqlAction
              sql={displaySQL ?? '-'}
              hidden={originalSql === displaySQL}
            />
            <ShowSqlDifferenceAction
              hidden={originalSql === displaySQL}
              showSqlDifference={showSqlDifference}
              toggleShowSqlDifference={toggleShowSqlDifference}
            />
          </div>

          <EmptyBox if={originalSql !== displaySQL}>
            <RewrittenSqlCommonEditor
              showSqlDifference={showSqlDifference}
              originalSql={originalSql}
              rewrittenSql={displaySQL ?? '-'}
            />
          </EmptyBox>

          <EmptyBox if={!!desc}>
            <OptimizationDescriptionStyleWrapper>
              <MarkdownPreviewModeStyleWrapper
                className="description-content"
                source={desc}
                rehypePlugins={[rehypeSanitize]}
              />
              <EmptyBox if={!!ddl_dcl}>
                <TypedLink
                  className="sql-analyze-link"
                  target="_blank"
                  to={ROUTE_PATHS.SQLE.SQL_EXEC_WORKFLOW.analyze}
                  params={{
                    projectID,
                    taskId: taskID,
                    sqlNum: sqlNumber.toString()
                  }}
                >
                  {t('sqlRewrite.viewCurrentTableStructureInSqlAnalysis')}
                </TypedLink>
              </EmptyBox>
            </OptimizationDescriptionStyleWrapper>
          </EmptyBox>
        </RewrittenSuggestionDetailsStyleWrapper>
      </LazyLoadComponent>
    </>
  );
};
export default RewrittenSuggestionItem;
