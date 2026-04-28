import * as React from "react"

export function BodyAnatomySvg({ className, activePart = "" }: { className?: string; activePart?: string }) {
  return (
    <svg viewBox="0 0 400 500" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      {/* Background Grid */}
      <rect width="400" height="500" fill="url(#grid)" />
      <defs>
        <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
          <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeOpacity="0.05" strokeWidth="1"/>
        </pattern>
      </defs>

      {/* Abstract Body Outline */}
      <g stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
        {/* Head */}
        <circle cx="200" cy="80" r="30" className="transition-all duration-300 hover:fill-primary/20" />
        {/* Shoulders & Torso */}
        <path d="M 140 140 C 140 120, 260 120, 260 140 L 250 250 L 150 250 Z" 
              className={`transition-all duration-300 hover:fill-primary/20 ${activePart === 'chest' ? 'fill-primary/30 stroke-primary' : ''}`} />
        {/* Left Arm (Bicep/Tricep) */}
        <path d="M 140 140 L 100 200 L 110 250" 
              className={`transition-all duration-300 hover:stroke-primary ${activePart === 'arms' ? 'stroke-primary drop-shadow-[0_0_8px_rgba(139,92,246,0.5)]' : ''}`} />
        {/* Right Arm */}
        <path d="M 260 140 L 300 200 L 290 250" 
              className={`transition-all duration-300 hover:stroke-primary ${activePart === 'arms' ? 'stroke-primary drop-shadow-[0_0_8px_rgba(139,92,246,0.5)]' : ''}`} />
        {/* Core/Abs */}
        <rect x="160" y="250" width="80" height="60" rx="10" 
              className={`transition-all duration-300 hover:fill-primary/20 ${activePart === 'core' ? 'fill-primary/30 stroke-primary' : ''}`} />
        {/* Left Leg */}
        <path d="M 160 310 L 140 420 L 160 480" 
              className={`transition-all duration-300 hover:stroke-primary ${activePart === 'legs' ? 'stroke-primary drop-shadow-[0_0_8px_rgba(139,92,246,0.5)]' : ''}`} />
        {/* Right Leg */}
        <path d="M 240 310 L 260 420 L 240 480" 
              className={`transition-all duration-300 hover:stroke-primary ${activePart === 'legs' ? 'stroke-primary drop-shadow-[0_0_8px_rgba(139,92,246,0.5)]' : ''}`} />
      </g>
    </svg>
  )
}

export function TreadmillSvg({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <path d="M40 160 L160 160 L180 180 L20 180 Z" fill="currentColor" fillOpacity="0.1" stroke="currentColor" strokeWidth="4" strokeLinejoin="round"/>
      <path d="M60 160 L80 60 L120 60" stroke="currentColor" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round"/>
      <rect x="110" y="40" width="30" height="40" rx="5" fill="currentColor" fillOpacity="0.2" stroke="currentColor" strokeWidth="4"/>
      <circle cx="160" cy="170" r="10" fill="currentColor" />
      <circle cx="40" cy="170" r="10" fill="currentColor" />
    </svg>
  )
}

export function SquatRackSvg({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <rect x="40" y="20" width="10" height="160" fill="currentColor" fillOpacity="0.8"/>
      <rect x="150" y="20" width="10" height="160" fill="currentColor" fillOpacity="0.8"/>
      <path d="M20 180 L180 180" stroke="currentColor" strokeWidth="8" strokeLinecap="round"/>
      <path d="M40 60 L60 60" stroke="currentColor" strokeWidth="6" strokeLinecap="round"/>
      <path d="M150 60 L130 60" stroke="currentColor" strokeWidth="6" strokeLinecap="round"/>
      <rect x="20" y="55" width="160" height="10" fill="currentColor" />
      <circle cx="15" cy="60" r="15" fill="currentColor" fillOpacity="0.5" stroke="currentColor" strokeWidth="4"/>
      <circle cx="185" cy="60" r="15" fill="currentColor" fillOpacity="0.5" stroke="currentColor" strokeWidth="4"/>
    </svg>
  )
}

export function BenchPressSvg({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <rect x="50" y="100" width="100" height="20" rx="4" fill="currentColor" fillOpacity="0.2" stroke="currentColor" strokeWidth="4"/>
      <path d="M70 120 L70 180" stroke="currentColor" strokeWidth="6" strokeLinecap="round"/>
      <path d="M130 120 L130 180" stroke="currentColor" strokeWidth="6" strokeLinecap="round"/>
      <path d="M50 180 L150 180" stroke="currentColor" strokeWidth="4" strokeLinecap="round"/>
      
      <rect x="30" y="40" width="10" height="60" fill="currentColor" />
      <rect x="160" y="40" width="10" height="60" fill="currentColor" />
      <rect x="10" y="35" width="180" height="10" fill="currentColor" />
      <circle cx="20" cy="40" r="20" fill="currentColor" fillOpacity="0.5" stroke="currentColor" strokeWidth="4"/>
      <circle cx="180" cy="40" r="20" fill="currentColor" fillOpacity="0.5" stroke="currentColor" strokeWidth="4"/>
    </svg>
  )
}

export function LatPulldownSvg({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <rect x="90" y="20" width="20" height="160" fill="currentColor" fillOpacity="0.8"/>
      <path d="M60 180 L140 180" stroke="currentColor" strokeWidth="8" strokeLinecap="round"/>
      <path d="M90 20 L140 20 L140 80" stroke="currentColor" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round"/>
      <rect x="125" y="80" width="30" height="10" rx="5" fill="currentColor" />
      <path d="M140 80 L140 120" stroke="currentColor" strokeWidth="2" strokeDasharray="4 4"/>
      <path d="M100 120 L180 120" stroke="currentColor" strokeWidth="8" strokeLinecap="round"/>
      <rect x="70" y="100" width="40" height="40" rx="4" fill="currentColor" fillOpacity="0.2" stroke="currentColor" strokeWidth="4"/>
    </svg>
  )
}
