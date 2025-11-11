import {
  BasicSelect,
  jsonParse,
  ROUTE_PATHS,
  TRANSIT_FROM_CONSTANT,
  BasicInput
} from '@actiontech/dms-kit';
import { FormItemLabel } from '@actiontech/dms-kit';
import { useTranslation } from 'react-i18next';
import useDbService from '../../../../../../hooks/useDbService';
import { useEffect, useMemo } from 'react';
import { useCurrentProject } from '@actiontech/shared/lib/features';
import { ListDBServiceTipsFunctionalModuleEnum } from '@actiontech/shared/lib/api/base/service/DBService/index.enum';
import useInstanceSchema from 'sqle/src/hooks/useInstanceSchema';
import { CreateExportTaskFormEntryProps } from '../index.type';
import { Form, SelectProps } from 'antd';
import dayjs from 'dayjs';
import { RingPieFilled } from '@actiontech/icons';
import { CommonIconStyleWrapper } from '@actiontech/dms-kit';
import { useTypedQuery } from '@actiontech/shared';
import { decompressFromEncodedURIComponent } from 'lz-string';
const ExportSourceFormItem: React.FC<
  Pick<
    CreateExportTaskFormEntryProps,
    'sourceForm' | 'baseForm' | 'methodForm'
  > & { mode?: 'create' | 'update' }
> = ({ sourceForm, baseForm, methodForm, mode = 'create' }) => {
  const { t } = useTranslation();
  const { projectID, projectName } = useCurrentProject();
  const extractQueries = useTypedQuery();

  const {
    updateDbServiceList,
    generateDbServiceIDSelectOptions,
    dbServiceList,
    loading: getDbServiceListLoading,
    getServiceDbType
  } = useDbService();

  const dbServiceID = Form.useWatch('dbService', sourceForm);
  const dbServiceName = useMemo(() => {
    const name = dbServiceList.find((v) => v.id === dbServiceID)?.name;
    return name;
  }, [dbServiceID, dbServiceList]);

  //todo 暂时先使用 sqle 接口。。
  const {
    generateInstanceSchemaSelectOption,
    loading: getInstanceSchemaListLoading
  } = useInstanceSchema(projectName, dbServiceName);
  const dbServiceChangeHandle: SelectProps['onChange'] = (id) => {
    const name = dbServiceList.find((v) => v.id === id)?.name;
    if (!baseForm.getFieldValue('workflow_subject')) {
      baseForm.setFieldValue(
        'workflow_subject',
        `${name}_${dayjs().format('YYYYMMDDhhmmss')}`
      );
    }
    sourceForm.setFieldValue('dbType', getServiceDbType(id));
  };
  useEffect(() => {
    updateDbServiceList({
      project_uid: projectID,
      functional_module:
        ListDBServiceTipsFunctionalModuleEnum.create_export_task
    });
  }, [projectID, updateDbServiceList]);

  useEffect(() => {
    if (dbServiceList?.length === 0 || mode === 'update') {
      return;
    }

    const searchParams = extractQueries(ROUTE_PATHS.BASE.DATA_EXPORT.create);
    if (!searchParams) {
      return;
    }

    const compressionData = searchParams.compression_data;
    const from = searchParams.from;

    if (
      from &&
      compressionData &&
      Object.values(TRANSIT_FROM_CONSTANT).includes(from)
    ) {
      try {
        const { databaseName, instanceName, taskName, sql } = jsonParse<{
          databaseName: string;
          instanceName: string;
          taskName: string;
          sql: string;
        }>(decompressFromEncodedURIComponent(compressionData));
        if (taskName) {
          baseForm.setFieldValue('workflow_subject', taskName);
        }

        if (sql) {
          methodForm.setFieldValue('sql', sql);
        }

        const serviceId = dbServiceList.find(
          (v) => v.name === instanceName
        )?.id;

        if (serviceId) {
          sourceForm.setFieldsValue({
            dbService: serviceId,
            dbType: getServiceDbType(serviceId)
          });
        }

        if (databaseName) {
          sourceForm.setFieldValue('schema', databaseName);
        }
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error(`${error}`);
      }
    }
  }, [
    baseForm,
    dbServiceList,
    extractQueries,
    methodForm,
    mode,
    sourceForm,
    getServiceDbType
  ]);

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
            <CommonIconStyleWrapper className="custom-icon-ellipse">
              <RingPieFilled />
            </CommonIconStyleWrapper>
            <span>{t('dmsDataExport.create.form.source.dbService')}</span>
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
          onChange={dbServiceChangeHandle}
          placeholder={t('common.form.placeholder.select', {
            name: t('dmsDataExport.create.form.source.dbService')
          })}
          loading={getDbServiceListLoading}
        >
          {generateDbServiceIDSelectOptions()}
        </BasicSelect>
      </FormItemLabel>
      <FormItemLabel name="dbType" hidden>
        <BasicInput />
      </FormItemLabel>
      <FormItemLabel
        label={
          <div className="label-cont-custom">
            <CommonIconStyleWrapper className="custom-icon-ellipse">
              <RingPieFilled />
            </CommonIconStyleWrapper>
            <span>{t('dmsDataExport.create.form.source.schema')}</span>
          </div>
        }
        name="schema"
        className="has-required-style"
        rules={[
          {
            required: true,
            message: t('common.form.placeholder.select', {
              name: t('dmsDataExport.create.form.source.schema')
            })
          }
        ]}
      >
        <BasicSelect
          placeholder={t('common.form.placeholder.select', {
            name: t('dmsDataExport.create.form.source.schema')
          })}
          loading={getInstanceSchemaListLoading}
        >
          {generateInstanceSchemaSelectOption()}
        </BasicSelect>
      </FormItemLabel>
    </>
  );
};
export default ExportSourceFormItem;
