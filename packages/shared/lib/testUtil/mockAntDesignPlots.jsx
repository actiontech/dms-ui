import { cloneDeep } from 'lodash';

const MockPlots = (props) => {
  const clonePropsData = cloneDeep(props);
  // 考虑到输入的属性是作为 div 的自定义属性，故而对 params 做了 stringify 的处理
  const params = JSON.stringify(clonePropsData);
  return <div data-custom-params={params} />;
};

const Line = MockPlots;
const Pie = MockPlots;
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
  RingProgress
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
