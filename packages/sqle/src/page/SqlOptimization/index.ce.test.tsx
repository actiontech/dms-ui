/**
 * @test_version ce
 */

import SqlOptimization from '.';
import { superRender } from '@actiontech/shared/lib/testUtil/superRender';

jest.mock('react-router-dom', () => {
  return {
    ...jest.requireActual('react-router-dom'),
    useNavigate: jest.fn()
  };
});

describe('slqe/SqlOptimization CE', () => {
  test('should match snap shot', async () => {
    const { baseElement } = superRender(<SqlOptimization />);
    expect(baseElement).toMatchSnapshot();
  });
});
