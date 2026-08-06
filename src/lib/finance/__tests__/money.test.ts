import { describe, it, expect } from 'vitest'
import { formatCurrency, toCents, toReais, sumCents } from '../money'

// pt-BR Intl uses non-breaking space ( ) between currency symbol and number
const NBSP = ' '

describe('money', () => {
  describe('formatCurrency', () => {
    it('formats zero', () => {
      expect(formatCurrency(0)).toBe(`R$${NBSP}0,00`)
    })

    it('formats reais with cents', () => {
      expect(formatCurrency(35075)).toBe(`R$${NBSP}350,75`)
    })

    it('formats negative values', () => {
      expect(formatCurrency(-5000)).toBe(`-R$${NBSP}50,00`)
    })

    it('formats large values', () => {
      expect(formatCurrency(123456789)).toBe(`R$${NBSP}1.234.567,89`)
    })
  })

  describe('toCents', () => {
    it('converts reais to cents', () => {
      expect(toCents(350.75)).toBe(35075)
    })

    it('handles zero', () => {
      expect(toCents(0)).toBe(0)
    })

    it('rounds correctly', () => {
      expect(toCents(99.999)).toBe(10000)
    })
  })

  describe('toReais', () => {
    it('converts cents to reais', () => {
      expect(toReais(35075)).toBe(350.75)
    })
  })

  describe('sumCents', () => {
    it('sums an array', () => {
      expect(sumCents([100, 200, 300])).toBe(600)
    })

    it('returns 0 for empty array', () => {
      expect(sumCents([])).toBe(0)
    })
  })
})
