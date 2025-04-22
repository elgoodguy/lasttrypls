import React, { useEffect } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { Button } from '@repo/ui';
import { Input } from '@repo/ui';
import { Label } from '@repo/ui';
import { useSupabase } from '@/providers/SupabaseProvider';
import { useAuth } from '@/providers/AuthProvider';
import { getProfile, updateProfile, Profile, ProfileUpdate } from '@repo/api-client';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';

// Define the form data structure
type ProfileFormData = {
  fullName: string;
  email: string; // Display only, not editable via this form
};

export const ProfileForm: React.FC = () => {
  const supabase = useSupabase();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  // 1. Query to fetch the user's profile data
  const {
    data: profile,
    isLoading: isLoadingProfile,
    error: profileError,
  } = useQuery<Profile | null>({
    queryKey: ['profile', user?.id],
    queryFn: () => getProfile(supabase),
    enabled: !!user,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  // 2. Mutation to update the profile
  const { mutate: updateProfileMutation, isPending: isUpdatingProfile } = useMutation({
    mutationFn: (updates: ProfileUpdate) => updateProfile(supabase, updates),
    onSuccess: updatedProfile => {
      queryClient.invalidateQueries({ queryKey: ['profile', user?.id] });
      toast.success(t('profile.personalInfo.updateSuccess'));
      reset({ fullName: updatedProfile.full_name || '', email: user?.email || '' });
    },
    onError: error => {
      console.error('Profile update failed:', error);
      toast.error(t('profile.personalInfo.updateError') + error.message);
    },
  });

  // 3. React Hook Form setup
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<ProfileFormData>({
    defaultValues: {
      fullName: '',
      email: '',
    },
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
  const onSubmit: SubmitHandler<ProfileFormData> = data => {
    if (!profile) {
      toast.error(t('profile.personalInfo.loadError'));
      return;
    }
    const updates: ProfileUpdate = {
      full_name: data.fullName,
    };

    updateProfileMutation(updates);
  };

  // Handle loading and error states
  if (isLoadingProfile) {
    return <div>{t('common.loading')}</div>;
  }

  if (profileError) {
    return <div className="text-red-500">{t('profile.personalInfo.loadError')}: {profileError.message}</div>;
  }

  // Render the form
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <h3 className="text-lg font-medium">{t('profile.personalInfo.title')}</h3>
      <div className="grid gap-2">
        <Label htmlFor="fullName">{t('profile.personalInfo.fullName')}</Label>
        <Input
          id="fullName"
          {...register('fullName', { required: t('profile.personalInfo.fullNameRequired') })}
          placeholder={t('profile.personalInfo.fullNamePlaceholder')}
          className={errors.fullName ? 'border-red-500' : ''}
        />
        {errors.fullName && (
          <p className="text-sm text-red-500">{errors.fullName.message}</p>
        )}
      </div>

      <div className="grid gap-2">
        <Label htmlFor="email">{t('profile.personalInfo.email')}</Label>
        <Input
          id="email"
          type="email"
          value={user?.email || ''}
          disabled
          placeholder={t('profile.personalInfo.emailPlaceholder')}
        />
      </div>

      <Button type="submit" disabled={!isDirty || isUpdatingProfile}>
        {isUpdatingProfile ? t('common.saving') : t('profile.personalInfo.saveChanges')}
      </Button>
    </form>
  );
};
