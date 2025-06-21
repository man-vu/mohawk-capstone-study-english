import { renderHook } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { useAuth } from '../hooks/useAuth'
import { AuthContext } from '../context/AuthContext'

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <AuthContext.Provider value={{ user: { name: 'Alice' } } as any}>
    {children}
  </AuthContext.Provider>
)

describe('useAuth hook', () => {
  it('throws when used outside provider', () => {
    expect(() => renderHook(() => useAuth())).toThrow('useAuth must be used')
  })

  it('returns context when inside provider', () => {
    const { result } = renderHook(() => useAuth(), { wrapper })
    expect(result.current.user.name).toBe('Alice')
  })
})
