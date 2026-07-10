import { useState } from 'react';
import { Typography } from 'antd';
import { DownOutlined, RightOutlined } from '@actiontech/icons';
import { AuditResultExemptionPanelLayout } from './types';
import {
  CollapsibleExemptedSectionDiffStyleWrapper,
  CollapsibleExemptedSectionReportStyleWrapper
} from './style';

type CollapsibleExemptedSectionProps = {
  title: string;
  count: number;
  children: React.ReactNode;
  defaultExpanded?: boolean;
  layout?: AuditResultExemptionPanelLayout;
};

const CollapsibleExemptedSection: React.FC<CollapsibleExemptedSectionProps> = ({
  title,
  count,
  children,
  defaultExpanded = true,
  layout = 'diff'
}) => {
  const [expanded, setExpanded] = useState(defaultExpanded);

  if (count <= 0) {
    return null;
  }

  if (layout === 'report') {
    return (
      <CollapsibleExemptedSectionReportStyleWrapper>
        <Typography.Title level={3}>{title}</Typography.Title>
        <div className="report-exempted-section-body">{children}</div>
      </CollapsibleExemptedSectionReportStyleWrapper>
    );
  }

  const toggleExpanded = () => {
    setExpanded((prev) => !prev);
  };

  const handleHeaderKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      toggleExpanded();
    }
  };

  const chevronIcon = expanded ? (
    <DownOutlined className="diff-section-chevron" />
  ) : (
    <RightOutlined className="diff-section-chevron" />
  );

  return (
    <CollapsibleExemptedSectionDiffStyleWrapper>
      <div
        className={`diff-section diff-section-exempted${
          !expanded ? ' diff-section-collapsed' : ''
        }`}
      >
        <div
          className="diff-section-header diff-section-header-collapsible"
          onClick={toggleExpanded}
          role="button"
          tabIndex={0}
          onKeyDown={handleHeaderKeyDown}
        >
          <div className="diff-section-header-main">
            {chevronIcon}
            <Typography.Text className="diff-section-title">
              {title}
            </Typography.Text>
          </div>
          <Typography.Text type="secondary" className="diff-section-count">
            {count}
          </Typography.Text>
        </div>
        {expanded ? <div className="diff-section-body">{children}</div> : null}
      </div>
    </CollapsibleExemptedSectionDiffStyleWrapper>
  );
};

export default CollapsibleExemptedSection;
