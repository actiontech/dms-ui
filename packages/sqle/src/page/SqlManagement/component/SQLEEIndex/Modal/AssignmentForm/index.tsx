import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import { Form } from 'antd5';
import { FormItemLabelStyleWrapper } from '@actiontech/shared/lib/components/FormCom/FormItemCom/style';
import { BasicSelect } from '@actiontech/shared';

import { filterOptionByLabel } from '@actiontech/shared/lib/components/BasicSelect/utils';
import useUsername from '../../../../../../hooks/useUsername';
import { useCurrentProject } from '@actiontech/shared/lib/global';
import { IAssignmentForm } from './index.type';

export const FormSubmitStatusContext = React.createContext<boolean>(false);

const AssignmentForm = ({ form, submitLoading, ...props }: IAssignmentForm) => {
  const { t } = useTranslation();
  const { loading, updateUsernameList, generateUsernameSelectOption } =
    useUsername();
  const { projectName } = useCurrentProject();

  useEffect(() => {
    if (props.init) {
      updateUsernameList(projectName);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.init]);

  return (
    <FormSubmitStatusContext.Provider value={submitLoading}>
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
    </FormSubmitStatusContext.Provider>
  );
};

export default AssignmentForm;
