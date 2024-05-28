import {
  ActiontechTableColumn,
  PageInfoWithoutIndexAndSize,
  ActiontechTableActionMeta,
  InlineActiontechTableMoreActionsButtonMeta
} from '@actiontech/shared/lib/components/ActiontechTable';
import BasicTypographyEllipsis from '@actiontech/shared/lib/components/BasicTypographyEllipsis';
import {
  IListAuthorization,
  IDataObjectService
} from '@actiontech/shared/lib/api/provision/service/common';
import { t } from '~/locale';
import { IAuthListAuthorizationParams } from '@actiontech/shared/lib/api/provision/service/auth/index.d';
import { EmptyBox, BasicToolTips, BasicTag } from '@actiontech/shared';
import { EditOutlined } from '@ant-design/icons';
import { Space, Typography } from 'antd';
import { ListAuthorizationStatusEnum } from '@actiontech/shared/lib/api/provision/service/common.enum';
import dayjs from 'dayjs';
import { NavigateFunction } from 'react-router-dom';
import { ModalName } from '~/data/enum';
import { formatTime } from '@actiontech/shared/lib/utils/Common';

export type AuthListFilterParamType = PageInfoWithoutIndexAndSize<
  Omit<IAuthListAuthorizationParams, 'filter_by_namespace_uid'> & {
    page_index: number;
  }
>;

export const AuthTableColumns = (
  projectID: string,
  navigate: NavigateFunction,
  openModal: (record: IListAuthorization, name: ModalName) => void
): ActiontechTableColumn<IListAuthorization, AuthListFilterParamType> => {
  return [
    {
      dataIndex: 'permission_user',
      title: () => <>{t('auth.columns.permissionUser')}</>,
      render: (user: string, record) => (
        <Space className="auth-action-column">
          <Typography.Link onClick={() => navigate('/userCenter')}>
            {user}
          </Typography.Link>
          <Typography.Link
            className="auth-action-column-editor"
            onClick={() => openModal(record, ModalName.UpdateUserInAuth)}
          >
            <EditOutlined />
          </Typography.Link>
        </Space>
      )
    },
    {
      dataIndex: 'purpose',
      title: () => <>{t('auth.columns.purpose')}</>,
      filterCustomType: 'select',
      filterKey: 'filter_by_purpose'
    },
    {
      dataIndex: 'businesses',
      title: () => <>{t('auth.columns.businesses')}</>,
      filterCustomType: 'select',
      filterKey: 'filter_by_business'
    },
    {
      dataIndex: 'data_permission_template_names',
      title: t('auth.columns.template'),
      render: (names: string[], record: IListAuthorization) => (
        <Space className="auth-action-column">
          {names.map((name) => (
            <BasicTag
              style={{ margin: 5 }}
              key={name}
              onClick={() =>
                navigate(
                  `/provision/project/${projectID}/auth/template/edit-template/?name=${name}`
                )
              }
              className="template-name-tag"
            >
              {name}
            </BasicTag>
          ))}
          <Typography.Link
            className="auth-action-column-editor"
            onClick={() => openModal(record, ModalName.UpdateTemplateInAuth)}
          >
            <EditOutlined />
          </Typography.Link>
        </Space>
      )
    },
    {
      dataIndex: 'data_object_service',
      title: () => <>{t('auth.columns.dataObjectService')}</>,
      filterCustomType: 'select',
      filterKey: 'filter_by_data_object_service_dns',
      render: (service?: IDataObjectService[]) => {
        return (
          <EmptyBox if={!!service && service.length !== 0}>
            <BasicToolTips
              title={
                service?.length &&
                service.length > 1 && (
                  <>
                    {service?.map((item) => (
                      <Typography.Link
                        key={item.data_object_service_uid}
                        onClick={() =>
                          navigate(
                            `/project/${projectID}/db-services?address=${
                              item.data_object_service_dns?.split(':')[0]
                            }`
                          )
                        }
                      >
                        {`${item.data_object_service_dns}(${item.data_object_service_user})`}
                        <br />
                      </Typography.Link>
                    ))}
                  </>
                )
              }
            >
              <Typography.Link
                onClick={() =>
                  navigate(
                    `/project/${projectID}/db-services?address=${
                      service?.[0].data_object_service_dns?.split(':')[0]
                    }`
                  )
                }
              >
                {`${service?.[0].data_object_service_dns}(${service?.[0].data_object_service_user})`}
              </Typography.Link>
              {service?.length && service.length > 1 ? '...' : ''}
            </BasicToolTips>
          </EmptyBox>
        );
      }
    },
    {
      dataIndex: 'status',
      title: () => <>{t('auth.columns.status')}</>,
      width: 90,
      render: (status: ListAuthorizationStatusEnum, record) => {
        const time =
          record.expiration === -1
            ? t('auth.columns.permanent')
            : dayjs.unix(record.expiration ?? 0).format('YYYY-MM-DD HH:mm:ss');
        return (
          <BasicToolTips title={`${t('auth.columns.expiration')}: ${time}`}>
            {renderStatus[status]}
          </BasicToolTips>
        );
      }
    },
    {
      dataIndex: 'memo',
      className: 'ellipsis-column-width',
      title: () => <>{t('auth.columns.memo')}</>,
      render: (memo?: string) => {
        if (!memo) return '-';
        return (
          <BasicTypographyEllipsis textCont={memo} tooltipLimitLength={200} />
        );
      }
    },
    {
      dataIndex: 'last_update_at',
      title: () => <>{t('auth.columns.updateTime')}</>,
      render: (val) => formatTime(val)
    }
  ];
};

export const AuthTableActions = (
  onRecovery: (record?: IListAuthorization) => void,
  openModal: (record: IListAuthorization, name: ModalName) => void
): {
  moreButtons?: InlineActiontechTableMoreActionsButtonMeta<IListAuthorization>[];
  buttons: ActiontechTableActionMeta<IListAuthorization>[];
} => ({
  buttons: [
    {
      key: 'auth_connect',
      text: t('auth.connectionDetails.getConnection'),
      buttonProps: (record) => ({
        onClick: () => {
          openModal(record!, ModalName.GetConnection);
        }
      })
    },
    {
      key: 'auth_delete',
      text: t('auth.deleteAuth.button'),
      buttonProps: () => ({
        danger: true
      }),
      confirm: (record) => ({
        title: t('auth.deleteAuth.title', {
          purpose: record?.purpose ?? ''
        }),
        okText: t('common.ok'),
        cancelText: t('common.cancel'),
        onConfirm: () => {
          onRecovery(record);
        }
      })
    }
  ],
  moreButtons: [
    {
      key: 'expiration',
      text: t('auth.updateExpirationField'),
      onClick: (record) => openModal(record!, ModalName.UpdateExpirationInAuth),
      disabled: (record) => {
        return record?.expiration === -1;
      }
    }
  ]
});

const renderStatus = {
  [ListAuthorizationStatusEnum.effective]: (
    <Typography.Text type="success">
      {t('auth.columns.effective')}
    </Typography.Text>
  ),
  [ListAuthorizationStatusEnum.expired]: (
    <Typography.Text type="danger">{t('auth.columns.invalid')}</Typography.Text>
  ),
  [ListAuthorizationStatusEnum.expiring]: (
    <Typography.Text type="warning">
      {t('auth.columns.expiring')}
    </Typography.Text>
  )
};
