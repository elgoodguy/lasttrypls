import React from 'react';
import { ProfileForm } from '@/components/profile/ProfileForm';
import { Button } from '@repo/ui/components/ui/button';
import { Separator } from '@repo/ui/components/ui/separator';
import { useAuth } from '@/providers/AuthProvider';
import { Toaster } from 'sonner';

export const ProfilePage = () => {
  const { signOut } = useAuth();

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

      {/* Placeholder Sections */}
      <div>
        <h3 className="text-lg font-medium">Manage Addresses</h3>
        <p className="text-sm text-muted-foreground">Add or update your delivery addresses.</p>
        <Button variant="outline" className="mt-2" disabled>Manage Addresses</Button>
      </div>

      <Separator />

      <div>
        <h3 className="text-lg font-medium">Preferences</h3>
        <p className="text-sm text-muted-foreground">Set your language and theme.</p>
        <div className="flex gap-4 mt-2">
          <Button variant="outline" disabled>Set Language</Button>
          <Button variant="outline" disabled>Set Theme</Button>
        </div>
      </div>

      <Separator />

      <div>
        <h3 className="text-lg font-medium">Security</h3>
        <p className="text-sm text-muted-foreground">Manage your password.</p>
        <Button variant="outline" className="mt-2" disabled>Change Password</Button>
      </div>

      <Separator />

      <Button variant="destructive" onClick={signOut}>
        Log Out
      </Button>
    </div>
  );
}; 