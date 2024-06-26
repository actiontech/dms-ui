import { Col, Form } from 'antd';
import { BasicSelect, BasicInput } from '@actiontech/shared';
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
import { MemberRoleSelectorRowStyleWrapper } from '../style';
import { PlusCircleFilled, MinusCircleFilled } from '@actiontech/icons';

const RoleSelector: React.FC<{ projectID: string }> = ({ projectID }) => {
  const { t } = useTranslation();
  const {
    loading: getRoleListLoading,
    updateRoleList,
    generateRoleSelectOption
  } = useRole();
  const {
    loading: getDbServiceListLoading,
    updateDbServiceList,
    generateDbServiceIDSelectOptions
  } = useDbService();
  useEffect(() => {
    updateRoleList();
    updateDbServiceList({ project_uid: projectID });
  }, [projectID, updateDbServiceList, updateRoleList]);

  return (
    <Form.List name="roles" initialValue={[]}>
      {(fields, { add, remove }) => (
        <>
          {fields.map((field, index) => (
            <MemberRoleSelectorRowStyleWrapper key={field.key}>
              <Col span={8}>
                <Form.Item
                  label={index === 0 ? t('dmsMember.roleSelector.role') : ''}
                  {...field}
                  name={[field.name, 'role_uid']}
                  rules={[{ required: true }]}
                >
                  <BasicSelect<string>
                    popupMatchSelectWidth={false}
                    showSearch
                    loading={getRoleListLoading}
                    optionFilterProp="children"
                    filterOption={filterOptionByLabel}
                    placeholder={t('common.form.placeholder.select', {
                      name: t('dmsMember.roleSelector.role')
                    })}
                  >
                    {generateRoleSelectOption({
                      showTooltip: true,
                      excludeDisabled: true
                    })}
                  </BasicSelect>
                </Form.Item>
              </Col>
              <Col span={12} offset={1}>
                <Form.Item
                  {...field}
                  name={[field.name, 'range_uids']}
                  label={index === 0 ? t('dmsMember.roleSelector.opRange') : ''}
                  rules={[{ required: true }]}
                >
                  <BasicSelect
                    placeholder={t('common.form.placeholder.select', {
                      name: t('dmsMember.roleSelector.opRange')
                    })}
                    mode="multiple"
                    showSearch
                    allowClear
                    loading={getDbServiceListLoading}
                    optionFilterProp="children"
                    filterOption={filterOptionByLabel}
                  >
                    {generateDbServiceIDSelectOptions()}
                  </BasicSelect>
                </Form.Item>
              </Col>
              <Col span={0}>
                <Form.Item
                  name={[field.name, 'op_range_type']}
                  initialValue={MemberRoleWithOpRangeOpRangeTypeEnum.db_service}
                  noStyle
                >
                  <BasicInput />
                </Form.Item>
              </Col>
              <Col span={1} offset={1}>
                <Form.Item label={index === 0 ? ' ' : ''} colon={false}>
                  <DrawerFormIconWrapper
                    onClick={() => {
                      remove(index);
                    }}
                    icon={<MinusCircleFilled />}
                  />
                </Form.Item>
              </Col>
            </MemberRoleSelectorRowStyleWrapper>
          ))}
          <Form.Item label="" colon={false}>
            <FormListAddButtonWrapper
              icon={<PlusCircleFilled />}
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
