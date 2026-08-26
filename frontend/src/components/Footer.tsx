export default function Footer() {
  return (
    <footer className="mt-20 border-t border-line bg-panel">
      <div className="mx-auto grid max-w-7xl gap-6 px-4 py-8 sm:grid-cols-3">
        <div>
          <p className="flex items-center gap-2">
            <span className="flex h-5 w-5 items-center justify-center rounded bg-gold">
              <svg viewBox="0 0 24 24" className="h-3 w-3 text-white" fill="none" stroke="currentColor" strokeWidth="2.4">
                <path d="M12 2l8 3v6c0 5-3.5 8.5-8 11-4.5-2.5-8-6-8-11V5l8-3z" />
              </svg>
            </span>
            <span className="text-sm font-semibold text-paper">MuleShield</span>
          </p>
          <p className="mt-2 max-w-xs text-xs leading-relaxed text-faint">
            Explainable mule-account detection for Indian banking. Detection to STR filing in one system.
          </p>
        </div>
        <div className="text-xs text-mist sm:text-center">
          <p>CyberShield 2026 · Bank of India × IIT Hyderabad</p>
          <p className="mt-1 text-faint">Problem Statement 2 — Mule Account Classification</p>
        </div>
        <div className="sm:text-right">
          <p className="tick-mark text-xs text-mist">Rajkiya Engineering College, Kannauj</p>
          <p className="tick-mark mt-1 text-xs text-faint">AUC 0.991 · 9,082 accounts · 2,116 features</p>
        </div>
      </div>
    </footer>
  )
}