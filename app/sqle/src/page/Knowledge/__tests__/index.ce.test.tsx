/**
 * @test_version ce
 */
import KnowledgeSearchResults from '../index';
import { sqleSuperRender } from '../../../testUtils/superRender';

describe('Knowledge ce', () => {
  it('render init snap', async () => {
    const { baseElement } = sqleSuperRender(<KnowledgeSearchResults />);
    expect(baseElement).toMatchSnapshot();
  });
});
