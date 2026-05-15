import { useRequest } from 'ahooks';
import { useEffect, useMemo } from 'react';
import EventEmitter from '../../../../utils/EventEmitter';
import EmitterKey from '../../../../data/EmitterKey';
import { RuleTemplateTableColumn } from '../columns';
import {
  useCurrentProject,
  useDbServiceDriver
} from '@actiontech/shared/lib/features';
import rule_template from '@actiontech/shared/lib/api/sqle/service/rule_template';
import { IRuleTemplateResV1 } from '@actiontech/shared/lib/api/sqle/service/common';
import { IGetRuleTemplateListV1Params } from '@actiontech/shared/lib/api/sqle/service/rule_template/index.d';
import {
  useTableRequestError,
  ActiontechTable,
  useTableRequestParams
} from '@actiontech/dms-kit/es/components/ActiontechTable';

const CommonTable = () => {
  const { projectID } = useCurrentProject();
  const { getLogoUrlByDbType } = useDbServiceDriver();

  const { tableChange, pagination } =
    useTableRequestParams<IRuleTemplateResV1>();
  const { requestErrorMessage, handleTableRequestError } =
    useTableRequestError();

  const {
    data: ruleCommonTemplateList,
    loading,
    refresh: refreshRuleTemplate
  } = useRequest(() => {
    const params: IGetRuleTemplateListV1Params = {
      ...pagination
    };
    return handleTableRequestError(rule_template.getRuleTemplateListV1(params));
  });

  useEffect(() => {
    const { unsubscribe } = EventEmitter.subscribe(
      EmitterKey.Refresh_Rule_Template_List,
      refreshRuleTemplate
    );
    return unsubscribe;
  }, [refreshRuleTemplate]);

  const columns = useMemo(
    () => RuleTemplateTableColumn(projectID, getLogoUrlByDbType, true),
    [getLogoUrlByDbType, projectID]
  );

  return (
    <ActiontechTable
      key="common-rule-list"
      rowKey="rule_template_name"
      loading={loading}
      dataSource={ruleCommonTemplateList?.list ?? []}
      pagination={{
        total: ruleCommonTemplateList?.total ?? 0
      }}
      onChange={tableChange}
      columns={columns}
      errorMessage={requestErrorMessage}
    />
  );
};

export default CommonTable;
