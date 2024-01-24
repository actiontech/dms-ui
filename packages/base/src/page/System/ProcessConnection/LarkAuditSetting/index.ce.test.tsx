/**
 * @test_version ce
 */

import { superRender } from '@actiontech/shared/lib/testUtil/customRender';
import LarkAuditSetting from '.';

describe('base/System/ProcessConnection/LarkAuditSetting-ce', () => {
  const customRender = () => {
    return superRender(<LarkAuditSetting />);
  };

  it('render snap',  () => {
    const { baseElement } = customRender();

    expect(baseElement).toMatchSnapshot();
  });
});
