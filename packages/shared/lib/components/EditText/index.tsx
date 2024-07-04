import { useState, useRef } from 'react';
import { EditTypeProps } from './index.type';
import EmptyBox from '../EmptyBox';
import BasicButton from '../BasicButton';
import { EditTextStyleWrapper } from './style';
import classNames from 'classnames';
import { EditFilled } from '@actiontech/icons';

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
            onChange: (data) => {
              internalValue.current = data;
              editable?.onChange?.(data);
            },
            onEnd: () => {
              editable?.onEnd?.(internalValue.current);
            },
            icon: <EditFilled className="custom-icon" color="currentColor" />,
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
            icon={
              editButtonProps?.children ? undefined : (
                <EditFilled className="custom-icon" color="currentColor" />
              )
            }
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
            onChange: (data) => {
              internalValue.current = data;
              editable?.onChange?.(data);
              setShowEdit(false);
            },
            onEnd: () => {
              editable?.onEnd?.(internalValue.current);
              setShowEdit(false);
            },
            onCancel: () => {
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
