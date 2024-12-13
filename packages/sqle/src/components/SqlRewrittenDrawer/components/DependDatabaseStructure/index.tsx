import { IRewriteSuggestion } from '@actiontech/shared/lib/api/sqle/service/common';
import { Alert, List, Space } from 'antd';
import RuleLevelIcon from '../../../RuleList/RuleLevelIcon';
import { BasicTypographyEllipsis } from '@actiontech/shared';
import { OptimizationRuleItemStyleWrapper } from '../Common/style';
import { useTranslation } from 'react-i18next';
import EmptyContent from '../Common/EmptyContent';
import { WarningFilled } from '@actiontech/icons';
import { DependDatabaseStructureStyleWrapper } from './style';
import { ToggleButtonStyleWrapper } from '@actiontech/shared/lib/styleWrapper/element';

type Props = {
  dataSource: IRewriteSuggestion[];
  enableStructureOptimize: boolean;
  toggleEnableStructureOptimize: () => void;
};

const DependDatabaseStructure: React.FC<Props> = ({
  dataSource,
  enableStructureOptimize,
  toggleEnableStructureOptimize
}) => {
  const { t } = useTranslation();
  return (
    <DependDatabaseStructureStyleWrapper>
      <Alert
        className="depend-database-structure-tips"
        showIcon
        type="warning"
        message={
          <Space>
            <span>{t('sqlRewrite.rewriteRulesAffectingStructure')}</span>
            <ToggleButtonStyleWrapper
              active={enableStructureOptimize}
              onClick={toggleEnableStructureOptimize}
            >
              {t('sqlRewrite.enableDatabaseStructureOptimization')}
            </ToggleButtonStyleWrapper>
          </Space>
        }
        icon={<WarningFilled />}
      />

      <List
        dataSource={dataSource}
        renderItem={(item) => {
          return (
            <OptimizationRuleItemStyleWrapper hiddenArrow>
              <RuleLevelIcon
                ruleLevel={item.audit_level}
                onlyShowIcon
                iconFontSize={18}
              />
              <BasicTypographyEllipsis
                className="rule-name"
                copyable={false}
                textCont={item.rule_name ?? ''}
              />
            </OptimizationRuleItemStyleWrapper>
          );
        }}
        locale={{
          emptyText: (
            <EmptyContent
              text={t('sqlRewrite.noPendingRewriteRulesForCurrentSql')}
            />
          )
        }}
      />
    </DependDatabaseStructureStyleWrapper>
  );
};

export default DependDatabaseStructure;
