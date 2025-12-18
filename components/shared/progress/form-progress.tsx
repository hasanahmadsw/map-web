'use client';

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Progress } from '@/components/ui/progress';

interface FormProgressProps {
  currentStep: number;
  progress: number;
  steps: string[];
  onStepClick: (stepNumber: number) => void;
}

function FormProgress({ currentStep, progress, steps, onStepClick }: FormProgressProps) {
  const progressValue = currentStep === steps.length ? 100 : progress;

  return (
    <div className="mb-8">
      {/* Breadcrumb - Only show when currentStep > 1 */}
      {currentStep > 1 && (
        <div className="mb-6">
          <Breadcrumb>
            <BreadcrumbList>
              {steps
                .filter((_, index) => index + 1 <= currentStep)
                .map((step, index) => (
                  <div key={step} className="flex items-center">
                    {index > 0 && <BreadcrumbSeparator />}
                    <BreadcrumbItem>
                      {index + 1 === currentStep ? (
                        <BreadcrumbPage className="text-primary font-medium">{step}</BreadcrumbPage>
                      ) : (
                        <BreadcrumbLink onClick={() => onStepClick(index + 1)} className="cursor-pointer">
                          {step}
                        </BreadcrumbLink>
                      )}
                    </BreadcrumbItem>
                  </div>
                ))}
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      )}

      {/* Progress Details */}
      <div className="my-2 flex items-center justify-between">
        <p className="text-muted-foreground text-sm">{progressValue}% completed</p>
        <h3 className="text-foreground text-sm font-medium">
          Step {currentStep} of {steps.length}
        </h3>
      </div>

      {/* Progress Bar */}
      <div className="mt-2 mb-3">
        <Progress value={progressValue} className="h-2" />
      </div>
    </div>
  );
}

export default FormProgress;
