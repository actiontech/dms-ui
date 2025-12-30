import { EmptyBox } from '@actiontech/dms-kit';
import { SQLRenderer } from '@actiontech/shared';
import { IRewriteSuggestion } from '@actiontech/shared/lib/api/sqle/service/common';
import {
  BusinessWarningStyleWrapper,
  DiffSQLEditorSubTitleStyleWrapper,
  ExecuteOrderExplanationStyleWrapper,
  SqlComparisonTitleStyleWrapper
} from './style';
import { useMemo } from 'react';
import { useToggle } from 'ahooks';
import { useTranslation } from 'react-i18next';
import rehypeSanitize from 'rehype-sanitize';
import { RingOutlined, WarningFilled } from '@actiontech/icons';
import OverallRewrittenItem from './OverallRewrittenItem';
import {
  CopySqlAction,
  ShowExecuteOrderExplanationAction,
  ShowSqlDifferenceAction
} from '../Common/actions';
import {
  MarkdownPreviewModeStyleWrapper,
  OptimizationDescriptionStyleWrapper,
  OptimizationSummaryStyleWrapper
} from '../Common/style';
import RewrittenSqlCommonEditor from '../Common/RewrittenSqlCommonEditor';
import useThemeStyleData from '../../../../hooks/useThemeStyleData';
import { Typography } from 'antd';
import { useCurrentUser } from '@actiontech/shared/lib/features';
type Props = {
  originalSql: string;
  rewrittenSql?: string;
  businessNonEquivalentDesc?: string;
  suggestions: IRewriteSuggestion[];
  optimizedCount: number;
  remainingCount: number;
  businessCount: number;
  businessDesc: string;
  sqlLogicDesc: string;
  rewrittenSqlLogicDesc: string;
  isRewriting: boolean;
};
const OverallRewrittenSuggestion: React.FC<Props> = ({
  rewrittenSql,
  originalSql,
  businessNonEquivalentDesc,
  suggestions,
  optimizedCount,
  remainingCount,
  businessCount,
  businessDesc,
  sqlLogicDesc,
  rewrittenSqlLogicDesc,
  isRewriting
}) => {
  const { t } = useTranslation();
  const { sharedTheme } = useThemeStyleData();
  const { theme } = useCurrentUser();
  const TitleCommonIcon = (
    <RingOutlined
      color={sharedTheme.uiToken.colorPrimary}
      height={24}
      width={24}
    />
  );
  const [showSqlDifference, { toggle: toggleShowSqlDifference }] =
    useToggle(true);
  const [
    showExecuteOrderExplanation,
    { toggle: toggleShowExecuteOrderExplanation }
  ] = useToggle(false);
  const overallDDL = useMemo(() => {
    return `${suggestions
      .map((v) => v.ddl_dcl)
      .filter(Boolean)
      .join('\n\n')}`;
  }, [suggestions]);
  const readonlyEditorHeight = useMemo(() => {
    if (!overallDDL) {
      return 200;
    }
    return overallDDL.split('\n').length * 40;
  }, [overallDDL]);
  const renderSummaryText = () => {
    if (isRewriting) {
      return <li>{t('sqlRewrite.rewriteInProgressTip')}</li>;
    }
    return (
      <>
        <li>
          {t('sqlRewrite.sqlRewriteConclusion', {
            optimizedCount,
            remainingCount,
            businessCount
          })}
        </li>
        <li hidden={!businessDesc}>
          <MarkdownPreviewModeStyleWrapper
            source={businessDesc}
            rehypePlugins={[rehypeSanitize]}
          />
        </li>
      </>
    );
  };
  return (
    <section>
      <OverallRewrittenItem
        icon={TitleCommonIcon}
        title={t('sqlRewrite.summary')}
      >
        <OptimizationDescriptionStyleWrapper>
          <OptimizationSummaryStyleWrapper>
            {renderSummaryText()}
          </OptimizationSummaryStyleWrapper>
        </OptimizationDescriptionStyleWrapper>
      </OverallRewrittenItem>

      <EmptyBox if={!!overallDDL}>
        <OverallRewrittenItem
          icon={TitleCommonIcon}
          title={t('sqlRewrite.databaseStructureChangeStatement')}
          action={<CopySqlAction sql={overallDDL} />}
        >
          <SQLRenderer.ViewOnlyEditor
            theme={theme}
            sql={overallDDL}
            height={readonlyEditorHeight}
          />
        </OverallRewrittenItem>
      </EmptyBox>

      <EmptyBox if={!!rewrittenSql}>
        <OverallRewrittenItem
          className="sql-rewritten-title"
          icon={TitleCommonIcon}
          title={t('sqlRewrite.sqlRewriteResult')}
          action={
            <>
              <CopySqlAction sql={rewrittenSql!} />
              <ShowSqlDifferenceAction
                showSqlDifference={showSqlDifference}
                toggleShowSqlDifference={toggleShowSqlDifference}
              />
              <ShowExecuteOrderExplanationAction
                showExecuteOrderExplanation={showExecuteOrderExplanation}
                toggleShowExecuteOrderExplanation={
                  toggleShowExecuteOrderExplanation
                }
              />
            </>
          }
        >
          <DiffSQLEditorSubTitleStyleWrapper hidden={!showSqlDifference}>
            <SqlComparisonTitleStyleWrapper className="original">
              <span className="sql-indicator"></span>
              <Typography.Text type="secondary" className="subtitle-item-text">
                {t('sqlRewrite.originalSql')}
              </Typography.Text>
            </SqlComparisonTitleStyleWrapper>

            <SqlComparisonTitleStyleWrapper className="optimized">
              <span className="sql-indicator"></span>
              <Typography.Text type="secondary" className="subtitle-item-text">
                {t('sqlRewrite.rewrittenSql')}
              </Typography.Text>
            </SqlComparisonTitleStyleWrapper>
          </DiffSQLEditorSubTitleStyleWrapper>
          <RewrittenSqlCommonEditor
            showSqlDifference={showSqlDifference}
            originalSql={originalSql}
            rewrittenSql={rewrittenSql!}
          />
        </OverallRewrittenItem>

        <EmptyBox if={showExecuteOrderExplanation}>
          <OverallRewrittenItem
            className="sql-rewritten-title"
            icon={TitleCommonIcon}
            title={t('sqlRewrite.executionOrderExplanation')}
          >
            <ExecuteOrderExplanationStyleWrapper>
              <div className="execute-item">
                <SqlComparisonTitleStyleWrapper className="original">
                  <span className="sql-indicator"></span>
                  <Typography.Text
                    type="secondary"
                    className="subtitle-item-text"
                  >
                    {t('sqlRewrite.originalSql')}
                  </Typography.Text>
                </SqlComparisonTitleStyleWrapper>

                <OptimizationDescriptionStyleWrapper className="execute-item-content">
                  <MarkdownPreviewModeStyleWrapper
                    className="description-content"
                    source={sqlLogicDesc}
                    rehypePlugins={[rehypeSanitize]}
                  />
                </OptimizationDescriptionStyleWrapper>
              </div>
              <div className="execute-item">
                <SqlComparisonTitleStyleWrapper className="optimized">
                  <span className="sql-indicator"></span>
                  <Typography.Text
                    type="secondary"
                    className="subtitle-item-text"
                  >
                    {t('sqlRewrite.rewrittenSql')}
                  </Typography.Text>
                </SqlComparisonTitleStyleWrapper>
                <OptimizationDescriptionStyleWrapper className="execute-item-content">
                  <MarkdownPreviewModeStyleWrapper
                    className="description-content"
                    source={rewrittenSqlLogicDesc}
                    rehypePlugins={[rehypeSanitize]}
                  />
                </OptimizationDescriptionStyleWrapper>
              </div>
            </ExecuteOrderExplanationStyleWrapper>
          </OverallRewrittenItem>
        </EmptyBox>
      </EmptyBox>

      <EmptyBox if={!!businessNonEquivalentDesc}>
        <OverallRewrittenItem
          icon={<WarningFilled height={24} width={24} />}
          title={t('sqlRewrite.riskWarning')}
        >
          <BusinessWarningStyleWrapper
            type="warning"
            message={
              <MarkdownPreviewModeStyleWrapper
                source={businessNonEquivalentDesc}
                rehypePlugins={[rehypeSanitize]}
              />
            }
          />
        </OverallRewrittenItem>
      </EmptyBox>
    </section>
  );
};
export default OverallRewrittenSuggestion;
