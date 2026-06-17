import { EditableSelect } from '@actiontech/dms-kit';
import type {
  EditableSelectProps,
  EditableSelectOption
} from '@actiontech/dms-kit/es/components/EditableSelect/EditableSelect.types';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { DmsApi } from '@actiontech/shared/lib/api';
import { message } from 'antd';
import { useRequest } from 'ahooks';
import { ResponseCode } from '@actiontech/dms-kit';
import { IListDBServiceV2 } from '@actiontech/shared/lib/api/base/service/common';
import { useBoolean } from 'ahooks';

const ENVIRONMENT_TAG_PRESET_COLORS = [
  '#F5222D',
  '#FA8C16',
  '#52C41A',
  '#1677FF',
  '#722ED1',
  '#8C8C8C'
];

interface EnvironmentFieldProps extends Omit<EditableSelectProps, 'options'> {
  projectID?: string;
}
const EnvironmentField: React.FC<EnvironmentFieldProps> = ({
  projectID,
  ...props
}) => {
  const { t } = useTranslation();
  const [messageApi, contextHolder] = message.useMessage();
  const [boundServices, setBoundServices] = useState<IListDBServiceV2[]>([]);
  const [
    operationLoading,
    { setTrue: startOperationLoading, setFalse: stopOperationLoading }
  ] = useBoolean();
  const {
    data: environmentTags,
    refresh,
    loading
  } = useRequest(
    () =>
      DmsApi.ProjectService.ListEnvironmentTags({
        page_index: 1,
        page_size: 9999,
        project_uid: projectID ?? ''
      }).then((res) => {
        if (res.data.code === ResponseCode.SUCCESS) {
          return res.data.data?.map((item) => ({
            value: item.uid || '',
            label: item.name || '',
            color: item.color || undefined
          }));
        }
      }),
    {
      refreshDeps: [projectID],
      ready: !!projectID
    }
  );
  const onAdd = (v: string, color?: string) => {
    startOperationLoading();
    DmsApi.ProjectService.CreateEnvironmentTag({
      environment_name: v,
      color: color ?? '',
      project_uid: projectID ?? ''
    })
      .then((res) => {
        if (res.data.code === ResponseCode.SUCCESS) {
          messageApi.success(
            t('dmsDataSource.dataSourceForm.addEnvironmentAttributeSuccess')
          );
          refresh();
        }
      })
      .finally(() => {
        stopOperationLoading();
      });
  };
  const deleteEnvironmentTag = (environmentTagUid: string) => {
    startOperationLoading();
    DmsApi.ProjectService.DeleteEnvironmentTag({
      environment_tag_uid: environmentTagUid,
      project_uid: projectID ?? ''
    })
      .then((delRes) => {
        if (delRes.data.code === ResponseCode.SUCCESS) {
          messageApi.success(
            t('dmsDataSource.dataSourceForm.deleteEnvironmentAttributeSuccess')
          );
          refresh();
        }
      })
      .finally(() => {
        stopOperationLoading();
      });
  };
  const onDelete = (item: EditableSelectOption) => {
    const environmentTagUid = item.value.toString();
    DmsApi.DBServiceService.ListDBServicesV2({
      filter_by_environment_tag_uid: environmentTagUid,
      project_uid: projectID ?? '',
      page_size: 9999
    })
      .then((res) => {
        if (res.data.code === ResponseCode.SUCCESS) {
          setBoundServices(res.data.data ?? []);
          if (res.data.data?.length === 0) {
            deleteEnvironmentTag(environmentTagUid);
          }
        }
      })
      .finally(() => {
        stopOperationLoading();
      });
  };
  const onUpdate = (item: EditableSelectOption) => {
    startOperationLoading();
    DmsApi.ProjectService.UpdateEnvironmentTag({
      environment_tag_uid: item.value.toString(),
      environment_name: item.label,
      color: item.color ?? '',
      project_uid: projectID ?? ''
    })
      .then((res) => {
        if (res.data.code === ResponseCode.SUCCESS) {
          messageApi.success(
            t('dmsDataSource.dataSourceForm.updateEnvironmentAttributeSuccess')
          );
          refresh();
        }
      })
      .finally(() => {
        stopOperationLoading();
      });
  };
  return (
    <>
      {contextHolder}
      <EditableSelect
        {...props}
        options={environmentTags ?? []}
        addButtonText={t(
          'dmsDataSource.dataSourceForm.addEnvironmentAttribute'
        )}
        deletionConfirmTitle={t(
          'dmsDataSource.dataSourceForm.deleteEnvironmentAttributeConfirm'
        )}
        onDelete={onDelete}
        onUpdate={onUpdate}
        onAdd={onAdd}
        colorable
        presetColors={ENVIRONMENT_TAG_PRESET_COLORS}
        loading={operationLoading || loading}
        errorMessage={
          boundServices.length > 0
            ? t(
                'dmsDataSource.dataSourceForm.deleteEnvironmentAttributeError',
                {
                  name: boundServices.map((item) => item.name).join(',')
                }
              )
            : undefined
        }
      />
    </>
  );
};
export default EnvironmentField;
