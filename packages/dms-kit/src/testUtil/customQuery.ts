import * as domTestingLib from '@testing-library/dom';
import { act, fireEvent, screen } from '@testing-library/react';

export const getBySelector = (selector: string, baseElement?: Element) => {
  let temp;
  if (baseElement !== undefined) {
    temp = baseElement.querySelectorAll(selector);
  } else {
    temp = document.querySelectorAll(selector);
  }
  if (temp.length === 0) {
    throw domTestingLib.queryHelpers.getElementError(
      `Unable to find an element by: selector=${selector}`,
      document.body
    );
  }
  if (temp.length > 1) {
    throw domTestingLib.queryHelpers.getElementError(
      `Found multiple elements with the selector=${selector}`,
      document.body
    );
  }
  return temp[0];
};

export const queryBySelector = (selector: string, baseElement?: Element) => {
  let temp;
  if (baseElement !== undefined) {
    temp = baseElement.querySelector(selector);
  } else {
    temp = document.querySelector(selector);
  }
  return temp;
};

export const getAllBySelector = (selector: string, baseElement?: Element) => {
  let temp;
  if (baseElement !== undefined) {
    temp = baseElement.querySelectorAll(selector);
  } else {
    temp = document.querySelectorAll(selector);
  }
  if (temp.length === 0) {
    throw domTestingLib.queryHelpers.getElementError(
      `Unable to find an element by: selector=${selector}`,
      document.body
    );
  }
  return temp;
};

export const getSelectContentByFormLabel = (label: string) => {
  return getBySelector(
    '.ant-select-selection-item-content',
    screen.getByText(label).parentNode?.parentNode as HTMLDivElement
  );
};

export const getSelectValueByFormLabel = (label: string) => {
  return getBySelector(
    '.ant-select-selection-item',
    screen.getByLabelText(label).parentNode?.parentNode as HTMLDivElement
  );
};

export const selectOptionByIndex = (
  label: string,
  optionText: string,
  index = 1
) => {
  fireEvent.mouseDown(screen.getByLabelText(label));
  const option = screen.getAllByText(optionText)[index];
  expect(option).toHaveClass('ant-select-item-option-content');
  fireEvent.click(option);
};

/**
 * 具体功能同 selectOptionByIndex, 不过该函数主要针对下拉框选项为一个节点的情况
 * @param label 表单中 Select 组件外部 Form.Item 的label, 注意该 Form.Item 必须有 name
 * @param optionCls 下拉项节点最外层的 class
 * @param index  这里不同于 selectOptionByIndex 的 index, 其代表的就是真实需要选择的下拉项的序号, 从 0 开始.
 */
export const selectCustomOptionByClassName = (
  label: string,
  optionCls: string,
  index: number
) => {
  fireEvent.mouseDown(screen.getByLabelText(label));
  const options = getAllBySelector(`.${optionCls}`);
  let realIndex = index;
  if (index < 0) {
    realIndex = options.length + index;
  }

  const option = options[realIndex];
  expect(option.parentNode).toHaveClass('ant-select-item-option-content');
  fireEvent.click(option);
};

export const getValueByInput = (val: string) => {
  const inputList = getAllBySelector('.ant-input');
  const findInputList = [];
  for (const input of inputList) {
    if (input.getAttribute('value') === val) {
      findInputList.push(input);
    }
  }
  if (findInputList.length === 0) {
    throw domTestingLib.queryHelpers.getElementError(
      `Unable to find an element by: value=${val}`,
      document.body
    );
  }
  if (findInputList.length > 1) {
    throw domTestingLib.queryHelpers.getElementError(
      `Found multiple elements with the value=${val}`,
      document.body
    );
  }
  return findInputList[0];
};

const globalTimeout = global.setTimeout;

export const sleep = async (timeout = 0) => {
  await act(async () => {
    await new Promise((resolve) => {
      globalTimeout(resolve, timeout);
    });
  });
};

export const getHrefByText = (name: string) => {
  return screen.getByText(name).getAttribute('href');
};

export const getAllHrefByText = (name: string) => {
  return screen.getAllByText(name).map((v) => v.getAttribute('href'));
};
