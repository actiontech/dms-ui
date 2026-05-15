import { ReactNode } from 'react';
import classNames from 'classnames';
import { ChartTooltipStyleWrapper } from './style';
import { SharedTheme } from '@actiontech/dms-kit';

type typeListItem = {
  label: string | ReactNode;
  dotColor?: string;
  value?: string | ReactNode;
};

export interface IChartTooltip {
  titleData: {
    dotColor: string;
    text: string | ReactNode;
  };
  sharedTheme: SharedTheme;
  listData?: typeListItem[];
  children?: string | ReactNode;
  customRender?: string | ReactNode;
  wrapperClassName?: string;
}

/**
  由于 charts tool custom cont 没有 provider theme, 所以 theme 作为 props 传入
 */
const ChartTooltip = (props: IChartTooltip) => {
  const {
    titleData,
    listData,
    sharedTheme,
    children,
    customRender,
    wrapperClassName
  } = props;

  const renderList = () => {
    return (listData ?? []).map((item: typeListItem, index) => {
      return (
        <dl
          className="tooltip-list"
          key={`${item.label}${item?.value ?? ''}${index}`}
        >
          <dt className="tooltip-name">
            <span
              className="dot"
              hidden={!item.dotColor}
              style={{ background: item.dotColor }}
            ></span>
            {item.label}
          </dt>
          <dd className="tooltip-value">{item.value}</dd>
        </dl>
      );
    });
  };

  // tooltip-box-wrapper tooltip-box-database-source-order
  return (
    <ChartTooltipStyleWrapper
      className={classNames(
        'tooltip-box-wrapper',
        'tooltip-box-database-source-order',
        [wrapperClassName]
      )}
    >
      {customRender ?? (
        <>
          <header
            className="tooltip-title"
            style={{ color: sharedTheme.uiToken.colorTextTertiary }}
          >
            <span
              className="dot"
              hidden={!titleData.dotColor}
              style={{ background: titleData.dotColor }}
            ></span>
            {titleData.text}
          </header>
          {children ?? renderList()}
        </>
      )}
    </ChartTooltipStyleWrapper>
  );
};

export default ChartTooltip;
