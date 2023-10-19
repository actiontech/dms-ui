import { DownOutlined } from '@ant-design/icons';
import { Box } from '@mui/system';
import {
  Button,
  Dropdown,
  MenuProps,
  Popconfirm,
  Space,
  Tag,
  Typography
} from 'antd';
import i18n from 'i18next';
import { ModalName } from '~/data/enum';
import { TableColumn } from '~/types/common.type';
import { Link } from '../../../components/Link';
import { IListDataPermissionTemplate } from '@actiontech/shared/lib/api/provision/service/common';

export const authTemplateListTableColumns: (
  openModal: (name: ModalName, record?: IListDataPermissionTemplate) => void,
  removeTemplate: (record: IListDataPermissionTemplate) => void,
  projectID: string
) => TableColumn<IListDataPermissionTemplate, 'operator'> = (
  openModal,
  removeTemplate,
  projectID
) => [
  {
    title: () => <>{i18n.t('auth.template.columns.name')}</>,
    dataIndex: 'name'
  },
  {
    title: () => <>{i18n.t('auth.template.columns.authorization_purpose')}</>,
    dataIndex: 'authorization_purpose',
    render: (purpose: string[]) => {
      return (
        purpose?.map((item) => (
          <Box
            key={item}
            sx={(theme) => ({
              '&:hover .ant-tag': {
                borderColor: theme.color.link
              },
              '&:hover a': {
                color: theme.color.link
              }
            })}
          >
            <Tag style={{ margin: 5 }}>
              <Link to={`${projectID}/auth/list/${item}`}>{item}</Link>
            </Tag>
          </Box>
        )) ?? '--'
      );
    }
  },
  {
    title: () => <>{i18n.t('common.operate')}</>,
    dataIndex: 'operator',
    width: 170,
    fixed: 'right',
    render: (_, record: IListDataPermissionTemplate) => {
      const handleClickCopyButton = () => {
        openModal(ModalName.CopyTemplate, record);
      };
      return (
        <Space size={16}>
          <Link
            to={`${projectID}/auth/template/edit_template/?id=${record?.uid}&name=${record.name}`}
          >
            <>{i18n.t('auth.columns.details')}</>
          </Link>
          <Popconfirm
            title={i18n.t<string>('auth.removeTemplate.deleteTips', {
              name: record.name
            })}
            placement="topRight"
            okText={i18n.t<string>('common.ok')}
            cancelText={i18n.t<string>('common.cancel')}
            onConfirm={() => {
              removeTemplate(record);
            }}
          >
            <Typography.Text type="danger" className="pointer">
              {i18n.t<string>('common.delete')}
            </Typography.Text>
          </Popconfirm>
          <Dropdown
            menu={{
              items: generateMoreButtonItems(
                handleClickCopyButton,
                record,
                projectID
              )
            }}
            trigger={['click']}
            placement="bottomRight"
          >
            <Typography.Link>
              <Space>
                {i18n.t<string>('common.more')}
                <DownOutlined />
              </Space>
            </Typography.Link>
          </Dropdown>
        </Space>
      );
    }
  }
];

const generateMoreButtonItems: (
  handleClickCopyButton: () => void,
  record: IListDataPermissionTemplate,
  projectID: string
) => MenuProps['items'] = (handleClickCopyButton, record, projectID) => [
  {
    key: 'jumpAuth',
    label: (
      <Button type="link" block={true}>
        <Link to={`${projectID}/auth/list/add?id=${record.uid}`}>
          <>{i18n.t('auth.button.addAuth')}</>
        </Link>
      </Button>
    )
  },
  {
    key: 'copyTemplate',
    label: (
      <Button type="link">{i18n.t<string>('auth.button.copyTemplate')}</Button>
    ),
    onClick: handleClickCopyButton
  }
];
