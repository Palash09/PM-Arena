import { AppShell } from "@/components/app-shell";
import { ResetPasswordScreen } from "@/components/reset-password-screen";

interface ResetPasswordPageProps {
  searchParams: Promise<{
    token?: string;
  }>;
}

export default async function ResetPasswordPage({ searchParams }: ResetPasswordPageProps) {
  const params = await searchParams;

  return (
    <AppShell title="Reset Password" compact>
      <ResetPasswordScreen token={params.token ?? ""} />
    </AppShell>
  );
}
