import {
  ActiontechTableActionMeta,
  ActiontechTableColumn,
  ActiontechTableProps,
  ActiontechTableToolbarActionMeta,
  InlineActiontechTableMoreActionsButtonMeta
} from '../index.type';
import { useTranslation } from 'react-i18next';
import { Popconfirm, Popover, Space } from 'antd';
import classnames from 'classnames';
import { useCallback, useState } from 'react';
import {
  InlineTableActionButtonsStyleWrapper,
  InlineTableActionMoreButtonPopoverStyleWrapper
} from '../components/style';
import { checkButtonPermissions, checkButtonDisabled } from '../utils';
import classNames from 'classnames';
import { DashOutlined } from '@actiontech/icons';
import { ActionButtonProps, ActionButton } from '../../ActionButton';
import { EmptyBox } from '../../EmptyBox';
import { BasicButton } from '../../BasicButton';

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
      if (actions.length === 0) {
        return null;
      }
      const render = (
        action: ActiontechTableActionMeta<T> | ActiontechTableToolbarActionMeta
      ) => {
        if (!checkButtonPermissions(action.permissions, record)) {
          return null;
        }
        const buttonProps =
          typeof action.buttonProps === 'function'
            ? action.buttonProps(record)
            : action.buttonProps;

        const commonProps: ActionButtonProps = {
          ...buttonProps,
          text: action.text,
          className: classnames(
            'actiontech-table-actions-button',
            buttonProps?.className
          ),
          size: 'small'
        };

        const confirm =
          typeof action.confirm === 'function'
            ? action.confirm(record)
            : action.confirm;

        if (confirm) {
          return (
            <ActionButton
              {...commonProps}
              key={action.key}
              actionType="confirm"
              confirm={confirm}
            />
          );
        }
      };
      if (actions.length === 1) {
        return render(actions[0]);
      }

      return <Space>{actions.map(render)}</Space>;
    },
    []
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
      | null => {
      if (!actions) {
        return null;
      }
      if (Array.isArray(actions) && actions.length === 0) {
        return null;
      }
      if (
        !Array.isArray(actions) &&
        actions.buttons.length === 0 &&
        actions.moreButtons?.length === 0
      ) {
        return null;
      }
      const calculateMaxWidth = () => {
        if (Array.isArray(actions)) {
          return actions.length * ACTIONTECH_TABLE_ACTION_BUTTON_WIDTH;
        } else {
          const buttonCount = actions.buttons.length;
          const hasMoreButtons =
            !Array.isArray(actions) &&
            actions.moreButtons &&
            (Array.isArray(actions.moreButtons)
              ? actions.moreButtons.length > 0
              : true);

          return (
            buttonCount * ACTIONTECH_TABLE_ACTION_BUTTON_WIDTH +
            (hasMoreButtons ? ACTIONTECH_TABLE_MORE_BUTTON_WIDTH : 0)
          );
        }
      };

      const maxWidth = calculateMaxWidth();

      const renderContent = (record: T) => {
        const visibleButtons = Array.isArray(actions)
          ? actions.filter((action) =>
              checkButtonPermissions(action.permissions, record)
            )
          : actions.buttons.filter((action) =>
              checkButtonPermissions(action.permissions, record)
            );
        let visibleMoreButtons: InlineActiontechTableMoreActionsButtonMeta<T>[] =
          [];

        if (!Array.isArray(actions) && actions.moreButtons) {
          const moreButtons =
            typeof actions.moreButtons === 'function'
              ? actions.moreButtons(record)
              : actions.moreButtons;
          visibleMoreButtons = moreButtons.filter((button) =>
            checkButtonPermissions(button.permissions, record)
          );
        }
        if (visibleButtons.length === 0 && visibleMoreButtons.length > 0) {
          //todo 文档记录. 当 visibleButtons 为 0 时，从 moreButtons 中 move 两个 button 到外层。
          const maxIndex = Math.min(visibleMoreButtons.length, 2);

          for (let i = 0; i < maxIndex; i++) {
            const button = visibleMoreButtons[i];
            visibleButtons.push({
              key: button.key,
              text: button.text,
              confirm: button.confirm,
              permissions: button.permissions,
              buttonProps: (data) => ({
                onClick: () => {
                  button.onClick?.(data);
                },
                disabled: !!button.disabled,
                icon: button.icon
              })
            });
          }
          visibleMoreButtons = visibleMoreButtons.slice(maxIndex);
        }
        return (
          <InlineTableActionButtonsStyleWrapper
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            {renderAction(visibleButtons, record)}
            <MoreButtons moreButtons={visibleMoreButtons} record={record} />
          </InlineTableActionButtonsStyleWrapper>
        );
      };

      return {
        dataIndex: ACTIONTECH_TABLE_OPERATOR_COLUMN_DATA_INDEX,
        className: ACTIONTECH_TABLE_OPERATOR_COLUMN_CLS,
        title: Array.isArray(actions)
          ? () => t('common.operate')
          : actions.title ?? (() => t('common.operate')),
        fixed: Array.isArray(actions) ? 'right' : actions.fixed ?? 'right',
        width: Array.isArray(actions) ? maxWidth : actions.width ?? maxWidth,
        render: (_: unknown, record: T) => renderContent(record)
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

  const visibleMoreButtons = moreButtons.map((button) => {
    return {
      ...button,
      disabled: checkButtonDisabled(button.disabled, record),
      permissions: checkButtonPermissions(button.permissions, record)
    };
  });

  if (visibleMoreButtons.length === 0) {
    return null;
  }

  return (
    <Popover
      open={open}
      arrow={false}
      trigger="click"
      placement="bottomLeft"
      overlayInnerStyle={{ padding: 0 }}
      onOpenChange={setOpen}
      content={
        <InlineTableActionMoreButtonPopoverStyleWrapper>
          {visibleMoreButtons.map((button) => {
            const isDisabled = button.disabled;

            const handleClick = () => {
              if (!isDisabled) {
                button.onClick?.(record);
                setOpen(false);
              }
            };

            const buttonChildren = (
              <>
                <span className="more-button-item-icon">{button.icon}</span>
                <span className="more-button-item-text">{button.text}</span>
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

            const onConfirm = button.confirm
              ? button.confirm?.(record)?.onConfirm
              : null;

            return button.confirm ? (
              <EmptyBox
                key={button.key}
                if={!isDisabled}
                defaultNode={confirmButton}
              >
                <Popconfirm
                  {...button.confirm?.(record)}
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
                key={button.key}
                className={classNames('more-button-item', {
                  'more-button-item-disabled': isDisabled
                })}
                onClick={handleClick}
              >
                {buttonChildren}
              </div>
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
