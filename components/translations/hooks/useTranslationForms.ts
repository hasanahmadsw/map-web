"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useTranslation } from "@/providers/translations-provider";
import { autoTranslateArticleSchema, createArticleTranslationSchema } from "@/schemas/articles.schemas";
import { autoTranslateStaffSchema, createStaffTranslationSchema } from "@/schemas/staff.schemas";
import { autoTranslateServiceSchema, createServiceTranslationSchema } from "@/schemas/services.schemas";
import { autoTranslateSolutionSchema, createSolutionTranslationSchema } from "@/schemas/solutions.schemas";
import type { TAutoTranslateForm, TCreateTranslationForm } from "@/schemas/translations.schemas";
import { autoTranslateSchema, createTranslationSchema } from "@/schemas/translations.schemas";
import type { EntityType } from "@/types/translations.types";

export const useTranslationForms = (entityType: EntityType, hasContent = false, hasMeta = false, hasSubServices = false) => {
  const { t } = useTranslation();
  // Get validation messages for the specific entity type
  const validationDict = t.validation;

  // Get the appropriate schema based on entity type
  const getTranslationSchema = () => {
    switch (entityType) {
      case "article":
        return createArticleTranslationSchema(validationDict);
      case "staff":
        return createStaffTranslationSchema(validationDict);
      case "service":
        return createServiceTranslationSchema(validationDict);
      case "solution":
        return createSolutionTranslationSchema(validationDict);
      default:
        return createTranslationSchema(validationDict, hasContent, hasMeta, hasSubServices);
    }
  };

  const getAutoTranslateSchema = () => {
    switch (entityType) {
      case "article":
        return autoTranslateArticleSchema(validationDict);
      case "staff":
        return autoTranslateStaffSchema(validationDict);
      case "service":
        return autoTranslateServiceSchema(validationDict);
      case "solution":
        return autoTranslateSolutionSchema(validationDict);
      default:
        return autoTranslateSchema(validationDict);
    }
  };

  const translationForm = useForm<any>({
    resolver: zodResolver(getTranslationSchema()),
    defaultValues: {
      languageCode: "",
      name: "",
      ...(entityType === "staff" && { bio: "" }),
      ...(entityType !== "article" && entityType !== "staff" && { description: "" }),
      ...(entityType === "service" && { 
        shortDescription: "",
        subServices: [],
      }),
      ...(entityType === "solution" && { 
        shortDescription: "",
      }),
      ...(hasContent && {
        content: "",
        excerpt: "",
        tags: "",
        topics: "",
        ...(hasMeta && {
          meta: {
            title: "",
            description: "",
            keywords: [],
          },
        }),
      }),
      ...(hasSubServices && {
        shortDescription: "",
        subServices: [],
      }),
    },
  });

  const autoTranslateForm = useForm<TAutoTranslateForm>({
    resolver: zodResolver(getAutoTranslateSchema()),
    defaultValues: {
      translateTo: [],
    },
  });

  return {
    translationForm,
    autoTranslateForm,
    CreateTranslationFormData: {} as TCreateTranslationForm,
    AutoTranslateFormData: {} as TAutoTranslateForm,
  };
};
