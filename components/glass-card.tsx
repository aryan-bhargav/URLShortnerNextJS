import React from 'react'

const GlassCard = ({ children, className = "", }: { children: React.ReactNode; className?: string; }) => {
    return (
        <div
            className={`glass rounded-2xl p-5 ${className}`}
        >
            {children}
        </div>
    )
}

export default GlassCard;
