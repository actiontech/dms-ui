import { createFileRoute } from '@tanstack/react-router';
import { CoreApp } from '@cloudbeaver/core-app';

export const Route = createFileRoute('/')({
  component: App
});

function App() {
  return <CoreApp />;
}
