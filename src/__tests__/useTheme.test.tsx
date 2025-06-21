import { renderHook, act } from '@testing-library/react'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { useTheme } from '../hooks/useTheme'

describe('useTheme hook', () => {
  beforeEach(() => {
    localStorage.clear()
    document.documentElement.className = ''
    // stub matchMedia
    ;(window as any).matchMedia = vi.fn().mockReturnValue({ matches: false, addEventListener: vi.fn(), removeEventListener: vi.fn() })
  })

  it('defaults to light when no saved preference', () => {
    const { result } = renderHook(() => useTheme())
    expect(result.current.theme).toBe('light')
  })

  it('reads saved theme and toggles correctly', () => {
    localStorage.setItem('theme', 'dark')
    const { result } = renderHook(() => useTheme())
    expect(result.current.theme).toBe('dark')
    act(() => {
      result.current.toggleTheme()
    })
    expect(result.current.theme).toBe('light')
    expect(localStorage.getItem('theme')).toBe('light')
    expect(document.documentElement.classList.contains('dark')).toBe(false)
  })
})
