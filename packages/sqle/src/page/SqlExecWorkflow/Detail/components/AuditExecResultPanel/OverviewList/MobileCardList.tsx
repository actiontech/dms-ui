import { IGetWorkflowTasksItemV2 } from '@actiontech/shared/lib/api/sqle/service/common';
import { List, Card, Descriptions, Space, Popconfirm } from 'antd';
import { useTranslation } from 'react-i18next';
import { MobileCardListStyleWrapper } from './style';
import { useMemo } from 'react';
import type { ActiontechTableColumn } from '@actiontech/dms-kit/es/components/ActiontechTable';
import { BasicButton, BasicEmpty } from '@actiontech/dms-kit';
import type { ActiontechTableProps } from '@actiontech/dms-kit/es/components/ActiontechTable';

interface MobileCardListProps {
  dataSource?: IGetWorkflowTasksItemV2[];
  loading: boolean;
  actions?: ActiontechTableProps<IGetWorkflowTasksItemV2>['actions'];
  columns: ActiontechTableColumn<IGetWorkflowTasksItemV2>;
  onCardClick: (record: IGetWorkflowTasksItemV2) => void;
}

type TaskItemValue = IGetWorkflowTasksItemV2[keyof IGetWorkflowTasksItemV2];

const defaultCellRender = (value: TaskItemValue): React.ReactNode => {
  if (value === null || value === undefined || value === '') {
    return '-';
  }
  if (Array.isArray(value)) {
    if (value.length === 0) {
      return '-';
    }
    const allPrimitive = value.every(
      (v) => typeof v === 'string' || typeof v === 'number'
    );
    return allPrimitive ? value.join(', ') : `${value.length}`;
  }
  return value as React.ReactNode;
};

const MobileCardList: React.FC<MobileCardListProps> = ({
  dataSource,
  loading,
  actions,
  columns,
  onCardClick
}) => {
  const { t } = useTranslation();

  const renderActions = useMemo(() => {
    return (record: IGetWorkflowTasksItemV2) => {
      // ActiontechTableActionsWithPermissions 也可能是数组类型；这里移动端只处理 object-config 的 buttons
      if (!actions || Array.isArray(actions) || !actions.buttons) {
        return null;
      }

      const actionButtons = actions.buttons
        .filter((btn) => {
          if (btn.permissions && !btn.permissions(record)) {
            return false;
          }

          // hidden 检查
          const buttonPropsResult =
            typeof btn.buttonProps === 'function'
              ? btn.buttonProps(record)
              : btn.buttonProps || {};

          return !buttonPropsResult.hidden;
        })
        .map((btn) => {
          const buttonPropsResult =
            typeof btn.buttonProps === 'function'
              ? btn.buttonProps(record)
              : btn.buttonProps || {};

          const confirmResult =
            typeof btn.confirm === 'function'
              ? btn.confirm(record)
              : btn.confirm;

          // 有 confirm 配置时使用 Popconfirm 包裹
          if (confirmResult) {
            return (
              <span
                key={btn.key}
                onClick={(e) => {
                  e.stopPropagation();
                }}
              >
                <Popconfirm
                  title={confirmResult.title}
                  onConfirm={confirmResult.onConfirm}
                  disabled={confirmResult.disabled}
                  placement="top"
                >
                  <BasicButton
                    size="small"
                    danger={buttonPropsResult.danger}
                    disabled={buttonPropsResult.disabled}
                    type={buttonPropsResult.type}
                  >
                    {btn.text}
                  </BasicButton>
                </Popconfirm>
              </span>
            );
          }

          // 无 confirm 配置时直接渲染按钮
          return (
            <BasicButton
              key={btn.key}
              size="small"
              danger={buttonPropsResult.danger}
              disabled={buttonPropsResult.disabled}
              onClick={(e) => {
                e.stopPropagation();
                (buttonPropsResult.onClick as any)?.(e);
              }}
              type={buttonPropsResult.type}
            >
              {btn.text}
            </BasicButton>
          );
        });

      return actionButtons.length > 0 ? actionButtons : null;
    };
  }, [actions]);

  return (
    <MobileCardListStyleWrapper>
      <List
        loading={loading}
        dataSource={dataSource}
        locale={{
          emptyText: <BasicEmpty description={t('common.noData')} />
        }}
        renderItem={(record, index) => {
          const actionButtons = renderActions(record);

          return (
            <List.Item className="overview-list-item">
              <Card
                className="overview-card"
                onClick={() => {
                  onCardClick(record);
                }}
              >
                {/* 标题：实例名 - 可点击跳转 */}
                <div className="overview-card-title">
                  {record.instance_name}
                </div>

                {/* 详情信息 */}
                <Descriptions
                  size="small"
                  column={1}
                  className="overview-card-desc"
                >
                  {columns.map((col, colIndex) => {
                    const label =
                      typeof col.title === 'function'
                        ? col.title(undefined as any)
                        : col.title;
                    const dataIndex = col.dataIndex as
                      | keyof IGetWorkflowTasksItemV2
                      | undefined;
                    const rawValue = dataIndex
                      ? record?.[dataIndex]
                      : undefined;
                    const content = col.render
                      ? (col.render as any)(rawValue, record, index ?? colIndex)
                      : defaultCellRender(rawValue);

                    const key = String(
                      col.key ?? col.dataIndex ?? `col-${colIndex}`
                    );

                    return (
                      <Descriptions.Item
                        key={key}
                        label={label as React.ReactNode}
                      >
                        {content}
                      </Descriptions.Item>
                    );
                  })}
                </Descriptions>

                {/* 操作按钮区域 */}
                {actionButtons && (
                  <Space
                    size="small"
                    wrap
                    className="overview-card-actions"
                    onClick={(e) => {
                      e.stopPropagation();
                    }}
                  >
                    {actionButtons}
                  </Space>
                )}
              </Card>
            </List.Item>
          );
        }}
      />
    </MobileCardListStyleWrapper>
  );
};

export default MobileCardList;
