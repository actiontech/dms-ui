import { useTranslation } from 'react-i18next';
import { useEffect, useState, useRef, useMemo, useContext } from 'react';

import {
  FormAreaBlockStyleWrapper,
  FormAreaLineStyleWrapper,
  FormStyleWrapper
} from '@actiontech/shared/lib/components/CustomForm/style';
import { FormItemLabel } from '@actiontech/shared/lib/components/CustomForm';
import { SqlAuditBaseInfoFormProps } from './index.type';
import { FormItemBigTitle } from '@actiontech/shared/lib/components/CustomForm';
import {
  BasicSelect,
  BasicInput,
  BasicButton,
  BasicTag
} from '@actiontech/shared';
import { Divider, Form, InputRef, SelectProps, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

import { useCurrentProject } from '@actiontech/shared/lib/features';
import useSQLAuditRecordTag from '../../../../hooks/useSQLAuditRecordTag';
import { useForm } from 'antd/es/form/Form';
import { tagNameRule } from '@actiontech/shared/lib/utils/FormRule';
import { FormSubmitStatusContext } from '..';
import { BriefcaseFilled } from '@actiontech/icons';
import Icon from '@ant-design/icons';

const BaseInfoForm = ({ form }: SqlAuditBaseInfoFormProps) => {
  const { t } = useTranslation();
  const { projectName } = useCurrentProject();
  const submitLoading = useContext(FormSubmitStatusContext);

  const [messageApi, messageContextHolder] = message.useMessage();
  const { loading, updateSQLAuditRecordTag, auditRecordTags } =
    useSQLAuditRecordTag();
  const [extraTagForm] = useForm<{ extraTag: string }>();
  const inputRef = useRef<InputRef>(null);
  const [formTagVal, setFormTagVal] = useState<string[]>([]);
  const [customTags, setCustomTags] = useState<string[]>([]);
  const customTagsOptionData = useMemo(() => {
    return [...auditRecordTags, ...customTags].map((tag) => {
      return {
        label: (
          <div className="flex-display">
            <BasicTag color="geekblue" size="small">
              {tag}
            </BasicTag>
          </div>
        ),
        value: tag
      };
    });
  }, [auditRecordTags, customTags]);

  const tagRender: SelectProps['tagRender'] = (props) => {
    return (
      <BasicTag
        color="geekblue"
        closable={true}
        size="small"
        onClose={() => {
          setFormTagVal((values) => values.filter((v) => v !== props.value));
          form.setFieldsValue({
            tags: formTagVal.filter((v) => v !== props.value)
          });
        }}
      >
        {props.value}
      </BasicTag>
    );
  };

  const onCreateTag = async (
    e: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>
  ) => {
    e.preventDefault();
    const values = await extraTagForm.validateFields();
    const tag = values.extraTag.trim();
    if ([...auditRecordTags, ...customTags].includes(tag)) {
      messageApi.error(t('sqlAudit.create.createTagErrorTips'));
      return;
    }
    setCustomTags([...customTags, tag]);
    setFormTagVal([...formTagVal, tag]);
    form.setFieldsValue({
      tags: [...formTagVal, tag]
    });

    setTimeout(() => {
      extraTagForm.resetFields();
    }, 0);
  };

  useEffect(() => {
    updateSQLAuditRecordTag(projectName);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectName]);

  return (
    <>
      {messageContextHolder}
      <FormStyleWrapper
        form={form}
        colon={false}
        labelAlign="left"
        className="hasTopHeader clearPaddingBottom"
      >
        <FormAreaLineStyleWrapper className="has-border">
          <FormAreaBlockStyleWrapper>
            <FormItemBigTitle>
              <Icon component={BriefcaseFilled} className="title-icon" />
              <span>{t('sqlAudit.create.title')}</span>
            </FormItemBigTitle>
            <FormItemLabel
              label={t('sqlAudit.create.baseInfoForm.tags')}
              name="tags"
            >
              <BasicSelect
                placeholder={t('common.form.placeholder.select', {
                  name: t('sqlAudit.create.baseInfoForm.tagsPlaceholder')
                })}
                allowClear
                showSearch
                mode="multiple"
                disabled={submitLoading}
                loading={loading}
                options={customTagsOptionData}
                dropdownRender={(menu) => (
                  <>
                    {menu}
                    <Divider style={{ margin: '8px 0' }} />
                    <Form
                      form={extraTagForm}
                      layout="inline"
                      initialValues={{ extraTag: '' }}
                    >
                      <Form.Item
                        name="extraTag"
                        rules={[{ validator: tagNameRule() }]}
                      >
                        <BasicInput
                          placeholder={t(
                            'sqlAudit.list.action.updateTags.addTag.placeholder'
                          )}
                          ref={inputRef}
                        />
                      </Form.Item>

                      <Form.Item>
                        <BasicButton
                          icon={<PlusOutlined />}
                          onClick={onCreateTag}
                          block
                        >
                          {t('sqlAudit.list.action.updateTags.addTag.text')}
                        </BasicButton>
                      </Form.Item>
                    </Form>
                  </>
                )}
                tagRender={tagRender}
                value={formTagVal}
                onChange={setFormTagVal}
              />
            </FormItemLabel>
          </FormAreaBlockStyleWrapper>
        </FormAreaLineStyleWrapper>
      </FormStyleWrapper>
    </>
  );
};

export default BaseInfoForm;
