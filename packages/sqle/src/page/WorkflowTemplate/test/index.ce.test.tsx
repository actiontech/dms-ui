/**
 * @test_version ce
 */

import { screen } from '@testing-library/react';
import WorkflowTemplate from '../';
import { superRender } from '../../../testUtils/customRender';

describe('page/WorkflowTemplate CE', () => {
  test('should match snap shot', async () => {
    const { baseElement } = superRender(<WorkflowTemplate />);
    expect(baseElement).toMatchSnapshot();
  });
});
