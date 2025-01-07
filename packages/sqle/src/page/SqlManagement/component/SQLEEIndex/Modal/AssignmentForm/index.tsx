import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Form } from 'antd';
import { BasicSelect } from '@actiontech/shared';
import { filterOptionByLabel } from '@actiontech/shared/lib/components/BasicSelect/utils';
import useUsername from '../../../../../../hooks/useUsername';
import { useCurrentProject } from '@actiontech/shared/lib/global';
import { IAssignmentForm } from './index.type';
import { FormItemLabelStyleWrapper } from '@actiontech/shared/lib/components/CustomForm/FormItem/style';

const AssignmentForm = ({ form, submitLoading, ...props }: IAssignmentForm) => {
  const { t } = useTranslation();
  const { loading, updateUsernameList, generateUsernameSelectOption } =
    useUsername();
  const { projectName } = useCurrentProject();

  useEffect(() => {
    if (props.init) {
      updateUsernameList({ filter_project: projectName });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.init]);

  return (
    <Form form={form}>
      <FormItemLabelStyleWrapper
        label=""
        name="assignees"
        rules={[
          {
            required: true,
            message: t('common.form.placeholder.select', {
              name: t('sqlManagement.table.column.personInCharge')
            })
          }
        ]}
      >
        <BasicSelect
          loading={loading}
          showSearch
          disabled={submitLoading}
          filterOption={filterOptionByLabel}
          mode="multiple"
          placeholder={t('common.form.placeholder.select', {
            name: t('sqlManagement.table.column.personInCharge')
          })}
        >
          {generateUsernameSelectOption()}
        </BasicSelect>
      </FormItemLabelStyleWrapper>
    </Form>
  );
};

export default AssignmentForm;
