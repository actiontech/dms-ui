import { useTranslation } from 'react-i18next';
import { Space } from 'antd';
import { PageHeader, EmptyBox, SegmentedTabs } from '@actiontech/dms-kit';
import { TableRefreshButton } from '@actiontech/dms-kit/es/components/ActiontechTable';
import { useState } from 'react';
import { useCurrentProject } from '@actiontech/shared/lib/features';
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
        items={[
          {
            label: t('ruleTemplate.ruleTemplateTitle.project'),
            value: EnumTemplateType.project,
            children: <ProjectTable />
          },
          {
            label: t('ruleTemplate.ruleTemplateTitle.common'),
            value: EnumTemplateType.common,
            children: <CommonTable />
          }
        ]}
      />
      <CloneRuleTemplate />
      <ExportProjectRuleTemplate />
    </>
  );
};
export default RuleTemplateList;
