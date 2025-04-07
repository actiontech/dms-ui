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
import { IListProject } from '@actiontech/shared/lib/api/base/service/common';

interface BusinessSelectorProps {
  value?: EditableSelectValue;
  onChange?: (value: EditableSelectValue) => void;
}

const BusinessField = (props: BusinessSelectorProps) => {
  const { t } = useTranslation();

  const [messageApi, contextHolder] = message.useMessage();

  const [bindedProjectList, setBindedProjectList] = useState<IListProject[]>(
    []
  );

  const { data: businessList, refresh } = useRequest(() =>
    DmsApi.ProjectService.ListBusinessTags({
      page_index: 1,
      page_size: 9999
    }).then((res) => {
      if (res.data.code === ResponseCode.SUCCESS) {
        return res.data.data?.map((item) => ({
          value: item.id ?? 0,
          label: item.name ?? ''
        }));
      }
    })
  );

  const onAddBusiness = (v: string) => {
    DmsApi.ProjectService.CreateBusinessTag({
      business_tag: {
        name: v
      }
    }).then((res) => {
      if (res.data.code === ResponseCode.SUCCESS) {
        messageApi.success(t('dmsProject.projectForm.createBusinessSuccess'));
        refresh();
      }
    });
  };

  const deleteBusinessTag = (id: number) => {
    DmsApi.ProjectService.DeleteBusinessTag({
      business_tag_uid: id.toString()
    }).then((res) => {
      if (res.data.code === ResponseCode.SUCCESS) {
        messageApi.success(t('dmsProject.projectForm.deleteBusinessSuccess'));
        refresh();
      }
    });
  };

  const onDelete = (item: EditableSelectOption) => {
    DmsApi.ProjectService.ListProjectsV2({
      filter_by_business_tag: item.value.toString(),
      page_size: 9999
    }).then((res) => {
      if (res.data.code === ResponseCode.SUCCESS) {
        setBindedProjectList(res.data.data ?? []);
        if (bindedProjectList.length === 0) {
          deleteBusinessTag(Number(item.value));
        }
      }
    });
  };

  const onUpdate = (item: EditableSelectOption) => {
    DmsApi.ProjectService.UpdateBusinessTag({
      business_tag_uid: item.value.toString(),
      business_tag: {
        name: item.label
      }
    }).then((res) => {
      if (res.data.code === ResponseCode.SUCCESS) {
        messageApi.success(t('dmsProject.projectForm.updateBusinessSuccess'));
        refresh();
      }
    });
  };

  return (
    <>
      {contextHolder}
      <EditableSelect
        // options={[
        //   { value: '1', label: '市场部' },
        //   { value: '2', label: '研发部' }
        // ]}
        options={businessList ?? []}
        onAdd={onAddBusiness}
        onDelete={onDelete}
        onUpdate={onUpdate}
        addButtonText={t('dmsProject.projectForm.addBusiness')}
        deletionConfirmTitle={t(
          'dmsProject.projectForm.deleteBusinessConfirmTitle'
        )}
        {...props}
      />
      <EmptyBox if={bindedProjectList.length > 0}>
        <ReminderInformation
          status="error"
          message={t('dmsProject.projectForm.deleteBusinessError', {
            name: bindedProjectList.map((item) => item.name).join(',')
          })}
        />
      </EmptyBox>
    </>
  );
};

export default BusinessField;
