import {
  FormItemLabel,
  FormItemNoLabel
} from '@actiontech/shared/lib/components/FormCom';
import { SqlExecModeSelectorProps } from './index.type';
import {
  AuditTaskResV1SqlSourceEnum,
  CreateAuditTasksGroupReqV1ExecModeEnum
} from '@actiontech/shared/lib/api/sqle/service/common.enum';
import { EmptyBox, ModeSwitcher } from '@actiontech/shared';
import { sqlExecModeOptions } from '../index.data';
import { useTranslation } from 'react-i18next';
import { IconEllipse } from '@actiontech/shared/lib/Icon/common';
import { Form } from 'antd';
import { SqlAuditInfoFormFields } from '../../../../Create/index.type';

const SqlExecModeSelector: React.FC<SqlExecModeSelectorProps> = ({
  fieldPrefixPath,
  isSupportFileModeExecuteSql
}) => {
  const { t } = useTranslation();
  const form = Form.useFormInstance<SqlAuditInfoFormFields>();
  const currentSqlUploadType = Form.useWatch(
    [fieldPrefixPath, 'currentUploadType'],
    form
  ) as AuditTaskResV1SqlSourceEnum;
  return (
    <EmptyBox
      if={
        currentSqlUploadType !== AuditTaskResV1SqlSourceEnum.form_data &&
        isSupportFileModeExecuteSql
      }
    >
      <FormItemLabel
        className="has-label-tip form-item-label-mb-16"
        label={
          <div className="label-cont-custom">
            <div>
              <IconEllipse />
              <span>
                {t('execWorkflow.create.form.sqlInfo.selectExecuteMode')}
              </span>
            </div>
            <div className="tip-content-box">
              {t('execWorkflow.create.form.sqlInfo.selectExecuteModeTips')}
            </div>
          </div>
        }
      />
      <FormItemNoLabel
        name={[fieldPrefixPath, 'exec_mode']}
        initialValue={CreateAuditTasksGroupReqV1ExecModeEnum.sqls}
      >
        <ModeSwitcher rowProps={{ gutter: 10 }} options={sqlExecModeOptions} />
      </FormItemNoLabel>
    </EmptyBox>
  );
};

export default SqlExecModeSelector;
