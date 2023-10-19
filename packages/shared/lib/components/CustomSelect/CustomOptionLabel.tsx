import { ReactNode } from 'react';
import { CustomSelectOptionLabelStyleWrapper } from './style';

const CustomOptionLabel: React.FC<{
  prefix?: ReactNode;
  label: ReactNode;
}> = ({ prefix, label }) => {
  return (
    <CustomSelectOptionLabelStyleWrapper className="custom-select-option-content">
      {prefix && (
        <span className="custom-select-option-content-prefix">{prefix}</span>
      )}
      <span className="custom-select-option-content-label">{label}</span>
    </CustomSelectOptionLabelStyleWrapper>
  );
};

export default CustomOptionLabel;
