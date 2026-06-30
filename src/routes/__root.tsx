import "~/styles/globals.css"
import "virtual:uno.css"
import { Outlet, createRootRouteWithContext } from "@tanstack/react-router"
import { TanStackRouterDevtools } from "@tanstack/router-devtools"
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"
import type { QueryClient } from "@tanstack/react-query"
import { isMobile } from "react-device-detect"
import { Analytics } from "@vercel/analytics/react"
import { Header } from "~/components/header"
import { GlobalOverlayScrollbar } from "~/components/common/overlay-scrollbar"
import { Footer } from "~/components/footer"
import { Toast } from "~/components/common/toast"
import { SearchBar } from "~/components/common/search-bar"

export const Route = createRootRouteWithContext<{
  queryClient: QueryClient
}>()({
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
})

function NotFoundComponent() {
  const nav = Route.useNavigate()
  nav({
    to: "/",
  })
}

function RootComponent() {
  useOnReload()
  useSync()
  usePWA()
  return (
    <>
      <GlobalOverlayScrollbar
        className={$([
          !isMobile && "px-3",
          "h-full overflow-x-auto",
          "md:(px-6)",
          "lg:(px-12)",
        ])}
      >
        <header
          className={$([
            "grid items-center py-3 px-3",
            "lg:(py-5)",
            "sticky top-0 z-10 backdrop-blur-lg",
            "border-b border-[var(--line)] bg-[var(--surface)]/80",
          ])}
          style={{
            gridTemplateColumns: "auto 1fr auto",
            gap: "0.5rem",
          }}
        >
          <Header />
        </header>
        <main className={$([
          "mt-3",
          "min-h-[calc(100vh-180px)]",
          "md:(min-h-[calc(100vh-160px)])",
          "lg:(min-h-[calc(100vh-170px)])",
        ])}
        >
          <Outlet />
        </main>
        <footer className="py-8 flex flex-col items-center justify-center text-sm color-neutral-400">
          <Footer />
        </footer>
      </GlobalOverlayScrollbar>
      <Toast />
      <SearchBar />
      <Analytics />
      {import.meta.env.DEV && (
        <>
          <ReactQueryDevtools buttonPosition="bottom-left" />
          <TanStackRouterDevtools position="bottom-right" />
        </>
      )}
    </>
  )
}
