import { useMemo } from 'react'
import './BirthdayCelebration.css'

const CONFETTI_COLORS = ['#c1502e', '#2f6690', '#e2c044', '#4caf50', '#e2795a', '#6fb3d9']

interface ConfettiPiece {
  left: number
  duration: number
  delay: number
  color: string
  width: number
  height: number
  rotate: number
}

function useConfettiPieces(count: number): ConfettiPiece[] {
  return useMemo(
    () =>
      Array.from({ length: count }, () => ({
        left: Math.random() * 100,
        duration: 2.6 + Math.random() * 2.6,
        delay: Math.random() * -4,
        color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
        width: 6 + Math.random() * 6,
        height: 10 + Math.random() * 8,
        rotate: Math.random() * 360,
      })),
    [count],
  )
}

export function BirthdayCelebration({ onContinue }: { onContinue: () => void }) {
  const pieces = useConfettiPieces(70)

  return (
    <div className="birthday-screen">
      <div className="confetti-layer" aria-hidden="true">
        {pieces.map((p, i) => (
          <span
            key={i}
            className="confetti-piece"
            style={{
              left: `${p.left}%`,
              width: `${p.width}px`,
              height: `${p.height}px`,
              background: p.color,
              animationDuration: `${p.duration}s`,
              animationDelay: `${p.delay}s`,
              transform: `rotate(${p.rotate}deg)`,
            }}
          />
        ))}
      </div>

      <div className="birthday-card">
        <div className="birthday-emoji">🎉🎂🏍️</div>
        <h1>Herzlichen Glückwunsch!</h1>
        <p>
          Zum Geburtstag gibt's kein Geschenkpapier, sondern eine ganze Tour:
          Dänemark und Norwegen, mit Fjorden, Pässen und Küstenstraßen. Lass
          uns die Route zusammen anschauen.
        </p>
        <button className="birthday-continue" onClick={onContinue}>
          Zur Tour →
        </button>
      </div>
    </div>
  )
}
