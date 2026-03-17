import { AuthForm } from '@/components/auth/auth-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Logo from '@/components/layout/header/logo';

export default async function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="flex justify-center">
          <Logo width={96} height={96} className="h-16 w-32" />
        </div>
        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="text-center text-2xl">Login</CardTitle>
            <CardDescription className="text-center">Login to your account to continue</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <AuthForm />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
