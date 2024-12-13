import { EmptyBox, SQLRenderer } from '@actiontech/shared';
import { IRewriteSuggestion } from '@actiontech/shared/lib/api/sqle/service/common';
import { BusinessWarningStyleWrapper } from './style';
import { useMemo } from 'react';
import { useToggle } from 'ahooks';
import { useTranslation } from 'react-i18next';
import MDEditor from '@uiw/react-md-editor';
import rehypeSanitize from 'rehype-sanitize';
import { RingOutlined, WarningFilled } from '@actiontech/icons';
import OverallRewrittenItem from './OverallRewrittenItem';
import { CopySqlAction, ShowSqlDifferenceAction } from '../Common/actions';
import {
  OptimizationDescriptionStyleWrapper,
  OptimizationSummaryStyleWrapper
} from '../Common/style';
import RewrittenSqlCommonEditor from '../Common/RewrittenSqlCommonEditor';
import useThemeStyleData from '../../../../hooks/useThemeStyleData';

type Props = {
  originalSql: string;
  rewrittenSql: string;
  businessNonEquivalentDesc?: string;
  suggestions: IRewriteSuggestion[];
  optimizedCount: number;
  remainingCount: number;
  businessCount: number;
  businessDesc: string;
  rewrittenSqlBusinessDesc: string;
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
  rewrittenSqlBusinessDesc
}) => {
  const { t } = useTranslation();
  const { sharedTheme } = useThemeStyleData();

  const [showSqlDifference, { toggle: toggleShowSqlDifference }] =
    useToggle(true);

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

  return (
    <section>
      <OverallRewrittenItem
        icon={
          <RingOutlined
            color={sharedTheme.uiToken.colorPrimary}
            height={24}
            width={24}
          />
        }
        title={t('sqlRewrite.summary')}
      >
        <OptimizationDescriptionStyleWrapper>
          <OptimizationSummaryStyleWrapper>
            <li>
              {t('sqlRewrite.sqlRewriteConclusion', {
                optimizedCount,
                remainingCount,
                businessCount
              })}
            </li>
            <li>{businessDesc}</li>
            <li>{rewrittenSqlBusinessDesc}</li>
          </OptimizationSummaryStyleWrapper>
        </OptimizationDescriptionStyleWrapper>
      </OverallRewrittenItem>

      <EmptyBox if={!!overallDDL}>
        <OverallRewrittenItem
          icon={
            <RingOutlined
              color={sharedTheme.uiToken.colorPrimary}
              height={24}
              width={24}
            />
          }
          title={t('sqlRewrite.databaseStructureChangeStatement')}
          action={<CopySqlAction sql={overallDDL} />}
        >
          <SQLRenderer.ViewOnlyEditor
            sql={overallDDL}
            height={readonlyEditorHeight}
          />
        </OverallRewrittenItem>
      </EmptyBox>

      <EmptyBox if={!!rewrittenSql}>
        <OverallRewrittenItem
          className="sql-rewritten-title"
          icon={
            <RingOutlined
              color={sharedTheme.uiToken.colorPrimary}
              height={24}
              width={24}
            />
          }
          title={t('sqlRewrite.sqlRewriteResult')}
          action={
            <>
              <CopySqlAction sql={rewrittenSql} />
              <ShowSqlDifferenceAction
                showSqlDifference={showSqlDifference}
                toggleShowSqlDifference={toggleShowSqlDifference}
              />
            </>
          }
        >
          <RewrittenSqlCommonEditor
            showSqlDifference={showSqlDifference}
            originalSql={originalSql}
            rewrittenSql={rewrittenSql}
          />
        </OverallRewrittenItem>
      </EmptyBox>

      <EmptyBox if={!!businessNonEquivalentDesc}>
        <OverallRewrittenItem
          icon={<WarningFilled height={24} width={24} />}
          title={t('sqlRewrite.riskWarning')}
        >
          <BusinessWarningStyleWrapper
            type="warning"
            message={
              <MDEditor.Markdown
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
