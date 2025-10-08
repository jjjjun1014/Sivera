import { AuthForm } from "@/components/features/auth/AuthForm";

export default async function SignupPage({
  searchParams,
}: {
  searchParams: Promise<{
    returnUrl?: string;
    email?: string;
    inviteToken?: string;
  }>;
}) {
  const { returnUrl, email, inviteToken } = await searchParams;

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <AuthForm
        initialMode="signup"
        returnUrl={returnUrl}
        defaultEmail={email}
        inviteToken={inviteToken}
      />
    </div>
  );
}
