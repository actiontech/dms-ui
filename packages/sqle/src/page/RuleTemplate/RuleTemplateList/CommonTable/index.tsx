import { useRequest } from 'ahooks';
import { useCallback, useEffect, useMemo } from 'react';
import EventEmitter from '../../../../utils/EventEmitter';
import EmitterKey from '../../../../data/EmitterKey';
import {
  useTableRequestError,
  ActiontechTable,
  useTableRequestParams
} from '@actiontech/shared/lib/components/ActiontechTable';
import { RuleTemplateTableColumn } from '../columns';
import {
  useCurrentProject,
  useDbServiceDriver
} from '@actiontech/shared/lib/global';
import rule_template from '@actiontech/shared/lib/api/sqle/service/rule_template';
import { TemplateTableProps } from '../index.type';
import { IRuleTemplateResV1 } from '@actiontech/shared/lib/api/sqle/service/common';
import { IGetRuleTemplateListV1Params } from '@actiontech/shared/lib/api/sqle/service/rule_template/index.d';

const CommonTable = (props: TemplateTableProps) => {
  const { hidden } = props;
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
  } = useRequest(
    () => {
      const params: IGetRuleTemplateListV1Params = {
        ...pagination
      };
      return handleTableRequestError(
        rule_template.getRuleTemplateListV1(params)
      );
    },
    {
      manual: true
    }
  );

  const refreshTable = useCallback(() => {
    if (hidden) return;
    refreshRuleTemplate();
  }, [hidden, refreshRuleTemplate]);

  useEffect(() => {
    !hidden && refreshTable();
  }, [hidden, refreshTable]);

  useEffect(() => {
    EventEmitter.subscribe(EmitterKey.Refresh_Rule_Template_List, refreshTable);
    return () => {
      EventEmitter.unsubscribe(
        EmitterKey.Refresh_Rule_Template_List,
        refreshTable
      );
    };
  }, [refreshTable]);

  const columns = useMemo(
    () => RuleTemplateTableColumn(projectID, getLogoUrlByDbType, true),
    [getLogoUrlByDbType, projectID]
  );

  return (
    <>
      <section hidden={hidden}>
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
      </section>
    </>
  );
};

export default CommonTable;
