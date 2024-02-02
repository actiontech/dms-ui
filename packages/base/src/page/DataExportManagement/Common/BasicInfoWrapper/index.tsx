import classNames from 'classnames';
import { BasicInfoWrapperProps } from './index.type';
import { EmptyBox } from '@actiontech/shared';
import { IconOrderStatusWrapper } from 'sqle/src/icon/Order';
import { DataExportStatusDictionary } from '../index.data';
import { BasicInfoStyleWrapper } from './style';

const BasicInfoWrapper: React.FC<BasicInfoWrapperProps> = ({
  title,
  desc,
  className,
  status,
  gap = 12
}) => {
  return (
    <BasicInfoStyleWrapper
      className={classNames(className)}
      gap={gap}
      status={status}
    >
      <EmptyBox if={!!status}>
        <div className="workflow-base-info-status">
          <IconOrderStatusWrapper />
          <span className="workflow-base-info-status-text">
            {status && DataExportStatusDictionary[status]}
          </span>
        </div>
      </EmptyBox>

      <div className="workflow-base-info-title">{title}</div>
      <div className="workflow-base-info-desc">{desc ?? '-'}</div>
    </BasicInfoStyleWrapper>
  );
};

export default BasicInfoWrapper;
