/**
 * @test_version ce
 */
import KnowledgeSearchResults from '../index';
import { superRender } from '../../../testUtils/customRender';

describe('Knowledge ce', () => {
  it('render init snap', async () => {
    const { baseElement } = superRender(<KnowledgeSearchResults />);
    expect(baseElement).toMatchSnapshot();
  });
});
