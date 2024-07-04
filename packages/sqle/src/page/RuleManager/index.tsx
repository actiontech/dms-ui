import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Space, Typography } from 'antd';
import {
  BasicButton,
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
import { PlusOutlined, LoginBoxOutlined } from '@actiontech/icons';

const RuleManager: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const { activeKey, updateActiveSegmentedKey } = useRuleManagerSegmented();

  const refresh = () => {
    eventEmitter.emit(EmitterKey.Refresh_Global_Rule_Template_List);
    eventEmitter.emit(EmitterKey.Refresh_Custom_Rule_Template_List);
  };

  const renderExtraButton = () => {
    return (
      <>
        <Space
          size={12}
          hidden={activeKey !== RuleManagerSegmentedKey.GlobalRuleTemplate}
        >
          <BasicButton
            type="text"
            icon={<LoginBoxOutlined />}
            onClick={() => navigate('/sqle/rule-manager/global-import')}
          >
            {t('ruleTemplate.importRuleTemplate.button')}
          </BasicButton>
          <BasicButton
            type="primary"
            icon={<PlusOutlined color="currentColor" width={10} height={10} />}
            onClick={() => navigate('/sqle/rule-manager/global-create')}
          >
            {t('ruleTemplate.createRuleTemplate.button')}
          </BasicButton>
        </Space>

        {/* #if [ee] */}
        <BasicButton
          hidden={activeKey !== RuleManagerSegmentedKey.CustomRule}
          type="primary"
          onClick={() => navigate('/sqle/rule-manager/custom-create')}
        >
          {t('customRule.filterForm.add')}
        </BasicButton>
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
