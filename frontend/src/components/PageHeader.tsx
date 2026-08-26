export default function PageHeader({
  eyebrow,
  title,
  desc,
}: {
  eyebrow: string
  title: string
  desc?: string
}) {
  return (
    <header className="hairline-b pb-6">
      <p className="eyebrow">{eyebrow}</p>
      <h1 className="mt-2 text-[26px] font-semibold tracking-tight text-paper md:text-3xl">{title}</h1>
      {desc && <p className="mt-2 max-w-2xl text-sm leading-relaxed text-mist">{desc}</p>}
    </header>
  )
}