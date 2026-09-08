// Arrays is the reference module (.kiro/specs/interactive-dsa-visualization-engine/
// tasks.md wave 2, and docs/dsaverse-2-migration-plan.md Phase 3) — the
// pattern every other module follows. Held to a higher correctness bar than
// the breadth-only codeLineValidity suite.
import { describe, it, expect } from 'vitest'
import { generateTraverseSteps, generateSearchSteps, generateReverseSteps } from '../arrayEngine'

describe('generateTraverseSteps', () => {
  it('empty array returns a single explanatory step, no crash', () => {
    const steps = generateTraverseSteps([])
    expect(steps).toHaveLength(1)
    expect(steps[0].stateSnapshot).toEqual([])
  })

  it('single element visits it once', () => {
    const steps = generateTraverseSteps([42])
    expect(steps).toHaveLength(1)
    expect(steps[0].highlights.activeIndices).toEqual([0])
  })

  it('visits every element exactly once, in order', () => {
    const arr = [5, 3, 8, 1]
    const steps = generateTraverseSteps(arr)
    expect(steps).toHaveLength(arr.length)
    steps.forEach((step, i) => expect(step.highlights.activeIndices).toEqual([i]))
  })
})

describe('generateSearchSteps', () => {
  it('empty array reports not-found without crashing', () => {
    const steps = generateSearchSteps([], 5)
    expect(steps).toHaveLength(1)
    expect(steps[0].highlights.foundIndex).toBeUndefined()
  })

  it('finds the target and stops early (does not scan past it)', () => {
    const steps = generateSearchSteps([5, 3, 8, 1, 9], 8)
    const last = steps[steps.length - 1]
    expect(last.highlights.foundIndex).toBe(2)
    expect(steps).toHaveLength(3) // stops at index 2, doesn't continue to 3/4
  })

  it('target not present scans the whole array and appends a not-found step', () => {
    const arr = [5, 3, 8, 1, 9]
    const steps = generateSearchSteps(arr, 999)
    expect(steps).toHaveLength(arr.length + 1)
    expect(steps[steps.length - 1].variables.status).toBe('Not Found')
  })
})

describe('generateReverseSteps', () => {
  it('empty array does not crash', () => {
    const steps = generateReverseSteps([])
    expect(steps).toHaveLength(1)
  })

  it('single element is already reversed, no swap steps', () => {
    const steps = generateReverseSteps([7])
    expect(steps).toHaveLength(1)
    expect(steps[0].highlights.swapIndices).toBeUndefined()
  })

  it('final state is the correctly reversed array', () => {
    const arr = [1, 2, 3, 4, 5]
    const steps = generateReverseSteps(arr)
    const final = steps[steps.length - 1]
    expect(final.stateSnapshot).toEqual([5, 4, 3, 2, 1])
  })

  it('performs exactly floor(n/2) swap steps plus one completion step', () => {
    const arr = [1, 2, 3, 4, 5, 6]
    const steps = generateReverseSteps(arr)
    expect(steps).toHaveLength(Math.floor(arr.length / 2) + 1)
  })
})
