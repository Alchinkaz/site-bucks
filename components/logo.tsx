export default function Logo({
  className = "h-10 w-auto max-w-none",
}: {
  className?: string
}) {
  /* Inline-SVG prevents any network-fetch errors.
     Replace the simple placeholder below with the full corporate SVG when you’re ready. */
  return (
    <svg viewBox="0 0 32 32" role="img" aria-label="Orda Premium Burabay" className={className} fill="currentColor">
      <circle cx="16" cy="16" r="14" />
      <text x="50%" y="55%" textAnchor="middle" fontSize="9" fontFamily="sans-serif" fill="#fff">
        ORDA
      </text>
    </svg>
  )
}
