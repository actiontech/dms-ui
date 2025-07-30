import { Header, Layout } from '@cloudbeaver/core-app';
import { Outlet, createRootRoute } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools';

export const Route = createRootRoute({
  component: () => (
    <Layout header={<Header />}>
      <Outlet />
      <TanStackRouterDevtools />
    </Layout>
  )
});
