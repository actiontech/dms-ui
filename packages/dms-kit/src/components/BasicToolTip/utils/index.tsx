import { BasicTooltipProps } from '../BasicToolTip.types';
import { PopoverInnerContentStyleWrapper } from '../style';

export const basicTooltipCommonProps: (
  title: BasicTooltipProps['title'],
  width?: number
) => BasicTooltipProps = (title, width) => {
  const renderTitle = typeof title === 'function' ? title() : title;

  return {
    title: (
      <PopoverInnerContentStyleWrapper width={width}>
        {renderTitle}
      </PopoverInnerContentStyleWrapper>
    ),
    arrow: false,
    overlayInnerStyle: {
      padding: 0,
      borderRadius: '10px'
    }
  };
};
