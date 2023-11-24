import { Space, Typography, Form, message } from 'antd';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ModalName } from '~/data/enum';
import useModalStatus from '~/hooks/useModalStatus';
import { IDataPermissionsTable } from './Modal/AddDataPermission/index.d';
import { AuthDataPermissionListModalStatus } from '~/store/auth/templateList';
import { AuthTableActions, AuthTableColumns } from './TableColumns';
import AddDataPermission from './Modal/AddDataPermission';
import { useBoolean, useRequest } from 'ahooks';
import { cloneDeep } from 'lodash';
import { AxiosResponse } from 'axios';
import { generateDataPermissionValueByDataPermission } from './index.utils';
import { useCurrentProject } from '@actiontech/shared/lib/global';
import { usePrompt } from '@actiontech/shared/lib/hooks';
import auth from '@actiontech/shared/lib/api/provision/service/auth';
import { IDataPermission } from '@actiontech/shared/lib/api/provision/service/common';
import { PageLayoutHasFixedHeaderStyleWrapper } from '@actiontech/shared/lib/styleWrapper/element';
import {
  BasicButton,
  BasicInput,
  BasicResult,
  PageHeader
} from '@actiontech/shared';
import {
  IconLeftArrow,
  IconSuccessResult
} from '@actiontech/shared/lib/Icon/common';
import {
  AuthTemplateFormStyleWrapper,
  EditAuthTemplateStyleWrapper
} from './style';
import classNames from 'classnames';
import { IconSelectedBusiness } from '~/icon/AuthTemplate';
import {
  ActiontechTable,
  TableToolbar,
  useTableRequestError
} from '@actiontech/shared/lib/components/ActiontechTable';
import BasicEmpty from '@actiontech/shared/lib/components/BasicEmpty';
import { ResponseCode } from '@actiontech/shared/lib/enum';

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

  const { requestErrorMessage, handleTableRequestError } =
    useTableRequestError();
  const { loading: getPermissionLoading } = useRequest(
    () =>
      handleTableRequestError(
        auth.AuthGetDataPermissionsInDataPermissionTemplate({
          data_permission_template_uid: id ?? templateId ?? ''
        })
      ),
    {
      ready: !!id || !!templateId,
      onSuccess: (res) => {
        if (res.list && res.list.length > 0) {
          const permissions = generateDataPermissionValueByDataPermission(
            res.list
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

  const [dataPermissions, setDataPermissions] = useState<
    IDataPermissionsTable[]
  >([]);
  const [editIndex, setEditIndex] = useState<number>();
  const [resultVisible, { setTrue: showResult, setFalse: hideResult }] =
    useBoolean();
  const [submitLoading, { setTrue: startSubmit, setFalse: submitFinish }] =
    useBoolean();
  const hasSelectedBusiness = useMemo(
    () => dataPermissions.length > 0,
    [dataPermissions]
  );
  const [newlyAddedAuthTemplateId, setNewlyAddedAuthTemplateId] = useState('');

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
        if (uid) {
          message.success(
            t('auth.editTemplate.editSuccessTips', { name: values.name })
          );
          navigate(`/provision/project/${projectID}/auth/template`);
        } else {
          setNewlyAddedAuthTemplateId(res.data.data.uid ?? '');
          showResult();
        }
      }
    } finally {
      submitFinish();
    }
  };

  const editTemplate = (index?: number) => {
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

  const checkCurrentAuthTemplate = useCallback(() => {
    const currentTemplateName = form.getFieldValue('name');
    navigate(
      `/provision/project/${projectID}/auth/template/edit_template?id=${newlyAddedAuthTemplateId}&name=${currentTemplateName}`
    );
    hideResult();
  }, [form, hideResult, navigate, newlyAddedAuthTemplateId, projectID]);

  const [isUpdated, setIsUpdated] = useState<boolean>(false);

  useEffect(() => {
    initModalStatus({
      [ModalName.DataPermissionModal]: false
    });
  }, [initModalStatus]);

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
    <EditAuthTemplateStyleWrapper>
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
            <Space hidden={!id && resultVisible}>
              <BasicButton
                type="primary"
                loading={submitLoading}
                onClick={handleSubmit}
              >
                {t('common.save')}
              </BasicButton>
            </Space>
          }
        />

        {resultVisible ? (
          <BasicResult
            icon={<IconSuccessResult />}
            title={t('auth.editTemplate.addSuccessTips', {
              name: form.getFieldValue('name')
            })}
            extra={[
              <BasicButton
                type="primary"
                key="checkAuthTemplateDetail"
                onClick={checkCurrentAuthTemplate}
              >
                {t('auth.button.checkAuthTemplateDetail')}
              </BasicButton>,
              <BasicButton
                key="toAuthList"
                onClick={() => navigate(`/provision/project/${projectID}/auth`)}
              >
                {t('auth.button.toAuthList')}
              </BasicButton>
            ]}
          />
        ) : (
          <>
            <AuthTemplateFormStyleWrapper>
              <Form form={form}>
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
            <TableToolbar
              actions={
                hasSelectedBusiness
                  ? [
                      {
                        key: 'remove-all-permission',
                        text: t('auth.addAuth.baseForm.reset'),
                        buttonProps: {
                          danger: true
                        },
                        confirm: {
                          title: t('auth.editTemplate.clearConfirmTips'),
                          onConfirm: removeAllTemplate
                        }
                      },
                      {
                        key: 'add-data-permission',
                        text: t('auth.button.addDataPermission'),
                        buttonProps: {
                          onClick: () =>
                            openModal(ModalName.DataPermissionModal)
                        }
                      }
                    ]
                  : undefined
              }
            >
              <span className="table-toolbar-title">
                {t('auth.addAuth.baseForm.overview')}
              </span>
            </TableToolbar>
            <ActiontechTable
              rowKey={(record) =>
                `${record.serviceLabel}${record.objectsLabel}`
              }
              loading={getIdLoading || getPermissionLoading}
              dataSource={dataPermissions}
              columns={AuthTableColumns()}
              actions={AuthTableActions(editTemplate, removeTemplate)}
              errorMessage={requestErrorMessage}
              locale={{
                emptyText: (
                  <BasicEmpty>
                    {!getPermissionLoading && (
                      <>
                        <Typography.Paragraph className="extra-tips">
                          {t('auth.editTemplate.extraEmptyTips')}
                        </Typography.Paragraph>
                        <BasicButton
                          type="primary"
                          onClick={() =>
                            openModal(ModalName.DataPermissionModal)
                          }
                        >
                          {t('auth.button.addDataPermission')}
                        </BasicButton>
                      </>
                    )}
                  </BasicEmpty>
                )
              }}
              pagination={false}
              scroll={{ x: 'max-content' }}
            />

            <AddDataPermission
              editIndex={editIndex}
              setEditIndex={setEditIndex}
              dataPermissions={dataPermissions}
              setDataPermissions={setDataPermissions}
            />
          </>
        )}
      </PageLayoutHasFixedHeaderStyleWrapper>
    </EditAuthTemplateStyleWrapper>
  );
};

export default EditTemplate;
