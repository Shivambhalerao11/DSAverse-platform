/**
 * useVisualization — Universal step-by-step DSA animation hook
 *
 * Provides: play/pause, step forward/back, speed control, auto-run
 * Used by every DSA world page.
 */
import { useState, useRef, useCallback, useEffect } from 'react'

export interface VisualizationStep<S = unknown> {
  state: S
  description: string
  codeLine?: number
  highlight?: number[]   // indices to highlight in the structure
  swapIndices?: number[]
  foundIndex?: number
  variables?: Record<string, string | number | boolean>
}

interface UseVisualizationOptions<S> {
  steps: VisualizationStep<S>[]
  onStepChange?: (step: VisualizationStep<S>, index: number) => void
  onComplete?: () => void
  initialSpeed?: number  // 1 = normal, 2 = fast, 0.5 = slow
}

export function useVisualization<S>({
  steps,
  onStepChange,
  onComplete,
  initialSpeed = 1,
}: UseVisualizationOptions<S>) {
  const [currentIndex, setCurrentIndex] = useState(-1)
  const [isPlaying, setIsPlaying]       = useState(false)
  const [speed, setSpeed]               = useState(initialSpeed)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const stepsRef = useRef(steps)

  // Keep steps ref fresh without re-registering effects
  useEffect(() => { stepsRef.current = steps }, [steps])

  const clearTimer = () => {
    if (timerRef.current) { clearTimeout(timerRef.current); timerRef.current = null }
  }

  const goToStep = useCallback((index: number) => {
    const s = stepsRef.current
    if (index < 0 || index >= s.length) return
    setCurrentIndex(index)
    onStepChange?.(s[index], index)
  }, [onStepChange])

  const stepForward = useCallback(() => {
    setCurrentIndex((prev) => {
      const next = Math.min(prev + 1, stepsRef.current.length - 1)
      onStepChange?.(stepsRef.current[next], next)
      return next
    })
  }, [onStepChange])

  const stepBack = useCallback(() => {
    setCurrentIndex((prev) => {
      const next = Math.max(prev - 1, 0)
      onStepChange?.(stepsRef.current[next], next)
      return next
    })
  }, [onStepChange])

  // Auto-play loop
  useEffect(() => {
    if (!isPlaying) { clearTimer(); return }

    const delay = Math.round(800 / speed)

    timerRef.current = setTimeout(() => {
      setCurrentIndex((prev) => {
        const next = prev + 1
        if (next >= stepsRef.current.length) {
          setIsPlaying(false)
          onComplete?.()
          return prev
        }
        onStepChange?.(stepsRef.current[next], next)
        return next
      })
    }, delay)

    return clearTimer
  }, [isPlaying, currentIndex, speed, onStepChange, onComplete])

  const play = useCallback(() => {
    if (currentIndex >= stepsRef.current.length - 1) {
      setCurrentIndex(-1)
    }
    setIsPlaying(true)
  }, [currentIndex])

  const pause  = useCallback(() => { setIsPlaying(false) }, [])
  const toggle = useCallback(() => { isPlaying ? pause() : play() }, [isPlaying, play, pause])

  const reset = useCallback(() => {
    clearTimer()
    setIsPlaying(false)
    setCurrentIndex(-1)
  }, [])

  const currentStep = steps[currentIndex] ?? null
  const progress    = steps.length > 0 ? ((currentIndex + 1) / steps.length) * 100 : 0
  const isComplete  = currentIndex >= steps.length - 1 && steps.length > 0

  return {
    currentIndex,
    currentStep,
    isPlaying,
    speed,
    progress,
    isComplete,
    totalSteps: steps.length,
    play,
    pause,
    toggle,
    reset,
    stepForward,
    stepBack,
    goToStep,
    setSpeed,
  }
}
