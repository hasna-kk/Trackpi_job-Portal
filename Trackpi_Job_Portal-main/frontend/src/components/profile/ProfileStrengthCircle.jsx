import React from 'react';

const ProfileStrengthCircle = ({ strength, className = "w-[240px] h-[240px]" }) => {
    // Radius 100, Stroke 24. 
    // Circumference = 2 * PI * 100 = 628.3
    const radius = 100;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference * (1 - strength / 100);

    return (
        <div className={`relative flex items-center justify-center ${className}`}>
            <svg className="w-full h-full transform -rotate-90 overflow-visible" viewBox="0 0 240 240">
                <defs>
                    <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#FF8601" />
                        <stop offset="39%" stopColor="#F7E56D" />
                        <stop offset="100%" stopColor="#FFB300" />
                    </linearGradient>
                    <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                        <feGaussianBlur stdDeviation="4" result="blur" />
                        <feComposite in="SourceGraphic" in2="blur" operator="over" />
                    </filter>
                </defs>

                {/* Track */}
                <circle
                    cx="120" cy="120" r={radius}
                    fill="none"
                    stroke="#5D5D5D"
                    strokeWidth="24"
                />

                {/* Progress */}
                <circle
                    cx="120" cy="120" r={radius}
                    fill="none"
                    stroke="url(#goldGradient)"
                    strokeWidth="24"
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    style={{
                        transition: 'stroke-dashoffset 0.5s ease-in-out',
                        filter: 'drop-shadow(0px 4px 6px rgba(255, 179, 0, 0.4))'
                    }}
                />
            </svg>

            {/* Inner Text */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-[14px] font-bold text-black mb-0">Profile Strength</span>
                <span className="text-[56px] font-bold bg-gradient-to-r from-[#FF8601] via-[#F7E56D] to-[#FFB300] bg-clip-text text-transparent leading-tight mt-[-2px]">
                    {strength}%
                </span>
            </div>
        </div>
    );
};

export default ProfileStrengthCircle;
