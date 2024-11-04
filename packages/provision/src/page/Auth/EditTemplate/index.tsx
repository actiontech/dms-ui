import { Space, Typography, Form, message } from 'antd';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ModalName } from '~/data/enum';
import useModalStatus from '~/hooks/useModalStatus';
import { IDataPermissionsTable } from './Modal/AddDataPermission/index.type';
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
  AuthTemplateFormStyleWrapper,
  EditAuthTemplateStyleWrapper
} from './style';
import classNames from 'classnames';
import {
  ActiontechTable,
  TableToolbar,
  useTableRequestError
} from '@actiontech/shared/lib/components/ActiontechTable';
import BasicEmpty from '@actiontech/shared/lib/components/BasicEmpty';
import { ResponseCode } from '@actiontech/shared/lib/enum';
import {
  IEditTemplateFormFields,
  IEditTemplateActionTypeEnum
} from './index.type';
import { LeftArrowOutlined } from '@actiontech/icons';
import { CommonIconStyleWrapper } from '@actiontech/shared/lib/styleWrapper/element';

const EditTemplate = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const templateIdFormUrl = params.get('id');
  const templateNameFormUrl = params.get('name');
  const isView = params.get('action') === IEditTemplateActionTypeEnum.view;
  const [form] = Form.useForm<IEditTemplateFormFields>();
  const { projectID } = useCurrentProject();
  const [messageApi, messageContextHolder] = message.useMessage();

  const { loading: getIdLoading, data: templateId } = useRequest(
    () =>
      auth
        .AuthListDataPermissionTemplate({
          filter_by_name: templateNameFormUrl ?? '',
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
      ready: !!templateNameFormUrl && !templateIdFormUrl,
      refreshDeps: [projectID]
    }
  );
  const { requestErrorMessage, handleTableRequestError } =
    useTableRequestError();
  const { loading: getPermissionLoading } = useRequest(
    () =>
      handleTableRequestError(
        auth.AuthGetDataPermissionsInDataPermissionTemplate({
          data_permission_template_uid: templateIdFormUrl ?? templateId ?? ''
        })
      ),
    {
      ready: !!templateIdFormUrl || !!templateId,
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
    if (!templateNameFormUrl) return;
    form.setFieldsValue({ name: templateNameFormUrl });
  }, [form, templateNameFormUrl]);

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
      const uid = templateIdFormUrl ?? templateId;
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
          messageApi.success(
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
      `/provision/project/${projectID}/auth/template/edit-template?id=${newlyAddedAuthTemplateId}&name=${currentTemplateName}`
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
      {messageContextHolder}
      <PageLayoutHasFixedHeaderStyleWrapper>
        <PageHeader
          fixed
          title={
            <BasicButton
              onClick={() =>
                navigate(`/provision/project/${projectID}/auth/template`)
              }
              icon={<LeftArrowOutlined />}
            >
              {t('auth.backToAuthTemplateList')}
            </BasicButton>
          }
          extra={
            <Space hidden={isView || (!templateIdFormUrl && resultVisible)}>
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
            status="success"
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
                onClick={() =>
                  navigate(`/provision/project/${projectID}/auth/list/add`)
                }
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
                    disabled={!!templateNameFormUrl}
                    placeholder={t('auth.editTemplate.templateNamePlaceholder')}
                    onChange={() => setIsUpdated(true)}
                    size="large"
                    bordered={false}
                  />
                </Form.Item>
              </Form>
              <Space>
                <section className="tag-wrapper">
                  <CommonIconStyleWrapper className="custom-icon">
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 16 16"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M4.66659 3.33329V1.33329C4.66659 1.15648 4.73682 0.986912 4.86185 0.861888C4.98687 0.736864 5.15644 0.666626 5.33325 0.666626H10.6666C10.8434 0.666626 11.013 0.736864 11.138 0.861888C11.263 0.986912 11.3333 1.15648 11.3333 1.33329V3.33329H13.9999C14.1767 3.33329 14.3463 3.40353 14.4713 3.52855C14.5963 3.65358 14.6666 3.82315 14.6666 3.99996V13.3333C14.6666 13.5101 14.5963 13.6797 14.4713 13.8047C14.3463 13.9297 14.1767 14 13.9999 14H1.99992C1.82311 14 1.65354 13.9297 1.52851 13.8047C1.40349 13.6797 1.33325 13.5101 1.33325 13.3333V3.99996C1.33325 3.82315 1.40349 3.65358 1.52851 3.52855C1.65354 3.40353 1.82311 3.33329 1.99992 3.33329H4.66659ZM2.66659 9.99996V12.6666H13.3333V9.99996H2.66659ZM7.33325 7.33329V8.66663H8.66659V7.33329H7.33325ZM5.99992 1.99996V3.33329H9.99992V1.99996H5.99992Z"
                        fill="#3DB5F1"
                      />
                    </svg>
                  </CommonIconStyleWrapper>
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
                hasSelectedBusiness && !isView
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
              actions={
                isView ? [] : AuthTableActions(editTemplate, removeTemplate)
              }
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
