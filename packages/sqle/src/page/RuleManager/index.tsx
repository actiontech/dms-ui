import { useTranslation } from 'react-i18next';
import { Space, Typography } from 'antd';
import { PageHeader, SegmentedTabs } from '@actiontech/dms-kit';
import { EnterpriseFeatureDisplay } from '@actiontech/shared';
import { TableRefreshButton } from '@actiontech/shared/lib/components/ActiontechTable';
import eventEmitter from '../../utils/EventEmitter';
import EmitterKey from '../../data/EmitterKey';
import CustomRuleList from '../CustomRule/CustomRuleList';
import RuleTemplateList from '../GlobalRuleTemplate/RuleTemplateList';
import { RuleManagerSegmentedKey } from './index.type';
import useRuleManagerSegmented from './useRuleManagerSegmented';
import { RuleManagerPageHeaderActions } from './action';
const RuleManager: React.FC = () => {
  const { t } = useTranslation();
  const { activeKey, updateActiveSegmentedKey } = useRuleManagerSegmented();
  const refresh = () => {
    eventEmitter.emit(EmitterKey.Refresh_Global_Rule_Template_List);
    // #if [ee]
    eventEmitter.emit(EmitterKey.Refresh_Custom_Rule_Template_List);
    // #endif
  };
  const renderExtraButton = () => {
    const pageHeaderActions = RuleManagerPageHeaderActions(activeKey);
    return (
      <>
        <Space>
          {pageHeaderActions['import_rule_template']}
          {pageHeaderActions['create_rule_template']}
        </Space>
        {/* #if [ee] */}
        {pageHeaderActions['create_custom_rule']}
        {/* #endif */}
      </>
    );
  };
  return (
    <article>
      <PageHeader
        title={
          <Space>
            {t('ruleManager.pageTitle')}
            <TableRefreshButton refresh={refresh} />
          </Space>
        }
        extra={renderExtraButton()}
      />

      <SegmentedTabs
        activeKey={activeKey}
        onChange={updateActiveSegmentedKey}
        items={[
          {
            label: t('ruleTemplate.globalRuleTemplateListTitle'),
            value: RuleManagerSegmentedKey.GlobalRuleTemplate,
            children: <RuleTemplateList />
          },
          {
            label: t('customRule.title'),
            value: RuleManagerSegmentedKey.CustomRule,
            children: (
              <EnterpriseFeatureDisplay
                featureName={t('customRule.title')}
                eeFeatureDescription={
                  <Typography.Paragraph className="paragraph">
                    {t('customRule.ceTips')}
                  </Typography.Paragraph>
                }
              >
                <CustomRuleList />
              </EnterpriseFeatureDisplay>
            )
          }
        ]}
      />
    </article>
  );
};
export default RuleManager;
