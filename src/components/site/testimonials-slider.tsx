"use client"

import { ChevronLeft, ChevronRight } from "lucide-react"
import {
  type PointerEvent,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react"
import { cn } from "@/lib/utils"

type Testimonial = {
  quote: string
  author: string
}

type Locale = "ru" | "en"

const labels = {
  ru: {
    previous: "Предыдущий отзыв",
    next: "Следующий отзыв",
    counter: "отзыв",
  },
  en: {
    previous: "Previous review",
    next: "Next review",
    counter: "review",
  },
} satisfies Record<Locale, Record<string, string>>

const LOOP_COPIES = 7
const CENTER_COPY = Math.floor(LOOP_COPIES / 2)
const EDGE_COPY_BUFFER = 1

function getNearestSlideIndex(scroller: HTMLDivElement) {
  const slides = Array.from(scroller.querySelectorAll<HTMLElement>("[data-testimonial-slide]"))
  const center = scroller.scrollLeft + scroller.clientWidth / 2

  return slides.reduce(
    (nearest, slide, index) => {
      const slideCenter = slide.offsetLeft + slide.clientWidth / 2
      const distance = Math.abs(center - slideCenter)

      return distance < nearest.distance ? { index, distance } : nearest
    },
    { index: 0, distance: Number.POSITIVE_INFINITY },
  ).index
}

export function TestimonialsSlider({
  items,
  locale,
}: {
  items: Testimonial[]
  locale: string
}) {
  const normalizedLocale: Locale = locale === "en" ? "en" : "ru"
  const hasLoop = items.length > 1
  const renderedItems = useMemo(
    () =>
      hasLoop
        ? Array.from({ length: LOOP_COPIES }, () => items).flat()
        : items,
    [hasLoop, items],
  )
  const startIndex = hasLoop ? CENTER_COPY * items.length : 0
  const scrollerRef = useRef<HTMLDivElement>(null)
  const dragStateRef = useRef({
    pointerId: -1,
    scrollLeft: 0,
    startX: 0,
  })
  const scrollTimerRef = useRef<number | null>(null)
  const isDraggingRef = useRef(false)
  const isResettingRef = useRef(false)
  const [activeIndex, setActiveIndex] = useState(0)
  const [renderedIndex, setRenderedIndex] = useState(startIndex)
  const [isDragging, setIsDragging] = useState(false)
  const copy = labels[normalizedLocale]

  function getRealIndex(index: number) {
    if (!items.length) {
      return 0
    }

    return ((index % items.length) + items.length) % items.length
  }

  function getCenteredIndex(index: number) {
    return hasLoop ? CENTER_COPY * items.length + getRealIndex(index) : index
  }

  function shouldRecenter(index: number) {
    if (!hasLoop) {
      return false
    }

    const copyIndex = Math.floor(index / items.length)

    return (
      copyIndex <= EDGE_COPY_BUFFER ||
      copyIndex >= LOOP_COPIES - EDGE_COPY_BUFFER - 1
    )
  }

  function getNearestRenderedIndexForRealIndex(realIndex: number, fromIndex: number) {
    if (!hasLoop) {
      return realIndex
    }

    const baseCopy = Math.floor(fromIndex / items.length)
    const candidates = [baseCopy - 1, baseCopy, baseCopy + 1]
      .map((copyIndex) => copyIndex * items.length + realIndex)
      .filter((index) => index >= 0 && index < renderedItems.length)

    return candidates.reduce(
      (nearest, candidate) =>
        Math.abs(candidate - fromIndex) < Math.abs(nearest - fromIndex)
          ? candidate
          : nearest,
      candidates[0] ?? getCenteredIndex(realIndex),
    )
  }

  function withStableBaseIndex(callback: (baseIndex: number) => void) {
    clearScrollTimer()

    if (!shouldRecenter(renderedIndex)) {
      callback(renderedIndex)
      return
    }

    const centeredIndex = getCenteredIndex(renderedIndex)

    isResettingRef.current = true
    setRenderedIndex(centeredIndex)
    setActiveIndex(getRealIndex(centeredIndex))
    scrollToRenderedSlide(centeredIndex, "auto")

    window.requestAnimationFrame(() => {
      isResettingRef.current = false
      callback(centeredIndex)
    })
  }

  function scrollToRenderedSlide(index: number, behavior: ScrollBehavior = "smooth") {
    const scroller = scrollerRef.current
    const slide = scroller?.querySelectorAll<HTMLElement>("[data-testimonial-slide]")[index]

    if (!scroller || !slide) {
      return
    }

    scroller.scrollTo({
      behavior,
      left: slide.offsetLeft - (scroller.clientWidth - slide.clientWidth) / 2,
    })
  }

  function clearScrollTimer() {
    if (scrollTimerRef.current === null) {
      return
    }

    window.clearTimeout(scrollTimerRef.current)
    scrollTimerRef.current = null
  }

  function normalizeToCenter(index: number) {
    if (!hasLoop || !shouldRecenter(index)) {
      return
    }

    const centeredIndex = getCenteredIndex(index)

    if (centeredIndex === index) {
      return
    }

    isResettingRef.current = true
    setRenderedIndex(centeredIndex)
    setActiveIndex(getRealIndex(centeredIndex))

    window.requestAnimationFrame(() => {
      scrollToRenderedSlide(centeredIndex, "auto")

      window.requestAnimationFrame(() => {
        isResettingRef.current = false
      })
    })
  }

  function updateActiveSlide(shouldNormalize = !isDraggingRef.current) {
    const scroller = scrollerRef.current

    if (!scroller || isResettingRef.current) {
      return
    }

    const nearestIndex = getNearestSlideIndex(scroller)
    setRenderedIndex(nearestIndex)
    setActiveIndex(getRealIndex(nearestIndex))

    if (hasLoop && shouldNormalize) {
      clearScrollTimer()

      if (shouldRecenter(nearestIndex)) {
        scrollTimerRef.current = window.setTimeout(() => {
          normalizeToCenter(nearestIndex)
        }, 260)
      }
    }
  }

  function scrollToRealSlide(index: number) {
    const realIndex = getRealIndex(index)

    withStableBaseIndex((baseIndex) => {
      const targetIndex = getNearestRenderedIndexForRealIndex(realIndex, baseIndex)

      setActiveIndex(realIndex)
      setRenderedIndex(targetIndex)
      scrollToRenderedSlide(targetIndex)
    })
  }

  function handlePointerDown(event: PointerEvent<HTMLDivElement>) {
    if (event.pointerType === "mouse" && event.button !== 0) {
      return
    }

    const scroller = scrollerRef.current

    if (!scroller) {
      return
    }

    dragStateRef.current = {
      pointerId: event.pointerId,
      scrollLeft: scroller.scrollLeft,
      startX: event.clientX,
    }

    isDraggingRef.current = true
    setIsDragging(true)
    scroller.setPointerCapture(event.pointerId)
  }

  function handlePointerMove(event: PointerEvent<HTMLDivElement>) {
    const scroller = scrollerRef.current
    const dragState = dragStateRef.current

    if (!scroller || dragState.pointerId !== event.pointerId) {
      return
    }

    scroller.scrollLeft = dragState.scrollLeft - (event.clientX - dragState.startX)
  }

  function finishPointerDrag(event: PointerEvent<HTMLDivElement>) {
    const scroller = scrollerRef.current
    const dragState = dragStateRef.current

    if (!scroller || dragState.pointerId !== event.pointerId) {
      return
    }

    if (scroller.hasPointerCapture(event.pointerId)) {
      scroller.releasePointerCapture(event.pointerId)
    }

    dragStateRef.current.pointerId = -1
    isDraggingRef.current = false
    setIsDragging(false)
    updateActiveSlide(true)
  }

  function move(direction: -1 | 1) {
    if (!hasLoop) {
      scrollToRealSlide(0)
      return
    }

    withStableBaseIndex((baseIndex) => {
      const targetIndex = baseIndex + direction

      setRenderedIndex(targetIndex)
      setActiveIndex(getRealIndex(targetIndex))
      scrollToRenderedSlide(targetIndex)
    })
  }

  useEffect(() => {
    clearScrollTimer()
    isDraggingRef.current = false
    isResettingRef.current = false
    setActiveIndex(0)
    setRenderedIndex(startIndex)
    window.requestAnimationFrame(() => {
      scrollToRenderedSlide(startIndex, "auto")
    })

  }, [items.length, startIndex])

  useEffect(() => {
    return () => {
      clearScrollTimer()
    }
  }, [])

  if (!items.length) {
    return null
  }

  return (
    <div className="mt-10">
      <div className="mb-5 flex justify-end">
        <div className="flex items-center gap-2">
          <button
            aria-label={copy.previous}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-ink/18 text-ink/70 transition-all duration-300 ease-out hover:-translate-y-0.5 hover:border-line hover:bg-line/12 hover:text-ink"
            onClick={() => move(-1)}
            type="button"
          >
            <ChevronLeft size={17} />
          </button>
          <button
            aria-label={copy.next}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-ink/18 text-ink/70 transition-all duration-300 ease-out hover:-translate-y-0.5 hover:border-line hover:bg-line/12 hover:text-ink"
            onClick={() => move(1)}
            type="button"
          >
            <ChevronRight size={17} />
          </button>
        </div>
      </div>

      <div
        className={cn(
          "scrollbar-none -mx-5 flex touch-pan-y items-start gap-5 overflow-x-auto px-5 pb-4 select-none md:-mx-8 md:px-8",
          isDragging ? "snap-none" : "snap-x snap-mandatory",
        )}
        onPointerCancel={finishPointerDrag}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={finishPointerDrag}
        onScroll={() => updateActiveSlide()}
        ref={scrollerRef}
      >
        {renderedItems.map((item, index) => (
          <figure
            className="min-w-[82vw] snap-center scroll-mx-5 rounded-[6px] border border-ink/12 bg-background/70 p-7 sm:min-w-[390px] lg:min-w-[430px]"
            data-testimonial-slide=""
            key={`${item.author}-${index}`}
          >
            <blockquote className="max-h-[22rem] overflow-y-auto pr-2 text-base leading-7 text-ink/70 md:text-lg md:leading-8">
              “{item.quote}”
            </blockquote>
            <figcaption className="mt-6 text-sm uppercase tracking-[0.16em] text-ink/40">
              {item.author}
            </figcaption>
          </figure>
        ))}
      </div>

      <div className="mt-5 flex flex-wrap justify-center gap-2.5">
        {items.map((item, index) => (
          <button
            aria-label={`${copy.counter} ${index + 1}`}
            className={cn(
              "h-2.5 w-2.5 rounded-full border transition-all duration-300 ease-out",
              activeIndex === index
                ? "scale-110 border-line bg-line"
                : "border-ink/25 bg-background/80 hover:border-line/70 hover:bg-line/25",
            )}
            key={`${item.author}-${index}-dot`}
            onClick={() => scrollToRealSlide(index)}
            type="button"
          />
        ))}
      </div>
    </div>
  )
}
