import { useCallback, useRef, useEffect } from 'react';

interface EditorAdapter {
  getContentHeight(): number;
  getContentWidth(): number;
  getLayoutInfo(): { height: number; width: number };
  getScrollTop(): number;
  getScrollLeft(): number;
  setScrollTop(scrollTop: number): void;
  setScrollLeft(scrollLeft: number): void;
  onDidChangeModelContent(listener: () => void): void;
  onDidLayoutChange(listener: () => void): void;
}

interface UseMonacoScrollbarHandlerReturn<TEditor, TMonaco> {
  editorRef: React.RefObject<TEditor>;
  monacoRef: React.RefObject<TMonaco>;
  containerRef: React.RefObject<HTMLDivElement>;
  hasScrollbarRef: React.RefObject<boolean>;
  setupScrollbarHandler: (
    editor: TEditor,
    monaco: TMonaco,
    getAdapter: (editor: TEditor) => EditorAdapter
  ) => void;
}

const useMonacoScrollbarHandler = <
  TEditor,
  TMonaco
>(): UseMonacoScrollbarHandlerReturn<TEditor, TMonaco> => {
  const editorRef = useRef<TEditor | null>(null);
  const monacoRef = useRef<TMonaco | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const hasScrollbarRef = useRef<boolean>(false);
  const adapterRef = useRef<EditorAdapter | null>(null);

  const checkScrollbarExistence = useCallback(() => {
    if (!monacoRef.current || !adapterRef.current) return;

    const adapter = adapterRef.current;
    const contentHeight = adapter.getContentHeight();
    const contentWidth = adapter.getContentWidth();
    const layoutInfo = adapter.getLayoutInfo();

    // 检查是否有滚动条：内容尺寸大于视口尺寸
    const hasVerticalScrollbar = contentHeight > layoutInfo.height;
    const hasHorizontalScrollbar = contentWidth > layoutInfo.width;
    const hasScrollbar = hasVerticalScrollbar || hasHorizontalScrollbar;
    hasScrollbarRef.current = hasScrollbar;
  }, []);

  // 手动处理滚动事件 有滚动条时阻止事件冒泡，让Monaco编辑器处理 没有滚动条时不做任何处理，让事件正常冒泡到外层容器
  const handleWheelEvent = useCallback((e: WheelEvent) => {
    if (hasScrollbarRef.current && adapterRef.current) {
      e.preventDefault();
      e.stopPropagation();

      const adapter = adapterRef.current;
      const currentScrollTop = adapter.getScrollTop();
      const currentScrollLeft = adapter.getScrollLeft();

      if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
        adapter.setScrollTop(currentScrollTop + e.deltaY);
      } else {
        adapter.setScrollLeft(currentScrollLeft + e.deltaX);
      }
    }
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    container.addEventListener('wheel', handleWheelEvent, { passive: false });

    return () => {
      container.removeEventListener('wheel', handleWheelEvent);
    };
  }, [handleWheelEvent]);

  const setupScrollbarHandler = useCallback(
    (
      editor: TEditor,
      monaco: TMonaco,
      getAdapter: (editor: TEditor) => EditorAdapter
    ) => {
      editorRef.current = editor;
      monacoRef.current = monaco;
      adapterRef.current = getAdapter(editor);

      // 初始检查滚动条
      checkScrollbarExistence();

      // 监听内容变化，重新检查滚动条
      adapterRef.current.onDidChangeModelContent(() => {
        checkScrollbarExistence();
      });

      // 监听布局变化，重新检查滚动条
      adapterRef.current.onDidLayoutChange(() => {
        checkScrollbarExistence();
      });
    },
    [checkScrollbarExistence]
  );

  return {
    editorRef,
    monacoRef,
    containerRef,
    hasScrollbarRef,
    setupScrollbarHandler
  };
};

export default useMonacoScrollbarHandler;
