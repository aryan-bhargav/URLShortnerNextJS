import React from 'react'
import GlassCard from './glass-card';

const StatCard = ({ title, value, }: { title: string; value: number; }) => {
    return (
        <GlassCard>
            <p className="text-sm text-gray-400">{title}</p>
            <p className="text-4xl font-semibold mt-2">
                {value}
            </p>
        </GlassCard>
    )
}

export default StatCard;
