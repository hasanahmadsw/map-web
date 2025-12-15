import { authService } from '@/services/auth.service';
import { getTranslations } from '@/utils/dictionary-utils';
import { formatDate } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Calendar, Mail, User, Edit, Shield } from 'lucide-react';
import Link from 'next/link';

interface ProfilePageProps {
  params: Promise<{ lang: string }>;
}

export default async function ProfilePage({ params }: ProfilePageProps) {
  const { lang } = await params;
  const data = await authService.getMe();
  const t = await getTranslations(lang as "en" | "ar");
  // Find translation for current language
  const currentTranslation = data.translations?.find(t => t.languageCode === lang);


  const getRoleVariant = (role: string): "superadmin" | "admin" | "author" | "default" => {
    switch (role) {
      case 'superadmin':
        return 'superadmin';
      case 'admin':
        return 'admin';
      case 'author':
        return 'author';
      default:
        return 'default';
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">{t.header.profile}</h1>
        <p className="text-muted-foreground mt-2">
          {t.staffs.staffManagementDescription}
        </p>
      </div>

      <div className="grid gap-6">
        {/* Profile Header Card */}
        <Card>
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={data.image || ''} alt={currentTranslation?.name || data.name} />
                  <AvatarFallback className="text-lg">
                    {(currentTranslation?.name || data.name).split(' ').map(n => n[0]).join('').toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h2 className="text-2xl font-semibold">
                    {currentTranslation?.name || data.name}
                  </h2>
                  <p className="text-muted-foreground flex items-center mt-1">
                    <Mail className="h-4 w-4 mr-2" />
                    {data.email}
                  </p>
                  <Badge variant={getRoleVariant(data.role) === "superadmin" ? "destructive" : "default"} className="mt-2">
                    <Shield className="h-3 w-3 mr-1" />
                    {data.role.charAt(0).toUpperCase() + data.role.slice(1)}
                  </Badge>
                </div>
              </div>
              <Link href={`/dashboard/profile/edit`} className='text-sm font-medium text-primary-foreground bg-primary flex items-center justify-center gap-2 px-4 py-2 rounded-md'>
                <Edit className="h-4 w-4 mr-2" />
                {t.staffs.edit}
              </Link>
            </div>
          </CardHeader>
        </Card>

        {/* Profile Details Card */}
        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center text-xl">
              <User className="h-5 w-5 mr-2" />
              {t.common.profileDetails}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                  {t.common.name}
                </label>
                <p className="text-base font-medium text-foreground">
                  {currentTranslation?.name || data.name}
                </p>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                  {t.common.email}
                </label>
                <p className="text-base font-medium text-foreground break-all">
                  {data.email}
                </p>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                  {t.staffs.role}
                </label>
                <div className="flex items-center">
                  <Badge variant={getRoleVariant(data.role) === "superadmin" ? "destructive" :"default"} className="text-sm font-medium">
                    <Shield className="h-3 w-3 mr-1" />
                    {data.role.charAt(0).toUpperCase() + data.role.slice(1)}
                  </Badge>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                  {t.common.createdAt}
                </label>
                <p className="text-base font-medium text-foreground flex items-center">
                  <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                  {formatDate(data.createdAt, lang)}
                </p>
              </div>
            </div>
            
            {(currentTranslation?.bio || data.bio) && (
              <div className="space-y-3 pt-4 border-t">
                <label className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                  {t.common.bio}
                </label>
                <div className="bg-muted/50 rounded-lg p-4">
                  <p className="text-base leading-relaxed text-foreground">
                    {currentTranslation?.bio || data.bio}
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

      
      </div>
    </div>
  );
}