import { Col, Form, Spin, Alert } from 'antd';
import {
  BasicSelect,
  BasicInput,
  FormItemSubTitle,
  BasicSwitch,
  EmptyBox
} from '@actiontech/shared';
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
  MemberRoleSelectorRowStyleWrapper,
  MemberPermissionCheckboxGroupStyleWrapper
} from '../style';
import { PlusCircleFilled, MinusCircleFilled } from '@actiontech/icons';
import { ListOpPermissionsFilterByTargetEnum } from '@actiontech/shared/lib/api/base/service/OpPermission/index.enum';
import useOpPermission from '../../../hooks/useOpPermission';

type PermissionFieldsProps = {
  projectID: string;
};

const PermissionFields: React.FC<PermissionFieldsProps> = ({ projectID }) => {
  const { t } = useTranslation();

  const isProjectAdmin = Form.useWatch('isProjectAdmin');

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

  const {
    loading: getOpPermissionListLoading,
    updateOpPermissionList,
    opPermissionList
  } = useOpPermission();

  useEffect(() => {
    updateRoleList();
    updateDbServiceList({ project_uid: projectID });
    updateOpPermissionList(ListOpPermissionsFilterByTargetEnum.project);
  }, [projectID, updateDbServiceList, updateRoleList, updateOpPermissionList]);

  return (
    <>
      <FormItemSubTitle className="member-form-sub-title">
        {t('dmsMember.memberForm.managerSetter')}
      </FormItemSubTitle>
      <Form.Item
        name="isProjectAdmin"
        label={t('dmsMember.memberForm.isProjectAdmin')}
        valuePropName="checked"
        initialValue={false}
      >
        <BasicSwitch />
      </Form.Item>
      <EmptyBox if={isProjectAdmin}>
        <Alert
          message={t('dmsMember.memberForm.projectAdminTips')}
          type="info"
          showIcon
        />
      </EmptyBox>
      <EmptyBox if={!isProjectAdmin}>
        <Spin
          spinning={
            getOpPermissionListLoading ||
            getRoleListLoading ||
            getDbServiceListLoading
          }
        >
          <FormItemSubTitle className="member-form-sub-title">
            {t('dmsMember.memberForm.projectManagementPermission')}
          </FormItemSubTitle>
          <Form.Item name="projectManagementPermission">
            <MemberPermissionCheckboxGroupStyleWrapper
              options={
                opPermissionList?.map((item) => ({
                  label: item.op_permission?.name ?? '',
                  value: item.op_permission?.uid ?? ''
                })) ?? []
              }
            />
          </Form.Item>
          <FormItemSubTitle className="member-form-sub-title">
            {t('dmsMember.memberForm.projectOpPermission')}
          </FormItemSubTitle>
          <Form.List name="roles" initialValue={[]}>
            {(fields, { add, remove }) => (
              <>
                {fields.map((field, index) => (
                  <MemberRoleSelectorRowStyleWrapper key={field.key}>
                    <Col span={12}>
                      <Form.Item
                        {...field}
                        key={field.key}
                        name={[field.name, 'range_uids']}
                        label={
                          index === 0 ? t('dmsMember.roleSelector.opRange') : ''
                        }
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
                          {generateDbServiceIDSelectOptions()}
                        </BasicSelect>
                      </Form.Item>
                    </Col>
                    <Col span={8} offset={1}>
                      <Form.Item
                        label={
                          index === 0 ? t('dmsMember.roleSelector.role') : ''
                        }
                        {...field}
                        key={field.key}
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
                          {generateRoleSelectOption({
                            showTooltip: true,
                            excludeDisabled: true
                          })}
                        </BasicSelect>
                      </Form.Item>
                    </Col>
                    <Col span={0}>
                      <Form.Item
                        name={[field.name, 'op_range_type']}
                        initialValue={
                          MemberRoleWithOpRangeOpRangeTypeEnum.db_service
                        }
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
                    {t('dmsMember.memberForm.addProjectOpPermission')}
                  </FormListAddButtonWrapper>
                </Form.Item>
              </>
            )}
          </Form.List>
        </Spin>
      </EmptyBox>
    </>
  );
};

export default PermissionFields;
