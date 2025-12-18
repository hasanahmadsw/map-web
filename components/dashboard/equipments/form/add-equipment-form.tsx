'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import { Form, FormProvider, type Resolver, useForm, useWatch } from 'react-hook-form';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import FormProgress from '@/components/shared/progress/form-progress';
import { LoadingButton } from '@/components/shared/buttons/loading-button';
import ResponseError from '@/components/shared/response-error';

import {
  createEquipmentSchema,
  type TCreateEquipmentForm,
} from '@/validations/equipments/create-equipment.schema';
import { useEquipmentMutations } from '@/hooks/api/equipments/mutations';
import { sanitizeDto } from '@/utils/format';
import { EquipmentType } from '@/types/equipments/equipment.enum';
import FormSkeleton from '@/components/shared/skeletons/form-skeleton';

// Dynamic Imports
const BasicInfoStep = dynamic(() => import('./steps/basic-info-step'), {
  ssr: false,
  loading: () => <FormSkeleton />,
});
const MediaStep = dynamic(() => import('./steps/media-step'), {
  ssr: false,
  loading: () => <FormSkeleton />,
});
const SpecificationsStep = dynamic(() => import('./steps/specifications-step'), {
  ssr: false,
  loading: () => <FormSkeleton />,
});

const STEP_COUNT = 3;
const STEP_PROGRESS = Math.round(100 / STEP_COUNT);

function AddEquipmentForm() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [progress, setProgress] = useState(STEP_PROGRESS);

  const { create } = useEquipmentMutations();

  const form = useForm<TCreateEquipmentForm>({
    resolver: zodResolver(createEquipmentSchema()) as Resolver<TCreateEquipmentForm>,
    defaultValues: {
      equipmentType: EquipmentType.CAMERA,
      isPublished: false,
      isFeatured: false,
      galleryPaths: [],
    },
  });

  const equipmentType = useWatch({ control: form.control, name: 'equipmentType' });

  // Update specs type when equipmentType changes
  useEffect(() => {
    const currentSpecs = form.getValues('specs');
    if (currentSpecs?.type !== equipmentType) {
      // Reset specs based on equipment type
      switch (equipmentType) {
        case EquipmentType.CAMERA:
          form.setValue('specs', {
            type: EquipmentType.CAMERA,
            sensor: undefined as any,
            mounts: [],
          } as any);
          break;
        case EquipmentType.LENS:
          form.setValue('specs', {
            type: EquipmentType.LENS,
            mount: undefined as any,
            focalLengthMm: { min: 0, max: 0 },
            isZoom: false,
          } as any);
          break;
        case EquipmentType.LIGHT:
          form.setValue('specs', {
            type: EquipmentType.LIGHT,
            powerW: 0,
            hasRgb: false,
          } as any);
          break;
        case EquipmentType.AUDIO:
          form.setValue('specs', {
            type: EquipmentType.AUDIO,
            category: undefined as any,
          } as any);
          break;
        case EquipmentType.ACCESSORY:
          form.setValue('specs', {
            type: EquipmentType.ACCESSORY,
            notes: '',
          } as any);
          break;
      }
    }
  }, [equipmentType, form]);

  const nextStep = async () => {
    let isValid = false;
    const { trigger } = form;

    switch (step) {
      case 1: // Basic Information
        isValid = await trigger([
          'equipmentType',
          'slug',
          'name',
          'summary',
          'description',
          'categoryId',
          'brandId',
          'order',
          'isPublished',
          'isFeatured',
        ]);
        break;
      case 2: // Media
        isValid = await trigger(['coverPath', 'galleryPaths']);
        break;
      case 3: // Specifications
        isValid = await trigger(['specs']);
        break;
      default:
        isValid = true;
    }

    if (isValid) {
      setStep(step + 1);
      setProgress(progress + STEP_PROGRESS);
    }
  };

  const prevStep = () => {
    setStep(step - 1);
    setProgress(progress - STEP_PROGRESS);
  };

  const onSubmit = async (data: TCreateEquipmentForm) => {
    const { categoryLabel, brandLabel, ...rest } = data;

    const sanitizedValues = sanitizeDto(rest) as TCreateEquipmentForm;

    try {
      await create.mutateAsync(sanitizedValues);
      toast.success('Equipment created successfully');
      router.push('/dashboard/equipments');
    } catch (error) {
      const errMsg = (error as Error)?.message || 'Failed to create equipment';
      toast.error(errMsg);
      console.error('Error creating equipment:', error);
    }
  };

  return (
    <section className="py-dash-section-padding-y">
      {/* Progress Bar */}
      <FormProgress
        currentStep={step}
        progress={progress}
        steps={['Basic Information', 'Media', 'Specifications']}
        onStepClick={stepNumber => {
          setStep(stepNumber);
          setProgress(Math.round(stepNumber * STEP_PROGRESS));
        }}
      />

      {/* Form */}
      <FormProvider {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          {/* Step 1: Basic Information */}
          {step === 1 && <BasicInfoStep />}

          {/* Step 2: Media */}
          {step === 2 && <MediaStep />}

          {/* Step 3: Specifications */}
          {step === 3 && <SpecificationsStep />}

          {/* Response Error */}
          {<ResponseError error={create.error as Error} />}

          {/* Navigation Buttons */}
          <div className="flex justify-between">
            {step > 1 ? (
              <Button
                key="previous"
                type="button"
                variant="outline"
                disabled={create.isPending}
                onClick={prevStep}
              >
                <ArrowLeft className="me-2 h-4 w-4" />
                Previous
              </Button>
            ) : (
              <div></div>
            )}

            {step < STEP_COUNT ? (
              <Button key="next" type="button" onClick={nextStep}>
                Next
                <ArrowRight className="ms-2 h-4 w-4" />
              </Button>
            ) : (
              <LoadingButton
                key="submit"
                isLoading={create.isPending}
                loadingText="Creating..."
                defaultText="Create Equipment"
                disabled={create.isPending}
                className="h-fit w-40"
              />
            )}
          </div>
        </form>
      </FormProvider>
    </section>
  );
}

export default AddEquipmentForm;
