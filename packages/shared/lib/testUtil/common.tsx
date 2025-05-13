/* eslint-disable no-console */
export const ignoreConsoleErrors = (
  params: Array<UtilsConsoleErrorStringsEnum>
) => {
  const originalError = console.error;
  const paramsWithGlobalRules = [
    ...params,
    'Warning: findDOMNode is deprecated and will be removed in the next major release. Instead, add a ref directly to the element you want to reference. Learn more about using refs safely here: https://reactjs.org/link/strict-mode-find-nod'
  ];

  beforeAll(() => {
    console.error = (...arg) => {
      if (
        typeof arg[0] === 'string' &&
        paramsWithGlobalRules.some((v) => arg[0].includes(v))
      ) {
        return;
      }
      originalError(...arg);
    };
  });

  afterAll(() => {
    // 恢复原始的 console.error
    console.error = originalError;
  });
};

export enum UtilsConsoleErrorStringsEnum {
  // 表单校验失败并且没有使用 try catch 捕获时出现该错误
  ASYNC_VALIDATOR_ERROR = 'async-validator',

  // 组件被 Form 包裹但是没有提供 form 时
  UNCONNECTED_FORM_COMPONENT = 'Instance created by `useForm` is not connected to any Form element. Forget to pass `form` prop?',

  // 非受控组件
  UNCONTROLLED_COMPONENT = 'A component is changing a controlled input to be uncontrolled.',

  // antd-plots 组件相关错误
  PARENT_COMPONENT_PROP_ERROR = 'If you accidentally passed it from a parent component, remove it from the DOM element.',

  // 在选择 date-range-pick 组件的结束日期 input 元素时，实际选择到了，报此 warning
  INPUT_DATE_FORMAT_MISMATCH = 'Not match any format. Please help to fire a issue about this.',

  // 循环生成组件时若没有设置 key，便会抛出该错误信息
  UNIQUE_KEY_REQUIRED = `Each child in a list should have a unique "key" prop`,

  // 当为原生的 html 添加大驼峰、小驼峰之类的自定义属性，会出现报错
  INVALID_CUSTOM_ATTRIBUTE = `prop on a DOM element. If you intentionally want it to appear in the DOM as a custom attribute, spell it as lowercase`,

  /**
   * 过滤 NaN is an invalid value for the height css style property. 问题
   * input.textarea 设置 minRows 或者 maxRows 时出现
   */
  INVALID_CSS_VALUE = '`NaN` is an invalid value for the',

  // antd Drawer Popconfirm等弹出组件不在同一个根元素内 会报此warning
  TRIGGER_ELEMENT_SAME_ROOT = 'trigger element and popup element should in same shadow root.',

  // monaco-editor mock input not exist onMount property
  UNKNOWN_EVENT_HANDLER = 'Unknown event handler property'
}
