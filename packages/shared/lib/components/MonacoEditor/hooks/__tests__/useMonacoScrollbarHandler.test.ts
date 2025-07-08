import { renderHook, act } from '@testing-library/react';
import useMonacoScrollbarHandler from '../useMonacoScrollbarHandler';

const createMockEditorAdapter = (overrides = {}) => ({
  getContentHeight: jest.fn(() => 1000),
  getContentWidth: jest.fn(() => 800),
  getLayoutInfo: jest.fn(() => ({ height: 500, width: 600 })),
  getScrollTop: jest.fn(() => 0),
  getScrollLeft: jest.fn(() => 0),
  setScrollTop: jest.fn(),
  setScrollLeft: jest.fn(),
  onDidChangeModelContent: jest.fn(),
  onDidLayoutChange: jest.fn(),
  ...overrides
});

const createMockEditor = () => ({
  id: 'test-editor'
});

const createMockMonaco = () => ({
  editor: {
    defineTheme: jest.fn(),
    setTheme: jest.fn()
  }
});

describe('useMonacoScrollbarHandler', () => {
  let mockConsoleError: jest.SpyInstance;

  beforeEach(() => {
    mockConsoleError = jest
      .spyOn(console, 'error')
      .mockImplementation(() => {});
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
  });

  it('should return required refs and setupScrollbarHandler function', () => {
    const { result } = renderHook(() => useMonacoScrollbarHandler());

    expect(result.current.editorRef).toBeDefined();
    expect(result.current.monacoRef).toBeDefined();
    expect(result.current.containerRef).toBeDefined();
    expect(result.current.hasScrollbarRef).toBeDefined();
    expect(result.current.setupScrollbarHandler).toBeInstanceOf(Function);
    expect(result.current.hasScrollbarRef.current).toBe(false);
  });

  it('should detect scrollbar when content is larger than viewport', () => {
    const { result } = renderHook(() => useMonacoScrollbarHandler());
    const mockEditor = createMockEditor();
    const mockMonaco = createMockMonaco();

    const mockAdapter = createMockEditorAdapter({
      getContentHeight: jest.fn(() => 1000),
      getContentWidth: jest.fn(() => 800)
    });

    act(() => {
      result.current.setupScrollbarHandler(
        mockEditor,
        mockMonaco,
        () => mockAdapter
      );
    });

    expect(result.current.hasScrollbarRef.current).toBe(true);
  });

  it('should not detect scrollbar when content fits in viewport', () => {
    const { result } = renderHook(() => useMonacoScrollbarHandler());
    const mockEditor = createMockEditor();
    const mockMonaco = createMockMonaco();

    const mockAdapter = createMockEditorAdapter({
      getContentHeight: jest.fn(() => 400),
      getContentWidth: jest.fn(() => 500)
    });

    act(() => {
      result.current.setupScrollbarHandler(
        mockEditor,
        mockMonaco,
        () => mockAdapter
      );
    });

    expect(result.current.hasScrollbarRef.current).toBe(false);
  });

  it('should setup content and layout change listeners', () => {
    const { result } = renderHook(() => useMonacoScrollbarHandler());
    const mockEditor = createMockEditor();
    const mockMonaco = createMockMonaco();
    const mockAdapter = createMockEditorAdapter();

    act(() => {
      result.current.setupScrollbarHandler(
        mockEditor,
        mockMonaco,
        () => mockAdapter
      );
    });

    expect(mockAdapter.onDidChangeModelContent).toHaveBeenCalledWith(
      expect.any(Function)
    );
    expect(mockAdapter.onDidLayoutChange).toHaveBeenCalledWith(
      expect.any(Function)
    );
  });

  it('should update scrollbar detection when content changes', () => {
    const { result } = renderHook(() => useMonacoScrollbarHandler());
    const mockEditor = createMockEditor();
    const mockMonaco = createMockMonaco();

    let contentHeight = 400;
    const mockAdapter = createMockEditorAdapter({
      getContentHeight: jest.fn(() => contentHeight),
      getContentWidth: jest.fn(() => 500)
    });

    act(() => {
      result.current.setupScrollbarHandler(
        mockEditor,
        mockMonaco,
        () => mockAdapter
      );
    });

    expect(result.current.hasScrollbarRef.current).toBe(false);

    const contentChangeListener = (
      mockAdapter.onDidChangeModelContent as jest.Mock
    ).mock.calls[0][0];

    contentHeight = 1000;
    act(() => {
      contentChangeListener();
    });

    expect(result.current.hasScrollbarRef.current).toBe(true);
  });

  it('should update scrollbar detection when layout changes', () => {
    const { result } = renderHook(() => useMonacoScrollbarHandler());
    const mockEditor = createMockEditor();
    const mockMonaco = createMockMonaco();

    let layoutHeight = 500;
    const mockAdapter = createMockEditorAdapter({
      getContentHeight: jest.fn(() => 500),
      getContentWidth: jest.fn(() => 500),
      getLayoutInfo: jest.fn(() => ({ height: layoutHeight, width: 600 }))
    });

    act(() => {
      result.current.setupScrollbarHandler(
        mockEditor,
        mockMonaco,
        () => mockAdapter
      );
    });

    expect(result.current.hasScrollbarRef.current).toBe(false);

    const layoutChangeListener = (mockAdapter.onDidLayoutChange as jest.Mock)
      .mock.calls[0][0];

    layoutHeight = 300;
    act(() => {
      layoutChangeListener();
    });

    expect(result.current.hasScrollbarRef.current).toBe(true);
  });

  it('should verify scrollbar adapter interface', () => {
    const { result } = renderHook(() => useMonacoScrollbarHandler());
    const mockEditor = createMockEditor();
    const mockMonaco = createMockMonaco();

    const mockAdapter = createMockEditorAdapter();

    act(() => {
      result.current.setupScrollbarHandler(
        mockEditor,
        mockMonaco,
        () => mockAdapter
      );
    });

    expect(mockAdapter.getContentHeight).toHaveBeenCalled();
    expect(mockAdapter.getContentWidth).toHaveBeenCalled();
    expect(mockAdapter.getLayoutInfo).toHaveBeenCalled();
  });
});
