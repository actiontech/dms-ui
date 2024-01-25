import { ReactNode } from 'react';
import { NavigateOptions, To, useNavigate } from 'react-router-dom';
import { CardProps, Tooltip } from 'antd';
import Icon from '@ant-design/icons/lib/components/Icon';
import { CardWrapperStyleWrapper } from './style';
import { IconTipOrange, IconTitleMore } from '@actiontech/shared/lib/Icon';

export interface ICardWrapper extends CardProps {
  enabledLoading?: boolean;
  title: string | ReactNode;
  moreRouteLink?: { to: To; options?: NavigateOptions };
  titleToolTips?: string | ReactNode;
  extraNode?: string | ReactNode;
  children?: string | ReactNode;
}

const CardWrapper = (props: ICardWrapper) => {
  const { enabledLoading, title, moreRouteLink, titleToolTips, extraNode } =
    props;
  const navigate = useNavigate();

  const onSkipPage = () => {
    if (!moreRouteLink) return;
    navigate(moreRouteLink.to, moreRouteLink.options);
  };

  return (
    <CardWrapperStyleWrapper
      hoverable
      bordered={false}
      loading={enabledLoading}
    >
      <header className="card-header">
        <div className="title">
          <div className="title-cont">{title}</div>
          {titleToolTips && (
            <Tooltip title={titleToolTips}>
              <Icon component={IconTipOrange} className="icon-tip" />
            </Tooltip>
          )}
        </div>
        <div className="extra" onClick={onSkipPage}>
          {moreRouteLink && <Icon component={IconTitleMore} />}
          {extraNode ?? null}
        </div>
      </header>
      <section className="card-cont">{props.children}</section>
    </CardWrapperStyleWrapper>
  );
};

export default CardWrapper;
