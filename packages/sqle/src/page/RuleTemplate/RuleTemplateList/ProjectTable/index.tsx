import { useRequest } from 'ahooks';
import { useCallback, useEffect, useMemo } from 'react';
import { useDispatch } from 'react-redux';
import { message } from 'antd5';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { useCurrentProject } from '@actiontech/shared/lib/global';
import rule_template from '@actiontech/shared/lib/api/sqle/service/rule_template';
import { IProjectRuleTemplateResV1 } from '@actiontech/shared/lib/api/sqle/service/common';
import { IGetProjectRuleTemplateListV1Params } from '@actiontech/shared/lib/api/sqle/service/rule_template/index.d';

import { RuleTemplateTableColumn, RuleTemplateTableActions } from '../columns';
import {
  updateSelectRuleTemplate,
  initRuleTemplateListModalStatus,
  updateRuleTemplateListModalStatus
} from '../../../../store/ruleTemplate';
import { ResponseCode } from '@actiontech/shared/lib/enum';

import { TemplateTableProps } from '../index.type';

import {
  useTableRequestError,
  ActiontechTable,
  useTableRequestParams
} from '@actiontech/shared/lib/components/ActiontechTable';
import EventEmitter from '../../../../utils/EventEmitter';
import EmitterKey from '../../../../data/EmitterKey';
import { ModalName } from '../../../../data/ModalName';

const ProjectTable = (props: TemplateTableProps) => {
  const { hidden, actionPermission } = props;

  const { t } = useTranslation();
  const navigate = useNavigate();
  const [messageApi, contextMessageHolder] = message.useMessage();
  const { projectName, projectID, projectArchive } = useCurrentProject();
  const dispatch = useDispatch();

  const { tableChange, pagination } =
    useTableRequestParams<IProjectRuleTemplateResV1>();
  const { requestErrorMessage, handleTableRequestError } =
    useTableRequestError();

  const {
    data: ruleTemplateList,
    loading,
    refresh: refreshRuleTemplate
  } = useRequest(() => {
    const params: IGetProjectRuleTemplateListV1Params = {
      project_name: projectName,
      ...pagination
    };
    return handleTableRequestError(
      rule_template.getProjectRuleTemplateListV1(params)
    );
  });

  const refreshTable = useCallback(() => {
    if (hidden) return;
    refreshRuleTemplate();
  }, [hidden, refreshRuleTemplate]);

  useEffect(() => {
    EventEmitter.subscribe(EmitterKey.Refresh_Rule_Template_List, refreshTable);
    return () => {
      EventEmitter.unsubscribe(
        EmitterKey.Refresh_Rule_Template_List,
        refreshTable
      );
    };
  }, [refreshTable]);

  const deleteTemplate = useCallback(
    (templateName: string) => {
      const hideLoading = messageApi.loading(
        t('ruleTemplate.deleteRuleTemplate.deleting', { name: templateName }),
        0
      );
      rule_template
        .deleteProjectRuleTemplateV1({
          rule_template_name: templateName,
          project_name: projectName
        })
        .then((res) => {
          if (res.data.code === ResponseCode.SUCCESS) {
            messageApi.success(
              t('ruleTemplate.deleteRuleTemplate.deleteSuccessTips', {
                name: templateName
              })
            );
            refreshRuleTemplate();
          }
        })
        .finally(() => {
          hideLoading();
        });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [projectName, refreshRuleTemplate, t]
  );

  const exportRuleTemplate = useCallback(
    (templateName: string) => {
      const hideLoading = messageApi.loading(
        t('ruleTemplate.exportRuleTemplate.exporting', { name: templateName }),
        0
      );
      rule_template
        .exportProjectRuleTemplateV1(
          {
            rule_template_name: templateName,
            project_name: projectName
          },
          {
            responseType: 'blob'
          }
        )
        .then((res) => {
          if (res.data.code === ResponseCode.SUCCESS) {
            messageApi.success(
              t('ruleTemplate.exportRuleTemplate.exportSuccessTips', {
                name: templateName
              })
            );
          }
        })
        .finally(() => {
          hideLoading();
        });
    },
    [messageApi, projectName, t]
  );

  const openCloneRuleTemplateModal = useCallback(
    (ruleTemplate: IProjectRuleTemplateResV1) => {
      dispatch(
        updateSelectRuleTemplate({
          ruleTemplate
        })
      );
      dispatch(
        updateRuleTemplateListModalStatus({
          modalName: ModalName.Clone_Rule_Template,
          status: true
        })
      );
    },
    [dispatch]
  );

  const onAction = useCallback(
    (record: IProjectRuleTemplateResV1 | undefined, type: string) => {
      if (type === 'delete') {
        deleteTemplate(record?.rule_template_name ?? '');
        return;
      }
      if (type === 'edit') {
        navigate(
          `/sqle/project/${projectID}/rule/template/update/${record?.rule_template_name}`
        );
        return;
      }
      if (type === 'export') {
        exportRuleTemplate(record?.rule_template_name ?? '');
        return;
      }
      if (type === 'clone') {
        openCloneRuleTemplateModal(record ?? {});
        return;
      }
    },
    [
      deleteTemplate,
      navigate,
      exportRuleTemplate,
      openCloneRuleTemplateModal,
      projectID
    ]
  );

  const actions = useMemo(() => {
    if (!actionPermission) return [];
    return RuleTemplateTableActions(onAction, projectArchive);
  }, [onAction, actionPermission, projectArchive]);
  const columns = useMemo(
    () => RuleTemplateTableColumn(projectID),
    [projectID]
  );

  useEffect(() => {
    dispatch(
      initRuleTemplateListModalStatus({
        modalStatus: {
          [ModalName.Clone_Rule_Template]: false
        }
      })
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      {contextMessageHolder}
      <section hidden={hidden}>
        <ActiontechTable
          key="project-rule-list"
          rowKey="rule_template_name"
          loading={loading}
          dataSource={ruleTemplateList?.list ?? []}
          pagination={{
            total: ruleTemplateList?.total ?? 0
          }}
          onChange={tableChange}
          columns={columns}
          errorMessage={requestErrorMessage}
          actions={actions}
        />
      </section>
    </>
  );
};

export default ProjectTable;
