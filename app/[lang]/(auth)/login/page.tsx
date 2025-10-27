import { AuthForm } from "@/components/auth/auth-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {getTranslations } from "@/utils/dictionary-utils";

export default async function LoginPage({params}: {params: Promise<{lang: string}>}) {
  const {lang} = await params;
  const t = await getTranslations(lang as "en" | "ar");
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center">{t.auth.login}</CardTitle>
            <CardDescription className="text-center">
              {t.auth.loginDescription}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <AuthForm />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
