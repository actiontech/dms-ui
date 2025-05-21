const mockSigmaGraph = {
  addNode: jest.fn(),
  addEdge: jest.fn(),
  clear: jest.fn(),
  dropNode: jest.fn(),
  dropEdge: jest.fn(),
  getNodeAttributes: jest.fn(),
  getEdgeAttributes: jest.fn(),
  forEachNode: jest.fn(),
  forEachEdge: jest.fn()
};

const mockSigma = {
  getGraph: jest.fn(() => mockSigmaGraph),
  getCamera: jest.fn(() => ({
    animate: jest.fn(),
    goTo: jest.fn(),
    reset: jest.fn()
  })),
  refresh: jest.fn(),
  kill: jest.fn()
};

export const SigmaContainer = jest.fn(({ children }) => (
  <div data-testid="sigma-container">{children}</div>
));

export const ControlsContainer = jest.fn(({ children }) => (
  <div data-testid="controls-container">{children}</div>
));

export const FullScreenControl = jest.fn(({ children }) => (
  <div data-testid="full-screen-container">{children}</div>
));

export const ZoomControl = jest.fn(({ children }) => (
  <div data-testid="zoom-container">{children}</div>
));

export const useLoadGraph = jest.fn();
export const useRegisterEvents = jest.fn();
export const useSigma = jest.fn(() => mockSigma);
export const useSetSettings = jest.fn();
