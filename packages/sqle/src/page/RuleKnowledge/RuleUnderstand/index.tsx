import {
  Card,
  Empty,
  Space,
  Typography,
  Spin,
  message,
  Popconfirm
} from 'antd';
import { RuleUnderstandProps } from './index.type';
import { useTranslation } from 'react-i18next';
import { EmptyBox, BasicButton } from '@actiontech/shared';
import { useBoolean } from 'ahooks';
import EditKnowledgeContent from './EditKnowledgeContent';
import { useEffect, useState } from 'react';
import rehypeSanitize from 'rehype-sanitize';
import rule_template from '@actiontech/shared/lib/api/sqle/service/rule_template';
import { ResponseCode } from '../../../data/common';
import { RuleKnowledgeMarkDownStyleWrapper } from '../style';
import classNames from 'classnames';
import { RuleKnowledgeEditActions } from './actions';

const RuleUnderstand: React.FC<RuleUnderstandProps> = ({
  content,
  ruleName,
  refresh,
  dbType,
  loading,
  isCustomRule
}) => {
  const { t } = useTranslation();
  const [modifyFlag, { setTrue: startModify, setFalse: modifyFinish }] =
    useBoolean();

  const [hasDirtyData, setHasDirtyData] = useState(false);

  const [editValue, setEditValue] = useState<string>();

  const [submitLoading, { setFalse: submitFinish, setTrue: startSubmit }] =
    useBoolean();

  const [messageApi, contextHolder] = message.useMessage();

  const submit = () => {
    startSubmit();
    const request = isCustomRule
      ? rule_template.updateCustomRuleKnowledge({
          rule_name: ruleName,
          knowledge_content: editValue,
          db_type: dbType
        })
      : rule_template.updateRuleKnowledge({
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
    if (modifyFlag) {
      setEditValue(content);
    }
  }, [content, modifyFlag]);

  const actions = RuleKnowledgeEditActions(startModify, loading);

  return (
    <>
      {contextHolder}
      <Card
        title={t('ruleKnowledge.ruleUnderstanding')}
        extra={
          !modifyFlag ? (
            actions['edit-rule-knowledge']
          ) : (
            <Space>
              <EmptyBox
                if={hasDirtyData}
                defaultNode={
                  <BasicButton disabled={submitLoading} onClick={modifyFinish}>
                    {t('common.cancel')}
                  </BasicButton>
                }
              >
                <Popconfirm
                  title={t('ruleKnowledge.hasDirtyDataTips')}
                  okText={t('common.ok')}
                  cancelText={t('common.cancel')}
                  onConfirm={() => {
                    modifyFinish();
                    setHasDirtyData(false);
                    setEditValue(content);
                  }}
                >
                  <BasicButton disabled={submitLoading}>
                    {t('common.cancel')}
                  </BasicButton>
                </Popconfirm>
              </EmptyBox>
              <BasicButton
                disabled={submitLoading}
                type="primary"
                onClick={submit}
              >
                {t('common.submit')}
              </BasicButton>
            </Space>
          )
        }
        className={classNames({ 'card-editing-status': modifyFlag })}
      >
        <Spin spinning={loading}>
          {modifyFlag ? (
            <EditKnowledgeContent
              value={editValue}
              onChange={setEditValue}
              setHasDirtyData={setHasDirtyData}
            />
          ) : (
            <EmptyBox
              if={!!content}
              defaultNode={
                <Empty
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                  description={
                    <Typography.Text type="secondary">
                      {t('ruleKnowledge.noData')}
                    </Typography.Text>
                  }
                />
              }
            >
              <RuleKnowledgeMarkDownStyleWrapper
                source={content}
                rehypePlugins={[rehypeSanitize]}
              />
            </EmptyBox>
          )}
        </Spin>
      </Card>
    </>
  );
};

export default RuleUnderstand;
