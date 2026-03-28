import { Toaster } from "@/components/ui/sonner";
import {
  Outlet,
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";
import { Layout } from "./components/Layout";
import { Admin } from "./pages/Admin";
import { Broadband } from "./pages/Broadband";
import { Home } from "./pages/Home";
import { Packages } from "./pages/Packages";
import { Portal } from "./pages/Portal";
import { Support } from "./pages/Support";

const rootRoute = createRootRoute({
  component: () => (
    <Layout>
      <Outlet />
    </Layout>
  ),
});

const homeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: Home,
});
const packagesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/packages",
  component: Packages,
});
const broadbandRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/broadband",
  component: Broadband,
});
const portalRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/portal",
  component: Portal,
});
const adminRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/admin",
  component: Admin,
});
const supportRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/support",
  component: Support,
});

const routeTree = rootRoute.addChildren([
  homeRoute,
  packagesRoute,
  broadbandRoute,
  portalRoute,
  adminRoute,
  supportRoute,
]);

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return (
    <>
      <RouterProvider router={router} />
      <Toaster />
    </>
  );
}
