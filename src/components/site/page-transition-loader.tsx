"use client"

import { usePathname } from "next/navigation"
import type { MutableRefObject } from "react"
import { useCallback, useEffect, useRef, useState } from "react"

const NAVIGATION_START_EVENT = "site:navigation-start"
const SHOW_DELAY_MS = 180
const HIDE_DELAY_MS = 180

function clearTimer(timerRef: MutableRefObject<number | null>) {
  if (timerRef.current) {
    window.clearTimeout(timerRef.current)
    timerRef.current = null
  }
}

export function triggerPageTransition() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event(NAVIGATION_START_EVENT))
  }
}

export function PageTransitionLoader() {
  const pathname = usePathname()
  const [isVisible, setIsVisible] = useState(false)
  const showTimerRef = useRef<number | null>(null)
  const hideTimerRef = useRef<number | null>(null)
  const isPendingRef = useRef(false)

  const startTransition = useCallback(() => {
    if (isPendingRef.current) {
      return
    }

    isPendingRef.current = true
    clearTimer(hideTimerRef)
    clearTimer(showTimerRef)
    showTimerRef.current = window.setTimeout(() => {
      setIsVisible(true)
    }, SHOW_DELAY_MS)
  }, [])

  const finishTransition = useCallback(() => {
    isPendingRef.current = false
    clearTimer(showTimerRef)
    clearTimer(hideTimerRef)
    hideTimerRef.current = window.setTimeout(() => {
      setIsVisible(false)
    }, HIDE_DELAY_MS)
  }, [])

  useEffect(() => {
    finishTransition()
  }, [finishTransition, pathname])

  useEffect(() => {
    const handleNavigationStart = () => startTransition()

    const handleClick = (event: MouseEvent) => {
      if (
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
      ) {
        return
      }

      const target = event.target instanceof Element ? event.target : null
      const anchor = target?.closest("a[href]") as HTMLAnchorElement | null

      if (!anchor || (anchor.target && anchor.target !== "_self") || anchor.hasAttribute("download")) {
        return
      }

      const nextUrl = new URL(anchor.href, window.location.href)
      const currentUrl = new URL(window.location.href)

      if (nextUrl.origin !== currentUrl.origin) {
        return
      }

      const isOnlyHashChange =
        nextUrl.pathname === currentUrl.pathname &&
        nextUrl.search === currentUrl.search &&
        nextUrl.hash &&
        nextUrl.hash !== currentUrl.hash

      if (isOnlyHashChange || nextUrl.href === currentUrl.href) {
        return
      }

      startTransition()
    }

    window.addEventListener(NAVIGATION_START_EVENT, handleNavigationStart)
    window.addEventListener("pageshow", finishTransition)
    window.addEventListener("popstate", handleNavigationStart)
    document.addEventListener("click", handleClick, true)

    return () => {
      window.removeEventListener(NAVIGATION_START_EVENT, handleNavigationStart)
      window.removeEventListener("pageshow", finishTransition)
      window.removeEventListener("popstate", handleNavigationStart)
      document.removeEventListener("click", handleClick, true)
      clearTimer(showTimerRef)
      clearTimer(hideTimerRef)
    }
  }, [finishTransition, startTransition])

  return (
    <div
      aria-hidden={!isVisible}
      className={`pointer-events-none fixed inset-x-0 top-0 z-[90] transition-opacity duration-300 ease-out ${
        isVisible ? "opacity-100" : "opacity-0"
      }`}
    >
      <div className="h-[3px] overflow-hidden bg-line/15">
        <div className="route-loader-bar h-full w-1/2 rounded-r-full bg-line shadow-[0_0_22px_rgba(125,158,174,0.55)]" />
      </div>
      <div className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full border border-line/25 bg-background/88 shadow-soft backdrop-blur-md md:right-8">
        <span className="absolute h-3 w-3 animate-ping rounded-full bg-line/45" />
        <span className="h-2 w-2 rounded-full bg-line" />
      </div>
    </div>
  )
}
