import { useTranslation } from 'react-i18next';
import { useBoolean } from 'ahooks';
import { useMemo, useState, useCallback } from 'react';
import { BasicButton } from '@actiontech/shared';
import { RuleSelectProps } from './index.type';
import { Space, Spin } from 'antd';
import {
  RuleList,
  RuleStatus,
  RuleFilter
} from '../../../../components/RuleList';
import {
  EnumActionType,
  RuleStatusEnum,
  typeActionType
} from '../../../../components/RuleList/index.type';
import useRuleList from '../../../../components/RuleList/useRuleList';
import { IRuleResV1 } from '@actiontech/shared/lib/api/sqle/service/common';
import EditRuleTemplate from '../../EditRuleTemplate';
import { SegmentedRowStyleWrapper } from '@actiontech/shared/lib/styleWrapper/element';

const RuleSelect = (props: RuleSelectProps) => {
  const { t } = useTranslation();

  const { ruleStatus, setRuleStatus } = useRuleList();
  const [editVisible, { setTrue: setEditVisible, setFalse: setEditHidden }] =
    useBoolean();
  const [ruleData, setRuleData] = useState<IRuleResV1 | undefined>(undefined);

  const disabledRuleStatus = useMemo(
    () => ruleStatus === RuleStatusEnum.disabled,
    [ruleStatus]
  );

  const disableRule = useMemo(() => {
    return (
      props.allRules?.filter(
        (e) => !props.activeRule?.find((item) => item.rule_name === e.rule_name)
      ) ?? []
    );
  }, [props.activeRule, props.allRules]);

  const updateRule = useCallback(
    (ruleItem: IRuleResV1, isDelete = false) => {
      let temp: IRuleResV1[] = [];
      let newShadowRules: IRuleResV1[] = [];
      if (isDelete) {
        temp = props.activeRule.filter(
          (e) => e.rule_name !== ruleItem.rule_name
        );
        newShadowRules = props.filteredRule.filter(
          (e) => e.rule_name !== ruleItem.rule_name
        );
      } else {
        temp = [...props.activeRule];
        temp.push(ruleItem);
        newShadowRules = [...props.filteredRule];
        newShadowRules.push(ruleItem);
      }
      props.updateActiveRule(temp);
      props.updateFilteredRule(newShadowRules);
    },
    [props]
  );

  const updateAllRule = useCallback(
    (active: boolean) => {
      if (active) {
        props.updateActiveRule([...(props.allRules ?? [])]);
        props.updateFilteredRule([...(props.allRules ?? [])]);
      } else {
        props.updateActiveRule([]);
        props.updateFilteredRule([]);
      }
    },
    [props]
  );

  const renderBatchAction = useCallback(() => {
    if (!disabledRuleStatus) {
      return (
        <BasicButton
          key="disable-all"
          danger
          disabled={props.activeRule.length === 0 || props.formSubmitLoading}
          onClick={updateAllRule.bind(null, false)}
        >
          {t('ruleTemplate.ruleTemplateForm.disableAllRules')}
        </BasicButton>
      );
    }
    return (
      <BasicButton
        key="active-all"
        disabled={disableRule.length === 0 || props.formSubmitLoading}
        onClick={updateAllRule.bind(null, true)}
      >
        {t('ruleTemplate.ruleTemplateForm.activeAllRules')}
      </BasicButton>
    );
  }, [
    disabledRuleStatus,
    t,
    updateAllRule,
    disableRule,
    props.activeRule,
    props.formSubmitLoading
  ]);

  const rulesData = useMemo(() => {
    return disabledRuleStatus ? disableRule : props.filteredRule;
  }, [disabledRuleStatus, disableRule, props.filteredRule]);

  const onAction = (data: IRuleResV1, type: typeActionType) => {
    if (type === EnumActionType.disabled) {
      updateRule(data, true);
      return;
    }
    if (type === EnumActionType.enabled) {
      updateRule(data, false);
      return;
    }
    setRuleData(data);
    setEditVisible();
  };

  const onEditRule = useCallback(
    (values: IRuleResV1) => {
      let temp: IRuleResV1[] = [];
      temp = props.activeRule.map((e: IRuleResV1) => {
        if (e.rule_name === values.rule_name) {
          return values;
        } else {
          return e;
        }
      });
      props.updateActiveRule(temp);
      let newShadowRules: IRuleResV1[] = [];
      newShadowRules = props.filteredRule.map((e: IRuleResV1) => {
        if (e.rule_name === values.rule_name) {
          return values;
        } else {
          return e;
        }
      });
      props.updateFilteredRule(newShadowRules);
      setEditHidden();
      setRuleData(undefined);
    },
    [props, setEditHidden]
  );

  return (
    <>
      <SegmentedRowStyleWrapper className="flex-space-between">
        <RuleStatus
          currentRuleStatus={ruleStatus}
          ruleStatusChange={setRuleStatus}
          options={{
            renderLabel(label, status) {
              return (
                <Space>
                  <span>{label}</span>
                  <span>
                    {status === RuleStatusEnum.disabled
                      ? disableRule.length
                      : props.filteredRule.length}
                  </span>
                </Space>
              );
            }
          }}
        />

        {renderBatchAction()}
      </SegmentedRowStyleWrapper>
      <div className="flex-space-between">
        <RuleFilter form={props.ruleFilterForm} />
      </div>
      <Spin spinning={props.listLoading || props.formSubmitLoading}>
        <RuleList
          isAction
          actionType={ruleStatus}
          rules={rulesData}
          activeDataKeys={rulesData.map((item) => item?.rule_name ?? '')}
          onActionHandle={(record, type) => onAction(record, type)}
          pageHeaderHeight={50}
          tags={props.filterCategoryTags}
        />
      </Spin>
      <EditRuleTemplate
        visible={editVisible}
        title={t('ruleTemplate.editModal.title')}
        dataSource={ruleData}
        onClosed={() => {
          setEditHidden();
        }}
        onSubmit={onEditRule}
      />
    </>
  );
};

export default RuleSelect;
