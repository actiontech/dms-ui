import { CSSProperties, ReactNode } from 'react';
import { ChartContTitleStyleWrapper } from './style';

interface IChartTitle {
  mainText: string | ReactNode | JSX.Element;
  noteText: string | ReactNode | JSX.Element;
  color?: string;
  mainSubText?: string | ReactNode | JSX.Element;
  noteSubText?: string | ReactNode | JSX.Element;
  noteSubStyleAttr?: CSSProperties;
  mainSubStyleAttr?: CSSProperties;
  style?: CSSProperties;
}

const ChartContTitle = (props: IChartTitle) => {
  const {
    color,
    mainText,
    mainSubText,
    noteText,
    noteSubText,
    noteSubStyleAttr,
    mainSubStyleAttr,
    style
  } = props;

  return (
    <ChartContTitleStyleWrapper style={style}>
      <div
        className="line-block"
        hidden={!color}
        style={{ background: color ?? 'none' }}
      ></div>
      <div className="line-cont">
        <div className="line1-main">
          {mainText}
          <span
            className="sub-cont"
            hidden={!mainSubText}
            style={mainSubStyleAttr ?? {}}
          >
            {mainSubText}
          </span>
        </div>
        <div className="line1-main-sub">
          {noteText}
          <span
            className="sub-cont"
            hidden={!noteSubText}
            style={noteSubStyleAttr ?? {}}
          >
            {noteSubText}
          </span>
        </div>
      </div>
    </ChartContTitleStyleWrapper>
  );
};

export default ChartContTitle;
