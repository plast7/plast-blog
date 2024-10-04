import { createRootRoute, Link, Outlet } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/router-devtools'
import NotFoundComponent from '../components/NotFoundComponent'
import '../styles/globals.css'

export const Route = createRootRoute({
  component: () => (
    <>
      <Outlet />
      {/* <TanStackRouterDevtools /> */}
    </>
  ),
  notFoundComponent: () => (
    <>
      <NotFoundComponent />
    </>
  ),
})
