import { ReactNode } from 'react';
import {
  OverallRewrittenItemStyleWrapper,
  OverallRewrittenTitleStyleWrapper
} from './style';
import { EmptyBox } from '@actiontech/shared';
import classNames from 'classnames';

type Props = {
  title: string;
  action?: ReactNode;
  icon: ReactNode;
  className?: string;
  children: ReactNode;
};

const OverallRewrittenItem: React.FC<Props> = ({
  title,
  icon,
  action,
  className,
  children
}) => {
  return (
    <OverallRewrittenItemStyleWrapper>
      <OverallRewrittenTitleStyleWrapper className={classNames(className)}>
        <div className="title-wrapper">
          {icon}
          <span className="title-text">{title}</span>
        </div>

        <EmptyBox if={!!action}>
          <div className="action-items-wrapper">{action}</div>
        </EmptyBox>
      </OverallRewrittenTitleStyleWrapper>

      {children}
    </OverallRewrittenItemStyleWrapper>
  );
};

export default OverallRewrittenItem;
