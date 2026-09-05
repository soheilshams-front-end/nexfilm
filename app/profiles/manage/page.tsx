'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Pencil, Plus, Trash2 } from 'lucide-react'
import { SiteNav } from '@/components/site-nav'
import { RequireAuth } from '@/components/require-auth'
import { Button } from '@/components/untitled/button'
import {
  MAX_PROFILES,
  addProfile,
  getProfiles,
  getProfileAvatarOptions,
  removeProfile,
  renameProfile,
  setProfileAvatar,
  type Profile,
} from '@/lib/user-store'
import { useToast } from '@/components/toast-provider'
import { cn } from '@/lib/utils'

export default function ManageProfilesPage() {
  return (
    <RequireAuth>
      <ManageProfilesContent />
    </RequireAuth>
  )
}

function ManageProfilesContent() {
  const toast = useToast()
  const [profiles, setProfiles] = useState<Profile[]>([])
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editName, setEditName] = useState('')
  const [newName, setNewName] = useState('')
  const [newKids, setNewKids] = useState(false)

  const refresh = () => setProfiles(getProfiles())

  useEffect(() => {
    refresh()
  }, [])

  const startEdit = (p: Profile) => {
    setEditingId(p.id)
    setEditName(p.name)
  }

  const saveEdit = () => {
    if (!editingId) return
    if (renameProfile(editingId, editName)) {
      toast('نام پروفایل به‌روز شد')
      setEditingId(null)
      refresh()
    }
  }

  const onAdd = () => {
    const created = addProfile(newName || 'پروفایل جدید', newKids)
    if (!created) {
      toast(`حداکثر ${MAX_PROFILES} پروفایل مجاز است`)
      return
    }
    toast('پروفایل اضافه شد')
    setNewName('')
    setNewKids(false)
    refresh()
  }

  const onRemove = (id: string) => {
    if (!removeProfile(id)) {
      toast('حداقل یک پروفایل باید باقی بماند')
      return
    }
    toast('پروفایل حذف شد')
    refresh()
  }

  return (
    <main className="min-h-screen bg-[var(--bg)] tabbar-pad">
      <SiteNav />
      <div className="mx-auto max-w-lg px-4 pt-28 text-center sm:px-6 md:pt-32">
        <h1 className="text-title-1 text-white">مدیریت پروفایل‌ها</h1>
        <p className="mt-2 text-[15px] text-[var(--fg-tertiary)]">
          تا {MAX_PROFILES} پروفایل — افزودن، تغییر نام و حذف
        </p>

        <ul className="mt-10 space-y-3 text-right">
          {profiles.map((p) => (
            <li
              key={p.id}
              className="flex items-center gap-3 rounded-xl bg-[var(--bg-secondary)] p-3 ring-1 ring-white/10"
            >
              <div className="flex flex-col items-center gap-2">
                <img src={p.avatar} alt="" className="size-11 rounded-[10px] object-cover" />
                <div className="flex gap-1">
                  {getProfileAvatarOptions().map((av) => (
                    <button
                      key={av}
                      type="button"
                      onClick={() => {
                        setProfileAvatar(p.id, av)
                        refresh()
                        toast('آواتار به‌روز شد')
                      }}
                      className={cn(
                        'size-5 overflow-hidden rounded-full ring-1 ring-white/20',
                        p.avatar === av && 'ring-2 ring-[var(--brand)]',
                      )}
                      aria-label="انتخاب آواتار"
                    >
                      <img src={av} alt="" className="size-full object-cover" />
                    </button>
                  ))}
                </div>
              </div>
              <div className="min-w-0 flex-1">
                {editingId === p.id ? (
                  <div className="flex gap-2">
                    <input
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className="h-9 w-full rounded-lg bg-[var(--bg)] px-3 text-sm text-white ring-1 ring-white/15 outline-none focus:ring-[var(--brand)]"
                      aria-label="نام پروفایل"
                    />
                    <Button size="sm" onPress={saveEdit}>
                      ذخیره
                    </Button>
                  </div>
                ) : (
                  <>
                    <p className="font-semibold text-white">{p.name}</p>
                    <p className="text-footnote text-[var(--fg-quaternary)]">
                      {p.isKids ? 'پروفایل کودک' : 'پروفایل بزرگسال'}
                    </p>
                  </>
                )}
              </div>
              {editingId !== p.id ? (
                <div className="flex gap-1">
                  <button
                    type="button"
                    onClick={() => startEdit(p)}
                    className="grid size-9 place-items-center rounded-lg text-white/60 hover:bg-white/10 hover:text-white"
                    aria-label="ویرایش نام"
                  >
                    <Pencil className="size-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => onRemove(p.id)}
                    className={cn(
                      'grid size-9 place-items-center rounded-lg text-white/60 hover:bg-white/10 hover:text-red-400',
                      profiles.length <= 1 && 'opacity-40',
                    )}
                    aria-label="حذف پروفایل"
                  >
                    <Trash2 className="size-4" />
                  </button>
                </div>
              ) : null}
            </li>
          ))}
        </ul>

        {profiles.length < MAX_PROFILES ? (
          <div className="mt-8 rounded-xl bg-[var(--bg-secondary)] p-4 text-right ring-1 ring-white/10">
            <p className="mb-3 text-sm font-semibold text-white">افزودن پروفایل</p>
            <input
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="نام پروفایل"
              className="h-10 w-full rounded-lg bg-[var(--bg)] px-3 text-sm text-white ring-1 ring-white/15 outline-none placeholder:text-white/35 focus:ring-[var(--brand)]"
            />
            <label className="mt-3 flex items-center gap-2 text-sm text-white/70">
              <input
                type="checkbox"
                checked={newKids}
                onChange={(e) => setNewKids(e.target.checked)}
                className="size-4 rounded border-white/20"
              />
              پروفایل کودک
            </label>
            <Button className="mt-4 w-full" onPress={onAdd}>
              <Plus className="size-4" />
              افزودن
            </Button>
          </div>
        ) : (
          <p className="mt-6 text-sm text-[var(--fg-quaternary)]">به سقف تعداد پروفایل رسیده‌اید.</p>
        )}

        <Button asChild variant="secondary" className="mt-8">
          <Link href="/profiles">بازگشت به انتخاب پروفایل</Link>
        </Button>
      </div>
    </main>
  )
}
