"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Save,  X, Link, BarChart3, Code, Plus, Check, Image, Globe } from "lucide-react";
import { useTranslation } from "@/providers/translations-provider";
import { useSettings } from "@/hooks/settings/useSettings";
import { useLang } from "@/hooks/useLang";
import { useLanguages } from "@/hooks/useLanguages";
import { Select } from "@/components/ui/select";
import { updateSettingsSchema } from "@/schemas/settings.schemas";
import { toast } from "sonner";
import { MediaPickerDialog } from "@/components/media/media-picker-dialog";

interface EditSettingsFormProps {
  settings: any;
}

export default function EditSettingsForm({ settings }: EditSettingsFormProps) {
  const router = useRouter();
  const lang = useLang();
  const { t } = useTranslation();
  const { languages } = useLanguages();
  const { updateSettings, isUpdating, updateError } = useSettings();

  const [formData, setFormData] = useState({
    siteName: settings?.siteName || "",
    siteDescription: settings?.siteDescription || "",
    siteLogo: settings?.siteLogo || "",
    siteDarkLogo: settings?.siteDarkLogo || "",
    siteFavicon: settings?.siteFavicon || "",
    defaultLanguage: settings?.defaultLanguage || "en",
    meta: {
      title: settings?.meta?.title || "",
      description: settings?.meta?.description || "",
      keywords: settings?.meta?.keywords || [],
    },
    social: settings?.social || [],
    analytics: {
      googleAnalytics: settings?.analytics?.googleAnalytics || "",
      facebookPixel: settings?.analytics?.facebookPixel || "",
      customScripts: settings?.analytics?.customScripts || [],
    },
    contact: {
      email: settings?.contact?.email || "",
      phone: settings?.contact?.phone || "",
    },
    customScripts: {
      header: settings?.customScripts?.header || [],
      footer: settings?.customScripts?.footer || [],
    },
  });

  const [newSocialLink, setNewSocialLink] = useState({ platform: "", url: "", label: "" });
  const [newAnalyticsScript, setNewAnalyticsScript] = useState("");
  const [newHeaderScript, setNewHeaderScript] = useState("");
  const [newFooterScript, setNewFooterScript] = useState("");
  const [newKeyword, setNewKeyword] = useState("");
  const [isMediaPickerOpen, setIsMediaPickerOpen] = useState(false);
  const [mediaPickerType, setMediaPickerType] = useState<"logo" | "darkLogo" | "favicon" | null>(null);


  const handleInputChange = (field: string, value: string) => {
    if (field.includes(".")) {
      const parts = field.split(".");
      if (parts.length === 2) {
        const [parent, child] = parts;
        setFormData(prev => ({
          ...prev,
          [parent]: {
            ...(prev[parent as keyof typeof prev] as any),
            [child]: value,
          },
        }));
      } else if (parts.length === 3) {
        const [parent, child, grandchild] = parts;
        setFormData(prev => ({
          ...prev,
          [parent]: {
            ...(prev[parent as keyof typeof prev] as any),
            [child]: {
              ...(prev[parent as keyof typeof prev] as any)?.[child],
              [grandchild]: value,
            },
          },
        }));
      }
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value,
      }));
    }
  };

  const addSocialLink = () => {
    if (newSocialLink.platform && newSocialLink.url && newSocialLink.label) {
      setFormData(prev => ({
        ...prev,
        social: [...prev.social, { ...newSocialLink }],
      }));
      setNewSocialLink({ platform: "", url: "", label: "" });
    }
  };

  const removeSocialLink = (index: number) => {
    setFormData(prev => ({
      ...prev,
      social: prev.social.filter((_: any, i: number) => i !== index),
    }));
  };

  const addAnalyticsScript = () => {
    if (newAnalyticsScript.trim()) {
      setFormData(prev => ({
        ...prev,
        analytics: {
          ...prev.analytics,
          customScripts: [...prev.analytics.customScripts, newAnalyticsScript.trim()],
        },
      }));
      setNewAnalyticsScript("");
    }
  };

  const removeAnalyticsScript = (index: number) => {
    setFormData(prev => ({
      ...prev,
      analytics: {
        ...prev.analytics,
        customScripts: prev.analytics.customScripts.filter((_: any, i: number) => i !== index),
      },
    }));
  };

  const addHeaderScript = () => {
    if (newHeaderScript.trim()) {
      setFormData(prev => ({
        ...prev,
        customScripts: {
          ...prev.customScripts,
          header: [...prev.customScripts.header, newHeaderScript.trim()],
        },
      }));
      setNewHeaderScript("");
    }
  };

  const removeHeaderScript = (index: number) => {
    setFormData(prev => ({
      ...prev,
      customScripts: {
        ...prev.customScripts,
        header: prev.customScripts.header.filter((_: any, i: number) => i !== index),
      },
    }));
  };

  const addFooterScript = () => {
    if (newFooterScript.trim()) {
      setFormData(prev => ({
        ...prev,
        customScripts: {
          ...prev.customScripts,
          footer: [...prev.customScripts.footer, newFooterScript.trim()],
        },
      }));
      setNewFooterScript("");
    }
  };

  const removeFooterScript = (index: number) => {
    setFormData(prev => ({
      ...prev,
      customScripts: {
        ...prev.customScripts,
        footer: prev.customScripts.footer.filter((_: any, i: number) => i !== index),
      },
    }));
  };

  const addKeyword = () => {
    const keyword = newKeyword.trim();
    if (keyword) {
      const currentKeywords = formData.meta.keywords || [];
      if (!currentKeywords.includes(keyword)) {
        setFormData(prev => ({
          ...prev,
          meta: {
            ...prev.meta,
            keywords: [...currentKeywords, keyword],
          },
        }));
      }
      setNewKeyword("");
    }
  };

  const removeKeyword = (keyword: string) => {
    setFormData(prev => ({
      ...prev,
      meta: {
        ...prev.meta,
        keywords: prev.meta.keywords.filter((k: string) => k !== keyword),
      },
    }));
  };

  const handleMediaSelect = (media: any) => {
    const selectedMedia = Array.isArray(media) ? media[0] : media;
    if (selectedMedia && mediaPickerType) {
      if (mediaPickerType === "logo") {
        setFormData(prev => ({ ...prev, siteLogo: selectedMedia.url }));
      } else if (mediaPickerType === "darkLogo") {
        setFormData(prev => ({ ...prev, siteDarkLogo: selectedMedia.url }));
      } else if (mediaPickerType === "favicon") {
        setFormData(prev => ({ ...prev, siteFavicon: selectedMedia.url }));
      }
      setMediaPickerType(null);
      setIsMediaPickerOpen(false);
    }
  };



  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!settings?.id) {
      toast.error("Settings not found");
      return;
    }

    try {
      const validatedData = updateSettingsSchema(t.validation).parse(formData);
      await updateSettings(validatedData);
      router.push("/dashboard/settings/general");
    } catch (error: any) {
      console.error("Update error:", error);
    }
  };

  return (
    <div className="space-y-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                {t.settings?.basicInformation || "Basic Information"}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="siteName">{t.settings?.siteName || "Site Name"}</Label>
                  <Input
                    id="siteName"
                    value={formData.siteName}
                    onChange={(e) => handleInputChange("siteName", e.target.value)}
                    placeholder="Enter site name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="defaultLanguage">{t.settings?.defaultLanguage || "Default Language"}</Label>
                  <select
                    id="defaultLanguage"
                    value={formData.defaultLanguage}
                    onChange={(e) => handleInputChange("defaultLanguage", e.target.value)}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {languages?.map((lang) => (
                      <option key={lang.code} value={lang.code}>
                        {lang.name} ({lang.code})
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="siteDescription">{t.settings?.siteDescription || "Site Description"}</Label>
                <Textarea
                  id="siteDescription"
                  value={formData.siteDescription}
                  onChange={(e) => handleInputChange("siteDescription", e.target.value)}
                  placeholder="Enter site description"
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          {/* Site Images */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Image className="h-5 w-5" />
                Site Images
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Site Logo */}
                <div className="space-y-2">
                  <Label>{t.settings?.siteLogo || "Site Logo"}</Label>
                  <div className="flex items-center gap-2">
                    {formData.siteLogo && (
                      <div className="relative w-20 h-20 rounded-lg overflow-hidden border">
                        <img
                          src={formData.siteLogo}
                          alt="Logo"
                          className="w-full h-full object-cover"
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          className="absolute top-1 right-1 h-5 w-5 rounded-full p-0"
                          onClick={() => handleInputChange("siteLogo", "")}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    )}
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setMediaPickerType("logo");
                        setIsMediaPickerOpen(true);
                      }}
                    >
                      <Image className="mr-2 h-4 w-4" />
                      {formData.siteLogo ? "Change" : "Select"}
                    </Button>
                  </div>
                </div>

                {/* Dark Logo */}
                <div className="space-y-2">
                  <Label>{t.settings?.siteDarkLogo || "Dark Logo"}</Label>
                  <div className="flex items-center gap-2">
                    {formData.siteDarkLogo && (
                      <div className="relative w-20 h-20 rounded-lg overflow-hidden border">
                        <img
                          src={formData.siteDarkLogo}
                          alt="Dark Logo"
                          className="w-full h-full object-cover"
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          className="absolute top-1 right-1 h-5 w-5 rounded-full p-0"
                          onClick={() => handleInputChange("siteDarkLogo", "")}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    )}
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setMediaPickerType("darkLogo");
                        setIsMediaPickerOpen(true);
                      }}
                    >
                      <Image className="mr-2 h-4 w-4" />
                      {formData.siteDarkLogo ? "Change" : "Select"}
                    </Button>
                  </div>
                </div>

                {/* Favicon */}
                <div className="space-y-2">
                  <Label>{t.settings?.siteFavicon || "Favicon"}</Label>
                  <div className="flex items-center gap-2">
                    {formData.siteFavicon && (
                      <div className="relative w-16 h-16 rounded-lg overflow-hidden border">
                        <img
                          src={formData.siteFavicon}
                          alt="Favicon"
                          className="w-full h-full object-cover"
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          className="absolute top-1 right-1 h-5 w-5 rounded-full p-0"
                          onClick={() => handleInputChange("siteFavicon", "")}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    )}
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setMediaPickerType("favicon");
                        setIsMediaPickerOpen(true);
                      }}
                    >
                      <Image className="mr-2 h-4 w-4" />
                      {formData.siteFavicon ? "Change" : "Select"}
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <MediaPickerDialog
            open={isMediaPickerOpen}
            onOpenChange={setIsMediaPickerOpen}
            onSelect={handleMediaSelect}
            mode="single"
            filter="image"
            initialSelected={
              mediaPickerType === "logo" && formData.siteLogo ? [formData.siteLogo] :
              mediaPickerType === "darkLogo" && formData.siteDarkLogo ? [formData.siteDarkLogo] :
              mediaPickerType === "favicon" && formData.siteFavicon ? [formData.siteFavicon] : []
            }
          />

          {/* Meta Information */}
          <Card>
            <CardHeader>
              <CardTitle>{t.settings?.metaInformation || "Meta Information"}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="metaTitle">{t.settings?.metaTitle || "Meta Title"}</Label>
                  <Input
                    id="metaTitle"
                    value={formData.meta.title}
                    onChange={(e) => handleInputChange("meta.title", e.target.value)}
                    placeholder="Enter meta title"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="metaDescription">{t.settings?.metaDescription || "Meta Description"}</Label>
                <Textarea
                  id="metaDescription"
                  value={formData.meta.description}
                  onChange={(e) => handleInputChange("meta.description", e.target.value)}
                  placeholder="Enter meta description"
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="keywords">{t.common?.keywords || "Keywords"}</Label>
                <div className="flex gap-2">
                  <Input
                    id="keywords"
                    value={newKeyword}
                    onChange={(e) => setNewKeyword(e.target.value)}
                    placeholder={t.common?.addKeyword || "Add keyword"}
                    onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addKeyword())}
                    className="flex-1"
                  />
                  <Button type="button" onClick={addKeyword} variant="outline">
                    {t.common?.add || "Add"}
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {(formData.meta.keywords || []).map((keyword: string) => (
                    <Badge key={keyword} variant="secondary" className="flex items-center gap-1 text-xs">
                      {keyword}
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="h-4 w-4 p-0 hover:bg-destructive/20"
                        onClick={() => removeKeyword(keyword)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Social Links */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Link className="h-5 w-5" />
                {t.settings?.socialLinks}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="platform">{t.settings?.platform}</Label>
                  <Input
                    id="platform"
                    value={newSocialLink.platform}
                    onChange={(e) => setNewSocialLink(prev => ({ ...prev, platform: e.target.value }))}
                    placeholder="facebook"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="url">{t.settings?.url}</Label>
                  <Input
                    id="url"
                    value={newSocialLink.url}
                    onChange={(e) => setNewSocialLink(prev => ({ ...prev, url: e.target.value }))}
                    placeholder="https://facebook.com/yourpage"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="label">{t.settings?.label}</Label>
                  <Input
                    id="label"
                    value={newSocialLink.label}
                    onChange={(e) => setNewSocialLink(prev => ({ ...prev, label: e.target.value }))}
                    placeholder="Follow us on Facebook"
                  />
                </div>
              </div>
              <Button type="button" onClick={addSocialLink} variant="outline" className="w-full">
                <Plus className="mr-2 h-4 w-4" />
                {t.settings?.addSocialLink}
              </Button>
              <div className="space-y-2">
                {formData.social.map((link: any, index: number) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-md">
                    <div className="flex items-center gap-3">
                      <Badge variant="secondary">{link.platform}</Badge>
                      <span className="text-sm">{link.label}</span>
                      <span className="text-xs text-muted-foreground">{link.url}</span>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeSocialLink(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Analytics */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                {t.settings?.analytics}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="googleAnalytics">{t.settings?.googleAnalytics}</Label>
                  <Input
                    id="googleAnalytics"
                    value={formData.analytics.googleAnalytics}
                    onChange={(e) => handleInputChange("analytics.googleAnalytics", e.target.value)}
                    placeholder="GA-XXXXXXXXX"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="facebookPixel">{t.settings?.facebookPixel}</Label>
                  <Input
                    id="facebookPixel"
                    value={formData.analytics.facebookPixel}
                    onChange={(e) => handleInputChange("analytics.facebookPixel", e.target.value)}
                    placeholder="FB-XXXXXXXXX"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="analyticsScripts">Analytics Custom Scripts</Label>
                <div className="flex gap-2">
                  <Input
                    value={newAnalyticsScript}
                    onChange={(e) => setNewAnalyticsScript(e.target.value)}
                    placeholder="console.log('Analytics loaded')"
                  />
                  <Button type="button" onClick={addAnalyticsScript} variant="outline">
                    <Check className="h-4 w-4" />
                  </Button>
                </div>
                <div className="space-y-2">
                  {formData.analytics.customScripts.map((script: string, index: number) => (
                    <div key={index} className="flex items-center justify-between p-2 border rounded">
                      <code className="text-xs">{script}</code>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeAnalyticsScript(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card>
            <CardHeader>
              <CardTitle>{t.settings?.contactInformation}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="email">{t.common?.email}</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.contact.email}
                    onChange={(e) => handleInputChange("contact.email", e.target.value)}
                    placeholder={t.common?.enterEmailAddress}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">{t.common?.phone}</Label>
                  <Input
                    id="phone"
                    value={formData.contact.phone}
                    onChange={(e) => handleInputChange("contact.phone", e.target.value)}
                    placeholder={t.common?.enterPhoneNumber}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Custom Scripts */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Code className="h-5 w-5" />
                {t.settings?.customScripts}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="headerScripts">{t.settings?.headerScripts}</Label>
                  <div className="flex gap-2 mt-2">
                    <Textarea
                      value={newHeaderScript}
                      onChange={(e) => setNewHeaderScript(e.target.value)}
                      placeholder="<script>console.log('Header script')</script>"
                      rows={2}
                      className="flex-1"
                    />
                    <Button type="button" onClick={addHeaderScript} variant="outline">
                      <Check className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="space-y-2 mt-2">
                    {formData.customScripts.header.map((script: string, index: number) => (
                      <div key={index} className="flex items-center justify-between p-2 border rounded">
                        <code className="text-xs">{script}</code>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeHeaderScript(index)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <Label htmlFor="footerScripts">{t.settings?.footerScripts}</Label>
                  <div className="flex gap-2 mt-2">
                    <Textarea
                      value={newFooterScript}
                      onChange={(e) => setNewFooterScript(e.target.value)}
                      placeholder="<script>console.log('Footer script')</script>"
                      rows={2}
                      className="flex-1"
                    />
                    <Button type="button" onClick={addFooterScript} variant="outline">
                      <Check className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="space-y-2 mt-2">
                    {formData.customScripts.footer.map((script: string, index: number) => (
                      <div key={index} className="flex items-center justify-between p-2 border rounded">
                        <code className="text-xs">{script}</code>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFooterScript(index)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end gap-4">
            <Button type="button" variant="outline" onClick={() => router.back()}>
              {t.common?.cancel}
            </Button>
            <Button type="submit" disabled={isUpdating}>
              <Save className="mr-2 h-4 w-4" />
              {isUpdating ? t.common?.saving : t.common?.saveChanges}
            </Button>
          </div>
        </form>
    </div>
  );
}