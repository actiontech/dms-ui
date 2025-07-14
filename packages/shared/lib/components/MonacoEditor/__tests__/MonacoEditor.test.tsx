import MonacoEditor from '../MonacoEditor';
import { superRender } from '../../../testUtil';
import * as useMonacoScrollbarHandler from '../hooks/useMonacoScrollbarHandler';

describe('CustomMonacoEditor', () => {
  const defaultProps = {
    value: 'test code',
    language: 'javascript'
  };

  const mockSetupScrollbarHandler = jest.fn();
  const mockContainerRef = { current: null };

  beforeEach(() => {
    const spy = jest.spyOn(useMonacoScrollbarHandler, 'default');
    spy.mockImplementation(() => ({
      editorRef: { current: null },
      monacoRef: { current: null },
      containerRef: mockContainerRef,
      hasScrollbarRef: { current: false },
      setupScrollbarHandler: mockSetupScrollbarHandler
    }));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should handle editor options correctly', () => {
    const options = {
      automaticLayout: true,
      scrollBeyondLastLine: false,
      readOnly: false,
      minimap: { enabled: true },
      glyphMargin: true,
      folding: true,
      lineDecorationsWidth: 10,
      lineNumbersMinChars: 3
    };

    const { container } = superRender(
      <MonacoEditor {...defaultProps} options={options} />
    );

    expect(container).toMatchSnapshot();
    expect(mockSetupScrollbarHandler).toHaveBeenCalled();
  });
});
