import {
  EditableSelect,
  EditableSelectValue,
  EditableSelectOption,
  ReminderInformation,
  EmptyBox
} from '@actiontech/shared';
import { useTranslation } from 'react-i18next';
import { DmsApi } from '@actiontech/shared/lib/api';
import { useRequest } from 'ahooks';
import { ResponseCode } from '@actiontech/shared/lib/enum';
import { message } from 'antd';
import { useState } from 'react';
import { IListProjectV2 } from '@actiontech/shared/lib/api/base/service/common';
import { useBoolean } from 'ahooks';

interface BusinessSelectorProps {
  value?: EditableSelectValue;
  onChange?: (value: EditableSelectValue) => void;
}

const BusinessField = (props: BusinessSelectorProps) => {
  const { t } = useTranslation();

  const [messageApi, contextHolder] = message.useMessage();

  const [boundProjectList, setBoundProjectList] = useState<IListProjectV2[]>(
    []
  );

  const [
    operationLoading,
    { setTrue: startOperationLoading, setFalse: stopOperationLoading }
  ] = useBoolean();

  const {
    data: businessList,
    refresh,
    loading
  } = useRequest(() =>
    DmsApi.ProjectService.ListBusinessTags({
      page_index: 1,
      page_size: 9999
    }).then((res) => {
      if (res.data.code === ResponseCode.SUCCESS) {
        return res.data.data?.map((item) => ({
          value: item.uid || '',
          label: item.name || ''
        }));
      }
    })
  );

  const onAddBusiness = (v: string) => {
    startOperationLoading();
    DmsApi.ProjectService.CreateBusinessTag({
      business_tag: {
        name: v
      }
    })
      .then((res) => {
        if (res.data.code === ResponseCode.SUCCESS) {
          messageApi.success(t('dmsProject.projectForm.createBusinessSuccess'));
          refresh();
        }
      })
      .finally(() => {
        stopOperationLoading();
      });
  };

  const deleteBusinessTag = (id: string) => {
    startOperationLoading();
    DmsApi.ProjectService.DeleteBusinessTag({
      business_tag_uid: id
    })
      .then((res) => {
        if (res.data.code === ResponseCode.SUCCESS) {
          messageApi.success(t('dmsProject.projectForm.deleteBusinessSuccess'));
          refresh();
        }
      })
      .finally(() => {
        stopOperationLoading();
      });
  };

  const onDelete = (item: EditableSelectOption) => {
    startOperationLoading();
    DmsApi.ProjectService.ListProjectsV2({
      filter_by_business_tag: item.label,
      page_size: 9999
    })
      .then((res) => {
        if (res.data.code === ResponseCode.SUCCESS) {
          setBoundProjectList(res.data.data ?? []);
          if (res.data.data?.length === 0) {
            deleteBusinessTag(item.value.toString());
          }
        }
      })
      .finally(() => {
        stopOperationLoading();
      });
  };

  const onUpdate = (item: EditableSelectOption) => {
    startOperationLoading();
    DmsApi.ProjectService.UpdateBusinessTag({
      business_tag_uid: item.value.toString(),
      business_tag: {
        name: item.label
      }
    })
      .then((res) => {
        if (res.data.code === ResponseCode.SUCCESS) {
          messageApi.success(t('dmsProject.projectForm.updateBusinessSuccess'));
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
        options={businessList ?? []}
        onAdd={onAddBusiness}
        onDelete={onDelete}
        onUpdate={onUpdate}
        addButtonText={t('dmsProject.projectForm.addBusiness')}
        deletionConfirmTitle={t(
          'dmsProject.projectForm.deleteBusinessConfirmTitle'
        )}
        loading={operationLoading || loading}
        {...props}
      />
      <EmptyBox if={boundProjectList.length > 0}>
        <ReminderInformation
          status="error"
          message={t('dmsProject.projectForm.deleteBusinessError', {
            name: boundProjectList.map((item) => item.name).join(',')
          })}
        />
      </EmptyBox>
    </>
  );
};

export default BusinessField;
