import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import KnowledgeGraph from '..';

describe('KnowledgeGraph', () => {
  const mockGraphData = {
    nodes: [],
    edges: []
  };

  beforeEach(() => {});

  afterEach(() => {
    jest.clearAllMocks();
    jest.clearAllTimers();
  });

  it('should match snapshot', () => {
    expect(
      toJson(shallow(<KnowledgeGraph graphData={mockGraphData} />))
    ).toMatchSnapshot();
  });
});
