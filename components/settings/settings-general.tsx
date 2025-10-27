"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2, Mail, Phone, Globe, Facebook, Twitter, Linkedin, Instagram } from "lucide-react";
import type { Settings } from "@/types/settings.types";
import { useTranslation } from "@/providers/translations-provider";
import { useRouter } from "next/navigation";

interface SettingsGeneralProps {
  settings: Settings;
  
}

function getSocialIcon(platform: string) {
  switch (platform.toLowerCase()) {
    case "facebook":
      return Facebook;
    case "twitter":
      return Twitter;
    case "linkedin":
      return Linkedin;
    case "instagram":
      return Instagram;
    default:
      return Globe;
  }
}

export function SettingsGeneral({ settings }: SettingsGeneralProps) {
  const { t } = useTranslation();
  const router = useRouter();
  return (
    <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl">{settings.siteName}</CardTitle>
              <CardDescription className="mt-1">{settings.siteDescription}</CardDescription>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => router.push(`/dashboard/settings/general/edit`)}>
                  <Edit className="mr-2 h-4 w-4" />
                  {t.common.edit}
              </Button>
            
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <h4 className="font-medium text-sm text-muted-foreground">
                  {t.settings.defaultLanguage}
                </h4>
                <Badge variant="secondary">{settings.defaultLanguage.toUpperCase()}</Badge>
              </div>
              
            </div>

            {/* Contact Information */}
            <div className="space-y-3">
              <h4 className="font-medium text-sm text-muted-foreground">
                {t.settings.contact}
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{settings.contact.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{settings.contact.phone}</span>
                </div>
              </div>
            </div>

            {/* Social Links */}
            <div className="space-y-3">
              <h4 className="font-medium text-sm text-muted-foreground">
                {t.settings.socialLinks}
              </h4>
              <div className="flex gap-2">
                {settings.social.map((link) => {
                  const Icon = getSocialIcon(link.platform);
                  return (
                    <a
                      key={link.platform}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-md border hover:bg-muted transition-colors"
                      title={link.label}
                    >
                      <Icon className="h-4 w-4" />
                    </a>
                  );
                })}
              </div>
            </div>

            {/* Analytics */}
            <div className="space-y-3">
              <h4 className="font-medium text-sm text-muted-foreground">
                {t.settings.analytics}
              </h4>
              <div className="flex gap-2">
                {settings.analytics.googleAnalytics && (
                  <Badge variant="outline" className="text-xs">
                    GA: {settings.analytics.googleAnalytics}
                  </Badge>
                )}
                {settings.analytics.facebookPixel && (
                  <Badge variant="outline" className="text-xs">
                    FB: {settings.analytics.facebookPixel}
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
  );
}
