import { renderHook, act } from '@testing-library/react';
import useMonacoScrollbarHandler from '../useMonacoScrollbarHandler';
import { editor } from 'monaco-editor';
import { Monaco } from '@monaco-editor/react';

const createMockEditor = (overrides = {}) =>
  ({
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
  } as unknown as editor.IStandaloneCodeEditor);

const createMockMonaco = () =>
  ({
    editor: {
      defineTheme: jest.fn(),
      setTheme: jest.fn()
    }
  } as unknown as Monaco);

describe('useMonacoScrollbarHandler', () => {
  it('should return required refs and setupScrollbarHandler function', () => {
    const { result } = renderHook(() => useMonacoScrollbarHandler());

    expect(result.current.monacoRef).toBeDefined();
    expect(result.current.containerRef).toBeDefined();
    expect(result.current.hasScrollbarRef).toBeDefined();
    expect(result.current.setupScrollbarHandler).toBeInstanceOf(Function);
    expect(result.current.hasScrollbarRef.current).toBe(false);
  });

  it('should detect scrollbar when content is larger than viewport', () => {
    const { result } = renderHook(() => useMonacoScrollbarHandler());
    const mockMonaco = createMockMonaco();

    const mockEditor = createMockEditor({
      getContentHeight: jest.fn(() => 1000),
      getContentWidth: jest.fn(() => 800)
    });

    act(() => {
      result.current.setupScrollbarHandler(mockEditor, mockMonaco);
    });

    expect(result.current.hasScrollbarRef.current).toBe(true);
  });

  it('should not detect scrollbar when content fits in viewport', () => {
    const { result } = renderHook(() => useMonacoScrollbarHandler());
    const mockMonaco = createMockMonaco();

    const mockEditor = createMockEditor({
      getContentHeight: jest.fn(() => 400),
      getContentWidth: jest.fn(() => 500)
    });

    act(() => {
      result.current.setupScrollbarHandler(mockEditor, mockMonaco);
    });

    expect(result.current.hasScrollbarRef.current).toBe(false);
  });

  it('should setup content and layout change listeners', () => {
    const { result } = renderHook(() => useMonacoScrollbarHandler());
    const mockEditor = createMockEditor();
    const mockMonaco = createMockMonaco();

    act(() => {
      result.current.setupScrollbarHandler(mockEditor, mockMonaco);
    });

    expect(mockEditor.onDidChangeModelContent).toHaveBeenCalledWith(
      expect.any(Function)
    );
    expect(mockEditor.onDidLayoutChange).toHaveBeenCalledWith(
      expect.any(Function)
    );
  });

  it('should update scrollbar detection when content changes', () => {
    const { result } = renderHook(() => useMonacoScrollbarHandler());
    const mockMonaco = createMockMonaco();

    let contentHeight = 400;
    const mockEditor = createMockEditor({
      getContentHeight: jest.fn(() => contentHeight),
      getContentWidth: jest.fn(() => 500)
    });

    act(() => {
      result.current.setupScrollbarHandler(mockEditor, mockMonaco);
    });

    expect(result.current.hasScrollbarRef.current).toBe(false);

    const contentChangeListener = (
      mockEditor.onDidChangeModelContent as jest.Mock
    ).mock.calls[0][0];

    contentHeight = 1000;
    act(() => {
      contentChangeListener();
    });

    expect(result.current.hasScrollbarRef.current).toBe(true);
  });

  it('should update scrollbar detection when layout changes', () => {
    const { result } = renderHook(() => useMonacoScrollbarHandler());
    const mockMonaco = createMockMonaco();

    let layoutHeight = 500;
    const mockEditor = createMockEditor({
      getContentHeight: jest.fn(() => 500),
      getContentWidth: jest.fn(() => 500),
      getLayoutInfo: jest.fn(() => ({ height: layoutHeight, width: 600 }))
    });

    act(() => {
      result.current.setupScrollbarHandler(mockEditor, mockMonaco);
    });

    expect(result.current.hasScrollbarRef.current).toBe(false);

    const layoutChangeListener = (mockEditor.onDidLayoutChange as jest.Mock)
      .mock.calls[0][0];

    layoutHeight = 300;
    act(() => {
      layoutChangeListener();
    });

    expect(result.current.hasScrollbarRef.current).toBe(true);
  });

  it('should verify scrollbar adapter interface', () => {
    const { result } = renderHook(() => useMonacoScrollbarHandler());
    const mockMonaco = createMockMonaco();

    const mockEditor = createMockEditor();

    act(() => {
      result.current.setupScrollbarHandler(mockEditor, mockMonaco);
    });

    expect(mockEditor.getContentHeight).toHaveBeenCalled();
    expect(mockEditor.getContentWidth).toHaveBeenCalled();
    expect(mockEditor.getLayoutInfo).toHaveBeenCalled();
  });
});
