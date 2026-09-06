export function DemoModeBanner({ detail }: { detail?: string }) {
  return (
    <div
      role="status"
      className="mb-4 rounded-xl border border-amber-500/30 bg-amber-500/10 px-3.5 py-2.5 text-[13px] text-amber-100/90"
    >
      <p className="font-semibold text-amber-50">حالت دمو — داده ثابت</p>
      <p className="mt-0.5 text-[12px] text-amber-100/70">
        {detail ?? 'این صفحه نمایشی است و به سرور واقعی وصل نیست.'}
      </p>
    </div>
  )
}
