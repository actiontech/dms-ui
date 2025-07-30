import 'reflect-metadata';
import reportWebVitals from './reportWebVitals';
import { configure } from 'mobx';
import { App } from '@cloudbeaver/core-di';
import { coreManifests, pluginManifests } from './manifests';
import { renderLayout } from './renderLayout';
import {
  executionExceptionContext,
  SyncExecutor
} from '@cloudbeaver/core-executor';
import './styles.css';

async function bootstrap() {
  configure({ enforceActions: 'never' });
  const app = new App([...coreManifests, ...pluginManifests]);
  (window as any).internalRestartApp = () => app.restart();

  let exception: Error | null = null;

  try {
    await app.start();
  } catch (e: any) {
    exception = e;
  }

  const unmountExecutor = new SyncExecutor();
  const render = renderLayout(app.getServiceProvider());

  // unmountExecutor.addHandler(() => render.unmount());
  app.onStart.before(unmountExecutor, undefined, (data) => data.preload);
  app.onStart.addHandler(({ preload }) => {
    if (!preload) {
      render.renderApp();
    }
  });
  app.onStart.addPostHandler((_, context) => {
    const exceptionContext = context.getContext(executionExceptionContext);

    if (exceptionContext.exception) {
      render.renderError(exceptionContext.exception);
    }
  });

  if (exception) {
    render.renderError(exception);
  } else {
    render.renderApp();
  }
  reportWebVitals();

  return app;
}

bootstrap();
