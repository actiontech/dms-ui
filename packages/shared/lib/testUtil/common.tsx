/* eslint-disable no-console */
export const ignoreAntdFormValidateWarning = () => {
  const warning = console.warn;

  beforeAll(() => {
    console.warn = (...arg) => {
      if (typeof arg[0] === 'string' && arg[0].includes('async-validator:')) {
        return;
      }
      warning(...arg);
    };
  });

  afterAll(() => {
    console.warn = warning;
  });
};

export const ignoreAntdUseFormNotConnectedError = () => {
  const error = console.error;

  beforeAll(() => {
    console.error = (...arg) => {
      if (
        typeof arg[0] === 'string' &&
        arg[0].includes(
          'Instance created by `useForm` is not connected to any Form element. Forget to pass `form` prop?'
        )
      ) {
        return;
      }
      error(...arg);
    };
  });

  afterAll(() => {
    console.error = error;
  });
};

export const ignoreComponentUncontrolled = () => {
  const error = console.error;

  beforeAll(() => {
    console.error = (...arg) => {
      if (
        typeof arg[0] === 'string' &&
        arg[0].includes(
          'A component is changing a controlled input to be uncontrolled.'
        )
      ) {
        return;
      }
      error(...arg);
    };
  });

  afterAll(() => {
    console.error = error;
  });
};

// 当为原生的 html 添加大驼峰、小驼峰之类的自定义属性，会出现报错
export const ignoreComponentCustomAttr = () => {
  const error = console.error;
  beforeAll(() => {
    console.error = (...arg) => {
      if (
        typeof arg[0] === 'string' &&
        arg[0].includes(
          'prop on a DOM element. If you intentionally want it to appear in the DOM as a custom attribute, spell it as lowercase'
        )
      ) {
        return;
      }
      error(...arg);
    };
  });

  afterAll(() => {
    console.error = error;
  });
};

export const ignoreAntdPlotsAttr = () => {
  const error = console.error;
  beforeAll(() => {
    console.error = (...arg) => {
      if (
        typeof arg[0] === 'string' &&
        arg[0].includes(
          'If you accidentally passed it from a parent component, remove it from the DOM element.'
        )
      ) {
        return;
      }
      error(...arg);
    };
  });

  afterAll(() => {
    console.error = error;
  });
};

/**
 * @description: 在选择 date-range-pick 组件的结束日期 input 元素时，实际选择到了，报此 warning
 */
export const ignoreComponentWarnExpDatePickChooseElement = () => {
  const warn = console.warn;
  beforeAll(() => {
    console.warn = (...arg) => {
      if (
        typeof arg[0] === 'string' &&
        arg[0].includes(
          'Not match any format. Please help to fire a issue about this.'
        )
      ) {
        return;
      }
      warn(...arg);
    };
  });

  afterAll(() => {
    console.warn = warn;
  });
};

export const ignoreComponentAutoCreatedListNoKey = () => {
  const error = console.error;

  beforeAll(() => {
    console.error = (...arg) => {
      if (
        typeof arg[0] === 'string' &&
        arg[0].includes('Each child in a list should have a unique "key" prop')
      ) {
        return;
      }
      error(...arg);
    };
  });

  afterAll(() => {
    console.error = error;
  });
};

/**
 * 过滤 NaN is an invalid value for the height css style property. 问题
 * 看起来应该是测试环境中某个原因导致 TextArea 组件高度设置错误了。 需要后面细究下啥原因。
 */
export const ignoreInvalidValueForCSSStyleProperty = () => {
  const error = console.error;

  beforeAll(() => {
    console.error = (...arg) => {
      if (
        typeof arg[0] === 'string' &&
        arg[0].includes('`NaN` is an invalid value for the')
      ) {
        return;
      }
      error(...arg);
    };
  });

  afterAll(() => {
    console.error = error;
  });
};

/**
 * 建议修改模式为 接收字符串数组（定义为枚举，并且给每个新增的项添加注释表明需要过滤错误的理由）为参数，来过滤 error output
 */

export const ignoreConsoleErrors = (
  params: Array<UtilsConsoleErrorStringsEnum>
) => {
  const error = console.error;

  beforeAll(() => {
    console.error = (...arg) => {
      if (
        typeof arg[0] === 'string' &&
        params.some((v) => arg[0].includes(v))
      ) {
        return;
      }
      error(...arg);
    };
  });

  afterAll(() => {
    console.error = error;
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
  INVALID_CSS_VALUE = '`NaN` is an invalid value for the'
}
