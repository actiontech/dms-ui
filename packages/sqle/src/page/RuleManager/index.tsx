import { useTranslation } from 'react-i18next';
import { Space, Typography } from 'antd';
import {
  ActionButton,
  EnterpriseFeatureDisplay,
  PageHeader,
  SegmentedTabs
} from '@actiontech/shared';
import { TableRefreshButton } from '@actiontech/shared/lib/components/ActiontechTable';
import eventEmitter from '../../utils/EventEmitter';
import EmitterKey from '../../data/EmitterKey';
import CustomRuleList from '../CustomRule/CustomRuleList';
import RuleTemplateList from '../GlobalRuleTemplate/RuleTemplateList';
import { RuleManagerSegmentedKey } from './index.type';
import useRuleManagerSegmented from './useRuleManagerSegmented';
import { PERMISSIONS, PermissionControl } from '@actiontech/shared/lib/global';
import { LoginBoxOutlined, PlusOutlined } from '@actiontech/icons';

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
    return (
      <>
        <Space>
          <PermissionControl
            permission={PERMISSIONS.ACTIONS.SQLE.GLOBAL_RULE_TEMPLATE.IMPORT}
          >
            <ActionButton
              text={t('ruleTemplate.importRuleTemplate.button')}
              hidden={activeKey !== RuleManagerSegmentedKey.GlobalRuleTemplate}
              icon={<LoginBoxOutlined />}
              actionType="navigate-link"
              link={{ to: `/sqle/rule-manager/global-import` }}
            />
          </PermissionControl>
          <PermissionControl
            permission={PERMISSIONS.ACTIONS.SQLE.GLOBAL_RULE_TEMPLATE.CREATE}
          >
            <ActionButton
              text={t('ruleTemplate.createRuleTemplate.button')}
              hidden={activeKey !== RuleManagerSegmentedKey.GlobalRuleTemplate}
              type="primary"
              icon={
                <PlusOutlined color="currentColor" width={10} height={10} />
              }
              actionType="navigate-link"
              link={{ to: `/sqle/rule-manager/global-create` }}
            />
          </PermissionControl>
        </Space>
        {/* #if [ee] */}
        <PermissionControl
          permission={PERMISSIONS.ACTIONS.SQLE.CUSTOM_RULE.CREATE}
        >
          <ActionButton
            text={t('customRule.filterForm.add')}
            hidden={activeKey !== RuleManagerSegmentedKey.CustomRule}
            type="primary"
            actionType="navigate-link"
            link={{ to: `/sqle/rule-manager/custom-create` }}
          />
        </PermissionControl>
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
