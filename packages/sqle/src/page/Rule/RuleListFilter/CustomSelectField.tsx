import { CustomSelect, CustomSelectProps } from '@actiontech/dms-kit';

const CustomSelectField: React.FC<
  CustomSelectProps & { onAfterChange: (v: string) => void }
> = ({ onAfterChange, onChange, ...props }) => {
  return (
    <CustomSelect
      {...props}
      onChange={(v, option) => {
        onChange?.(v, option);
        onAfterChange(v);
      }}
    />
  );
};

export default CustomSelectField;
