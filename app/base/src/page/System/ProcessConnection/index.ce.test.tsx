/**
 * @test_version ce
 */

import { superRender } from '@actiontech/shared/lib/testUtil/superRender';
import ProcessConnection from '.';

describe('base/System/ProcessConnection ce', () => {
  const customRender = () => {
    return superRender(<ProcessConnection />);
  };

  it('should match snap shots', () => {
    const { baseElement } = customRender();

    expect(baseElement).toMatchSnapshot();
  });
});
