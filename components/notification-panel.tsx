'use client'

import { Bell, Film, Tv } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

const notifications = [
  {
    id: '1',
    icon: Film,
    text: 'عنوان جدید به کتابخانه اضافه شد',
    time: '۲ ساعت پیش',
  },
  {
    id: '2',
    icon: Tv,
    text: 'قسمت جدید سریال مورد علاقه‌تان آماده است',
    time: 'دیروز',
  },
]

export function NotificationPanel({
  open,
  onClose,
}: {
  open: boolean
  onClose: () => void
}) {
  return (
    <>
      {open && (
        <button
          type="button"
          className="fixed inset-0 z-[60] bg-black/30"
          aria-label="بستن اعلان‌ها"
          onClick={onClose}
        />
      )}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.18 }}
              className="glass absolute left-2 top-full z-[70] mt-2 w-72 overflow-hidden rounded-[18px] sm:left-auto sm:right-0 sm:w-80"
          >
            <div className="flex items-center gap-2 border-b border-white/[0.06] px-4 py-3">
              <Bell className="size-4 text-white/50" />
              <span className="text-sm font-medium text-white">اعلان‌ها</span>
            </div>
            <ul className="max-h-72 overflow-y-auto">
              {notifications.map((n) => {
                const Icon = n.icon
                return (
                  <li
                    key={n.id}
                    className="flex gap-3 border-b border-white/[0.04] px-4 py-3 text-sm last:border-0 hover:bg-white/[0.03]"
                  >
                    <span className="mt-0.5 grid size-8 shrink-0 place-items-center rounded bg-white/8 text-white/60">
                      <Icon className="size-4" />
                    </span>
                    <div>
                      <p className="text-white/85">{n.text}</p>
                      <p className="mt-1 text-xs text-white/40">{n.time}</p>
                    </div>
                  </li>
                )
              })}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
