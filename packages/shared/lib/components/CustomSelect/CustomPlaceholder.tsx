import { ReactNode } from 'react';
import { CustomSelectPlaceholderStyleWrapper } from './style';

const CustomPlaceholder: React.FC<{
  prefix?: ReactNode;
  placeholder: ReactNode;
}> = ({ prefix, placeholder }) => {
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
