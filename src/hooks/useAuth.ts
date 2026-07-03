import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import type { PropsWithChildren } from 'react'
import { supabase } from '../lib/supabase'
import { mockProfile } from '../lib/mock-data'
import type { AuthIdentity } from '../types/app'

type Credentials = {
  email: string
  password: string
}

type SignUpPayload = Credentials & {
  fullName: string
}

type AuthContextValue = {
  user: AuthIdentity | null
  loading: boolean
  isAuthenticated: boolean
  signIn: (credentials: Credentials) => Promise<{ user: AuthIdentity | null }>
  signUp: (payload: SignUpPayload) => Promise<{ user: AuthIdentity | null }>
  signOut: () => Promise<void>
  updateProfile: (nextProfile: Partial<Pick<AuthIdentity, 'fullName' | 'phone' | 'avatarUrl'>>) => Promise<AuthIdentity>
}

const AuthContext = createContext<AuthContextValue | null>(null)
const storageKey = 'bgv-demo-profile'

function readLocalProfile(): AuthIdentity | null {
  if (typeof window === 'undefined') {
    return null
  }

  const stored = window.localStorage.getItem(storageKey)
  if (!stored) {
    return null
  }

  try {
    return JSON.parse(stored) as AuthIdentity
  } catch {
    return null
  }
}

function persistLocalProfile(profile: AuthIdentity | null) {
  if (typeof window === 'undefined') {
    return
  }

  if (!profile) {
    window.localStorage.removeItem(storageKey)
    return
  }

  window.localStorage.setItem(storageKey, JSON.stringify(profile))
}

export function AuthProvider({ children }: PropsWithChildren) {
  const [user, setUser] = useState<AuthIdentity | null>(readLocalProfile())
  const [loading, setLoading] = useState(Boolean(supabase))

  useEffect(() => {
    let mounted = true

    const bootstrap = async () => {
      if (!supabase) {
        if (mounted) {
          setLoading(false)
        }
        return
      }

      const sessionResult = await supabase.auth.getSession()
      const authUser = sessionResult.data.session?.user ?? null

      if (mounted && authUser) {
        setUser({
          id: authUser.id,
          email: authUser.email ?? '',
          fullName: (authUser.user_metadata.full_name as string) ?? authUser.email ?? '',
          phone: (authUser.user_metadata.phone as string) ?? '',
          avatarUrl: (authUser.user_metadata.avatar_url as string) ?? '',
          role: (authUser.user_metadata.role as 'reader' | 'librarian') ?? 'reader',
        })
      }

      if (mounted) {
        setLoading(false)
      }
    }

    void bootstrap()

    if (!supabase) {
      return () => {
        mounted = false
      }
    }

    const { data } = supabase.auth.onAuthStateChange(async (_event, session) => {
      const authUser = session?.user ?? null

      if (!mounted) {
        return
      }

      if (!authUser) {
        setUser(null)
        return
      }

      setUser({
        id: authUser.id,
        email: authUser.email ?? '',
        fullName: (authUser.user_metadata.full_name as string) ?? authUser.email ?? '',
        phone: (authUser.user_metadata.phone as string) ?? '',
        avatarUrl: (authUser.user_metadata.avatar_url as string) ?? '',
        role: (authUser.user_metadata.role as 'reader' | 'librarian') ?? 'reader',
      })
    })

    return () => {
      mounted = false
      data.subscription.unsubscribe()
    }
  }, [])

  const signIn = async ({ email, password }: Credentials) => {
    if (!supabase) {
      const demoProfile = { ...mockProfile, email, isDemo: true }
      setUser(demoProfile)
      persistLocalProfile(demoProfile)
      return { user: demoProfile }
    }

    const result = await supabase.auth.signInWithPassword({ email, password })

    if (result.error) {
      throw new Error(result.error.message)
    }

    return {
      user: result.data.user
        ? {
            id: result.data.user.id,
            email: result.data.user.email ?? '',
            fullName: (result.data.user.user_metadata.full_name as string) ?? result.data.user.email ?? '',
            phone: (result.data.user.user_metadata.phone as string) ?? '',
            avatarUrl: (result.data.user.user_metadata.avatar_url as string) ?? '',
            role: (result.data.user.user_metadata.role as 'reader' | 'librarian') ?? 'reader',
          }
        : null,
    }
  }

  const signUp = async ({ email, password, fullName }: SignUpPayload) => {
    if (!supabase) {
      const demoProfile: AuthIdentity = {
        ...mockProfile,
        email,
        fullName,
        isDemo: true,
      }
      setUser(demoProfile)
      persistLocalProfile(demoProfile)
      return { user: demoProfile }
    }

    const result = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
      },
    })

    if (result.error) {
      throw new Error(result.error.message)
    }

    return {
      user: result.data.user
        ? {
            id: result.data.user.id,
            email: result.data.user.email ?? '',
            fullName: (result.data.user.user_metadata.full_name as string) ?? result.data.user.email ?? '',
            phone: (result.data.user.user_metadata.phone as string) ?? '',
            avatarUrl: (result.data.user.user_metadata.avatar_url as string) ?? '',
            role: (result.data.user.user_metadata.role as 'reader' | 'librarian') ?? 'reader',
          }
        : null,
    }
  }

  const signOut = async () => {
    if (!supabase) {
      setUser(null)
      persistLocalProfile(null)
      return
    }

    const result = await supabase.auth.signOut()
    if (result.error) {
      throw new Error(result.error.message)
    }
    setUser(null)
  }

  const updateProfile = async (nextProfile: Partial<Pick<AuthIdentity, 'fullName' | 'phone' | 'avatarUrl'>>) => {
    if (!user) {
      throw new Error('Você precisa estar autenticado.')
    }

    if (!supabase || user.isDemo) {
      const updatedUser = {
        ...user,
        ...nextProfile,
      }
      setUser(updatedUser)
      persistLocalProfile(updatedUser)
      return updatedUser
    }

    const result = await supabase
      .from('profiles')
      .update({
        full_name: nextProfile.fullName ?? user.fullName,
        phone: nextProfile.phone ?? user.phone,
        avatar_url: nextProfile.avatarUrl ?? user.avatarUrl,
      })
      .eq('id', user.id)
      .select('*')
      .single()

    if (result.error) {
      throw new Error(result.error.message)
    }

    const updatedUser: AuthIdentity = {
      ...user,
      fullName: result.data.full_name,
      phone: result.data.phone,
      avatarUrl: result.data.avatar_url ?? '',
      role: result.data.role,
    }
    setUser(updatedUser)
    return updatedUser
  }

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      loading,
      isAuthenticated: Boolean(user),
      signIn,
      signUp,
      signOut,
      updateProfile,
    }),
    [loading, user],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }

  return context
}

