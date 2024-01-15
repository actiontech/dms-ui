import { cloneDeep, isObject, isBoolean } from 'lodash';

// 不适合作为 html 属性元素出现的 key 的数据集合
const customDomKeyData = ['label', 'legend'];

const MockPlots = (props) => {
  const { onReady, ref, ...othersParams } = cloneDeep(props);

  Object.keys(othersParams).forEach((key) => {
    if (customDomKeyData.includes(key)) {
      delete othersParams[key];
      return;
    }
    if (isObject(othersParams[key]) || isBoolean(othersParams[key])) {
      othersParams[key] = JSON.stringify(othersParams[key]);
    }
  });

  return <div {...othersParams} />;
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
