import {
  ActiontechTableActionMeta,
  ActiontechTableColumn,
  ActiontechTableProps,
  ActiontechTableToolbarActionMeta,
  InlineActiontechTableMoreActionsButtonMeta
} from '../index.type';
import BasicButton from '../../BasicButton';
import { useTranslation } from 'react-i18next';
import { Popconfirm, Popover, Space } from 'antd';
import classnames from 'classnames';
import { useCallback, useState } from 'react';
import {
  InlineTableActionButtonsStyleWrapper,
  InlineTableActionMoreButtonPopoverStyleWrapper
} from '../components/style';
import EmptyBox from '../../EmptyBox';
import { checkButtonPermissions, checkButtonDisabled } from '../utils';
import { PopconfirmMessageStyleWrapper } from '../../../styleWrapper/element';
import classNames from 'classnames';
import { DashOutlined } from '@actiontech/icons';

export const ACTIONTECH_TABLE_ACTION_BUTTON_WIDTH = 82;
export const ACTIONTECH_TABLE_MORE_BUTTON_WIDTH = 40;

export const ACTIONTECH_TABLE_OPERATOR_COLUMN_CLS =
  'actiontech-table-actions-column';
export const ACTIONTECH_TABLE_OPERATOR_COLUMN_DATA_INDEX = 'operator';

const useTableAction = () => {
  const { t } = useTranslation();

  const renderAction = useCallback(
    <T extends Record<string, any>>(
      actions: Array<
        ActiontechTableActionMeta<T> | ActiontechTableToolbarActionMeta
      > = [],
      record?: T
    ) => {
      return (
        <Space>
          {actions.map((v) => {
            const isShow = checkButtonPermissions(v.permissions, record);

            const buttonProps =
              typeof v.buttonProps === 'function'
                ? v.buttonProps(record)
                : v.buttonProps;
            const confirm =
              typeof v.confirm === 'function' ? v.confirm(record) : v.confirm;

            const renderButton = !!confirm ? (
              <Popconfirm
                okText={t('common.ok')}
                cancelText={t('common.cancel')}
                {...confirm}
                title={
                  typeof confirm.title === 'string' ? (
                    <PopconfirmMessageStyleWrapper>
                      {confirm.title}
                    </PopconfirmMessageStyleWrapper>
                  ) : (
                    confirm.title
                  )
                }
              >
                <BasicButton
                  size="small"
                  key={v.key}
                  {...buttonProps}
                  className={classnames(
                    'actiontech-table-actions-button',
                    buttonProps?.className
                  )}
                >
                  {v.text}
                </BasicButton>
              </Popconfirm>
            ) : (
              <BasicButton
                size="small"
                key={v.key}
                {...buttonProps}
                className={classnames(
                  'actiontech-table-actions-button',
                  buttonProps?.className
                )}
              >
                {v.text}
              </BasicButton>
            );

            return (
              <EmptyBox if={isShow} key={v.key}>
                {renderButton}
              </EmptyBox>
            );
          })}
        </Space>
      );
    },
    [t]
  );

  const renderActionInTable = useCallback(
    <T extends Record<string, any>>(
      actions: ActiontechTableProps<T>['actions']
    ):
      | ActiontechTableColumn<
          T,
          Record<string, any>,
          typeof ACTIONTECH_TABLE_OPERATOR_COLUMN_DATA_INDEX
        >[0]
      | undefined => {
      if (Array.isArray(actions)) {
        if (actions.length === 0) {
          return;
        }
        return {
          dataIndex: ACTIONTECH_TABLE_OPERATOR_COLUMN_DATA_INDEX,
          className: ACTIONTECH_TABLE_OPERATOR_COLUMN_CLS,
          title: () => t('common.operate'),
          fixed: 'right',
          width: actions.length * ACTIONTECH_TABLE_ACTION_BUTTON_WIDTH,
          render: (_, record: T) => {
            return (
              <InlineTableActionButtonsStyleWrapper
                onClick={(e) => {
                  e.stopPropagation();
                }}
              >
                {renderAction<T>(actions, record)}
              </InlineTableActionButtonsStyleWrapper>
            );
          }
        };
      }

      if (
        (actions?.buttons ?? []).length === 0 &&
        (actions?.moreButtons ?? []).length === 0
      ) {
        return;
      }

      return {
        dataIndex: ACTIONTECH_TABLE_OPERATOR_COLUMN_DATA_INDEX,
        className: ACTIONTECH_TABLE_OPERATOR_COLUMN_CLS,
        title: actions?.title ?? (() => t('common.operate')),
        fixed: actions?.fixed ?? 'right',
        width:
          actions?.width ??
          (actions?.buttons.length ?? 0) *
            ACTIONTECH_TABLE_ACTION_BUTTON_WIDTH +
            (!!actions?.moreButtons ? ACTIONTECH_TABLE_MORE_BUTTON_WIDTH : 0),
        render: (_, record: T) => {
          return (
            <InlineTableActionButtonsStyleWrapper
              onClick={(e) => {
                e.stopPropagation();
              }}
            >
              {renderAction(actions?.buttons, record)}
              {actions?.moreButtons &&
                Array.isArray(actions.moreButtons) &&
                actions.moreButtons.length && (
                  <MoreButtons
                    moreButtons={actions?.moreButtons ?? []}
                    record={record}
                  />
                )}
              {actions?.moreButtons &&
              typeof actions.moreButtons === 'function' &&
              actions?.moreButtons(record).length ? (
                <MoreButtons
                  moreButtons={actions.moreButtons(record)}
                  record={record}
                />
              ) : null}
            </InlineTableActionButtonsStyleWrapper>
          );
        }
      };
    },
    [renderAction, t]
  );

  return {
    renderAction,
    renderActionInTable
  };
};

const MoreButtons = <T extends Record<string, any>>({
  moreButtons,
  record
}: {
  moreButtons: InlineActiontechTableMoreActionsButtonMeta<T>[];
  record?: T;
}) => {
  const [open, setOpen] = useState(false);

  return (
    <Popover
      open={open}
      arrow={false}
      trigger={'click'}
      placement="bottomLeft"
      overlayInnerStyle={{ padding: 0 }}
      onOpenChange={setOpen}
      content={
        <InlineTableActionMoreButtonPopoverStyleWrapper>
          {moreButtons.map((v) => {
            const isShow = checkButtonPermissions(v.permissions, record);
            const isDisabled = checkButtonDisabled(v.disabled, record);

            const handleClick = () => {
              if (!isDisabled) {
                v.onClick?.(record);
                setOpen(false);
              }
            };

            const buttonChildren = (
              <>
                <span className="more-button-item-icon">{v.icon}</span>
                <span className="more-button-item-text">{v.text}</span>
              </>
            );

            const confirmButton = (
              <div
                className={classNames('more-button-item', {
                  'more-button-item-disabled': isDisabled
                })}
              >
                {buttonChildren}
              </div>
            );

            const onConfirm = v.confirm ? v.confirm?.(record)?.onConfirm : null;

            const renderItem = v.confirm ? (
              <EmptyBox if={!isDisabled} defaultNode={confirmButton}>
                <Popconfirm
                  {...v.confirm?.(record)}
                  onConfirm={() => {
                    onConfirm?.();
                    setOpen(false);
                  }}
                >
                  {confirmButton}
                </Popconfirm>
              </EmptyBox>
            ) : (
              <div
                className={classNames('more-button-item', {
                  'more-button-item-disabled': isDisabled
                })}
                onClick={handleClick}
              >
                {buttonChildren}
              </div>
            );

            return (
              <EmptyBox if={isShow} key={v.key}>
                {renderItem}
              </EmptyBox>
            );
          })}
        </InlineTableActionMoreButtonPopoverStyleWrapper>
      }
    >
      <BasicButton
        className="actiontech-table-actions-button actiontech-table-actions-more-button"
        icon={<DashOutlined color="currentColor" />}
        onClick={() => {
          setOpen(true);
        }}
        size="small"
      />
    </Popover>
  );
};
export default useTableAction;
