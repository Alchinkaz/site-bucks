export default function Logo({
  className = "h-10 w-auto max-w-none",
}: {
  className?: string
}) {
  return (
    <img 
      src="/bucks-logo.svg" 
      alt="Bucks Logo" 
      className={className}
    />
  )
}
