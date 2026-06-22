import { CSSProperties, memo } from 'react';
import { EnvironmentTagStyleWrapper } from './style';

export const DEFAULT_ENVIRONMENT_TAG_COLOR = '#8C8C8C';

export type EnvironmentTagProps = {
  name?: string;
  color?: string;
  size?: 'small' | 'default';
  className?: string;
  style?: CSSProperties;
  ellipsis?: boolean;
};

const EnvironmentTag: React.FC<EnvironmentTagProps> = ({
  name,
  color,
  size = 'default',
  className,
  style,
  ellipsis = true
}) => {
  if (!name) {
    return null;
  }

  const tagColor = color || DEFAULT_ENVIRONMENT_TAG_COLOR;

  return (
    <EnvironmentTagStyleWrapper
      color={tagColor}
      size={size}
      className={className}
      style={style}
      ellipsis={ellipsis}
    >
      <span className="environment-tag-name">{name}</span>
    </EnvironmentTagStyleWrapper>
  );
};

export default memo(EnvironmentTag);
