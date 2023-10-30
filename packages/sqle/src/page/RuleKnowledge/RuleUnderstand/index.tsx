import { Card, Empty, Modal, Space, Typography, Spin, message } from 'antd5';
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

const RuleUnderstand: React.FC<RuleUnderstandProps> = ({
  content,
  ruleName,
  refresh,
  dbType,
  loading,
  isAdmin,
  isCustomRule
}) => {
  const { t } = useTranslation();
  const [modifyFlag, { setTrue: startModify, setFalse: modifyFinish }] =
    useBoolean();

  const [hasDirtyData, setHasDirtyData] = useState(false);

  const [editValue, setEditValue] = useState<string>();

  const [submitLoading, { setFalse: submitFinish, setTrue: startSubmit }] =
    useBoolean();

  const [modal, contextHolder] = Modal.useModal();

  const cancel = () => {
    if (hasDirtyData) {
      modal.warning({
        content: t('ruleKnowledge.hasDirtyDataTips'),
        centered: true,
        onOk: () => {
          modifyFinish();
          setHasDirtyData(false);
          setEditValue(content);
        },
        okCancel: true,
        okText: t('common.ok'),
        okButtonProps: {
          size: 'small'
        },
        cancelButtonProps: {
          size: 'small'
        }
      });
    } else {
      modifyFinish();
    }
  };
  const submit = () => {
    startSubmit();
    // todo 待后端提供接口
    // const request = isCustomRule
    //   ? rule_template.updateCustomRuleKnowledge({
    //       rule_name: ruleName,
    //       knowledge_content: editValue,
    //       db_type: dbType
    //     })
    //   : rule_template.updateRuleKnowledge({
    //       rule_name: ruleName,
    //       knowledge_content: editValue,
    //       db_type: dbType
    //     });

    rule_template
      .updateRuleKnowledge({
        rule_name: ruleName,
        knowledge_content: editValue,
        db_type: dbType
      })
      .then((res) => {
        if (res.data.code === ResponseCode.SUCCESS) {
          message.success(t('ruleKnowledge.successTips'));
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

  return (
    <>
      {contextHolder}
      <Card
        title={t('ruleKnowledge.ruleUnderstanding')}
        extra={
          !modifyFlag ? (
            <EmptyBox if={isAdmin}>
              <BasicButton
                onClick={startModify}
                type="primary"
                disabled={loading}
              >
                {t('ruleKnowledge.edit')}
              </BasicButton>
            </EmptyBox>
          ) : (
            <Space>
              <BasicButton disabled={submitLoading} onClick={cancel}>
                {t('common.cancel')}
              </BasicButton>
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
