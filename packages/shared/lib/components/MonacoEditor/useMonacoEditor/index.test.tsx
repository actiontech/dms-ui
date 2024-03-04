import { renderHook } from '@testing-library/react-hooks';
import useMonacoEditor from '.';
import { createDependencyProposals } from './index.data';
import { IRange } from './index.type';

describe('userMonacoEditor', () => {
  test('should set value to empty when editor value is equal default placeholder', () => {
    const editor = {
      onDidFocusEditorText: jest.fn(),
      onDidBlurEditorText: jest.fn(),
      getValue: jest.fn().mockReturnValue('getValue'),
      setValue: jest.fn()
    };
    const dispose = jest.fn();
    const monaco = {
      languages: {
        registerCompletionItemProvider: jest.fn(() => ({ dispose }))
      }
    };
    const { result, unmount } = renderHook(() => useMonacoEditor());
    result.current.editorDidMount(editor as any, monaco as any);

    expect(editor.onDidBlurEditorText).toHaveBeenCalledTimes(1);
    expect(editor.onDidFocusEditorText).toHaveBeenCalledTimes(1);
    expect(
      monaco.languages.registerCompletionItemProvider
    ).toHaveBeenCalledTimes(1);
    expect(editor.getValue).toHaveBeenCalledTimes(0);
    expect(editor.setValue).toHaveBeenCalledTimes(0);

    const focusFn = editor.onDidFocusEditorText.mock.calls[0][0];
    focusFn();
    expect(editor.getValue).toHaveBeenCalledTimes(1);
    expect(editor.setValue).toHaveBeenCalledTimes(0);

    editor.getValue.mockReturnValue('/* input your sql */');

    focusFn();
    expect(editor.getValue).toHaveBeenCalledTimes(2);
    expect(editor.setValue).toHaveBeenCalledTimes(1);
    expect(editor.setValue).toHaveBeenCalledWith('');

    unmount();
    expect(dispose).toHaveBeenCalledTimes(1);
  });

  test('should set value to empty when editor value is equal custom placeholder', () => {
    const editor = {
      onDidFocusEditorText: jest.fn(),
      onDidBlurEditorText: jest.fn(),
      getValue: jest.fn().mockReturnValue('getValue'),
      setValue: jest.fn()
    };
    const dispose = jest.fn();
    const monaco = {
      languages: {
        registerCompletionItemProvider: jest.fn(() => ({ dispose }))
      }
    };
    const { result, unmount } = renderHook(() =>
      useMonacoEditor(undefined, { placeholder: 'test aaaa' })
    );
    result.current.editorDidMount(editor as any, monaco as any);

    expect(editor.onDidBlurEditorText).toHaveBeenCalledTimes(1);
    expect(editor.onDidFocusEditorText).toHaveBeenCalledTimes(1);
    expect(
      monaco.languages.registerCompletionItemProvider
    ).toHaveBeenCalledTimes(1);
    expect(editor.getValue).toHaveBeenCalledTimes(0);
    expect(editor.setValue).toHaveBeenCalledTimes(0);

    const focusFn = editor.onDidFocusEditorText.mock.calls[0][0];
    editor.getValue.mockReturnValue('/* input your sql */');
    focusFn();
    expect(editor.getValue).toHaveBeenCalledTimes(1);
    expect(editor.setValue).toHaveBeenCalledTimes(0);

    editor.getValue.mockReturnValue('test aaaa');
    focusFn();
    expect(editor.getValue).toHaveBeenCalledTimes(2);
    expect(editor.setValue).toHaveBeenCalledTimes(1);
    expect(editor.setValue).toHaveBeenCalledWith('');

    unmount();
    expect(dispose).toHaveBeenCalledTimes(1);
  });

  test('should set value to default placeholder when editor is blur and value is empty', () => {
    const editor = {
      onDidFocusEditorText: jest.fn(),
      onDidBlurEditorText: jest.fn(),
      getValue: jest.fn().mockReturnValue('getValue'),
      setValue: jest.fn()
    };
    const dispose = jest.fn();
    const monaco = {
      languages: {
        registerCompletionItemProvider: jest.fn(() => ({ dispose }))
      }
    };
    const { result, unmount } = renderHook(() => useMonacoEditor());
    result.current.editorDidMount(editor as any, monaco as any);

    expect(editor.onDidBlurEditorText).toHaveBeenCalledTimes(1);
    expect(editor.onDidFocusEditorText).toHaveBeenCalledTimes(1);
    expect(
      monaco.languages.registerCompletionItemProvider
    ).toHaveBeenCalledTimes(1);
    expect(editor.getValue).toHaveBeenCalledTimes(0);
    expect(editor.setValue).toHaveBeenCalledTimes(0);

    const blurFn = editor.onDidBlurEditorText.mock.calls[0][0];

    blurFn();
    expect(editor.getValue).toHaveBeenCalledTimes(1);
    expect(editor.setValue).toHaveBeenCalledTimes(0);

    editor.getValue.mockReturnValue('');

    blurFn();
    expect(editor.getValue).toHaveBeenCalledTimes(2);
    expect(editor.setValue).toHaveBeenCalledTimes(1);
    expect(editor.setValue).toHaveBeenCalledWith('/* input your sql */');

    unmount();
    expect(dispose).toHaveBeenCalledTimes(1);
  });

  test('should set value to custom placeholder when editor is blur and value is empty', () => {
    const editor = {
      onDidFocusEditorText: jest.fn(),
      onDidBlurEditorText: jest.fn(),
      getValue: jest.fn().mockReturnValue('getValue'),
      setValue: jest.fn()
    };
    const dispose = jest.fn();
    const monaco = {
      languages: {
        registerCompletionItemProvider: jest.fn(() => ({ dispose }))
      }
    };
    const { result, unmount } = renderHook(() =>
      useMonacoEditor(undefined, { placeholder: 'test aaa' })
    );
    result.current.editorDidMount(editor as any, monaco as any);

    expect(editor.onDidBlurEditorText).toHaveBeenCalledTimes(1);
    expect(editor.onDidFocusEditorText).toHaveBeenCalledTimes(1);
    expect(
      monaco.languages.registerCompletionItemProvider
    ).toHaveBeenCalledTimes(1);
    expect(editor.getValue).toHaveBeenCalledTimes(0);
    expect(editor.setValue).toHaveBeenCalledTimes(0);

    const blurFn = editor.onDidBlurEditorText.mock.calls[0][0];

    blurFn();
    expect(editor.getValue).toHaveBeenCalledTimes(1);
    expect(editor.setValue).toHaveBeenCalledTimes(0);

    editor.getValue.mockReturnValue('');

    blurFn();
    expect(editor.getValue).toHaveBeenCalledTimes(2);
    expect(editor.setValue).toHaveBeenCalledTimes(1);
    expect(editor.setValue).toHaveBeenCalledWith('test aaa');

    unmount();
    expect(dispose).toHaveBeenCalledTimes(1);
  });

  test('should set value to empty by form instance when editor value is equal default placeholder', () => {
    const editor = {
      onDidFocusEditorText: jest.fn(),
      onDidBlurEditorText: jest.fn(),
      getValue: jest.fn().mockReturnValue('getValue'),
      setValue: jest.fn()
    };
    const dispose = jest.fn();
    const monaco = {
      languages: {
        registerCompletionItemProvider: jest.fn(() => ({ dispose }))
      }
    };
    const form = {
      getFieldValue: jest.fn(),
      setFields: jest.fn()
    };
    const { result, unmount } = renderHook(() =>
      useMonacoEditor(form as any, { formName: 'sql' })
    );
    result.current.editorDidMount(editor as any, monaco as any);

    expect(editor.onDidBlurEditorText).toHaveBeenCalledTimes(1);
    expect(editor.onDidFocusEditorText).toHaveBeenCalledTimes(1);
    expect(
      monaco.languages.registerCompletionItemProvider
    ).toHaveBeenCalledTimes(1);

    const focusFn = editor.onDidFocusEditorText.mock.calls[0][0];
    focusFn();
    expect(form.getFieldValue).toHaveBeenCalledTimes(1);
    expect(form.getFieldValue).toHaveBeenCalledWith('sql');
    expect(form.setFields).toHaveBeenCalledTimes(0);
    expect(editor.getValue).toHaveBeenCalledTimes(0);
    expect(editor.setValue).toHaveBeenCalledTimes(0);

    form.getFieldValue.mockReturnValue('/* input your sql */');

    focusFn();
    expect(form.getFieldValue).toHaveBeenCalledTimes(2);
    expect(form.getFieldValue).lastCalledWith('sql');
    expect(form.setFields).toHaveBeenCalledTimes(1);
    expect(form.setFields).toHaveBeenCalledWith([{ name: 'sql', value: '' }]);

    unmount();
    expect(dispose).toHaveBeenCalledTimes(1);
  });

  test('should set value to empty by form instance when editor value is equal custom placeholder', () => {
    const editor = {
      onDidFocusEditorText: jest.fn(),
      onDidBlurEditorText: jest.fn(),
      getValue: jest.fn().mockReturnValue('getValue'),
      setValue: jest.fn()
    };
    const dispose = jest.fn();
    const monaco = {
      languages: {
        registerCompletionItemProvider: jest.fn(() => ({ dispose }))
      }
    };
    const form = {
      getFieldValue: jest.fn(),
      setFields: jest.fn()
    };
    const { result, unmount } = renderHook(() =>
      useMonacoEditor(form as any, {
        formName: 'sql',
        placeholder: 'test aaaa'
      })
    );
    result.current.editorDidMount(editor as any, monaco as any);

    expect(editor.onDidBlurEditorText).toHaveBeenCalledTimes(1);
    expect(editor.onDidFocusEditorText).toHaveBeenCalledTimes(1);
    expect(
      monaco.languages.registerCompletionItemProvider
    ).toHaveBeenCalledTimes(1);

    const focusFn = editor.onDidFocusEditorText.mock.calls[0][0];
    focusFn();
    expect(form.getFieldValue).toHaveBeenCalledTimes(1);
    expect(form.getFieldValue).toHaveBeenCalledWith('sql');
    expect(form.setFields).toHaveBeenCalledTimes(0);
    expect(editor.getValue).toHaveBeenCalledTimes(0);
    expect(editor.setValue).toHaveBeenCalledTimes(0);

    form.getFieldValue.mockReturnValue('test aaaa');

    focusFn();
    expect(form.getFieldValue).toHaveBeenCalledTimes(2);
    expect(form.getFieldValue).lastCalledWith('sql');
    expect(form.setFields).toHaveBeenCalledTimes(1);
    expect(form.setFields).toHaveBeenCalledWith([{ name: 'sql', value: '' }]);
    expect(editor.getValue).toHaveBeenCalledTimes(0);
    expect(editor.setValue).toHaveBeenCalledTimes(0);

    unmount();
    expect(dispose).toHaveBeenCalledTimes(1);
  });

  test('should set value to default placeholder by form instance when editor is blur and value is empty', () => {
    const editor = {
      onDidFocusEditorText: jest.fn(),
      onDidBlurEditorText: jest.fn(),
      getValue: jest.fn().mockReturnValue('getValue'),
      setValue: jest.fn()
    };
    const dispose = jest.fn();
    const monaco = {
      languages: {
        registerCompletionItemProvider: jest.fn(() => ({ dispose }))
      }
    };
    const form = {
      getFieldValue: jest.fn(),
      setFields: jest.fn()
    };
    const { result, unmount } = renderHook(() =>
      useMonacoEditor(form as any, { formName: 'sql' })
    );
    result.current.editorDidMount(editor as any, monaco as any);

    expect(editor.onDidBlurEditorText).toHaveBeenCalledTimes(1);
    expect(editor.onDidFocusEditorText).toHaveBeenCalledTimes(1);
    expect(
      monaco.languages.registerCompletionItemProvider
    ).toHaveBeenCalledTimes(1);
    expect(editor.getValue).toHaveBeenCalledTimes(0);
    expect(editor.setValue).toHaveBeenCalledTimes(0);

    const blurFn = editor.onDidBlurEditorText.mock.calls[0][0];

    blurFn();
    expect(form.getFieldValue).toHaveBeenCalledTimes(1);
    expect(form.getFieldValue).toHaveBeenCalledWith('sql');
    expect(form.setFields).toHaveBeenCalledTimes(0);
    expect(editor.getValue).toHaveBeenCalledTimes(0);
    expect(editor.setValue).toHaveBeenCalledTimes(0);

    form.getFieldValue.mockReturnValue('');

    blurFn();
    expect(form.getFieldValue).toHaveBeenCalledTimes(2);
    expect(form.getFieldValue).lastCalledWith('sql');
    expect(form.setFields).toHaveBeenCalledTimes(1);
    expect(form.setFields).toHaveBeenCalledWith([
      { name: 'sql', value: '/* input your sql */' }
    ]);

    unmount();
    expect(dispose).toHaveBeenCalledTimes(1);
  });

  test('should set value to custom placeholder by form instance when editor is blur and value is empty', () => {
    const editor = {
      onDidFocusEditorText: jest.fn(),
      onDidBlurEditorText: jest.fn(),
      getValue: jest.fn().mockReturnValue('getValue'),
      setValue: jest.fn()
    };
    const dispose = jest.fn();
    const monaco = {
      languages: {
        registerCompletionItemProvider: jest.fn(() => ({ dispose }))
      }
    };
    const form = {
      getFieldValue: jest.fn(),
      setFields: jest.fn()
    };
    const { result, unmount } = renderHook(() =>
      useMonacoEditor(form as any, {
        formName: 'sql',
        placeholder: 'test aaaa'
      })
    );
    result.current.editorDidMount(editor as any, monaco as any);

    expect(editor.onDidBlurEditorText).toHaveBeenCalledTimes(1);
    expect(editor.onDidFocusEditorText).toHaveBeenCalledTimes(1);
    expect(
      monaco.languages.registerCompletionItemProvider
    ).toHaveBeenCalledTimes(1);
    expect(editor.getValue).toHaveBeenCalledTimes(0);
    expect(editor.setValue).toHaveBeenCalledTimes(0);

    const blurFn = editor.onDidBlurEditorText.mock.calls[0][0];

    blurFn();
    expect(form.getFieldValue).toHaveBeenCalledTimes(1);
    expect(form.getFieldValue).toHaveBeenCalledWith('sql');
    expect(form.setFields).toHaveBeenCalledTimes(0);
    expect(editor.getValue).toHaveBeenCalledTimes(0);
    expect(editor.setValue).toHaveBeenCalledTimes(0);

    form.getFieldValue.mockReturnValue('');

    blurFn();
    expect(form.getFieldValue).toHaveBeenCalledTimes(2);
    expect(form.getFieldValue).lastCalledWith('sql');
    expect(form.setFields).toHaveBeenCalledTimes(1);
    expect(form.setFields).toHaveBeenCalledWith([
      { name: 'sql', value: 'test aaaa' }
    ]);

    unmount();
    expect(dispose).toHaveBeenCalledTimes(1);
  });

  test('should match snapshot for createDependencyProposals', () => {
    const monaco = {
      languages: {
        CompletionItemKind: {
          Function: 'function'
        }
      }
    };
    const range: IRange = {
      startLineNumber: 1,
      endLineNumber: 1,
      startColumn: 1,
      endColumn: 1
    };

    expect(createDependencyProposals(monaco as any, range)).toMatchSnapshot();
  });
});
