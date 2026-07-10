import { useDispatch } from 'react-redux';
import { useCallback, useEffect, useMemo } from 'react';
import {
  updateSelectWhitelist,
  updateWhitelistModalStatus
} from '../../../store/whitelist';
import { ModalName } from '../../../data/ModalName';
import { IAuditWhitelistResV1 } from '@actiontech/shared/lib/api/sqle/service/common';
import {
  useCurrentProject,
  useCurrentUser
} from '@actiontech/shared/lib/global';
import {
  buildAuditWhitelistPrefillFromSqlManage,
  BuildBlacklistPrefillFromSqlManageOptions,
  enrichSqlManageRuleExceptionRecord,
  SqlManageRuleExceptionRecord
} from '../../RuleException/index.data';
import useInstance from '../../../hooks/useInstance';
import { getInstanceTipListV1FunctionalModuleEnum } from '@actiontech/shared/lib/api/sqle/service/instance/index.enum';

const useWhitelistRedux = () => {
  const dispatch = useDispatch();

  const { projectName, projectArchive } = useCurrentProject();
  const { isAdmin, isProjectManager } = useCurrentUser();
  const { instanceList, updateInstanceList } = useInstance();

  const actionPermission = useMemo(() => {
    return (isAdmin || isProjectManager(projectName)) && !projectArchive;
  }, [isAdmin, isProjectManager, projectName, projectArchive]);

  useEffect(() => {
    updateInstanceList({
      project_name: projectName,
      functional_module: getInstanceTipListV1FunctionalModuleEnum.sql_manage
    });
  }, [projectName, updateInstanceList]);

  const openCreateWhitelistModal = useCallback(() => {
    dispatch(
      updateWhitelistModalStatus({
        modalName: ModalName.Add_Whitelist,
        status: true
      })
    );
  }, [dispatch]);

  const updateSelectWhitelistRecord = useCallback(
    (selectRow: IAuditWhitelistResV1) => {
      dispatch(
        updateSelectWhitelist({
          selectRow
        })
      );
    },
    [dispatch]
  );

  const openAuditWhitelistCreateWithPrefill = useCallback(
    (
      record?: SqlManageRuleExceptionRecord | null,
      options?: BuildBlacklistPrefillFromSqlManageOptions
    ) => {
      const applyPrefill = (instanceTips: typeof instanceList) => {
        const enrichedRecord = enrichSqlManageRuleExceptionRecord(
          record,
          instanceTips
        );
        const prefill = buildAuditWhitelistPrefillFromSqlManage(
          enrichedRecord,
          options
        );
        if (!prefill) {
          return;
        }
        updateSelectWhitelistRecord(prefill);
        openCreateWhitelistModal();
      };

      if (instanceList.length) {
        applyPrefill(instanceList);
        return;
      }

      updateInstanceList(
        {
          project_name: projectName,
          functional_module: getInstanceTipListV1FunctionalModuleEnum.sql_manage
        },
        { onSuccess: applyPrefill }
      );
    },
    [
      instanceList,
      openCreateWhitelistModal,
      projectName,
      updateInstanceList,
      updateSelectWhitelistRecord
    ]
  );

  return {
    openCreateWhitelistModal,
    updateSelectWhitelistRecord,
    openAuditWhitelistCreateWithPrefill,
    dispatch,
    actionPermission
  };
};

export default useWhitelistRedux;
