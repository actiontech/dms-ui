import { useRef, useState } from 'react';
import { EditTypeProps } from './index.type';
import EmptyBox from '../EmptyBox';
import BasicButton from '../BasicButton';
import { IconEdit } from '../../Icon/common';
import { EditTextStyleWrapper } from './style';
import classNames from 'classnames';

const EditText: React.FC<EditTypeProps> = ({
  value,
  editable,
  editButtonProps,
  ...props
}) => {
  const [showEdit, setShowEdit] = useState(false);
  const internalValue = useRef<string>(value);

  const render = () => {
    if (!!value) {
      return (
        <EditTextStyleWrapper
          {...props}
          editable={{
            triggerType: ['icon', 'text'],
            ...editable,
            onChange: (value) => {
              internalValue.current = value;
              editable?.onChange?.(value);
            },
            onEnd: () => {
              editable?.onEnd?.(internalValue.current);
            },
            icon: <IconEdit />,
            tooltip: false
          }}
        >
          {value}
        </EditTextStyleWrapper>
      );
    }

    return (
      <EmptyBox
        if={showEdit}
        defaultNode={
          <BasicButton
            size="small"
            className={classNames({
              'has-icon-primary': !editButtonProps?.children
            })}
            icon={editButtonProps?.children ? undefined : <IconEdit />}
            {...editButtonProps}
            onClick={(e) => {
              e.stopPropagation();
              setShowEdit(true);
            }}
          />
        }
      >
        <EditTextStyleWrapper
          {...props}
          editable={{
            triggerType: ['icon', 'text'],
            ...editable,
            editing: showEdit,
            onChange: (value) => {
              internalValue.current = value;
              editable?.onChange?.(value);
            },
            onEnd: () => {
              editable?.onEnd?.(internalValue.current);
              setShowEdit(false);
            },
            tooltip: false
          }}
        />
      </EmptyBox>
    );
  };

  return render();
};

export default EditText;
