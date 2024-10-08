import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useRequest } from 'ahooks';
import { message } from 'antd';
import { useCurrentUser } from '@actiontech/shared/lib/global';
import { ResponseCode } from '@actiontech/shared/lib/enum';
import EmitterKey from '../../../data/EmitterKey';
import { ModalName } from '../../../data/ModalName';
import {
  initGlobalRuleTemplateListModalStatus,
  updateGlobalSelectRuleTemplate,
  updateGlobalRuleTemplateListModalStatus
} from '../../../store/globalRuleTemplate';
import EventEmitter from '../../../utils/EventEmitter';
import { RuleTemplateActions, RuleTemplateColumns } from './column';
import RuleTemplateListModal from './Modal';
import rule_template from '@actiontech/shared/lib/api/sqle/service/rule_template';
import { IRuleTemplateResV1 } from '@actiontech/shared/lib/api/sqle/service/common';
import {
  ActiontechTable,
  useTableRequestError,
  useTableRequestParams
} from '@actiontech/shared/lib/components/ActiontechTable';
import useRuleManagerSegmented from '../../RuleManager/useRuleManagerSegmented';
import { RuleManagerSegmentedKey } from '../../RuleManager/index.type';
import ExportRuleTemplateModal from './Modal/ExportRuleTemplate';

const RuleTemplateList: React.FC<{ hiddenOperations?: boolean }> = ({
  hiddenOperations = false
}) => {
  const { t } = useTranslation();
  const [messageApi, messageContextHolder] = message.useMessage();
  const dispatch = useDispatch();
  const { tableChange, pagination } =
    useTableRequestParams<IRuleTemplateResV1>();
  const { requestErrorMessage, handleTableRequestError } =
    useTableRequestError();
  const { isAdmin } = useCurrentUser();
  const navigate = useNavigate();
  const { activeKey } = useRuleManagerSegmented();

  const {
    data: ruleTemplateList,
    loading,
    refresh: refreshRuleTemplate
  } = useRequest(
    () =>
      handleTableRequestError(
        rule_template.getRuleTemplateListV1({ ...pagination })
      ),
    {
      refreshDeps: [pagination, activeKey],
      ready: activeKey === RuleManagerSegmentedKey.GlobalRuleTemplate
    }
  );

  const navigateToUpdatePage = (templateName: string) => {
    navigate(`/sqle/rule-manager/global-update/${templateName}`);
  };

  const deleteTemplate = React.useCallback(
    (templateName: string) => {
      const hideLoading = messageApi.loading(
        t('ruleTemplate.deleteRuleTemplate.deleting', { name: templateName }),
        0
      );
      rule_template
        .deleteRuleTemplateV1({
          rule_template_name: templateName
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
    [messageApi, refreshRuleTemplate, t]
  );

  const openCloneRuleTemplateModal = (ruleTemplate: IRuleTemplateResV1) => {
    dispatch(
      updateGlobalSelectRuleTemplate({
        ruleTemplate
      })
    );
    dispatch(
      updateGlobalRuleTemplateListModalStatus({
        modalName: ModalName.Clone_Rule_Template,
        status: true
      })
    );
  };

  const openExportRuleTemplateModal = (ruleTemplate: IRuleTemplateResV1) => {
    dispatch(
      updateGlobalSelectRuleTemplate({
        ruleTemplate
      })
    );
    dispatch(
      updateGlobalRuleTemplateListModalStatus({
        modalName: ModalName.Export_Rule_Template,
        status: true
      })
    );
  };

  useEffect(() => {
    dispatch(
      initGlobalRuleTemplateListModalStatus({
        modalStatus: {
          [ModalName.Clone_Rule_Template]: false,
          [ModalName.Export_Rule_Template]: false
        }
      })
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const scopeRefresh = () => {
      refreshRuleTemplate();
    };
    const { unsubscribe } = EventEmitter.subscribe(
      EmitterKey.Refresh_Global_Rule_Template_List,
      scopeRefresh
    );
    return unsubscribe;
  }, [refreshRuleTemplate]);

  return (
    <>
      {messageContextHolder}
      <ActiontechTable
        rowKey="rule_template_name"
        loading={loading}
        dataSource={ruleTemplateList?.list}
        columns={RuleTemplateColumns()}
        errorMessage={requestErrorMessage}
        onChange={tableChange}
        actions={RuleTemplateActions(
          navigateToUpdatePage,
          deleteTemplate,
          openCloneRuleTemplateModal,
          openExportRuleTemplateModal,
          isAdmin && !hiddenOperations
        )}
        pagination={{
          total: ruleTemplateList?.total ?? 0
        }}
      />

      <RuleTemplateListModal />
      <ExportRuleTemplateModal />
    </>
  );
};

export default RuleTemplateList;
