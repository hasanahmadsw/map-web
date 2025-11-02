"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Form } from "@/components/ui/form";
import { TextInput } from "@/components/shared/input/TextInput";
import { TextAreaInput } from "@/components/shared/input/TextAreaInput";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Save, X, Edit, Globe } from "lucide-react";
import { useTranslation } from "@/providers/translations-provider";
import { useSettingsTranslations } from "@/hooks/settings/useSettingsTranslations";
import { useLang } from "@/hooks/useLang";
import { editTranslationFormSchema } from "@/schemas/settings.schemas";
import { toast } from "sonner";
import type { SettingsTranslation } from "@/types/settings.types";
import type { TEditTranslationFormDTO } from "@/schemas/settings.schemas";

interface EditTranslationsSettingsProps {
  settings?: any;
}

export default function EditTranslationsSettings({ settings }: EditTranslationsSettingsProps) {
  const lang = useLang();
  const { t } = useTranslation();
  const { data: settingsWithTranslations, isLoading, updateTranslation, isUpdating, updateError } = useSettingsTranslations({ lang });

  const [editingTranslation, setEditingTranslation] = useState<number | null>(null);
  const [newKeyword, setNewKeyword] = useState<Record<string, string>>({});

  const form = useForm<TEditTranslationFormDTO>({
    resolver: zodResolver(editTranslationFormSchema(t.validation)),
    defaultValues: {
      siteName: "",
      siteDescription: "",
      metaTitle: "",
      metaDescription: "",
      keywords: [],
    },
  });

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{t.settings?.translations || "Translations"}</CardTitle>
          <CardDescription>{t.settings?.translationsDescription || "Manage translations for your website settings in different languages."}</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-center py-8">
          <div className="text-center">
            <p className="text-muted-foreground">Loading translations...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!settingsWithTranslations?.translations?.length) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{t.settings?.translations || "Translations"}</CardTitle>
          <CardDescription>{t.settings?.translationsDescription || "Manage translations for your website settings in different languages."}</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-center py-8">
          <div className="text-center">
            <p className="text-muted-foreground">No translations found</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const startEditing = (translation: SettingsTranslation) => {
    setEditingTranslation(translation.id);
    form.reset({
      siteName: translation.siteName,
      siteDescription: translation.siteDescription,
      metaTitle: translation.meta.title,
      metaDescription: translation.meta.description,
      keywords: translation.meta.keywords || [],
    });
    setNewKeyword({ [translation.id]: "" });
  };

  const cancelEditing = () => {
    setEditingTranslation(null);
    form.reset();
    setNewKeyword({});
  };

  const addKeyword = (translationId: number) => {
    const keyword = newKeyword[translationId]?.trim();
    if (keyword) {
      const currentKeywords = form.getValues("keywords") || [];
      if (!currentKeywords.includes(keyword)) {
        form.setValue("keywords", [...currentKeywords, keyword]);
      }
      setNewKeyword(prev => ({ ...prev, [translationId]: "" }));
    }
  };

  const removeKeyword = (keyword: string, translationId: number) => {
    const currentKeywords = form.getValues("keywords") || [];
    form.setValue("keywords", currentKeywords.filter((k: string) => k !== keyword));
  };

  const handleSubmit = async (data: TEditTranslationFormDTO) => {
    if (!editingTranslation) return;
    
    try {
      // Transform form data to match the API schema
      const apiData = {
        siteName: data.siteName,
        siteDescription: data.siteDescription,
        meta: {
          title: data.metaTitle,
          description: data.metaDescription,
          keywords: data.keywords || [],
        },
      };
      
      await updateTranslation(editingTranslation, apiData);
      toast.success("Translation updated successfully");
      setEditingTranslation(null);
      form.reset();
      setNewKeyword({});
    } catch (error: any) {
      console.error("Update error:", error);
      if (error?.issues?.[0]?.message) {
        toast.error(error.issues[0].message);
      } else {
        toast.error(updateError || "Failed to update translation");
      }
    }
  };

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Globe className="h-5 w-5" />
          {t.settings?.translations || "Translations"}
        </CardTitle>
        <CardDescription>
          {t.settings?.translationsDescription || "Manage translations for your website settings in different languages."}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue={settingsWithTranslations.translations[0]?.languageCode} className="w-full">
          <TabsList className=" w-full ">
            {settingsWithTranslations.translations.map((translation) => (
              <TabsTrigger key={translation.id} value={translation.languageCode}>
                {translation.language.nativeName}
              </TabsTrigger>
            ))}
          </TabsList>
          
          {settingsWithTranslations.translations.map((translation) => (
            <TabsContent key={translation.id} value={translation.languageCode} className="space-y-6">
              <div className="flex items-center justify-between my-6">
                <div>
                  <h3 className="text-lg font-semibold">
                    {translation.language.name} ({translation.language.nativeName})
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {translation.language.isDefault ? t.common.defaultLanguage : t.common.translation}
                  </p>
                </div>
                {editingTranslation !== translation.id && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => startEditing(translation)}
                    className="shrink-0"
                  >
                    <Edit className="mr-2 h-4 w-4" />
                    {t.common.edit}
                  </Button>
                )}
              </div>

              {editingTranslation === translation.id ? (
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <TextInput
                        control={form.control}
                        name="siteName"
                        label={t.settings?.siteName || "Site Name"}
                        placeholder={t.common?.enterSiteName}
                        className="w-full"
                      />
                      <TextInput
                        control={form.control}
                        name="siteDescription"
                        label={t.settings?.siteDescription || "Site Description"}
                        placeholder={t.common?.enterSiteDescription}
                        className="w-full"
                      />
                    </div>

                    <div className="space-y-6">
                      <h4 className="text-lg font-semibold text-foreground border-b pb-2">
                        {t.settings?.metaInformation}
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <TextInput
                          control={form.control}
                          name="metaTitle"
                          label={t.settings?.metaTitle || "Meta Title"}
                          placeholder={t.common?.enterMetaTitle}
                          className="w-full"
                        />
                        <TextAreaInput
                          control={form.control}
                          name="metaDescription"
                          label={t.settings?.metaDescription || "Meta Description"}
                          placeholder={t.common?.enterMetaDescription}
                          rows={3}
                          className="w-full"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor={`keywords-${translation.id}`} className="text-sm font-medium">
                          {t.common?.keywords}
                        </Label>
                        <div className="flex gap-2">
                          <Input
                            id={`keywords-${translation.id}`}
                            value={newKeyword[translation.id] || ""}
                            onChange={(e) => setNewKeyword(prev => ({ ...prev, [translation.id]: e.target.value }))}
                            placeholder={t.common?.addKeyword}
                            onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addKeyword(translation.id))}
                            className="flex-1"
                          />
                          <Button type="button" onClick={() => addKeyword(translation.id)} variant="outline" className="shrink-0">
                            {t.common?.add}
                          </Button>
                        </div>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {(form.watch("keywords") || []).map((keyword: string) => (
                            <Badge key={keyword} variant="secondary" className="flex items-center gap-1 text-xs">
                              {keyword}
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="h-4 w-4 p-0 hover:bg-destructive/20"
                                onClick={() => removeKeyword(keyword, translation.id)}
                              >
                                <X className="h-3 w-3" />
                              </Button>
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-end gap-4 pt-6 border-t">
                      <Button type="button" variant="outline" onClick={cancelEditing}>
                        {t.common?.cancel}
                      </Button>
                      <Button type="submit" disabled={isUpdating}>
                        <Save className="mr-2 h-4 w-4" />
                        {isUpdating ? t.common?.saving : t.common?.saveChanges}
                      </Button>
                    </div>
                  </form>
                </Form>
              ) : (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-muted-foreground">
                        {t.settings?.siteName}
                      </Label>
                      <p className="text-sm font-medium text-foreground bg-muted/50 p-3 rounded-md">
                        {translation.siteName}
                      </p>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-muted-foreground">
                        {t.settings?.siteDescription}
                      </Label>
                      <p className="text-sm font-medium text-foreground bg-muted/50 p-3 rounded-md">
                        {translation.siteDescription}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4">
                  
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label className="text-sm font-medium text-muted-foreground">
                          {t.settings?.metaTitle}
                        </Label>
                        <p className="text-sm font-medium text-foreground bg-muted/50 p-3 rounded-md">
                          {translation.meta.title}
                        </p>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-sm font-medium text-muted-foreground">
                          {t.settings?.metaDescription}
                        </Label>
                        <p className="text-sm font-medium text-foreground bg-muted/50 p-3 rounded-md min-h-[60px]">
                          {translation.meta.description}
                        </p>
                      </div>
                    </div>
                    {translation.meta.keywords?.length > 0 && (
                      <div className="space-y-2">
                        <Label className="text-sm font-medium text-muted-foreground">
                          {t.common?.keywords}
                        </Label>
                        <div className="flex flex-wrap gap-2 p-3 bg-muted/50 rounded-md">
                          {translation.meta.keywords.map((keyword) => (
                            <Badge key={keyword} variant="secondary" className="text-xs">
                              {keyword}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  );
}