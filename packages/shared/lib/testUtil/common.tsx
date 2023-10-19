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
