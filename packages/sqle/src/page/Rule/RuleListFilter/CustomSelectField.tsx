import { CustomSelect, CustomSelectProps } from '@actiontech/dms-kit';
import { SelectProps } from 'antd';

const CustomSelectField: React.FC<
  CustomSelectProps & { onAfterChange: (v: string) => void }
> = ({ onAfterChange, onChange, ...props }) => {
  return (
    <CustomSelect
      {...props}
      onChange={(
        v: Parameters<NonNullable<SelectProps['onChange']>>[0],
        option: Parameters<NonNullable<SelectProps['onChange']>>[1]
      ) => {
        onChange?.(v, option);
        onAfterChange(v as string);
      }}
    />
  );
};

export default CustomSelectField;
