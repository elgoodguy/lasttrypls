import React, { useEffect } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { Button, Input, Label } from '@repo/ui';
import { useSupabase } from '@/providers/SupabaseProvider';
import { useAuth } from '@/providers/AuthProvider';
import { getProfile, updateProfile, Profile, ProfileUpdate } from '@repo/api-client';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

// Define the form data structure
type ProfileFormData = {
  fullName: string;
  email: string; // Display only, not editable via this form
};

export const ProfileForm: React.FC = () => {
  const supabase = useSupabase();
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // 1. Query to fetch the user's profile data
  const { data: profile, isLoading: isLoadingProfile, error: profileError } = useQuery<Profile | null>({
    queryKey: ['profile', user?.id],
    queryFn: () => getProfile(supabase),
    enabled: !!user,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  // 2. Mutation to update the profile
  const { mutate: updateProfileMutation, isPending: isUpdatingProfile } = useMutation({
    mutationFn: (updates: ProfileUpdate) => updateProfile(supabase, updates),
    onSuccess: (updatedProfile) => {
      queryClient.invalidateQueries({ queryKey: ['profile', user?.id] });
      toast.success("Profile updated successfully!");
      reset({ fullName: updatedProfile.full_name || '', email: user?.email || '' });
    },
    onError: (error) => {
      console.error("Profile update failed:", error);
      toast.error("Failed to update profile: " + error.message);
    },
  });

  // 3. React Hook Form setup
  const { register, handleSubmit, reset, formState: { errors, isDirty } } = useForm<ProfileFormData>({
    defaultValues: {
      fullName: '',
      email: '',
    }
  });

  // 4. Effect to reset form when profile data loads or changes
  useEffect(() => {
    if (profile) {
      reset({
        fullName: profile.full_name || '',
        email: user?.email || '',
      });
    } else if (user) {
      reset({ fullName: '', email: user.email || '' });
    }
  }, [profile, user, reset]);

  // 5. Handle form submission
  const onSubmit: SubmitHandler<ProfileFormData> = (data) => {
    if (!profile) {
      toast.error("Cannot update profile: profile data not loaded.");
      return;
    }
    const updates: ProfileUpdate = {
      full_name: data.fullName,
    };

    updateProfileMutation(updates);
  };

  // Handle loading and error states
  if (isLoadingProfile) {
    return <div>Loading profile...</div>;
  }

  if (profileError) {
    return <div className="text-red-500">Error loading profile: {profileError.message}</div>;
  }

  // Render the form
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <h3 className="text-lg font-medium">Personal Information</h3>
      <div className="grid gap-2">
        <Label htmlFor="fullName">Full Name</Label>
        <Input
          id="fullName"
          {...register('fullName')}
          placeholder="Your full name"
          disabled={isUpdatingProfile}
        />
        {errors.fullName && <p className="text-red-500 text-sm">{errors.fullName.message}</p>}
      </div>

      <div className="grid gap-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          {...register('email')}
          disabled
        />
        <p className="text-sm text-muted-foreground">Email cannot be changed here.</p>
      </div>

      <Button type="submit" disabled={isUpdatingProfile || !isDirty}>
        {isUpdatingProfile ? 'Saving...' : 'Save Changes'}
      </Button>
    </form>
  );
}; 