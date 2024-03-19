import { cloneDeep, set } from 'lodash';

const MockPlots = (props) => {
  const clonePropsData = cloneDeep(props);
  // 考虑到输入的属性是作为 div 的自定义属性，故而对 params 做了 stringify 的处理
  const params = JSON.stringify(clonePropsData);
  return <div data-custom-params={params} />;
};

const Line = MockPlots;
const Pie = MockPlots;
const PieWithCustomRenderCalled = (options) => (props) => {
  const clonePropsData = cloneDeep(props);

  if (clonePropsData?.statistic?.title?.customHtml) {
    set(
      clonePropsData,
      'statistic.title.customHtml',
      clonePropsData?.statistic?.title?.customHtml?.(
        ...(options?.statistic?.title?.customHtml?.(props) ?? [])
      )
    );
  }

  const tooltipCustomContent = clonePropsData?.tooltip?.customContent?.(
    ...(options?.tooltip?.customContent?.(props) ?? [])
  );

  const params = JSON.stringify(clonePropsData);
  if (tooltipCustomContent) {
    return <div data-custom-params={params}>{tooltipCustomContent}</div>;
  }
  return <div data-custom-params={params} />;
};

const RadialBar = MockPlots;
const Gauge = MockPlots;
const Column = MockPlots;
const Treemap = MockPlots;
const Area = MockPlots;
const Bar = MockPlots;
const RingProgress = MockPlots;
const mockRegisterShape = jest.fn();
const G2 = {
  registerShape: jest.fn()
};

export {
  Line,
  Pie,
  RadialBar,
  Gauge,
  Column,
  G2,
  mockRegisterShape,
  Treemap,
  Area,
  Bar,
  RingProgress,
  PieWithCustomRenderCalled
};

// eslint-disable-next-line import/no-anonymous-default-export
export default {
  Line,
  Pie,
  RadialBar,
  Gauge,
  Column,
  G2
};
