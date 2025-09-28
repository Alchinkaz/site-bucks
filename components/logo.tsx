export default function Logo({
  className = "h-10 w-auto max-w-none",
}: {
  className?: string
}) {
  return (
    <img 
      src="https://alchinkaz.github.io/db-bucks/imgs/bucks-logo.svg" 
      alt="Bucks Logo" 
      className={className}
    />
  )
}
