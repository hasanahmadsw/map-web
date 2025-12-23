'use client';

import { formatDate } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Calendar, Mail, User, Edit, Shield, Loader2 } from 'lucide-react';
import Link from 'next/link';

import { useStaffMe } from '@/hooks/api/staff/useStaffMe';
import ApiError from '@/components/shared/api-error';

const getRoleVariant = (role: string): 'superadmin' | 'admin' | 'author' | 'default' => {
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

function ProfileInfo() {
  const { currentStaff: data, isLoading, isError, error, refetch } = useStaffMe();

  if (isLoading) {
    return (
      <div className="flex h-32 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="flex min-h-screen flex-1 items-center justify-center">
        <ApiError
          refetchFunction={refetch}
          errorMessage={error ?? 'An error occurred while fetching the user data'}
        />
      </div>
    );
  }

  return (
    <div className="grid gap-6">
      {/* Profile Header Card */}
      <Card>
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Avatar className="h-20 w-20">
                <AvatarImage src={data.image || ''} alt={data.name} />
                <AvatarFallback className="text-lg">
                  {data.name
                    .split(' ')
                    .map(n => n[0])
                    .join('')
                    .toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <h2 className="text-2xl font-semibold">{data.name}</h2>
                <p className="text-muted-foreground mt-1 flex items-center">
                  <Mail className="mr-2 h-4 w-4" />
                  {data.email}
                </p>
                <Badge
                  variant={getRoleVariant(data.role) === 'superadmin' ? 'destructive' : 'default'}
                  className="mt-2"
                >
                  <Shield className="mr-1 h-3 w-3" />
                  {data.role.charAt(0).toUpperCase() + data.role.slice(1)}
                </Badge>
              </div>
            </div>
            <Link
              href={`/dashboard/profile/edit`}
              className="text-primary-foreground bg-primary flex items-center justify-center gap-2 rounded-md px-4 py-2 text-sm font-medium"
            >
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </Link>
          </div>
        </CardHeader>
      </Card>

      {/* Profile Details Card */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center text-xl">
            <User className="mr-2 h-5 w-5" />
            Profile Details
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-muted-foreground text-sm font-semibold tracking-wide uppercase">
                Name
              </label>
              <p className="text-foreground text-base font-medium">{data.name}</p>
            </div>
            <div className="space-y-2">
              <label className="text-muted-foreground text-sm font-semibold tracking-wide uppercase">
                Email
              </label>
              <p className="text-foreground text-base font-medium break-all">{data.email}</p>
            </div>
            <div className="space-y-2">
              <label className="text-muted-foreground text-sm font-semibold tracking-wide uppercase">
                Role
              </label>
              <div className="flex items-center">
                <Badge
                  variant={getRoleVariant(data.role) === 'superadmin' ? 'destructive' : 'default'}
                  className="text-sm font-medium"
                >
                  <Shield className="mr-1 h-3 w-3" />
                  {data.role.charAt(0).toUpperCase() + data.role.slice(1)}
                </Badge>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-muted-foreground text-sm font-semibold tracking-wide uppercase">
                Created At
              </label>
              <p className="text-foreground flex items-center text-base font-medium">
                <Calendar className="text-muted-foreground mr-2 h-4 w-4" />
                {formatDate(data.createdAt, 'en')}
              </p>
            </div>
          </div>

          {data.bio && (
            <div className="space-y-3 border-t pt-4">
              <label className="text-muted-foreground text-sm font-semibold tracking-wide uppercase">
                Bio
              </label>
              <div className="bg-muted/50 rounded-lg p-4">
                <p className="text-foreground text-base leading-relaxed">{data.bio}</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default ProfileInfo;
