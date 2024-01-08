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
