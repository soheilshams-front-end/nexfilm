'use client'

import type { PaidPlanId, PlanId } from '@/lib/subscription-plans'
import { getPaidPlan } from '@/lib/subscription-plans'

export type ListCategory = 'movies' | 'series' | 'watchLater'

export type Profile = {
  id: string
  name: string
  avatar: string
  isKids?: boolean
}

export type ContinueItem = {
  movieId: string
  progress: number
  updatedAt: number
  seasonId?: number
  episodeId?: number
  seconds?: number
}

export type HistoryItem = {
  movieId: string
  watchedAt: number
  seasonId?: number
  episodeId?: number
  progress: number
}

export type SubscriptionStatus = 'free' | 'active' | 'canceled'

export type SubscriptionState = {
  planId: PlanId
  status: SubscriptionStatus
  renewsAt: string | null
  activatedAt: string | null
}

export type UserState = {
  loggedIn: boolean
  accountEmail: string | null
  activeProfileId: string
  profiles: Profile[]
  myList: Record<string, string[]>
  likes: Record<string, string[]>
  dislikes: Record<string, string[]>
  continueWatching: Record<string, ContinueItem[]>
  watchHistory: Record<string, HistoryItem[]>
  subscription: SubscriptionState
}

export const MAX_PROFILES = 4

const KEY = 'nextfilm-user-state'
const AVATARS = [
  'https://ui-avatars.com/api/?name=S&background=1DD66F&color=0a0a0a&size=128',
  'https://ui-avatars.com/api/?name=F&background=3b82f6&color=fff&size=128',
  'https://ui-avatars.com/api/?name=K&background=f59e0b&color=0a0a0a&size=128',
  'https://ui-avatars.com/api/?name=N&background=a855f7&color=fff&size=128',
]

export function getProfileAvatarOptions(): string[] {
  return AVATARS
}

const defaultProfiles: Profile[] = [
  { id: 'soheil', name: 'سهیل', avatar: AVATARS[0] },
  { id: 'family', name: 'خانواده', avatar: AVATARS[1] },
  { id: 'kids', name: 'کودک', avatar: AVATARS[2], isKids: true },
]

function emptyPerProfile<T>(value: T): Record<string, T> {
  const out: Record<string, T> = {}
  for (const p of defaultProfiles) out[p.id] = value
  return out
}

function defaultSubscription(): SubscriptionState {
  return {
    planId: 'free',
    status: 'free',
    renewsAt: null,
    activatedAt: null,
  }
}

function defaultState(): UserState {
  return {
    loggedIn: false,
    accountEmail: null,
    activeProfileId: 'soheil',
    profiles: defaultProfiles,
    myList: emptyPerProfile([] as string[]),
    likes: emptyPerProfile([] as string[]),
    dislikes: emptyPerProfile([] as string[]),
    continueWatching: {
      soheil: [],
      family: [],
      kids: [],
    },
    watchHistory: emptyPerProfile([] as HistoryItem[]),
    subscription: defaultSubscription(),
  }
}

function addMonths(date: Date, months: number): Date {
  const d = new Date(date)
  d.setMonth(d.getMonth() + months)
  return d
}

function ensureProfileBuckets(s: UserState, profileId: string) {
  if (!s.myList[profileId]) s.myList[profileId] = []
  if (!s.likes[profileId]) s.likes[profileId] = []
  if (!s.dislikes[profileId]) s.dislikes[profileId] = []
  if (!s.continueWatching[profileId]) s.continueWatching[profileId] = []
  if (!s.watchHistory[profileId]) s.watchHistory[profileId] = []
}

export function loadUserState(): UserState {
  if (typeof window === 'undefined') return defaultState()
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return defaultState()
    const parsed = JSON.parse(raw) as Partial<UserState>
    const base = defaultState()
    return {
      ...base,
      ...parsed,
      // Guest by default when migrating old state without loggedIn
      loggedIn: parsed.loggedIn === true,
      accountEmail: parsed.accountEmail ?? null,
      subscription: { ...defaultSubscription(), ...parsed.subscription },
      profiles: parsed.profiles?.length ? parsed.profiles : base.profiles,
    }
  } catch {
    return defaultState()
  }
}

export function saveUserState(state: UserState) {
  if (typeof window === 'undefined') return
  localStorage.setItem(KEY, JSON.stringify(state))
}

export function isLoggedIn(): boolean {
  return loadUserState().loggedIn === true
}

export function login(email: string): void {
  const s = loadUserState()
  s.loggedIn = true
  s.accountEmail = email.trim() || s.accountEmail
  saveUserState(s)
}

export function signup(email: string, displayName?: string): void {
  const s = loadUserState()
  s.loggedIn = true
  s.accountEmail = email.trim() || null
  if (displayName?.trim() && s.profiles[0]) {
    s.profiles[0] = { ...s.profiles[0], name: displayName.trim() }
  }
  saveUserState(s)
}

export function logout(): void {
  const s = loadUserState()
  s.loggedIn = false
  saveUserState(s)
}

export function getAccountEmail(): string | null {
  return loadUserState().accountEmail
}

export function getProfiles(): Profile[] {
  return loadUserState().profiles
}

export function getActiveProfile(): Profile | undefined {
  const s = loadUserState()
  return s.profiles.find((p) => p.id === s.activeProfileId) ?? s.profiles[0]
}

export function getActiveProfileId(): string {
  return loadUserState().activeProfileId
}

export function setActiveProfile(id: string) {
  const s = loadUserState()
  if (!s.profiles.some((p) => p.id === id)) return
  s.activeProfileId = id
  saveUserState(s)
}

export function addProfile(name: string, isKids = false): Profile | null {
  const s = loadUserState()
  if (s.profiles.length >= MAX_PROFILES) return null
  const id = `p-${Date.now().toString(36)}`
  const profile: Profile = {
    id,
    name: name.trim() || 'پروفایل جدید',
    avatar: AVATARS[s.profiles.length % AVATARS.length],
    isKids: isKids || undefined,
  }
  s.profiles = [...s.profiles, profile]
  ensureProfileBuckets(s, id)
  saveUserState(s)
  return profile
}

export function renameProfile(id: string, name: string): boolean {
  const s = loadUserState()
  const idx = s.profiles.findIndex((p) => p.id === id)
  if (idx < 0) return false
  const trimmed = name.trim()
  if (!trimmed) return false
  s.profiles[idx] = { ...s.profiles[idx], name: trimmed }
  saveUserState(s)
  return true
}

export function removeProfile(id: string): boolean {
  const s = loadUserState()
  if (s.profiles.length <= 1) return false
  if (!s.profiles.some((p) => p.id === id)) return false
  s.profiles = s.profiles.filter((p) => p.id !== id)
  delete s.myList[id]
  delete s.likes[id]
  delete s.dislikes[id]
  delete s.continueWatching[id]
  delete s.watchHistory[id]
  if (s.activeProfileId === id) {
    s.activeProfileId = s.profiles[0].id
  }
  saveUserState(s)
  return true
}

export function toggleMyList(movieId: string, _category: ListCategory = 'movies'): boolean {
  const s = loadUserState()
  const pid = s.activeProfileId
  const list = s.myList[pid] ?? []
  const has = list.includes(movieId)
  s.myList[pid] = has ? list.filter((id) => id !== movieId) : [...list, movieId]
  saveUserState(s)
  return !has
}

export function isInMyList(movieId: string): boolean {
  const s = loadUserState()
  const list = s.myList[s.activeProfileId] ?? []
  return list.includes(movieId)
}

export function toggleLike(movieId: string): 'like' | 'none' {
  const s = loadUserState()
  const pid = s.activeProfileId
  const likes = s.likes[pid] ?? []
  const dislikes = s.dislikes[pid] ?? []
  if (likes.includes(movieId)) {
    s.likes[pid] = likes.filter((id) => id !== movieId)
    saveUserState(s)
    return 'none'
  }
  s.likes[pid] = [...likes, movieId]
  s.dislikes[pid] = dislikes.filter((id) => id !== movieId)
  saveUserState(s)
  return 'like'
}

export function toggleDislike(movieId: string): boolean {
  const s = loadUserState()
  const pid = s.activeProfileId
  const dislikes = s.dislikes[pid] ?? []
  const has = dislikes.includes(movieId)
  s.dislikes[pid] = has ? dislikes.filter((id) => id !== movieId) : [...dislikes, movieId]
  if (!has) {
    s.likes[pid] = (s.likes[pid] ?? []).filter((id) => id !== movieId)
  }
  saveUserState(s)
  return !has
}

export function updateContinueWatching(
  movieId: string,
  progress: number,
  meta?: { seasonId?: number; episodeId?: number; seconds?: number },
) {
  const s = loadUserState()
  const pid = s.activeProfileId
  const items = s.continueWatching[pid] ?? []
  const filtered = items.filter((i) => i.movieId !== movieId)
  const entry: ContinueItem = {
    movieId,
    progress: Math.round(progress),
    updatedAt: Date.now(),
    seasonId: meta?.seasonId,
    episodeId: meta?.episodeId,
    seconds: meta?.seconds,
  }
  if (progress >= 5 && progress < 95) {
    s.continueWatching[pid] = [entry, ...filtered].slice(0, 20)
  } else if (progress >= 95) {
    s.continueWatching[pid] = filtered
  } else {
    s.continueWatching[pid] = [entry, ...filtered].slice(0, 20)
  }

  if (progress >= 8) {
    const hist = (s.watchHistory[pid] ?? []).filter(
      (h) =>
        !(
          h.movieId === movieId &&
          h.seasonId === meta?.seasonId &&
          h.episodeId === meta?.episodeId
        ),
    )
    s.watchHistory[pid] = [
      {
        movieId,
        watchedAt: Date.now(),
        seasonId: meta?.seasonId,
        episodeId: meta?.episodeId,
        progress: Math.round(progress),
      },
      ...hist,
    ].slice(0, 50)
  }
  saveUserState(s)
}

export function getWatchHistory(): HistoryItem[] {
  const s = loadUserState()
  const raw = (s.watchHistory[s.activeProfileId] ?? []) as Array<HistoryItem | string>
  return raw
    .map((h) => {
      if (typeof h === 'string') {
        return { movieId: h, watchedAt: Date.now(), progress: 100 }
      }
      return h
    })
    .sort((a, b) => b.watchedAt - a.watchedAt)
}

export function clearWatchHistory() {
  const s = loadUserState()
  s.watchHistory[s.activeProfileId] = []
  saveUserState(s)
}

export function setProfileAvatar(id: string, avatar: string): boolean {
  const s = loadUserState()
  const idx = s.profiles.findIndex((p) => p.id === id)
  if (idx < 0) return false
  s.profiles[idx] = { ...s.profiles[idx], avatar }
  saveUserState(s)
  return true
}

export function isKidsProfileActive(): boolean {
  return Boolean(getActiveProfile()?.isKids)
}

export function getContinueWatching(): ContinueItem[] {
  const s = loadUserState()
  return s.continueWatching[s.activeProfileId] ?? []
}

export function removeContinueWatching(movieId: string) {
  const s = loadUserState()
  const pid = s.activeProfileId
  s.continueWatching[pid] = (s.continueWatching[pid] ?? []).filter((i) => i.movieId !== movieId)
  saveUserState(s)
}

export function clearContinueWatching() {
  const s = loadUserState()
  s.continueWatching[s.activeProfileId] = []
  saveUserState(s)
}

export function getMyListIds(): string[] {
  const s = loadUserState()
  return s.myList[s.activeProfileId] ?? []
}

export function getLikedIds(): string[] {
  const s = loadUserState()
  return s.likes[s.activeProfileId] ?? []
}

export function getSubscription(): SubscriptionState {
  return loadUserState().subscription
}

export function hasPremiumAccess(): boolean {
  const sub = getSubscription()
  if (sub.planId === 'free') return false
  if (sub.status !== 'active' && sub.status !== 'canceled') return false
  if (!sub.renewsAt) return sub.status === 'active'
  return new Date(sub.renewsAt).getTime() > Date.now()
}

export function activatePlan(planId: PaidPlanId): SubscriptionState {
  const plan = getPaidPlan(planId)
  if (!plan) return getSubscription()
  const now = new Date()
  const s = loadUserState()
  s.subscription = {
    planId,
    status: 'active',
    activatedAt: now.toISOString(),
    renewsAt: addMonths(now, plan.months).toISOString(),
  }
  saveUserState(s)
  return s.subscription
}

export function cancelSubscription(): SubscriptionState {
  const s = loadUserState()
  if (s.subscription.planId === 'free') return s.subscription
  const stillValid = s.subscription.renewsAt
    ? new Date(s.subscription.renewsAt).getTime() > Date.now()
    : s.subscription.status === 'active'
  if (!stillValid) {
    s.subscription = defaultSubscription()
    saveUserState(s)
    return s.subscription
  }
  s.subscription = {
    ...s.subscription,
    status: 'canceled',
  }
  saveUserState(s)
  return s.subscription
}

export function resetToFree(): SubscriptionState {
  const s = loadUserState()
  s.subscription = defaultSubscription()
  saveUserState(s)
  return s.subscription
}
