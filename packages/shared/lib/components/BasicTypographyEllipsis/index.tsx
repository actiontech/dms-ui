import { ReactNode, useMemo } from 'react';
import { TypographyStyleWrapper } from './style';
import { tooltipsCommonProps } from '../BasicToolTips';
import classNames from 'classnames';
import { EllipsisConfig } from 'antd/es/typography/Base';
import { TypedLink } from '../TypedRouter';

export interface IBasicTypographyEllipsis {
  textCont: string;
  tooltipLimitLength?: number;
  tooltipsMaxWidth?: number;
  linkData?: {
    text: string | ReactNode;
    route: string;
  };
  copyable?: boolean;
  tooltips?: EllipsisConfig['tooltip'];
  className?: string;
}

// 外层需要一个 max-width 容器 "例如：.ellipsis-column-width"
const BasicTypographyEllipsis = ({
  textCont,
  linkData,
  tooltipLimitLength = 500,
  tooltipsMaxWidth = 640,
  copyable = true,
  tooltips = true,
  className
}: IBasicTypographyEllipsis) => {
  const mergeTooltips = useMemo<EllipsisConfig['tooltip']>(() => {
    if (tooltips === true) {
      return {
        placement: 'topLeft',
        ...tooltipsCommonProps(
          textCont.length > tooltipLimitLength ? (
            <span>
              {`${textCont.slice(0, tooltipLimitLength)}...`}{' '}
              {linkData && (
                <TypedLink to={linkData.route}>{linkData.text}</TypedLink>
              )}
            </span>
          ) : (
            <span>
              {textCont}{' '}
              {linkData && (
                <TypedLink to={linkData.route}>{linkData.text}</TypedLink>
              )}
            </span>
          ),
          tooltipsMaxWidth
        )
      };
    }
    return tooltips;
  }, [linkData, textCont, tooltipLimitLength, tooltips, tooltipsMaxWidth]);

  return (
    <TypographyStyleWrapper
      className={classNames(className, 'basic-typography-ellipsis')}
      copyable={copyable}
      ellipsis={{
        expandable: false,
        tooltip: mergeTooltips
      }}
    >
      {textCont}
    </TypographyStyleWrapper>
  );
};

export default BasicTypographyEllipsis;
