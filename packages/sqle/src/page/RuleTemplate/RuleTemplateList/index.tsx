import { useTranslation } from 'react-i18next';

import { Space } from 'antd';
import {
  BasicButton,
  PageHeader,
  BasicSegmented,
  EmptyBox
} from '@actiontech/shared';
import { IconAdd, IconImport } from '@actiontech/shared/lib/Icon';
import { TableRefreshButton } from '@actiontech/shared/lib/components/ActiontechTable';

import { useNavigate } from 'react-router-dom';
import { useState, useMemo } from 'react';
import { useCurrentProject } from '@actiontech/shared/lib/global';
import { useCurrentUser } from '@actiontech/shared/lib/global';
import {
  EnumTemplateType,
  typeTemplateType,
  TemplateTypeData
} from './index.type';
import { RuleTemplateSegmentedStyleWrapper } from '../style';
import ProjectTable from './ProjectTable';
import CommonTable from './CommonTable';

import EventEmitter from '../../../utils/EventEmitter';
import EmitterKey from '../../../data/EmitterKey';
import CloneRuleTemplate from '../CloneRuleTemplate';

const RuleTemplateList = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const { projectName, projectID, projectArchive } = useCurrentProject();
  const { isAdmin, isProjectManager } = useCurrentUser();
  const actionPermission = useMemo(() => {
    return isAdmin || isProjectManager(projectName);
  }, [isAdmin, isProjectManager, projectName]);

  const onCreate = () => {
    navigate(`/sqle/project/${projectID}/rule/template/create`);
  };

  const onImport = () => {
    navigate(`/sqle/project/${projectID}/rule/template/import`);
  };

  const onRefresh = () => {
    EventEmitter.emit(EmitterKey.Refresh_Rule_Template_List);
  };

  const [templateType, setTemplateType] = useState<typeTemplateType>(
    EnumTemplateType.project
  );

  const templateOptions: { label: string; value: typeTemplateType }[] =
    useMemo(() => {
      return TemplateTypeData.map((item: typeTemplateType) => {
        return {
          label: t(`ruleTemplate.ruleTemplateTitle.${item}`),
          value: item
        };
      });
    }, [t]);

  const onChangeType = (type: typeTemplateType) => {
    setTemplateType(type);
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
        extra={
          <EmptyBox
            if={actionPermission && !projectArchive}
            key="ruleTemplateButton"
          >
            <Space size={12} hidden={templateType === EnumTemplateType.common}>
              <BasicButton icon={<IconImport />} onClick={onImport}>
                {t('ruleTemplate.importRuleTemplate.button')}
              </BasicButton>
              <BasicButton type="primary" icon={<IconAdd />} onClick={onCreate}>
                {t('ruleTemplate.createRuleTemplate.button')}
              </BasicButton>
            </Space>
          </EmptyBox>
        }
      />
      <RuleTemplateSegmentedStyleWrapper className="template-type-wrapper">
        <span className="segmented-cont">
          <BasicSegmented
            value={templateType}
            onChange={(v) => {
              const key = v as typeTemplateType;
              onChangeType(key);
            }}
            options={templateOptions}
          />
        </span>
      </RuleTemplateSegmentedStyleWrapper>

      <ProjectTable
        hidden={templateType !== EnumTemplateType.project}
        actionPermission={actionPermission}
      />
      <CommonTable hidden={templateType !== EnumTemplateType.common} />

      <CloneRuleTemplate />
    </>
  );
};

export default RuleTemplateList;
