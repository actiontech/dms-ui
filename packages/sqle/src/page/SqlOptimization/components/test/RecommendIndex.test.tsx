import RecommendIndex from '../RecommendIndex';
import { cleanup } from '@testing-library/react';
import { superRender } from '../../../../testUtils/customRender';

describe('sqle/SqlOptimization/RecommendIndex', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
    cleanup();
  });

  const customRender = (recommendations?: string[]) => {
    return superRender(<RecommendIndex recommendations={recommendations} />);
  };

  it('render snap shot', () => {
    const { baseElement } = customRender();
    expect(baseElement).toMatchSnapshot();
  });

  it('render snap shot when recommendations defined', () => {
    const { baseElement } = customRender(['Select 1;']);
    expect(baseElement).toMatchSnapshot();
  });

  it('render snap shot when recommendations is empty', () => {
    const { baseElement } = customRender([]);
    expect(baseElement).toMatchSnapshot();
  });
});
