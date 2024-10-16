import { GlassesIcon } from "lucide-react"

export const Logo = () => (
  <a
    href="/"
    className="flex items-center text-primary group hover:scale-105 transition"
  >
    <h1 className="flex items-center gap-1.5">
      <GlassesIcon
        strokeWidth={2.2}
        className="w-6 h-6 group-hover:-rotate-12 transition"
      />
      <span className="text-xl font-logo">Pentametro</span>
    </h1>
  </a>
)
