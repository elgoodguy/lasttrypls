import { ProfileForm } from '../components/profile/ProfileForm';
import { Button } from '@repo/ui/components/ui/button';
import { Separator } from '@repo/ui/components/ui/separator';
import { useAuth } from '@/providers/AuthProvider';
import { Toaster } from 'sonner';
import { AddressManager } from '../components/profile/AddressManager';
import { ThemeToggle } from '@repo/ui/components/ui/theme-toggle';
import { useTheme } from '@/providers/ThemeProvider';

export const ProfilePage = () => {
  const { signOut } = useAuth();
  const { theme, setTheme } = useTheme();

  return (
    <div className="space-y-6">
      <Toaster richColors position="top-center" />
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Profile Settings</h2>
        <p className="text-muted-foreground">Manage your account details.</p>
      </div>
      <Separator />

      <ProfileForm />

      <Separator />

      <AddressManager />

      <Separator />

      <div>
        <h3 className="text-lg font-medium">Preferences</h3>
        <p className="text-sm text-muted-foreground">Set your language and theme.</p>
        <div className="flex gap-4 mt-2 items-center">
          <Button variant="outline" disabled>
            Set Language
          </Button>
          <ThemeToggle theme={theme} setTheme={setTheme} />
        </div>
      </div>

      <Separator />

      <div>
        <h3 className="text-lg font-medium">Security</h3>
        <p className="text-sm text-muted-foreground">Manage your password.</p>
        <Button variant="outline" className="mt-2" disabled>
          Change Password
        </Button>
      </div>

      <Separator />

      <Button variant="destructive" onClick={signOut}>
        Log Out
      </Button>
    </div>
  );
};
