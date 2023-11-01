// import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { Col, Form, Input, Row } from 'antd5';
import { BasicSelect } from '@actiontech/shared';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import useRole from '../../../hooks/useRole';
import useDbService from '../../../hooks/useDbService';
import { MemberRoleWithOpRangeOpRangeTypeEnum } from '@actiontech/shared/lib/api/base/service/common.enum';
import { filterOptionByLabel } from '@actiontech/shared/lib/components/BasicSelect/utils';
import {
  DrawerFormIconWrapper,
  FormListAddButtonWrapper
} from '@actiontech/shared/lib/styleWrapper/element';
import {
  IconFormListDelete,
  IconFormListAdd
} from '@actiontech/shared/lib/Icon';

const RoleSelector: React.FC<{ projectID: string }> = ({ projectID }) => {
  const { t } = useTranslation();
  const { updateRoleList, generateRoleSelectOption } = useRole();
  const { updateDbServiceList, generateDbServiceSelectOption } = useDbService();
  useEffect(() => {
    updateRoleList();
    updateDbServiceList(projectID);
  }, [projectID, updateDbServiceList, updateRoleList]);

  return (
    <Form.List name="roles" initialValue={[]}>
      {(fields, { add, remove }) => (
        <>
          {fields.map((field, index) => (
            <Row key={field.key}>
              <Col span={8}>
                <Form.Item
                  label={t('dmsMember.roleSelector.role')}
                  {...field}
                  name={[field.name, 'role_uid']}
                  rules={[{ required: true }]}
                >
                  <BasicSelect<string>
                    popupMatchSelectWidth={false}
                    showSearch
                    optionFilterProp="children"
                    filterOption={filterOptionByLabel}
                    placeholder={t('common.form.placeholder.select', {
                      name: t('dmsMember.roleSelector.role')
                    })}
                  >
                    {generateRoleSelectOption({ showTooltip: true })}
                  </BasicSelect>
                </Form.Item>
              </Col>
              <Col span={12} offset={1}>
                <Form.Item
                  {...field}
                  name={[field.name, 'range_uids']}
                  label={t('dmsMember.roleSelector.opRange')}
                  rules={[{ required: true }]}
                >
                  <BasicSelect
                    placeholder={t('common.form.placeholder.select', {
                      name: t('dmsMember.roleSelector.opRange')
                    })}
                    mode="multiple"
                    showSearch
                    allowClear
                    optionFilterProp="children"
                    filterOption={filterOptionByLabel}
                  >
                    {generateDbServiceSelectOption()}
                  </BasicSelect>
                </Form.Item>
              </Col>
              <Col span={0}>
                <Form.Item
                  name={[field.name, 'op_range_type']}
                  initialValue={MemberRoleWithOpRangeOpRangeTypeEnum.db_service}
                  noStyle
                >
                  <Input />
                </Form.Item>
              </Col>
              <Col span={1} offset={1}>
                <Form.Item label=" " colon={false}>
                  <DrawerFormIconWrapper
                    onClick={() => {
                      remove(index);
                    }}
                    icon={<IconFormListDelete />}
                  />
                </Form.Item>
              </Col>
            </Row>
          ))}
          <Form.Item label="" colon={false}>
            <FormListAddButtonWrapper
              icon={<IconFormListAdd />}
              onClick={() => {
                add();
              }}
              className="member-form-add-button"
            >
              {t('dmsMember.roleSelector.addRoleAndOpRange')}
            </FormListAddButtonWrapper>
          </Form.Item>
        </>
      )}
    </Form.List>
  );
};

export default RoleSelector;
