import {
  ActiontechTableActionMeta,
  ActiontechTableColumn,
  ActiontechTableProps,
  ActiontechTableToolbarActionMeta,
  InlineActiontechTableMoreActionsButtonMeta
} from '../index.type';
import BasicButton from '../../BasicButton';
import { useTranslation } from 'react-i18next';
import { Popconfirm, Popover } from 'antd';
import classnames from 'classnames';
import { useCallback, useState } from 'react';
import {
  InlineTableActionButtonsStyleWrapper,
  InlineTableActionMoreButtonPopoverStyleWrapper
} from '../components/style';
import EmptyBox from '../../EmptyBox';
import { checkButtonPermissions, checkButtonDisabled } from '../utils';
import classNames from 'classnames';
import { DashOutlined } from '@actiontech/icons';
import { cloneDeep } from 'lodash';
import { ActionButtonGroup, ActionButtonGroupProps } from '../../ActionButton';

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
      return (
        <ActionButtonGroup
          actions={actions.map<ActionButtonGroupProps['actions'][0]>(
            (action) => {
              const buttonProps =
                typeof action.buttonProps === 'function'
                  ? action.buttonProps(record)
                  : action.buttonProps;

              const cls = classnames(
                'actiontech-table-actions-button',
                buttonProps?.className
              );

              const confirm =
                typeof action.confirm === 'function'
                  ? action.confirm(record)
                  : action.confirm;

              if (confirm) {
                return {
                  ...buttonProps,
                  key: action.key,
                  text: action.text,
                  className: cls,
                  size: 'small',
                  actionType: 'confirm',
                  confirm
                };
              }

              return {
                ...buttonProps,
                key: action.key,
                className: cls,
                text: action.text,
                size: 'small'
              };
            }
          )}
        />
      );
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
      if (!actions) return null;

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
          const maxIndex = visibleMoreButtons.length >= 2 ? 2 : 1;
          for (let i = 0; i < maxIndex; i++) {
            const cloneVisibleMoreButtons = cloneDeep(visibleMoreButtons);
            visibleButtons.push({
              key: cloneVisibleMoreButtons[i].key,
              text: cloneVisibleMoreButtons[i].text,
              confirm: cloneVisibleMoreButtons[i].confirm,
              permissions: cloneVisibleMoreButtons[i].permissions,
              buttonProps: (data) => ({
                onClick: () => {
                  cloneVisibleMoreButtons[i]?.onClick?.(data);
                },
                disabled: !!cloneVisibleMoreButtons[i]?.disabled,
                icon: cloneVisibleMoreButtons[i]?.icon
              })
            });
          }

          visibleMoreButtons.splice(0, 2);
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
        render: (_, record: T) => renderContent(record)
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

  if (moreButtons.length === 0) {
    return null;
  }

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
          {moreButtons.map((button) => {
            const isDisabled = checkButtonDisabled(button.disabled, record);

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
              <EmptyBox if={!isDisabled} defaultNode={confirmButton}>
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
