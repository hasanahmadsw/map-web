"use client";

import { Plus, Trash2 } from "lucide-react";
import type { Control, FieldPath, FieldValues } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { StandaloneIconSelectInput } from "@/components/shared/input/StandaloneIconSelectInput";
import { useTranslation } from "@/providers/translations-provider";

interface SubService {
  icon: string;
  title: string;
  description: string;
  features: string[];
}

interface SubServicesInputProps<T extends FieldValues> {
  control: Control<T>;
  name: FieldPath<T>;
  label: string;
  description?: string;
  className?: string;
  disabled?: boolean;
}

export function SubServicesInput<T extends FieldValues>({
  control,
  name,
  label,
  description,
  className,
  disabled = false,
}: SubServicesInputProps<T>) {
  const { t } = useTranslation();

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => {
        const subServices = field.value || [];

        const addSubService = () => {
          const newSubService: SubService = {
            icon: "",
            title: "",
            description: "",
            features: [],
          };
          field.onChange([...(subServices as SubService[]), newSubService]);
        };

        const removeSubService = (index: number) => {
          field.onChange((subServices as SubService[]).filter((_: SubService, i: number) => i !== index));
        };

        const updateSubService = (index: number, fieldName: keyof SubService, value: string | string[]) => {
          const updated = [...(subServices as SubService[])];
          updated[index] = { ...updated[index], [fieldName]: value };
          field.onChange(updated);
        };

        const addFeature = (subServiceIndex: number) => {
          const updated = [...(subServices as SubService[])];
          updated[subServiceIndex] = {
            ...updated[subServiceIndex],
            features: [...(updated[subServiceIndex].features || []), ""],
          };
          field.onChange(updated);
        };

        const removeFeature = (subServiceIndex: number, featureIndex: number) => {
          const updated = [...(subServices as SubService[])];
          updated[subServiceIndex].features = updated[subServiceIndex].features.filter(
            (_: string, i: number) => i !== featureIndex
          );
          field.onChange(updated);
        };

        const updateFeature = (subServiceIndex: number, featureIndex: number, value: string) => {
          const updated = [...(subServices as SubService[])];
          updated[subServiceIndex].features[featureIndex] = value;
          field.onChange(updated);
        };

        return (
          <FormItem className={className}>
            <div className="space-y-2">
              <FormLabel className="text-base">{label}</FormLabel>
              {description && <p className="text-sm text-muted-foreground">{description}</p>}
            </div>
            <FormControl>
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg">{t.services?.subServices || "Sub Services"}</CardTitle>
                      <p className="text-sm text-muted-foreground">
                        {t.services?.subServicesDescription || "Manage sub-services for this service."}
                      </p>
                    </div>
                    <Button
                      type="button"
                      onClick={addSubService}
                      variant="outline"
                      size="sm"
                      disabled={disabled}
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      {t.services?.addSubService || "Add Sub Service"}
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {subServices.map((subService: SubService, index: number) => (
                    <Card key={index}>
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-lg">
                            {t.services?.subService || "Sub Service"} {index + 1}
                          </CardTitle>
                          <Button
                            type="button"
                            onClick={() => removeSubService(index)}
                            variant="destructive"
                            size="sm"
                            disabled={disabled}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <StandaloneIconSelectInput
                            value={subService.icon || ""}
                            onChange={(value) => updateSubService(index, "icon", value)}
                            label={t.services?.icon || "Icon"}
                            placeholder={t.services?.iconPlaceholder || "Select an icon"}
                            disabled={disabled}
                          />
                          <div className="space-y-2">
                            <label className="text-sm font-medium">
                              {t.services?.title || "Title"}
                            </label>
                            <Input
                              placeholder={t.services?.titlePlaceholder || "Enter title"}
                              value={subService.title || ""}
                              onChange={(e) => updateSubService(index, "title", e.target.value)}
                              disabled={disabled}
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium">
                            {t.services?.description || "Description"}
                          </label>
                          <Textarea
                            placeholder={t.services?.descriptionPlaceholder || "Enter description"}
                            value={subService.description || ""}
                            onChange={(e) => updateSubService(index, "description", e.target.value)}
                            className="min-h-[80px]"
                            disabled={disabled}
                          />
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <label className="text-sm font-medium">
                              {t.services?.features || "Features"}
                            </label>
                            <Button
                              type="button"
                              onClick={() => addFeature(index)}
                              variant="outline"
                              size="sm"
                              disabled={disabled}
                            >
                              <Plus className="h-4 w-4" />
                            </Button>
                          </div>
                          <div className="space-y-2">
                            {(subService.features || []).map((feature: string, featureIndex: number) => (
                              <div key={featureIndex} className="flex gap-2">
                                <Input
                                  placeholder={t.services?.featurePlaceholder || "Enter feature"}
                                  value={feature}
                                  onChange={(e) => updateFeature(index, featureIndex, e.target.value)}
                                  disabled={disabled}
                                />
                                <Button
                                  type="button"
                                  onClick={() => removeFeature(index, featureIndex)}
                                  variant="destructive"
                                  size="sm"
                                  disabled={disabled}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            ))}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </CardContent>
              </Card>
            </FormControl>
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
}
