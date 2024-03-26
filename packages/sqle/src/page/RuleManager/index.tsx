import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Space, Typography } from 'antd';
import {
  BasicButton,
  EnterpriseFeatureDisplay,
  PageHeader
} from '@actiontech/shared';
import { TableRefreshButton } from '@actiontech/shared/lib/components/ActiontechTable';
import { IconAdd, IconImport } from '@actiontech/shared/lib/Icon';
import eventEmitter from '../../utils/EventEmitter';
import EmitterKey from '../../data/EmitterKey';
import CustomRuleList from '../CustomRule/CustomRuleList';
import RuleTemplateList from '../GlobalRuleTemplate/RuleTemplateList';
import { RuleManagerSegmentedKey } from './index.type';
import {
  BasicSegmentedPage,
  useSegmentedPageParams
} from '@actiontech/shared/lib/components/BasicSegmentedPage';
import useRuleManagerSegmented from './useRuleManagerSegmented';

const RuleManager: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const { activeKey } = useRuleManagerSegmented();

  const {
    updateSegmentedPageData,
    renderExtraButton,
    onChange,
    ...otherProps
  } = useSegmentedPageParams<RuleManagerSegmentedKey>();

  useEffect(() => {
    updateSegmentedPageData([
      {
        label: t('ruleTemplate.globalRuleTemplateListTitle'),
        value: RuleManagerSegmentedKey.GlobalRuleTemplate,
        content: <RuleTemplateList />,
        extraButton: (
          <Space size={12}>
            <BasicButton
              type="text"
              icon={<IconImport />}
              onClick={() => navigate('/sqle/rule-manager/global-import')}
            >
              {t('ruleTemplate.importRuleTemplate.button')}
            </BasicButton>

            <BasicButton
              type="primary"
              icon={<IconAdd />}
              onClick={() => navigate('/sqle/rule-manager/global-create')}
            >
              {t('ruleTemplate.createRuleTemplate.button')}
            </BasicButton>
          </Space>
        )
      },
      {
        label: t('customRule.title'),
        value: RuleManagerSegmentedKey.CustomRule,
        content: (
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
        ),
        // #if [ee]
        extraButton: (
          <BasicButton
            type="primary"
            onClick={() => navigate('/sqle/rule-manager/custom-create')}
          >
            {t('customRule.filterForm.add')}
          </BasicButton>
        )
        // #endif
      }
    ]);
  }, [navigate, t, updateSegmentedPageData]);

  useEffect(() => {
    if (activeKey) {
      onChange(activeKey);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const refresh = () => {
    eventEmitter.emit(EmitterKey.Refresh_Global_Rule_Template_List);
    eventEmitter.emit(EmitterKey.Refresh_Custom_Rule_Template_List);
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
      <BasicSegmentedPage onChange={onChange} {...otherProps} />
    </article>
  );
};

export default RuleManager;
