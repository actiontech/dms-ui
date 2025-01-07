import {
  FormItemLabel,
  FormItemNoLabel
} from '@actiontech/shared/lib/components/CustomForm';
import { SqlExecModeSelectorProps } from './index.type';
import {
  AuditTaskResV1SqlSourceEnum,
  CreateAuditTasksGroupReqV1ExecModeEnum
} from '@actiontech/shared/lib/api/sqle/service/common.enum';
import {
  BasicSelect,
  EmptyBox,
  ModeSwitcher,
  basicTooltipCommonProps
} from '@actiontech/shared';
import { sqlExecModeOptions } from '../index.data';
import { useTranslation } from 'react-i18next';
import { Form, Tooltip } from 'antd';
import { SqlAuditInfoFormFields } from '../../../../Create/index.type';
import { useRequest } from 'ahooks';
import task from '@actiontech/shared/lib/api/sqle/service/task';
import { ResponseCode } from '@actiontech/shared/lib/enum';
import { useEffect } from 'react';
import { RingPieFilled } from '@actiontech/icons';
import { CommonIconStyleWrapper } from '@actiontech/shared/lib/styleWrapper/element';

const SqlExecModeSelector: React.FC<SqlExecModeSelectorProps> = ({
  fieldPrefixPath,
  isSupportFileModeExecuteSql,
  currentSqlUploadType,
  isAtRejectStep
}) => {
  const { t } = useTranslation();
  const form = Form.useFormInstance<SqlAuditInfoFormFields>();

  const currentExecuteMode = Form.useWatch(
    [fieldPrefixPath, 'exec_mode'],
    form
  );

  const disabledSqlFileExecMode =
    !isSupportFileModeExecuteSql ||
    (!!currentSqlUploadType &&
      ![
        AuditTaskResV1SqlSourceEnum.sql_file,
        AuditTaskResV1SqlSourceEnum.zip_file
      ].includes(currentSqlUploadType));

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
    if (disabledSqlFileExecMode && !isAtRejectStep) {
      form.setFieldValue(
        [fieldPrefixPath, 'exec_mode'],
        CreateAuditTasksGroupReqV1ExecModeEnum.sqls
      );
    }
  }, [fieldPrefixPath, form, disabledSqlFileExecMode, isAtRejectStep]);

  return (
    <EmptyBox
      if={currentSqlUploadType !== AuditTaskResV1SqlSourceEnum.form_data}
    >
      <FormItemLabel
        className="has-label-tip form-item-label-mb-16"
        label={
          <div className="label-cont-custom">
            <div>
              <CommonIconStyleWrapper className="custom-icon-ellipse">
                <RingPieFilled className="custom-icon-ellipse" />
              </CommonIconStyleWrapper>
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
      <EmptyBox
        if={disabledSqlFileExecMode}
        defaultNode={
          <FormItemNoLabel
            initialValue={CreateAuditTasksGroupReqV1ExecModeEnum.sqls}
            name={[fieldPrefixPath, 'exec_mode']}
          >
            <ModeSwitcher
              data-testid="exec-mode-selector"
              rowProps={{ gutter: 10 }}
              options={sqlExecModeOptions}
            />
          </FormItemNoLabel>
        }
      >
        <Tooltip
          className="full-width-element"
          trigger="hover"
          {...basicTooltipCommonProps(
            t('execWorkflow.create.form.sqlInfo.execModeDisabledTips')
          )}
        >
          <FormItemNoLabel
            initialValue={CreateAuditTasksGroupReqV1ExecModeEnum.sqls}
            name={[fieldPrefixPath, 'exec_mode']}
          >
            <ModeSwitcher
              data-testid="exec-mode-selector"
              disabled={disabledSqlFileExecMode}
              rowProps={{ gutter: 10 }}
              options={sqlExecModeOptions}
            />
          </FormItemNoLabel>
        </Tooltip>
      </EmptyBox>

      {/* #if [ee] */}
      {isSupportsFileSortUpload && (
        <FormItemLabel
          label={t('execWorkflow.create.form.sqlInfo.selectFileSortMethod')}
          name={[fieldPrefixPath, 'file_sort_method']}
        >
          <BasicSelect
            loading={getSqlFileOrderMethodLoading}
            options={sqlFileOrderMethodOptions}
            disabled={isAtRejectStep}
          />
        </FormItemLabel>
      )}
      {/* #endif */}
    </EmptyBox>
  );
};

export default SqlExecModeSelector;
