import { ReactNode } from 'react';
import { CustomSelectPlaceholderStyleWrapper } from './style';

export interface ICustomPlaceholder {
  prefix?: ReactNode;
  placeholder: ReactNode;
}

const CustomPlaceholder: React.FC<ICustomPlaceholder> = ({
  prefix,
  placeholder
}) => {
  return (
    <CustomSelectPlaceholderStyleWrapper className="custom-select-placeholder">
      {!!prefix && (
        <span className="custom-select-placeholder-prefix">{prefix}</span>
      )}
      <span className="custom-select-placeholder-value">{placeholder}</span>
    </CustomSelectPlaceholderStyleWrapper>
  );
};

export default CustomPlaceholder;
