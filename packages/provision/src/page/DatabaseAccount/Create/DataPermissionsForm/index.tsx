import { FormItemSubTitle } from '@actiontech/shared/lib/components/FormCom';
import { useTranslation } from 'react-i18next';
import { Form } from 'antd';
import { CreateAccountFormType } from '../../index.type';
import { useCurrentProject } from '@actiontech/shared/lib/global';
import RolePermissionSelector from '../../../../components/RolePermissionSelector';

type Props = {
  disabled?: boolean;
};

const DataPermissionsForm: React.FC<Props> = ({ disabled }) => {
  const { t } = useTranslation();
  const { projectID } = useCurrentProject();
  const form = Form.useFormInstance<CreateAccountFormType>();

  return (
    <>
      <FormItemSubTitle>
        {t('databaseAccount.create.permissionInfo')}
      </FormItemSubTitle>

      <RolePermissionSelector
        showQuickCreateRole
        form={form}
        projectID={projectID}
      />
    </>
  );
};

export default DataPermissionsForm;
