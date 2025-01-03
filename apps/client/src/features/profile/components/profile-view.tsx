'use client';
import LoadingScreen from '@/components/loading/loading-screen';
import { cn } from '@/lib/utils';
import { Roles } from '@/types/globals';
import { useEffect, useState } from 'react';
import type { ProfileData } from '../types';
import { SectionRenderer } from './sections/section-renderer';

interface ProfileViewProps {
  data: string;
  role: Roles;
}

export function ProfileView({ data, role }: ProfileViewProps) {
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      const parsed = JSON.parse(data);

      if (!parsed.sections || !parsed.theme || !parsed.metadata) {
        throw new Error('Invalid profile data structure');
      }

      setProfile(parsed as ProfileData);
      setError(null);
    } catch (error) {
      console.error('Failed to parse profile data:', error);
      setError('Failed to load profile data');
    }
  }, [data]);

  if (error) {
    return (
      <div className="p-6 bg-destructive/10 rounded-lg text-center">
        <p className="text-destructive">{error}</p>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="p-6 bg-muted rounded-lg text-center">
        <LoadingScreen />
      </div>
    );
  }

  const { theme, sections } = profile;

  return (
    <div
      className={cn('mx-auto', {
        'space-y-4': theme.layout.spacing === 'compact',
        'space-y-6': theme.layout.spacing === 'comfortable',
        'space-y-8': theme.layout.spacing === 'spacious',
      })}
    >
      {sections
        .sort((a, b) => a.layout.order - b.layout.order)
        .map((section) => (
          <SectionRenderer
            key={section.id}
            section={section}
            role={role}
            className={cn(
              'rounded-lg',
              {
                'bg-card shadow-sm': theme.layout.style === 'card',
                'bg-background': theme.layout.style === 'minimal',
                'bg-background border border-border': theme.layout.style === 'flat',
              },
              'p-6',
            )}
            theme={theme}
          />
        ))}
    </div>
  );
}
