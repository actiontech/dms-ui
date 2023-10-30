import { Card, Button, Space, Input, Typography, Form, message } from 'antd5';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useSearchParams } from 'react-router-dom';
import ProvisionTable from '~/components/ProvisionTable';
import { ModalName } from '~/data/enum';
import useModalStatus from '~/hooks/useModalStatus';
import { IDataPermissionsTable } from './Modal/AddDataPermission/index.d';
import { AuthDataPermissionListModalStatus } from '~/store/auth/templateList';
import { authTableColumns } from './TableColumns';
import AddDataPermission from './Modal/AddDataPermission';
import { useBoolean, useRequest } from 'ahooks';
import { cloneDeep } from 'lodash';
import { ResponseCode } from '~/data/common';
import { AxiosResponse } from 'axios';
import {
  FormAreaBlockStyleWrapper,
  FormAreaLineStyleWrapper,
  FormStyleWrapper,
  formItemLayout
} from '@actiontech/shared/lib/components/FormCom/style';
import { generateDataPermissionValueByDataPermission } from './index.utils';
import { useCurrentProject } from '@actiontech/shared/lib/global';
import { usePrompt } from '@actiontech/shared/lib/hooks';
import auth from '@actiontech/shared/lib/api/provision/service/auth';
import { IDataPermission } from '@actiontech/shared/lib/api/provision/service/common';
import { PageLayoutHasFixedHeaderStyleWrapper } from '@actiontech/shared/lib/styleWrapper/element';
import { BasicButton, BasicInput, PageHeader } from '@actiontech/shared';
import { IconLeftArrow } from '@actiontech/shared/lib/Icon/common';
import { AuthTemplateFormStyleWrapper } from './style';
import classNames from 'classnames';
import { IconSelectedBusiness } from '~/icon/AuthTemplate';

interface IEditTemplateFormFields {
  name: string;
}

const EditTemplate = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const id = params.get('id');
  const name = params.get('name');
  const [form] = Form.useForm<IEditTemplateFormFields>();

  const { projectID } = useCurrentProject();

  const { loading: getIdLoading, data: templateId } = useRequest(
    () =>
      auth
        .AuthListDataPermissionTemplate({
          filter_by_name: name ?? '',
          page_size: 1,
          page_index: 1,
          filter_by_namespace_uid: projectID ?? ''
        })
        .then((res) => {
          if (res.data.code === ResponseCode.SUCCESS) {
            return res.data.data?.[0].uid ?? '';
          }
        }),
    {
      ready: !!name && !id,
      refreshDeps: [projectID]
    }
  );
  const { loading: getPermissionLoading } = useRequest(
    () =>
      auth.AuthGetDataPermissionsInDataPermissionTemplate({
        data_permission_template_uid: id ?? templateId ?? ''
      }),
    {
      ready: !!id || !!templateId,
      onSuccess: (res) => {
        if (res.data.code === ResponseCode.SUCCESS) {
          const permissions = generateDataPermissionValueByDataPermission(
            res.data.data ?? []
          );
          setDataPermissions(permissions);
        }
      }
    }
  );

  useEffect(() => {
    if (!name) return;
    form.setFieldsValue({ name });
  }, [form, name]);

  const { toggleModal, initModalStatus } = useModalStatus(
    AuthDataPermissionListModalStatus
  );
  const openModal = (name: ModalName) => {
    setIsUpdated(true);
    toggleModal(name, true);
  };
  useEffect(() => {
    initModalStatus({
      [ModalName.DataPermissionModal]: false
    });
  }, [initModalStatus]);

  const [dataPermissions, setDataPermissions] = useState<
    IDataPermissionsTable[]
  >([]);
  const [editIndex, setEditIndex] = useState<number>();
  const [submitLoading, { setTrue: startSubmit, setFalse: submitFinish }] =
    useBoolean();
  const hasSelectedBusiness = useMemo(
    () => dataPermissions.length > 0,
    [dataPermissions]
  );

  const handleSubmit = async () => {
    setIsUpdated(false);
    const values = await form.validateFields();
    const permissions: IDataPermission[] = dataPermissions.map((item) => ({
      data_object_uids: item.objectsParams,
      data_operation_set_uids: item.operationsValue
    }));
    startSubmit();
    try {
      const uid = id ?? templateId;
      let res: AxiosResponse;
      if (!uid) {
        res = await auth.AuthAddDataPermissionTemplate({
          template: {
            name: values.name,
            data_permissions: permissions,
            namespace_uid: projectID ?? ''
          }
        });
      } else {
        res = await auth.AuthUpdateDataPermissionTemplate({
          data_permission_template_uid: uid,
          template: {
            data_permissions: permissions
          }
        });
      }
      if (res.data.code === ResponseCode.SUCCESS) {
        const successTips = uid
          ? t('auth.editTemplate.editSuccessTips', { name: values.name })
          : t('auth.editTemplate.addSuccessTips', { name: values.name });
        message.success(successTips);
        navigate(`${projectID}/auth/template`);
      }
    } finally {
      submitFinish();
    }
  };

  const editTemplate = (index: number) => {
    setEditIndex(index);
    openModal(ModalName.DataPermissionModal);
  };
  const removeTemplate = (index: number) => {
    const data = cloneDeep(dataPermissions);
    const removed = data.splice(index, 1);
    setDataPermissions(data);
    setIsUpdated(true);
    return removed[0];
  };
  const removeAllTemplate = () => {
    setDataPermissions([]);
    setIsUpdated(true);
  };

  const [isUpdated, setIsUpdated] = useState<boolean>(false);

  useEffect(() => {
    const beforeunload = (e: any) => {
      if (isUpdated) {
        e.returnValue = '';
      }
    };
    window.addEventListener('beforeunload', beforeunload);
    return () => {
      window.removeEventListener('beforeunload', beforeunload);
    };
  }, [isUpdated]);
  usePrompt(t('auth.editTemplate.leaveTip'), isUpdated);

  return (
    <PageLayoutHasFixedHeaderStyleWrapper>
      <PageHeader
        fixed
        title={
          <BasicButton
            onClick={() =>
              navigate(`/provision/project/${projectID}/auth/template`)
            }
            icon={<IconLeftArrow />}
          >
            {t('auth.backToAuthTemplateList')}
          </BasicButton>
        }
        extra={
          <BasicButton
            type="primary"
            loading={submitLoading}
            onClick={handleSubmit}
          >
            {t('common.save')}
          </BasicButton>
        }
      />
      <AuthTemplateFormStyleWrapper>
        <Form form={form} wrapperCol={{ span: 5 }}>
          <Form.Item
            name="name"
            rules={[
              {
                required: true,
                message: t('common.form.rule.require', {
                  name: t('auth.template.columns.name')
                })
              }
            ]}
          >
            <BasicInput
              disabled={!!name}
              placeholder={t('auth.editTemplate.templateNamePlaceholder')}
              onChange={() => setIsUpdated(true)}
              size="large"
              bordered={false}
            />
          </Form.Item>
        </Form>
        <Space>
          <section className="tag-wrapper">
            <IconSelectedBusiness />
            <Typography.Text
              className={classNames('selected-business-text', {
                'has-selected': hasSelectedBusiness
              })}
            >
              {t('auth.addAuth.baseForm.selected')}
              {hasSelectedBusiness
                ? Array.from(
                    new Set(dataPermissions.map((item) => item.business))
                  )
                : '-'}
            </Typography.Text>
          </section>
        </Space>
      </AuthTemplateFormStyleWrapper>
      <Space direction="vertical" className="full-width-element" size={20}>
        <Card
          className="edit-template"
          title={<Space size={30}>{t('auth.addAuth.baseForm.overview')}</Space>}
          extra={
            <Space>
              <Button danger={true} type="text" onClick={removeAllTemplate}>
                {t('auth.addAuth.baseForm.reset')}
              </Button>
              <Button
                type="primary"
                onClick={() => openModal(ModalName.DataPermissionModal)}
              >
                {t('auth.button.addDataPermission')}
              </Button>
            </Space>
          }
        >
          <ProvisionTable
            rowKey={(record) => `${record.serviceLabel}${record.objectsLabel}`}
            loading={getIdLoading || getPermissionLoading}
            columns={authTableColumns(editTemplate, removeTemplate)}
            dataSource={dataPermissions}
            scroll={{ x: 'max-content' }}
          />
        </Card>
      </Space>
      <AddDataPermission
        editIndex={editIndex}
        setEditIndex={setEditIndex}
        dataPermissions={dataPermissions}
        setDataPermissions={setDataPermissions}
      />
    </PageLayoutHasFixedHeaderStyleWrapper>
  );
};

export default EditTemplate;
