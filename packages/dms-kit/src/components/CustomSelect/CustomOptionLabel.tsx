import { ReactNode } from 'react';
import { CustomSelectOptionLabelStyleWrapper } from './style';

export interface ICustomOptionLabel {
  prefix?: ReactNode;
  label: ReactNode;
}

const CustomOptionLabel: React.FC<ICustomOptionLabel> = ({ prefix, label }) => {
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
