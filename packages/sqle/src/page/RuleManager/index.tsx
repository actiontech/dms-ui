import { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Col, Row, Space, Typography, Image } from 'antd';
import {
  BasicButton,
  BasicSegmented,
  EnterpriseFeatureDisplay,
  PageHeader
} from '@actiontech/shared';
import { TableRefreshButton } from '@actiontech/shared/lib/components/ActiontechTable';
import { SegmentedRowStyleWrapper } from '@actiontech/shared/lib/styleWrapper/element';
import { IconAdd, IconImport } from '@actiontech/shared/lib/Icon';
import eventEmitter from '../../utils/EventEmitter';
import EmitterKey from '../../data/EmitterKey';
import CustomRuleList from '../CustomRule/CustomRuleList';
import RuleTemplateList from '../GlobalRuleTemplate/RuleTemplateList';
import useRuleManagerSegmented from './useRuleManagerSegmented';
import { RuleManagerSegmentedKey } from './index.type';

const RuleManager: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { activeKey, onSegmentedChange } = useRuleManagerSegmented();

  const options = useMemo(
    () => [
      {
        label: t('ruleTemplate.globalRuleTemplateListTitle'),
        value: RuleManagerSegmentedKey.GlobalRuleTemplate,
        components: <RuleTemplateList />,
        toolbarActions: (
          <Space size={12}>
            <BasicButton
              type="text"
              icon={<IconImport />}
              onClick={() => navigate('/sqle/ruleManager/globalImport')}
            >
              {t('ruleTemplate.importRuleTemplate.button')}
            </BasicButton>

            <BasicButton
              type="primary"
              icon={<IconAdd />}
              onClick={() => navigate('/sqle/ruleManager/globalCreate')}
            >
              {t('ruleTemplate.createRuleTemplate.button')}
            </BasicButton>
          </Space>
        )
      },
      {
        label: t('customRule.title'),
        value: RuleManagerSegmentedKey.CustomRule,
        components: (
          <EnterpriseFeatureDisplay
            featureName={t('customRule.title')}
            eeFeatureDescription={
              <Space direction="vertical">
                <Typography.Paragraph className="paragraph">
                  {t('customRule.ceTips')}
                </Typography.Paragraph>
                <Image
                  width="100%"
                  className="ce_img"
                  alt="white_list_preview"
                  src="/static/image/ce_custom_rule_preview.png"
                />
              </Space>
            }
          >
            <CustomRuleList />
          </EnterpriseFeatureDisplay>
        ),
        // #if [ee]
        toolbarActions: (
          <BasicButton
            type="primary"
            onClick={() => navigate('/sqle/ruleManager/customCreate')}
          >
            {t('customRule.filterForm.add')}
          </BasicButton>
        )
        // #endif
      }
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [t]
  );

  const refresh = () => {
    eventEmitter.emit(EmitterKey.Refresh_Global_Rule_Template_List);
    eventEmitter.emit(EmitterKey.Refresh_Custom_Rule_Template_List);
  };

  const renderActiveTab = useCallback(() => {
    return options.find((item) => item.value === activeKey)?.components;
  }, [activeKey, options]);

  return (
    <article>
      <PageHeader
        title={
          <Space>
            {t('ruleManager.pageTitle')}
            <TableRefreshButton refresh={refresh} />
          </Space>
        }
        extra={
          options.find((option) => option.value === activeKey)?.toolbarActions
        }
      />
      <SegmentedRowStyleWrapper>
        <BasicSegmented
          value={activeKey}
          options={options}
          onChange={onSegmentedChange}
        />
      </SegmentedRowStyleWrapper>

      <Row justify={'center'}>
        <Col span={24}>{renderActiveTab()}</Col>
      </Row>
    </article>
  );
};

export default RuleManager;
