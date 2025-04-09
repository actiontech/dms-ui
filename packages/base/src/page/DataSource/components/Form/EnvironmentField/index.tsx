import {
  EditableSelect,
  EditableSelectProps,
  EditableSelectOption,
  ReminderInformation,
  EmptyBox
} from '@actiontech/shared';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { DmsApi } from '@actiontech/shared/lib/api';
import { message } from 'antd';
import { useRequest } from 'ahooks';
import { ResponseCode } from '@actiontech/shared/lib/enum';
import { IListDBServiceV2 } from '@actiontech/shared/lib/api/base/service/common';
import { useBoolean } from 'ahooks';

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
            label: item.name || ''
          }));
        }
      }),
    {
      refreshDeps: [projectID],
      ready: !!projectID
    }
  );

  const onAdd = (v: string) => {
    startOperationLoading();
    DmsApi.ProjectService.CreateEnvironmentTag({
      environment_name: v,
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

  const deleteEnvironmentTag = (id: string) => {
    startOperationLoading();
    DmsApi.ProjectService.DeleteBusinessTag({
      business_tag_uid: id
    })
      .then((res) => {
        if (res.data.code === ResponseCode.SUCCESS) {
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
    startOperationLoading();
    DmsApi.DBServiceService.ListDBServicesV2({
      filter_by_environment_tag: item.label,
      project_uid: projectID ?? '',
      page_size: 9999
    })
      .then((res) => {
        if (res.data.code === ResponseCode.SUCCESS) {
          setBoundServices(res.data.data ?? []);
          if (res.data.data?.length === 0) {
            deleteEnvironmentTag(item.value.toString());
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
        loading={operationLoading || loading}
      />
      <EmptyBox if={boundServices.length > 0}>
        <ReminderInformation
          status="error"
          message={t(
            'dmsDataSource.dataSourceForm.deleteEnvironmentAttributeError',
            {
              name: boundServices.map((item) => item.name).join(',')
            }
          )}
        />
      </EmptyBox>
    </>
  );
};

export default EnvironmentField;
