import React from 'react';
import { Check } from 'lucide-react';

export interface Step {
  id: string;
  label: string;
  description?: string;
}

interface StepperProps {
  steps: Step[];
  currentStep: number;
  onStepClick?: (stepIndex: number) => void;
  allowClickPrevious?: boolean;
}

export const Stepper: React.FC<StepperProps> = ({
  steps,
  currentStep,
  onStepClick,
  allowClickPrevious = false,
}) => {
  const handleStepClick = (index: number) => {
    if (!onStepClick) return;
    
    // Allow click only on previous steps if allowClickPrevious is true
    if (allowClickPrevious && index < currentStep) {
      onStepClick(index);
    }
  };

  return (
    <div className="w-full">
      {/* Desktop Stepper */}
      <div className="hidden md:flex items-center justify-between">
        {steps.map((step, index) => {
          const isCompleted = index < currentStep;
          const isCurrent = index === currentStep;
          const isClickable = allowClickPrevious && index < currentStep;

          return (
            <React.Fragment key={step.id}>
              {/* Step */}
              <div className="flex flex-col items-center relative flex-1">
                <button
                  onClick={() => handleStepClick(index)}
                  disabled={!isClickable}
                  className={`flex items-center justify-center w-12 h-12 rounded-full font-bold text-lg mb-2 transition-all ${
                    isCompleted
                      ? 'bg-success-600 text-white shadow-lg'
                      : isCurrent
                      ? 'bg-primary-600 text-white shadow-xl scale-110'
                      : 'bg-gray-200 text-gray-500'
                  } ${isClickable ? 'cursor-pointer hover:scale-110' : 'cursor-default'}`}
                >
                  {isCompleted ? (
                    <Check className="w-6 h-6" />
                  ) : (
                    <span>{index + 1}</span>
                  )}
                </button>

                <div className="text-center">
                  <p
                    className={`font-semibold text-sm mb-1 ${
                      isCurrent ? 'text-primary-700' : isCompleted ? 'text-success-700' : 'text-gray-500'
                    }`}
                  >
                    {step.label}
                  </p>
                  {step.description && (
                    <p className="text-xs text-gray-500 max-w-[120px]">
                      {step.description}
                    </p>
                  )}
                </div>
              </div>

              {/* Connector Line */}
              {index < steps.length - 1 && (
                <div className="flex-1 px-4 pt-6 -mt-6">
                  <div
                    className={`h-1 rounded-full transition-all ${
                      index < currentStep ? 'bg-success-600' : 'bg-gray-200'
                    }`}
                  />
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>

      {/* Mobile Stepper - Compact */}
      <div className="md:hidden">
        <div className="flex items-center justify-center mb-4">
          <div className="flex items-center space-x-2">
            {steps.map((step, index) => {
              const isCompleted = index < currentStep;
              const isCurrent = index === currentStep;

              return (
                <React.Fragment key={step.id}>
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-all ${
                      isCompleted
                        ? 'bg-success-600 text-white'
                        : isCurrent
                        ? 'bg-primary-600 text-white scale-110'
                        : 'bg-gray-200 text-gray-500'
                    }`}
                  >
                    {isCompleted ? (
                      <Check className="w-4 h-4" />
                    ) : (
                      <span>{index + 1}</span>
                    )}
                  </div>

                  {index < steps.length - 1 && (
                    <div
                      className={`w-8 h-0.5 transition-all ${
                        index < currentStep ? 'bg-success-600' : 'bg-gray-200'
                      }`}
                    />
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>

        {/* Current Step Info */}
        <div className="text-center">
          <p className="font-bold text-primary-700 mb-1">
            {steps[currentStep].label}
          </p>
          {steps[currentStep].description && (
            <p className="text-xs text-gray-600">
              {steps[currentStep].description}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

