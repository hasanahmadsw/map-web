import { Edit, Trash2 } from "lucide-react";
import type React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTranslation } from "@/providers/translations-provider";
import type { ArticleTranslation, Translation } from "@/types/translations.types";
import HtmlViewer from "../shared/html-viewer";
import DivHtml from "../shared/div-html";

interface TranslationViewModeProps {
  translation: Translation;
  entityType: string;
  hasContent: boolean;
  hasMeta: boolean;
  hasSubServices?: boolean;
  isDeletingTranslation: boolean;
  onStartEditing: (translation: Translation) => void;
  onDeleteClick: (translation: Translation) => void;
}

export const TranslationViewMode: React.FC<TranslationViewModeProps> = ({
  translation,
  entityType,
  hasContent,
  hasMeta,
  hasSubServices = false,
  isDeletingTranslation,
  onStartEditing,
  onDeleteClick,
}) => {
  const { t } = useTranslation();
  return (
    <Card>
      <CardContent className="pt-4">
        <div className="flex items-start justify-between">
          <div className="space-y-2 flex-1">
            <div className="flex items-center gap-2">
              <Badge variant="secondary">{translation.languageCode}</Badge>
              <span className="font-medium">{translation.name}</span>
            </div>
            {hasContent && (translation as ArticleTranslation).excerpt && (
              <DivHtml html={(translation as ArticleTranslation).excerpt} />
              
            )}
            <p className="text-sm text-muted-foreground">
              {"bio" in translation ? translation.bio : "description" in translation ? translation.description : ""}
            </p>
            {entityType === "service" && "shortDescription" in translation && (
              <p className="text-sm text-muted-foreground">
                {translation.shortDescription}
              </p>
            )}

            {hasSubServices && "subServices" in translation && translation.subServices && translation.subServices.length > 0 && (
              <div className="mt-4">
                <h4 className="text-sm font-medium mb-2">{t.services?.subServices || "Sub Services"}</h4>
                <div className="space-y-3">
                  {translation.subServices.map((subService: any, index: number) => (
                    <Card key={index}>
                      <CardHeader className="pb-2">
                        <div className="flex items-center gap-2">
                          {subService.icon && (
                            <span className="text-lg">{subService.icon}</span>
                          )}
                          <CardTitle className="text-base">{subService.title}</CardTitle>
                        </div>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <p className="text-sm text-muted-foreground mb-2">{subService.description}</p>
                        {subService.features && subService.features.length > 0 && (
                          <div>
                            <h5 className="text-xs font-medium text-muted-foreground mb-1">Features:</h5>
                            <ul className="text-xs text-muted-foreground space-y-1">
                              {subService.features.map((feature: string, featureIndex: number) => (
                                <li key={featureIndex} className="flex items-start gap-1">
                                  <span className="text-blue-500">•</span>
                                  <span>{feature}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}
            {hasMeta && (translation as ArticleTranslation).meta && (
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <span>
                  {entityType === "article" ? t.articles.metaTitle : t.translations.metaTitle}:{" "}
                  {(translation as ArticleTranslation).meta.title}
                </span>
                {translation.createdAt && <span>{new Date(translation.createdAt).toLocaleDateString()}</span>}
              </div>
            )}
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => onStartEditing(translation)}>
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onDeleteClick(translation)}
              disabled={isDeletingTranslation}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
