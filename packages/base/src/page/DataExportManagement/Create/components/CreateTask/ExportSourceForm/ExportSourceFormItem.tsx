import { BasicSelect } from '@actiontech/shared';
import { FormItemLabel } from '@actiontech/shared/lib/components/FormCom';
import { useTranslation } from 'react-i18next';
import useDbService from '../../../../../../hooks/useDbService';
import { useEffect, useMemo } from 'react';
import { useCurrentProject } from '@actiontech/shared/lib/global';
import { IconEllipse } from '@actiontech/shared/lib/Icon/common';
import { ListDBServiceTipsFunctionalModuleEnum } from '@actiontech/shared/lib/api/base/service/dms/index.enum';
import useInstanceSchema from 'sqle/src/hooks/useInstanceSchema';
import { CreateExportTaskFormEntryProps } from '../index.type';
import { Form, SelectProps } from 'antd';
import dayjs from 'dayjs';

const ExportSourceFormItem: React.FC<
  Pick<CreateExportTaskFormEntryProps, 'sourceForm' | 'baseForm'>
> = ({ sourceForm, baseForm }) => {
  const { t } = useTranslation();
  const { projectID, projectName } = useCurrentProject();

  const {
    updateDbServiceList,
    generateDbServiceIDSelectOptions,
    dbServiceList
  } = useDbService();

  const dbServiceID = Form.useWatch('dbService', sourceForm);

  const dbServiceName = useMemo(() => {
    const name = dbServiceList.find((v) => v.id === dbServiceID)?.name;
    return name;
  }, [dbServiceID, dbServiceList]);

  //todo 暂时先使用 sqle 接口。。
  const { updateSchemaList, generateInstanceSchemaSelectOption } =
    useInstanceSchema(projectName, dbServiceName);

  const setDefaultWorkflowName: SelectProps['onChange'] = (dbServiceID) => {
    const name = dbServiceList.find((v) => v.id === dbServiceID)?.name;

    if (!baseForm.getFieldValue('workflow_subject')) {
      baseForm.setFieldValue(
        'workflow_subject',
        `${name}_${dayjs().format('YYYYMMDDhhmmss')}`
      );
    }

    updateSchemaList();
  };

  useEffect(() => {
    updateDbServiceList({
      project_uid: projectID,
      functional_module:
        ListDBServiceTipsFunctionalModuleEnum.create_export_task
    });
  }, [projectID, updateDbServiceList]);

  return (
    <>
      {/* <FormItemLabel
        label={
          <div className="label-cont-custom">
            <div>
              <IconEllipse />
              <span>{t('dmsDataExport.create.form.source.business')}</span>
            </div>
          </div>
        }
        name="business"
      >
        <BasicSelect
          placeholder={t('common.form.placeholder.select', {
            name: t('dmsDataExport.create.form.source.business')
          })}
        />
      </FormItemLabel> */}
      <FormItemLabel
        label={
          <div className="label-cont-custom">
            <div>
              <IconEllipse />
              <span>{t('dmsDataExport.create.form.source.dbService')}</span>
            </div>
          </div>
        }
        name="dbService"
        className="has-required-style"
        rules={[
          {
            required: true,
            message: t('common.form.placeholder.select', {
              name: t('dmsDataExport.create.form.source.dbService')
            })
          }
        ]}
      >
        <BasicSelect
          onChange={setDefaultWorkflowName}
          placeholder={t('common.form.placeholder.select', {
            name: t('dmsDataExport.create.form.source.dbService')
          })}
        >
          {generateDbServiceIDSelectOptions()}
        </BasicSelect>
      </FormItemLabel>
      <FormItemLabel
        label={
          <div className="label-cont-custom">
            <div>
              <IconEllipse />
              <span>{t('dmsDataExport.create.form.source.schema')}</span>
            </div>
          </div>
        }
        name="schema"
      >
        <BasicSelect
          placeholder={t('common.form.placeholder.select', {
            name: t('dmsDataExport.create.form.source.schema')
          })}
        >
          {generateInstanceSchemaSelectOption()}
        </BasicSelect>
      </FormItemLabel>
    </>
  );
};

export default ExportSourceFormItem;
