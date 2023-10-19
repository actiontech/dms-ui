import { EmptyBox } from '@actiontech/shared';
import { DownOutlined, EditOutlined } from '@ant-design/icons';
import {
  Button,
  Dropdown,
  MenuProps,
  Popconfirm,
  Space,
  Tag,
  Tooltip,
  Typography
} from 'antd';
import moment from 'moment';
import { TableColumn } from '~/components/ProvisionTable';
import { ModalName } from '~/data/enum';
import { t } from '~/locale';
import { formatTime } from '~/utils/Common';
import { Link } from '../../../components/Link';
import {
  IDataObjectService,
  IListAuthorization
} from '@actiontech/shared/lib/api/provision/service/common';
import { ListAuthorizationStatusEnum } from '@actiontech/shared/lib/api/provision/service/common.enum';

export const authListTableColumns = (
  openModal: (record: IListAuthorization, name: ModalName) => void,
  removeAuth: (record: IListAuthorization) => void,
  projectID: string
): TableColumn<IListAuthorization, 'operator' | 'auth_details'> => {
  const generateMoreButtonItems: (
    record: IListAuthorization
  ) => MenuProps['items'] = (record) => [
    {
      key: 'expiration',
      label: (
        <Button type="link" block={true} disabled={record.expiration === -1}>
          {t('auth.updateExpirationField')}
        </Button>
      ),
      onClick: () => openModal(record, ModalName.UpdateExpirationInAuth)
    }
  ];
  return [
    {
      dataIndex: 'permission_user',
      title: () => <>{t('auth.columns.permissionUser')}</>,
      render: (user: string, record: IListAuthorization) => (
        <Space>
          {/* todo 暂时没有筛选 */}
          <Link to={`/userCenter`} baseUrl="">
            {user}
          </Link>
          <Typography.Link
            onClick={() => {
              openModal(record, ModalName.UpdateUserInAuth);
            }}
          >
            <EditOutlined />
          </Typography.Link>
        </Space>
      )
    },
    {
      dataIndex: 'purpose',
      title: () => <>{t('auth.columns.purpose')}</>
    },
    {
      dataIndex: 'businesses',
      title: () => <>{t('auth.columns.businesses')}</>
    },
    {
      dataIndex: 'data_permission_template_names',
      title: () => <>{t('auth.columns.template')}</>,
      render: (names: string[], record: IListAuthorization) => (
        <Space>
          {names.map((name) => (
            <Tag style={{ margin: 5 }} key={name}>
              <Link
                to={`${projectID}/auth/template/edit_template/?name=${name}`}
              >
                {name}
              </Link>
            </Tag>
          ))}
          <Typography.Link
            onClick={() => {
              openModal(record, ModalName.UpdateTemplateInAuth);
            }}
          >
            <EditOutlined />
          </Typography.Link>
        </Space>
      )
    },
    {
      dataIndex: 'data_object_service',
      title: () => <>{t('auth.columns.dataObjectService')}</>,
      render: (service?: IDataObjectService[]) => {
        return (
          <EmptyBox if={!!service && service.length !== 0}>
            <Tooltip
              title={
                service?.length &&
                service.length > 1 && (
                  <>
                    {service?.map((item) => (
                      <Link
                        to={`${projectID}/data/object?address=${item.data_object_service_dns}&user=${item.data_object_service_user}`}
                        key={item.data_object_service_uid}
                      >
                        {`${item.data_object_service_dns}(${item.data_object_service_user})`}
                        <br />
                      </Link>
                    ))}
                  </>
                )
              }
            >
              <Link
                to={`${projectID}/data/object?address=${service?.[0].data_object_service_dns}&user=${service?.[0].data_object_service_user}`}
              >
                {`${service?.[0].data_object_service_dns}(${service?.[0].data_object_service_user})`}
              </Link>
              {service?.length && service.length > 1 ? '...' : ''}
            </Tooltip>
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
            : moment.unix(record.expiration ?? 0).format('YYYY-MM-DD HH:mm:ss');
        return (
          <Tooltip title={`${t('auth.columns.expiration')}: ${time}`}>
            {renderStatus[status]}
          </Tooltip>
        );
      }
    },
    {
      dataIndex: 'memo',
      title: () => <>{t('auth.columns.memo')}</>,
      render: (memo?: string) => (memo ? memo : '--')
    },
    {
      dataIndex: 'last_update_at',
      title: () => <>{t('auth.columns.updateTime')}</>,
      render: (val) => formatTime(val)
    },
    {
      dataIndex: 'operator',
      title: () => <>{t('common.operate')}</>,
      width: 230,
      fixed: 'right',
      render: (_, record) => {
        return (
          <Space size={16}>
            <Typography.Link
              onClick={openModal.bind(null, record, ModalName.GetConnection)}
            >
              {t('auth.connectionDetails.getConnection')}
            </Typography.Link>
            <Popconfirm
              title={t('auth.deleteAuth.title', {
                purpose: record.purpose ?? ''
              })}
              placement="topRight"
              okText={t('common.ok')}
              cancelText={t('common.cancel')}
              onConfirm={() => {
                removeAuth(record);
              }}
            >
              <Typography.Text type="danger" className="pointer">
                {t('auth.deleteAuth.button')}
              </Typography.Text>
            </Popconfirm>
            <Dropdown
              menu={{
                items: generateMoreButtonItems(record)
              }}
              trigger={['click']}
              placement="bottomRight"
            >
              <Typography.Link>
                <Space>
                  {t('common.more')}
                  <DownOutlined />
                </Space>
              </Typography.Link>
            </Dropdown>
          </Space>
        );
      }
    }
  ];
};

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
