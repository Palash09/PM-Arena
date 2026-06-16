import { AppShell } from "@/components/app-shell";
import { AuthScreen } from "@/components/auth-screen";

interface AccountPageProps {
  searchParams: Promise<{
    mode?: string;
    next?: string;
  }>;
}

export default async function AccountPage({ searchParams }: AccountPageProps) {
  const params = await searchParams;
  const initialMode = params.mode === "signup" ? "signup" : "login";
  const nextHref = params.next?.startsWith("/") ? params.next : "/";

  return (
    <AppShell title="Account" compact>
      <AuthScreen initialMode={initialMode} nextHref={nextHref} />
    </AppShell>
  );
}
