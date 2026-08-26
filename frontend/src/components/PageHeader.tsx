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
    <header className="pb-6">
      <p className="eyebrow">{eyebrow}</p>
      <h1 className="mt-2 font-display text-3xl font-bold tracking-tight text-paper md:text-4xl">{title}</h1>
      {desc && <p className="mt-3 max-w-2xl text-[15px] text-mist">{desc}</p>}
    </header>
  )
}