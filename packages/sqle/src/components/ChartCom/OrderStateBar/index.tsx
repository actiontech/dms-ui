import { Row, Col, Popover } from 'antd5';
import { OrderStateBarStyleWrapper } from './style';
import { ChartTooltipStyleWrapper } from '../ChartTooltip/style';

export type typeItem = {
  key: string;
  value: number | string;
  rate: string | number;
  color: string;
  text: string;
};

export interface IOrderStateBar {
  isEmpty: boolean;
  barData: typeItem[];
  legendData: typeItem[];
  localData: {
    tooltip: {
      numTitle: string;
      rateTitle: string;
    };
  };
  maxVal?: {
    key: string;
    value: any;
  };
}

/**
 * todo:
    前端算百分比的时候，需要注意所有百分比加起来等于 100%
 */
const OrderStateBar = (props: IOrderStateBar) => {
  const { isEmpty, legendData, barData, maxVal, localData } = props;

  if (isEmpty) return null;

  const renderLegend = () => {
    const legendItemRate = 100 / legendData.length;
    return legendData.map((item: typeItem) => {
      return (
        <Col style={{ width: `${legendItemRate}%` }} key={`${item.key}-legend`}>
          <div className="state-item">
            <header className="state-item-header">{item.text}</header>
            <div className="state-item-cont">
              <em className="num-val">{item.value}</em>
              <span
                className="rate-val"
                hidden={['-', 0, '0'].includes(item.rate)}
                style={{ color: item.color }}
              >
                {item.rate}
              </span>
            </div>
            <div className="line" style={{ background: item.color }}></div>
          </div>
        </Col>
      );
    });
  };

  const renderBar = () => {
    return barData?.map((item: typeItem) => {
      return (
        <Popover
          arrow={false}
          placement="topRight"
          title=""
          trigger="hover"
          key={`${item.key}-bar`}
          overlayClassName="order-state-popover"
          content={
            <ChartTooltipStyleWrapper className="tooltip-box-wrapper">
              <header className="tooltip-title">
                <span className="dot" style={{ background: item.color }}></span>
                {item.text}
              </header>
              <dl className="tooltip-list">
                <dt className="tooltip-name">{localData.tooltip.numTitle}</dt>
                <dd className="tooltip-value">{item.value}</dd>
              </dl>
              <dl className="tooltip-list">
                <dt className="tooltip-name">{localData.tooltip.rateTitle}</dt>
                <dd className="tooltip-value">{item.rate}</dd>
              </dl>
            </ChartTooltipStyleWrapper>
          }
        >
          <td
            width={item.key === maxVal?.key ? 'auto' : item.rate}
            style={{ backgroundColor: item.color }}
          ></td>
        </Popover>
      );
    });
  };

  return (
    <OrderStateBarStyleWrapper className="order-state-bar-wrapper">
      <div className="bar-wrapper">
        <div className="bar">
          <table width={'100%'} className="bar-line">
            <tbody>
              <tr>{renderBar()}</tr>
            </tbody>
          </table>
        </div>
      </div>
      <div className="legend-wrapper">
        <Row gutter={20}>{renderLegend()}</Row>
      </div>
    </OrderStateBarStyleWrapper>
  );
};

export default OrderStateBar;
