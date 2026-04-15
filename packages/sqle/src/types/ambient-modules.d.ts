declare module '*.less';
declare module '*.css';

declare module 'monaco-editor/esm/vs/language/json/json.worker?worker' {
  const workerFactory: new () => Worker;
  export default workerFactory;
}
