import { redirect } from 'next/navigation'

/** Legacy route — also redirected in next.config.mjs */
export default function WatchPartyRedirect() {
  redirect('/forum')
}
