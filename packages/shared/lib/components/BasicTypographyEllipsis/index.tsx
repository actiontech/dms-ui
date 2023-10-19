import { ReactNode, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { TypographyStyleWrapper } from './style';
import { tooltipsCommonProps } from '../BasicToolTips';

interface IBasicTypographyEllipsis {
  textCont: string;
  tooltipLimitLength?: number;
  limitMaxLength?: number;
  linkData?: {
    text: string | ReactNode;
    route: string;
  };
}

// 外层需要一个 max-width 容器 "例如：.ellipsis-column-width"
const BasicTypographyEllipsis = ({
  textCont,
  linkData,
  tooltipLimitLength,
  limitMaxLength
}: IBasicTypographyEllipsis) => {
  const { tooltipLimitLengthVal, limitMaxLengthVal } = useMemo(() => {
    return {
      tooltipLimitLengthVal: tooltipLimitLength ?? 500,
      limitMaxLengthVal: limitMaxLength ?? 640
    };
  }, [tooltipLimitLength, limitMaxLength]);

  return (
    <TypographyStyleWrapper
      copyable
      ellipsis={{
        expandable: false,
        tooltip: {
          placement: 'topLeft',
          ...tooltipsCommonProps(
            textCont.length > tooltipLimitLengthVal ? (
              <span>
                {`${textCont.slice(0, tooltipLimitLengthVal)}...`}{' '}
                {linkData && <Link to={linkData.route}>{linkData.text}</Link>}
              </span>
            ) : (
              <span>
                {textCont}{' '}
                {linkData && <Link to={linkData.route}>{linkData.text}</Link>}
              </span>
            ),
            limitMaxLengthVal
          )
        }
      }}
    >
      {textCont}
    </TypographyStyleWrapper>
  );
};

export default BasicTypographyEllipsis;
