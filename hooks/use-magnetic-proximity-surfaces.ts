"use client"

import { useEffect } from "react"

type MotionState = {
  node: HTMLElement
  x: number
  y: number
  vx: number
  vy: number
  tx: number
  ty: number
  ax: number
  ay: number
  isReturning: boolean
}

const PROXIMITY_ZONE = 150
const MAX_SHIFT = 2.4

export function useMagneticProximitySurfaces() {
  useEffect(() => {
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches
    const finePointer = window.matchMedia(
      "(hover: hover) and (pointer: fine)"
    ).matches

    if (reducedMotion || !finePointer) return

    const states: MotionState[] = Array.from(
      document.querySelectorAll<HTMLElement>("[data-magnetic-proximity]")
    ).map((node) => ({
      node,
      x: 0,
      y: 0,
      vx: 0,
      vy: 0,
      tx: 0,
      ty: 0,
      ax: 0,
      ay: 0,
      isReturning: false,
    }))

    if (states.length === 0) return

    let frameId = 0

    const render = (state: MotionState) => {
      state.node.style.transform = `translate3d(${state.x.toFixed(2)}px, ${state.y.toFixed(2)}px, 0)`
    }

    const step = () => {
      frameId = 0
      let shouldContinue = false

      states.forEach((state) => {
        const spring = state.isReturning ? 0.11 : 0.085
        const damping = state.isReturning ? 0.7 : 0.78
        const targetSmoothing = state.isReturning ? 0.18 : 0.1

        state.tx += (state.ax - state.tx) * targetSmoothing
        state.ty += (state.ay - state.ty) * targetSmoothing
        state.vx += (state.tx - state.x) * spring
        state.vy += (state.ty - state.y) * spring
        state.vx *= damping
        state.vy *= damping
        state.x += state.vx
        state.y += state.vy

        render(state)

        const isMoving =
          Math.abs(state.tx - state.x) > 0.08 ||
          Math.abs(state.ty - state.y) > 0.08 ||
          Math.abs(state.ax - state.tx) > 0.03 ||
          Math.abs(state.ay - state.ty) > 0.03 ||
          Math.abs(state.vx) > 0.08 ||
          Math.abs(state.vy) > 0.08

        if (isMoving) {
          shouldContinue = true
          return
        }

        state.tx = state.ax
        state.ty = state.ay
        state.x = state.ax
        state.y = state.ay
        state.vx = 0
        state.vy = 0
        render(state)
        state.node.style.willChange = "auto"
      })

      if (shouldContinue) {
        frameId = window.requestAnimationFrame(step)
      }
    }

    const start = () => {
      if (frameId !== 0) return
      states.forEach((state) => {
        state.node.style.willChange = "transform"
      })
      frameId = window.requestAnimationFrame(step)
    }

    const handlePointerMove = (event: PointerEvent) => {
      const rects = states.map((state) => {
        const rect = state.node.getBoundingClientRect()

        return {
          left: rect.left - state.x,
          right: rect.right - state.x,
          top: rect.top - state.y,
          bottom: rect.bottom - state.y,
        }
      })

      states.forEach((state, index) => {
        const rect = rects[index]
        const isInside =
          event.clientX >= rect.left &&
          event.clientX <= rect.right &&
          event.clientY >= rect.top &&
          event.clientY <= rect.bottom

        if (isInside) {
          state.isReturning = true
          state.ax = 0
          state.ay = 0
          return
        }

        const nearestX = Math.max(
          rect.left,
          Math.min(event.clientX, rect.right)
        )
        const nearestY = Math.max(
          rect.top,
          Math.min(event.clientY, rect.bottom)
        )
        const dx = event.clientX - nearestX
        const dy = event.clientY - nearestY
        const distance = Math.hypot(dx, dy)

        if (distance === 0 || distance > PROXIMITY_ZONE) {
          state.isReturning = true
          state.ax = 0
          state.ay = 0
          return
        }

        const proximity = 1 - distance / PROXIMITY_ZONE
        const easedProximity = proximity * proximity * (3 - 2 * proximity)
        const shift = easedProximity * MAX_SHIFT

        state.isReturning = false
        state.ax = (dx / distance) * shift
        state.ay = (dy / distance) * shift
      })

      start()
    }

    window.addEventListener("pointermove", handlePointerMove, { passive: true })

    return () => {
      if (frameId !== 0) {
        window.cancelAnimationFrame(frameId)
      }
      window.removeEventListener("pointermove", handlePointerMove)
      states.forEach(({ node }) => {
        node.style.transform = ""
        node.style.willChange = ""
      })
    }
  }, [])
}
