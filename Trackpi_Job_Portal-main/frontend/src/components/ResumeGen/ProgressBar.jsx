import React from 'react';
import { Check } from 'lucide-react';

const ProgressBar = ({ currentStep, steps }) => {
    return (
        <div className="w-full mb-12">
            <div className="flex items-center justify-between w-full px-4 md:px-12">
                {steps.map((step, index) => {
                    const stepNum = index + 1;
                    const isActive = stepNum === currentStep;
                    const isCompleted = stepNum < currentStep;

                    return (
                        <div key={index} className="flex flex-col items-center relative flex-1">

                            <div className="flex items-center w-full">
                                {/* Left Line */}
                                <div className={`h-[2px] w-full transition-all duration-300 ${index === 0 ? 'opacity-0' : ''} ${stepNum <= currentStep ? 'bg-[#D68F00]' : 'bg-gray-300'}`}></div>

                                {/* Circle */}
                                <div
                                    className={`w-12 h-12 rounded-full flex-shrink-0 flex items-center justify-center font-bold text-xl z-10 transition-all duration-300 border-[3px] shadow-sm
                      ${isActive || isCompleted ? 'bg-gradient-to-br from-[#FFC107] to-[#FF9800] border-transparent text-white shadow-[#FFB300]/50 shadow-lg' : 'bg-white border-gray-300 text-[#FF9800]'}
                    `}
                                >
                                    {isActive || isCompleted ? <Check size={24} strokeWidth={3} /> : stepNum}
                                </div>

                                {/* Right Line */}
                                <div className={`h-[2px] w-full transition-all duration-300 ${index === steps.length - 1 ? 'opacity-0' : ''} ${stepNum < currentStep ? 'bg-[#D68F00]' : 'bg-gray-300'}`}></div>
                            </div>

                        </div>
                    );
                })}
            </div>

            {/* Tab Navigation Below Stepper */}
            <div className="flex justify-between px-0 mt-8 border-b border-gray-200">
                {steps.map((step, index) => (
                    <div key={index} className={`pb-2 text-sm md:text-base font-semibold transition-colors cursor-default ${index + 1 === currentStep ? 'text-gray-900 border-b-2 border-gray-900' : 'text-gray-400'}`}>
                        {step}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ProgressBar;
