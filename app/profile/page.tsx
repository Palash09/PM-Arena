import { AppShell } from "@/components/app-shell";
import { ProfileClient } from "@/components/profile-client";

export default function ProfilePage() {
  return (
    <AppShell title="Profile" compact>
      <ProfileClient />
    </AppShell>
  );
}
