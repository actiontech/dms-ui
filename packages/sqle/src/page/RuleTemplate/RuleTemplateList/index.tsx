import { useTranslation } from 'react-i18next';
import { Space } from 'antd';
import {
  BasicButton,
  PageHeader,
  EmptyBox,
  SegmentedTabs
} from '@actiontech/shared';
import { IconAdd, IconImport } from '@actiontech/shared/lib/Icon';
import { TableRefreshButton } from '@actiontech/shared/lib/components/ActiontechTable';
import { useNavigate } from 'react-router-dom';
import { useMemo, useState } from 'react';
import { useCurrentProject } from '@actiontech/shared/lib/global';
import { useCurrentUser } from '@actiontech/shared/lib/global';
import { EnumTemplateType } from './index.type';
import ProjectTable from './ProjectTable';
import EventEmitter from '../../../utils/EventEmitter';
import EmitterKey from '../../../data/EmitterKey';
import CloneRuleTemplate from '../CloneRuleTemplate';
import CommonTable from './CommonTable';

const RuleTemplateList = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const { projectName, projectID, projectArchive } = useCurrentProject();

  const { isAdmin, isProjectManager } = useCurrentUser();

  const actionPermission = useMemo(() => {
    return isAdmin || isProjectManager(projectName);
  }, [isAdmin, isProjectManager, projectName]);

  const onRefresh = () => {
    EventEmitter.emit(EmitterKey.Refresh_Rule_Template_List);
  };

  const [activeKey, setActiveKey] = useState(EnumTemplateType.project);

  const renderExtraButton = () => {
    const onCreate = () => {
      navigate(`/sqle/project/${projectID}/rule/template/create`);
    };

    const onImport = () => {
      navigate(`/sqle/project/${projectID}/rule/template/import`);
    };
    return (
      <>
        <EmptyBox
          if={
            actionPermission &&
            !projectArchive &&
            activeKey === EnumTemplateType.project
          }
          key="ruleTemplateButton"
        >
          <Space size={12}>
            <BasicButton icon={<IconImport />} onClick={onImport}>
              {t('ruleTemplate.importRuleTemplate.button')}
            </BasicButton>
            <BasicButton type="primary" icon={<IconAdd />} onClick={onCreate}>
              {t('ruleTemplate.createRuleTemplate.button')}
            </BasicButton>
          </Space>
        </EmptyBox>
      </>
    );
  };

  return (
    <>
      <PageHeader
        title={
          <Space>
            {t('ruleTemplate.pageTitle')}
            <TableRefreshButton refresh={onRefresh} />
          </Space>
        }
        extra={renderExtraButton()}
      />
      <SegmentedTabs
        activeKey={activeKey}
        onChange={setActiveKey}
        items={[
          {
            label: t('ruleTemplate.ruleTemplateTitle.project'),
            value: EnumTemplateType.project,
            children: <ProjectTable actionPermission={actionPermission} />
          },
          {
            label: t('ruleTemplate.ruleTemplateTitle.common'),
            value: EnumTemplateType.common,
            children: <CommonTable />
          }
        ]}
      />
      <CloneRuleTemplate />
    </>
  );
};

export default RuleTemplateList;
