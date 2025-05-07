import * as monaco from 'monaco-editor';
import editorWorker from 'monaco-editor/esm/vs/language/json/json.worker?worker';
import jsonWorker from 'monaco-editor/esm/vs/language/json/json.worker?worker';
import { loader } from '@monaco-editor/react';

self.MonacoEnvironment = {
  getWorker(_, label) {
    if (label === 'json') {
      return new jsonWorker();
    }
    return new editorWorker();
  }
};

loader.config({ monaco });

loader.init().then(/* ... */);

// web worker
