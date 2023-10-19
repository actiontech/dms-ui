import { useRef, useState } from 'react';
import { EditTypeProps } from './index.type';
import EmptyBox from '../EmptyBox';
import BasicButton from '../BasicButton';
import { IconEdit } from '../../Icon/common';
import { EditTextStyleWrapper } from './style';

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
            ...editable,
            onChange: (value) => {
              internalValue.current = value;
              editable?.onChange?.(value);
            },
            onEnd: () => {
              editable?.onEnd?.(internalValue.current);
            },
            icon: <IconEdit />
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
            ...editable,
            editing: showEdit,
            onChange: (value) => {
              internalValue.current = value;
              editable?.onChange?.(value);
            },
            onEnd: () => {
              editable?.onEnd?.(internalValue.current);
              setShowEdit(false);
            }
          }}
        />
      </EmptyBox>
    );
  };

  return render();
};

export default EditText;
