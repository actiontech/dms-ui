import { useTranslation } from 'react-i18next';
import { useState, useMemo, useRef } from 'react';

import {
  BasicButton,
  BasicInput,
  BasicTag,
  EmptyBox
} from '@actiontech/shared';
import { PlusOutlined } from '@ant-design/icons';
import { SqlAuditTagsButton, SqlAuditTagsPopoverCont } from './style';
import { Divider, Form, InputRef, Popover, Space, Spin, message } from 'antd5';
import { useForm } from 'antd5/es/form/Form';
import BasicEmpty from '@actiontech/shared/lib/components/BasicEmpty';
import useSQLAuditRecordTag from '../../../../../hooks/useSQLAuditRecordTag';
import { tagNameRule } from '@actiontech/shared/lib/utils/FormRule';

export interface ISqlAuditTags {
  projectName: string;
  defaultTags: string[];
  updateTags: (tags: string[]) => Promise<void>;
}
const SqlAuditTags = ({
  projectName,
  defaultTags: tags,
  updateTags
}: ISqlAuditTags) => {
  const { t } = useTranslation();
  const [messageApi, messageContextHolder] = message.useMessage();

  const [open, setOpen] = useState(false);
  const [extraTagForm] = useForm<{ extraTag: string }>();
  const inputRef = useRef<InputRef>(null);
  const { loading, updateSQLAuditRecordTag, auditRecordTags } =
    useSQLAuditRecordTag();

  const removing = useRef(false);
  const removeTag = async (tag: string) => {
    if (removing.current) {
      return;
    }

    updateTags(tags.filter((v) => v !== tag)).finally(() => {
      removing.current = false;
    });
  };

  const handelClickAddTagsIcon = () => {
    setOpen(true);
    updateSQLAuditRecordTag(projectName);
  };

  const content = useMemo(() => {
    const createTag = async (
      e: React.MouseEvent<HTMLDivElement, MouseEvent>,
      tag?: string
    ) => {
      e.preventDefault();
      let realTag = '';
      if (tag) {
        realTag = tag;
      } else {
        const values = await extraTagForm.validateFields();
        realTag = values.extraTag;
      }
      if (!realTag) {
        return;
      }
      if (tags.includes(realTag)) {
        messageApi.error(t('sqlAudit.create.createTagErrorTips'));
        return;
      }
      updateTags([...tags, realTag]);

      extraTagForm.resetFields();

      setOpen(false);
    };

    return (
      <Spin spinning={loading}>
        {messageContextHolder}
        <SqlAuditTagsPopoverCont className="tag-content-wrapper">
          <EmptyBox
            if={auditRecordTags.length > 0}
            defaultNode={
              <BasicEmpty
                errorTitle={t('sqlAudit.list.action.updateTags.addTag.notTags')}
              />
            }
          >
            {auditRecordTags.map((v) => (
              <div
                className="custom-tag-item"
                key={v}
                onClick={(e) => createTag(e, v)}
              >
                <BasicTag color="geekblue" size="small">
                  {v}
                </BasicTag>
              </div>
            ))}
          </EmptyBox>
          <Divider style={{ marginTop: '2px', marginBottom: '8px' }} />
          <Form
            form={extraTagForm}
            layout="inline"
            initialValues={{ extraTag: '' }}
          >
            <Form.Item name="extraTag" rules={[{ validator: tagNameRule() }]}>
              <BasicInput
                placeholder={t(
                  'sqlAudit.list.action.updateTags.addTag.placeholder'
                )}
                ref={inputRef}
              />
            </Form.Item>

            <Form.Item>
              <BasicButton icon={<PlusOutlined />} onClick={createTag} block>
                {t('sqlAudit.list.action.updateTags.addTag.text')}
              </BasicButton>
            </Form.Item>
          </Form>
        </SqlAuditTagsPopoverCont>
      </Spin>
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [auditRecordTags, extraTagForm, loading, t, tags, updateTags]);

  return (
    <>
      <Space size={8}>
        {tags.map((v) => (
          <BasicTag
            color="geekblue"
            size="small"
            key={v}
            closable
            onClose={(e) => {
              e.preventDefault();
              removeTag(v);
            }}
          >
            {v}
          </BasicTag>
        ))}
        <Popover
          trigger={['click']}
          open={open}
          onOpenChange={(val) => {
            setOpen(val);
            !val && extraTagForm.resetFields();
          }}
          content={content}
          overlayClassName="custom-tags-box"
          overlayStyle={{
            width: '360px',
            paddingTop: 0
          }}
        >
          <SqlAuditTagsButton
            className="add-tag-focus-btn"
            icon={<PlusOutlined />}
            shape="circle"
            size="small"
            onClick={handelClickAddTagsIcon}
          ></SqlAuditTagsButton>
        </Popover>
      </Space>
    </>
  );
};

export default SqlAuditTags;
