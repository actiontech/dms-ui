import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useRequest } from 'ahooks';
import { Spin, message, Space, Popconfirm } from 'antd';
import { BasicButton, useTypedNavigate } from '@actiontech/shared';
import { TableToolbar } from '@actiontech/shared/lib/components/ActiontechTable';
import { ResponseCode } from '@actiontech/shared/lib/enum';
import useCustomRuleFilterForm from './useCustomRuleFilterForm';
import { RuleResV1LevelEnum } from '@actiontech/shared/lib/api/sqle/service/common.enum';
import { ICustomRuleResV1 } from '@actiontech/shared/lib/api/sqle/service/common';
import rule_template from '@actiontech/shared/lib/api/sqle/service/rule_template';
import { RuleList } from '../../../components/RuleList';
import {
  EnumActionType,
  RuleStatusEnum
} from '../../../components/RuleList/index.type';
import EventEmitter from '../../../utils/EventEmitter';
import EmitterKey from '../../../data/EmitterKey';
import useRuleManagerSegmented from '../../RuleManager/useRuleManagerSegmented';
import { RuleManagerSegmentedKey } from '../../RuleManager/index.type';
import { CloseOutlined } from '@actiontech/icons';
import {
  PERMISSIONS,
  PermissionControl,
  usePermission
} from '@actiontech/shared/lib/features';
import { ROUTE_PATHS } from '@actiontech/shared/lib/data/routePaths';

const CustomRuleList: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useTypedNavigate();
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [messageApi, messageContextHolder] = message.useMessage();
  const { activeKey } = useRuleManagerSegmented();
  const { checkActionPermission } = usePermission();

  const {
    data: ruleList,
    run: getCustomRuleList,
    loading,
    refresh
  } = useRequest(
    (dbType: string) =>
      rule_template
        .getCustomRulesV1({
          filter_db_type: dbType,
          filter_desc: searchRuleName
        })
        .then(
          (res) =>
            res.data.data?.map((v) => ({
              ...v,
              rule_name: v.rule_id,
              level: v.level as RuleResV1LevelEnum | undefined
            })) ?? []
        ),
    {
      refreshDeps: [activeKey],
      ready: activeKey === RuleManagerSegmentedKey.CustomRule
    }
  );

  const { searchRuleName, DbFilter, setSearchRuleName } =
    useCustomRuleFilterForm(getCustomRuleList, activeKey);

  const deleteRule = (item: ICustomRuleResV1) => {
    setDeleteLoading(true);
    rule_template
      .deleteCustomRuleV1({
        rule_id: item.rule_id ?? ''
      })
      .then((res) => {
        if (res.data.code === ResponseCode.SUCCESS) {
          messageApi.success(
            t('customRule.deleteSuccessTips', { desc: item.desc })
          );
          refresh();
        }
      })
      .finally(() => {
        setDeleteLoading(false);
      });
  };

  const onAction = (record: ICustomRuleResV1, type: EnumActionType) => {
    if (type !== EnumActionType.edit) return;

    navigate(ROUTE_PATHS.SQLE.CUSTOM_RULE.update, {
      params: { ruleID: record.rule_id ?? '' }
    });
  };

  const renderDisabledNode = (item: ICustomRuleResV1) => {
    return (
      <PermissionControl
        permission={PERMISSIONS.ACTIONS.SQLE.CUSTOM_RULE.DELETE}
      >
        <Popconfirm
          key={`${item.rule_id}-delete-item`}
          disabled={deleteLoading}
          placement="topLeft"
          title={t('customRule.deleteConfirm')}
          onOpenChange={(_, e) => {
            e?.stopPropagation();
          }}
          onConfirm={(e) => {
            e?.stopPropagation();
            deleteRule(item);
          }}
          okText={t('common.ok')}
        >
          <BasicButton
            size="small"
            shape="circle"
            danger
            className="action-circle-btn disabled-rule-item custom-rule-item-operator"
            key={`${item.rule_id}-remove-item`}
            icon={
              <CloseOutlined className="icon-disabled" fill="currentColor" />
            }
            onClick={(e) => {
              e.stopPropagation();
            }}
          />
        </Popconfirm>
      </PermissionControl>
    );
  };

  useEffect(() => {
    const { unsubscribe } = EventEmitter.subscribe(
      EmitterKey.Refresh_Custom_Rule_Template_List,
      refresh
    );
    return unsubscribe;
  }, [refresh]);

  return (
    <Spin spinning={loading}>
      {messageContextHolder}
      <Space direction="vertical" size={24} className="full-width-element">
        <TableToolbar
          searchInput={{
            onChange: setSearchRuleName,
            onSearch: refresh,
            placeholder: t('common.form.placeholder.searchInput', {
              name: t('customRule.filterForm.ruleName')
            }),
            style: { width: 240 }
          }}
        >
          {DbFilter()}
        </TableToolbar>

        <RuleList
          enableCheckDetail
          isAction={true}
          actionType={
            checkActionPermission(PERMISSIONS.ACTIONS.SQLE.CUSTOM_RULE.EDIT)
              ? RuleStatusEnum.enabled
              : undefined
          }
          renderDisableNode={(rule) =>
            renderDisabledNode(rule as ICustomRuleResV1)
          }
          rules={ruleList}
          activeDataKeys={(ruleList ?? []).map((item) => item?.rule_id ?? '')}
          onActionHandle={(record, type) =>
            onAction(record as ICustomRuleResV1, type)
          }
          pageHeaderHeight={120}
        />
      </Space>
    </Spin>
  );
};

export default CustomRuleList;
