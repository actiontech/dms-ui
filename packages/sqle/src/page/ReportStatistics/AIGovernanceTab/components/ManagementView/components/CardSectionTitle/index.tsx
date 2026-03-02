import { ReactNode } from 'react';
import { CardSectionTitleStyleWrapper } from './style';

interface CardSectionTitleProps {
  icon?: ReactNode;
  title: string;
  description: string;
}

const CardSectionTitle: React.FC<CardSectionTitleProps> = ({
  icon,
  title,
  description
}) => {
  return (
    <CardSectionTitleStyleWrapper>
      <div className="card-section-title-row">
        {icon != null ? (
          <span className="card-section-title-icon">{icon}</span>
        ) : null}
        <span className="card-section-title-text">{title}</span>
      </div>
      <span className="card-section-title-desc">{description}</span>
    </CardSectionTitleStyleWrapper>
  );
};

export default CardSectionTitle;
