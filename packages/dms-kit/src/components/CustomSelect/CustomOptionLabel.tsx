import { ReactNode } from 'react';
import classnames from 'classnames';
import { CustomSelectOptionLabelStyleWrapper } from './style';

export interface ICustomOptionLabel {
  prefix?: ReactNode;
  label: ReactNode;
}

const CustomOptionLabel: React.FC<ICustomOptionLabel> = ({ prefix, label }) => {
  const isTextLabel = typeof label === 'string';

  return (
    <CustomSelectOptionLabelStyleWrapper className="custom-select-option-content">
      {prefix && (
        <span className="custom-select-option-content-prefix">{prefix}</span>
      )}
      <span
        className={classnames('custom-select-option-content-label', {
          'is-text-label': isTextLabel
        })}
      >
        {label}
      </span>
    </CustomSelectOptionLabelStyleWrapper>
  );
};

export default CustomOptionLabel;
