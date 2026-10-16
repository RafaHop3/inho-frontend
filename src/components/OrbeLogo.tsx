'use client';

import React from 'react';

export default function OrbeLogo({ className = '', variant = 'header' }: { className?: string, variant?: 'header' | 'giant' }) {
    const isGiant = variant === 'giant';

    return (
        <svg
            viewBox="0 0 100 100"
            fill="none"
            className={`${className} overflow-visible`}
            xmlns="http://www.w3.org/2000/svg"
        >
            <defs>
                <filter id="glow-gold" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur stdDeviation="3" result="blur" />
                    <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
                </filter>
                <filter id="glow-green" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur stdDeviation="3" result="blur" />
                    <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
                </filter>
                <filter id="glow-blue" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur stdDeviation="3" result="blur" />
                    <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
                </filter>

                <linearGradient id="grad-gold" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#f5a623" />
                    <stop offset="100%" stopColor="#b7791f" />
                </linearGradient>
            </defs>

            {/* Core Golden Globe (Central Orbe) */}
            <circle cx="50" cy="50" r="14" fill="url(#grad-gold)" filter="url(#glow-gold)" className="animate-pulse" />
            <circle cx="50" cy="50" r="14" fill="none" stroke="#fff" strokeWidth="0.5" opacity="0.6" strokeDasharray="2 4" className="animate-spin-slow" />

            {/* Atomic Orbits */}
            {/* Green Orbit (Impact/Growth) */}
            <ellipse
                cx="50" cy="50" rx="42" ry="12"
                stroke="#10b981" strokeWidth={isGiant ? "1" : "1.5"}
                transform="rotate(-30 50 50)"
                className="animate-spin-slow origin-center"
                filter="url(#glow-green)"
                opacity="0.8"
                style={{ animationDirection: 'reverse', animationDuration: '8s' }}
                strokeDasharray="40 10 5 10"
            />
            {/* Electron on Green Orbit */}
            <circle cx="10" cy="50" r="2.5" fill="#10b981" filter="url(#glow-green)" transform="rotate(-30 50 50)">
                <animateTransform attributeName="transform" type="rotate" from="0 50 50" to="-360 50 50" dur="4s" repeatCount="indefinite" />
            </circle>

            {/* Blue Orbit (Tech/Security) */}
            <ellipse
                cx="50" cy="50" rx="42" ry="12"
                stroke="#0ea5e9" strokeWidth={isGiant ? "1" : "1.5"}
                transform="rotate(30 50 50)"
                className="origin-center"
                filter="url(#glow-blue)"
                opacity="0.8"
                strokeDasharray="60 15"
            >
                <animateTransform attributeName="transform" type="rotate" from="30 50 50" to="390 50 50" dur="12s" repeatCount="indefinite" />
            </ellipse>
            <circle cx="90" cy="50" r="2.5" fill="#0ea5e9" filter="url(#glow-blue)" transform="rotate(30 50 50)">
                <animateTransform attributeName="transform" type="rotate" from="0 50 50" to="360 50 50" dur="3s" repeatCount="indefinite" />
            </circle>

            {/* Gold Orbit (Finance) */}
            <ellipse
                cx="50" cy="50" rx="42" ry="12"
                stroke="#fcd34d" strokeWidth={isGiant ? "1" : "1.5"}
                transform="rotate(90 50 50)"
                className="origin-center"
                filter="url(#glow-gold)"
                opacity="0.6"
                strokeDasharray="20 5"
            >
                <animateTransform attributeName="transform" type="rotate" from="90 50 50" to="-270 50 50" dur="15s" repeatCount="indefinite" />
            </ellipse>
        </svg>
    );
}
