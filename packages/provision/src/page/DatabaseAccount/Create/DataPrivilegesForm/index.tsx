import { FormItemSubTitle } from '@actiontech/shared/lib/components/CustomForm';
import { useTranslation } from 'react-i18next';
import { Form } from 'antd';
import { CreateAccountFormType } from '../../index.type';
import { useCurrentProject } from '@actiontech/shared/lib/global';
import DatabasePrivilegesSelector from '../../../../components/DatabasePrivilegesSelector';

type Props = {
  mode: 'create' | 'update';
};

const DataPrivilegesForm: React.FC<Props> = ({ mode }) => {
  const { t } = useTranslation();
  const { projectID } = useCurrentProject();
  const form = Form.useFormInstance<CreateAccountFormType>();

  return (
    <>
      <FormItemSubTitle>
        {t('databaseAccount.create.privilegeInfo')}
      </FormItemSubTitle>

      <DatabasePrivilegesSelector
        showQuickCreateRole
        form={form}
        projectID={projectID}
        mode={mode}
      />
    </>
  );
};

export default DataPrivilegesForm;
