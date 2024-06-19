import {
  FormItemLabel,
  FormItemNoLabel
} from '@actiontech/shared/lib/components/FormCom';
import { SqlExecModeSelectorProps } from './index.type';
import {
  AuditTaskResV1SqlSourceEnum,
  CreateAuditTasksGroupReqV1ExecModeEnum
} from '@actiontech/shared/lib/api/sqle/service/common.enum';
import { BasicSelect, ModeSwitcher } from '@actiontech/shared';
import { sqlExecModeOptions } from '../index.data';
import { useTranslation } from 'react-i18next';
import { IconEllipse } from '@actiontech/shared/lib/Icon/common';
import { Form, Tooltip } from 'antd';
import { SqlAuditInfoFormFields } from '../../../../Create/index.type';
import { useRequest } from 'ahooks';
import task from '@actiontech/shared/lib/api/sqle/service/task';
import { ResponseCode } from '@actiontech/shared/lib/enum';
import { useEffect } from 'react';
import { tooltipsCommonProps } from '@actiontech/shared/lib/components/BasicToolTips';

const SqlExecModeSelector: React.FC<SqlExecModeSelectorProps> = ({
  fieldPrefixPath,
  isSupportFileModeExecuteSql,
  currentSqlUploadType
}) => {
  const { t } = useTranslation();
  const form = Form.useFormInstance<SqlAuditInfoFormFields>();

  const currentExecuteMode = Form.useWatch(
    [fieldPrefixPath, 'exec_mode'],
    form
  );

  const disabledSqlFileExecMode =
    !isSupportFileModeExecuteSql ||
    ![
      AuditTaskResV1SqlSourceEnum.sql_file,
      AuditTaskResV1SqlSourceEnum.zip_file
    ].includes(currentSqlUploadType);

  // #if [ee]
  const isSupportsFileSortUpload =
    currentSqlUploadType === AuditTaskResV1SqlSourceEnum.zip_file &&
    currentExecuteMode === CreateAuditTasksGroupReqV1ExecModeEnum.sql_file;

  const {
    data: sqlFileOrderMethodOptions,
    loading: getSqlFileOrderMethodLoading
  } = useRequest(
    () =>
      task.getSqlFileOrderMethodV1().then((res) => {
        if (res.data.code === ResponseCode.SUCCESS) {
          return res.data.data?.methods?.map((item) => {
            return {
              label: item.desc,
              value: item.order_method
            };
          });
        }
      }),
    {
      ready: isSupportsFileSortUpload
    }
  );
  // #endif

  useEffect(() => {
    if (disabledSqlFileExecMode) {
      form.setFieldValue([fieldPrefixPath, 'exec_mode'], undefined);
    } else {
      form.setFieldValue(
        [fieldPrefixPath, 'exec_mode'],
        CreateAuditTasksGroupReqV1ExecModeEnum.sqls
      );
    }
  }, [fieldPrefixPath, form, disabledSqlFileExecMode]);

  return (
    <>
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
        {disabledSqlFileExecMode ? (
          <Tooltip
            className="full-width-element"
            trigger="hover"
            {...tooltipsCommonProps(
              t('execWorkflow.create.form.sqlInfo.execModeDisabledTips')
            )}
          >
            <div data-testid="exec-mode-selector">
              <ModeSwitcher
                disabled={disabledSqlFileExecMode}
                rowProps={{ gutter: 10 }}
                options={sqlExecModeOptions}
              />
            </div>
          </Tooltip>
        ) : (
          <ModeSwitcher
            rowProps={{ gutter: 10 }}
            options={sqlExecModeOptions}
          />
        )}
      </FormItemNoLabel>

      {/* #if [ee] */}
      {isSupportsFileSortUpload && (
        <FormItemLabel
          label={t('execWorkflow.create.form.sqlInfo.selectFileSortMethod')}
          name={[fieldPrefixPath, 'file_sort_method']}
        >
          <BasicSelect
            loading={getSqlFileOrderMethodLoading}
            options={sqlFileOrderMethodOptions}
          />
        </FormItemLabel>
      )}
      {/* #endif */}
    </>
  );
};

export default SqlExecModeSelector;
