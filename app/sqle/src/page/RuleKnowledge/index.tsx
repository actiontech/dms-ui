import { useEffect, useState } from 'react';
import { message } from 'antd';
import { useTranslation } from 'react-i18next';
import { useRequest } from 'ahooks';
import { SqleApi } from '@actiontech/shared/lib/api';
import RuleUnderstand from './RuleUnderstand';
import { EmptyBox, PageHeader } from '@actiontech/dms-kit';
import { useTypedParams } from '@actiontech/shared';
import { ResponseCode } from '@actiontech/dms-kit';
import {
  RuleKnowledgeContentStyleWrapper,
  RuleKnowledgeStyleWrapper
} from './style';
import { ROUTE_PATHS } from '@actiontech/dms-kit';
import { RuleKnowledgeEditActions } from './actions';
import { useBoolean } from 'ahooks';
import KnowledgeBaseInfo from './components/KnowledgeBaseInfo';
import PageHeaderExtraAction from './components/PageHeaderExtraAction';

const RuleKnowledge: React.FC = () => {
  const { t } = useTranslation();

  const [isModifying, { setTrue: startModify, setFalse: modifyFinish }] =
    useBoolean();
  const [hasDirtyData, setHasDirtyData] = useState(false);
  const [editValue, setEditValue] = useState<string>();
  const [submitLoading, { setFalse: submitFinish, setTrue: startSubmit }] =
    useBoolean();
  const { ruleName = '', dbType = '' } =
    useTypedParams<typeof ROUTE_PATHS.SQLE.RULE_KNOWLEDGE.index>();
  const [isCustomRule, setIsCustomRule] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();
  const {
    data: ruleKnowledgeInfo,
    loading,
    refresh,
    run: getRuleKnowledge
  } = useRequest(
    (isCustomType: boolean, type: string) => {
      if (isCustomType) {
        return SqleApi.RuleTemplateService.getCustomRuleKnowledgeV1({
          rule_name: ruleName,
          db_type: type
        }).then((res) => {
          return res.data.data;
        });
      }
      return SqleApi.RuleTemplateService.getRuleKnowledgeV1({
        rule_name: ruleName,
        db_type: type
      }).then((res) => {
        return res.data.data;
      });
    },
    {
      manual: true
    }
  );
  const submit = () => {
    startSubmit();
    const request = isCustomRule
      ? SqleApi.RuleTemplateService.updateCustomRuleKnowledge({
          rule_name: ruleName,
          knowledge_content: editValue,
          db_type: dbType
        })
      : SqleApi.RuleTemplateService.updateRuleKnowledge({
          rule_name: ruleName,
          knowledge_content: editValue,
          db_type: dbType
        });
    request
      .then((res) => {
        if (res.data.code === ResponseCode.SUCCESS) {
          messageApi.success(t('ruleKnowledge.successTips'));
          setHasDirtyData(false);
          modifyFinish();
          refresh();
          setEditValue('');
        }
      })
      .finally(() => {
        submitFinish();
      });
  };
  useEffect(() => {
    if (isModifying) {
      setEditValue(ruleKnowledgeInfo?.knowledge_content);
    }
  }, [ruleKnowledgeInfo?.knowledge_content, isModifying]);
  useEffect(() => {
    if (!!ruleName && !!dbType) {
      SqleApi.RuleTemplateService.getRuleListV1({
        filter_rule_names: ruleName,
        filter_db_type: dbType
      }).then((res) => {
        if (res.data.code === ResponseCode.SUCCESS && res.data.data?.length) {
          const ruleInfo = res.data.data.find(
            (i) => i.rule_name === ruleName && i.db_type === dbType
          );
          if (!!ruleInfo?.db_type) {
            setIsCustomRule(!!ruleInfo.is_custom_rule);
            getRuleKnowledge(!!ruleInfo.is_custom_rule, ruleInfo.db_type);
          }
        }
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const actions = RuleKnowledgeEditActions(startModify, loading);
  return (
    <RuleKnowledgeStyleWrapper>
      {contextHolder}
      <PageHeader
        title={t('ruleKnowledge.pageTitle')}
        extra={
          !isModifying ? (
            actions['edit-rule-knowledge']
          ) : (
            <PageHeaderExtraAction
              hasDirtyData={hasDirtyData}
              submitLoading={submitLoading}
              modifyFinish={modifyFinish}
              onConfirm={() => {
                modifyFinish();
                setHasDirtyData(false);
                setEditValue(ruleKnowledgeInfo?.knowledge_content);
              }}
              onSubmit={submit}
            />
          )
        }
      />
      <RuleKnowledgeContentStyleWrapper>
        <KnowledgeBaseInfo
          loading={loading}
          ruleKnowledgeInfo={ruleKnowledgeInfo}
        />
        <EmptyBox if={!!dbType}>
          <RuleUnderstand
            loading={loading}
            content={ruleKnowledgeInfo?.knowledge_content}
            isModifying={isModifying}
            editValue={editValue}
            setEditValue={setEditValue}
            setHasDirtyData={setHasDirtyData}
            ruleName={ruleName}
          />
        </EmptyBox>
      </RuleKnowledgeContentStyleWrapper>
    </RuleKnowledgeStyleWrapper>
  );
};
export default RuleKnowledge;
