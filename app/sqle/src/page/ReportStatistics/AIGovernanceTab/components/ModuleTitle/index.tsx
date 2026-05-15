import { ReactNode } from 'react';
import { ModuleTitleStyleWrapper } from './style';

interface ModuleTitleProps {
  icon?: ReactNode;
  title: string;
  description: string;
}

const ModuleTitle: React.FC<ModuleTitleProps> = ({
  icon,
  title,
  description
}) => {
  return (
    <ModuleTitleStyleWrapper>
      {icon != null ? <span className="module-title-icon">{icon}</span> : null}
      <span className="module-title-text">{title}</span>
      <span className="module-title-desc">{description}</span>
    </ModuleTitleStyleWrapper>
  );
};

export default ModuleTitle;
