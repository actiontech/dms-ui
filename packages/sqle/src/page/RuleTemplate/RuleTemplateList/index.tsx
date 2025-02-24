import { useTranslation } from 'react-i18next';
import { Space } from 'antd';
import {
  PageHeader,
  EmptyBox,
  SegmentedTabs,
  SegmentedTabsProps
} from '@actiontech/shared';
import { TableRefreshButton } from '@actiontech/shared/lib/components/ActiontechTable';
import { useMemo, useState } from 'react';
import {
  PERMISSIONS,
  PermissionsConstantType,
  useCurrentProject,
  usePermission
} from '@actiontech/shared/lib/features';
import { EnumTemplateType } from './index.type';
import ProjectTable from './ProjectTable';
import EventEmitter from '../../../utils/EventEmitter';
import EmitterKey from '../../../data/EmitterKey';
import CloneRuleTemplate from '../CloneRuleTemplate';
import CommonTable from './CommonTable';
import ExportProjectRuleTemplate from '../ExportRuleTemplate';
import { RuleTemplatePageHeaderActions } from './actions';

const RuleTemplateList = () => {
  const { t } = useTranslation();

  const { projectID } = useCurrentProject();

  const pageHeaderActions = RuleTemplatePageHeaderActions(projectID);

  const onRefresh = () => {
    EventEmitter.emit(EmitterKey.Refresh_Rule_Template_List);
  };

  const [activeKey, setActiveKey] = useState(EnumTemplateType.project);

  const { checkPagePermission } = usePermission();

  const tabItems = useMemo<SegmentedTabsProps['items']>(() => {
    const items: Array<
      SegmentedTabsProps['items'][0] & { permission?: PermissionsConstantType }
    > = [
      {
        label: t('ruleTemplate.ruleTemplateTitle.project'),
        value: EnumTemplateType.project,
        children: <ProjectTable />
      },
      {
        label: t('ruleTemplate.ruleTemplateTitle.common'),
        value: EnumTemplateType.common,
        children: <CommonTable />,
        permission: PERMISSIONS.PAGES.SQLE.RULE_MANAGEMENT
      }
    ];

    return items.filter((item) => {
      if (item.permission === undefined) {
        return true;
      }
      return checkPagePermission(item.permission);
    });
  }, [checkPagePermission, t]);

  return (
    <>
      <PageHeader
        title={
          <Space>
            {t('ruleTemplate.pageTitle')}
            <TableRefreshButton refresh={onRefresh} />
          </Space>
        }
        extra={
          <EmptyBox if={activeKey === EnumTemplateType.project}>
            <Space size={12}>
              {pageHeaderActions['export-rule-template']}
              {pageHeaderActions['create-rule-template']}
            </Space>
          </EmptyBox>
        }
      />
      <SegmentedTabs
        activeKey={activeKey}
        onChange={setActiveKey}
        items={tabItems}
      />
      <CloneRuleTemplate />
      <ExportProjectRuleTemplate />
    </>
  );
};

export default RuleTemplateList;
