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
