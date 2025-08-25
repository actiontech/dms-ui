import { useMemo } from 'react';
import { TypographyStyleWrapper } from './style';
import classNames from 'classnames';
import { EllipsisConfig } from 'antd/es/typography/Base';
import { TypedLink } from '../TypedRouter';
import { basicTooltipCommonProps } from '@actiontech/dms-kit';
import { BasicTypographyEllipsisProps } from './BasicTypographyEllipsis.types';

// 外层需要一个 max-width 容器 "例如：.ellipsis-column-width"
const BasicTypographyEllipsis: React.FC<BasicTypographyEllipsisProps> = ({
  textCont,
  linkData,
  tooltipLimitLength = 500,
  tooltipsMaxWidth = 640,
  copyable = true,
  tooltips = true,
  className
}) => {
  const mergeTooltips = useMemo<EllipsisConfig['tooltip']>(() => {
    if (tooltips === true) {
      return {
        placement: 'topLeft',
        ...basicTooltipCommonProps(
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
