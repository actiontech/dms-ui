import classNames from 'classnames';
import { BasicInfoStyleWrapper } from './style';
import { BasicInfoWrapperProps } from './index.type';
import { IconOrderStatusWrapper } from '../../../../icon/Order';
import { EmptyBox } from '@actiontech/shared';
import { useTranslation } from 'react-i18next';
import { orderStatusDictionary } from '../../../../hooks/useStaticStatus/index.data';

const BasicInfoWrapper: React.FC<BasicInfoWrapperProps> = ({
  title,
  desc,
  className,
  status,
  gap = 12
}) => {
  const { t } = useTranslation();

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
            {status && t(orderStatusDictionary[status])}
          </span>
        </div>
      </EmptyBox>

      <div className="workflow-base-info-title">{title}</div>
      <div className="workflow-base-info-desc">{desc ?? '-'}</div>
    </BasicInfoStyleWrapper>
  );
};

export default BasicInfoWrapper;
