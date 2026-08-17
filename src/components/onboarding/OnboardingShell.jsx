// Shared full-bleed photo backdrop for every onboarding screen. Centralizing
// it here is what guarantees the background actually changes step to step
// instead of a form silently falling back to a bare white page.
export default function OnboardingShell({ image, maxWidth = 460, children }) {
  return (
    <div className="relative min-h-[100dvh] flex items-center justify-center safe-x py-10 overflow-hidden">
      <img key={image} src={image} alt="" className="absolute inset-0 w-full h-full object-cover sa-animate" />
      <div
        className="absolute inset-0"
        style={{ background: "linear-gradient(180deg, rgba(11,43,43,0.82) 0%, rgba(11,43,43,0.68) 45%, rgba(11,61,92,0.86) 100%)" }}
      />
      <div className="relative w-full" style={{ maxWidth }}>
        {children}
      </div>
    </div>
  );
}
