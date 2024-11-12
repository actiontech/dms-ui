import { ReactNode } from 'react';
import { NavigateOptions, To } from 'react-router-dom';
import { CardProps, Tooltip } from 'antd';
import Icon from '@ant-design/icons/lib/components/Icon';
import { CardWrapperStyleWrapper } from './style';
import { InfoCircleOutlined, DashOutlined } from '@actiontech/icons';
import { useTypedNavigate } from '@actiontech/shared';

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
  const navigate = useTypedNavigate();

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
              <Icon
                component={() => <InfoCircleOutlined width={14} height={14} />}
                className="icon-tip"
              />
            </Tooltip>
          )}
        </div>
        <div className="extra" onClick={onSkipPage}>
          {moreRouteLink && <Icon component={DashOutlined} />}
          {extraNode ?? null}
        </div>
      </header>
      <section className="card-cont">{props.children}</section>
    </CardWrapperStyleWrapper>
  );
};

export default CardWrapper;
