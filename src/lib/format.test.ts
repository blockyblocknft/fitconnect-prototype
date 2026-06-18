import { describe, it, expect } from 'vitest'
import { capacityFill, isNearlyFull, caloriesRemaining } from './format'

describe('capacityFill', () => {
  it('returns a clamped 0..100 percentage', () => {
    expect(capacityFill(18, 30)).toBe(60)
    expect(capacityFill(0, 30)).toBe(0)
    expect(capacityFill(40, 30)).toBe(100)
  })
})

describe('isNearlyFull', () => {
  it('is true at or above 85% capacity', () => {
    expect(isNearlyFull(14, 15)).toBe(true)
    expect(isNearlyFull(18, 30)).toBe(false)
  })
})

describe('caloriesRemaining', () => {
  it('never goes negative', () => {
    expect(caloriesRemaining(320, 500)).toBe(180)
    expect(caloriesRemaining(600, 500)).toBe(0)
  })
})
