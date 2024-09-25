import { Popover } from 'antd';
import { ContextMenuProps } from './index.type';
import { PopoverInnerStyleWrapper } from '@actiontech/shared/lib/styleWrapper/nav';
import { useControllableValue } from 'ahooks';
import classNames from 'classnames';

const ContextMenu: React.FC<ContextMenuProps> = ({
  popoverProps,
  header,
  items,
  children
}) => {
  const [open, onOpenChange] = useControllableValue(
    typeof popoverProps?.open !== 'undefined'
      ? {
          value: popoverProps.open,
          onChange: popoverProps?.onOpenChange,
          defaultValue: false
        }
      : {
          onChange: popoverProps?.onOpenChange,
          defaultValue: false
        }
  );
  return (
    <Popover
      trigger={['click']}
      arrow={false}
      overlayInnerStyle={{ padding: 0 }}
      {...popoverProps}
      open={open}
      onOpenChange={onOpenChange}
      content={
        <PopoverInnerStyleWrapper>
          {header && <div className="header">{header}</div>}
          <div className="content">
            {items.map((menu) => {
              if (menu.hidden) {
                return null;
              }
              return (
                <div
                  key={menu.key}
                  className={classNames('content-item', {
                    'content-item-disabled': menu.disabled
                  })}
                  onClick={(e) => {
                    if (menu.disabled) {
                      return;
                    }
                    if (!menu.keepOpenOnClick) {
                      popoverProps?.onOpenChange?.(false);
                    }
                    menu.onClick?.(e);
                  }}
                >
                  {menu.icon}

                  <div className="content-item-text">{menu.text}</div>
                </div>
              );
            })}
          </div>
        </PopoverInnerStyleWrapper>
      }
    >
      {children}
    </Popover>
  );
};

export default ContextMenu;
