'use client';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useRegistrationStore } from '@/stores/use-registration-store';
import { SignUp, useSignUp } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';

const SignUpPage = () => {
  const router = useRouter();
  const [selectedRole, setSelectedRole] = useState<'developer' | 'recruiter' | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showRoleDialog, setShowRoleDialog] = useState(false);
  const { isLoaded, signUp } = useSignUp();
  const { setRegistrationData } = useRegistrationStore();

  useEffect(() => {
    const hasRole = localStorage.getItem('selectedRole');
    if (!hasRole) {
      setShowRoleDialog(true);
    } else {
      setSelectedRole(hasRole as 'developer' | 'recruiter');
    }
  }, []);

  const handleRoleSelect = (value: 'developer' | 'recruiter') => {
    setSelectedRole(value);
    localStorage.setItem('selectedRole', value);
    setShowRoleDialog(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoaded || !selectedRole) return;

    try {
      const formData = new FormData(e.target as HTMLFormElement);
      const email = formData.get('emailAddress') as string;
      const password = formData.get('password') as string;

      const result = await signUp.create({
        emailAddress: email,
        password,
        unsafeMetadata: {
          role: selectedRole,
          onboardingComplete: false,
        },
      });

      setRegistrationData({
        id: result.createdUserId!,
        role: selectedRole,
        email,
      });

      router.push('/onboarding/');
    } catch (err) {
      console.error('Error during signup:', err);
      setError(err instanceof Error ? err.message : 'An error occurred during signup');
    }
  };

  const handleChangeRole = () => {
    setShowRoleDialog(true);
  };

  return (
    <div className="flex min-h-[calc(100vh-3.5rem)] items-center justify-center bg-secondary p-4">
      <div className="w-full max-w-md">
        <Card className="w-full">
          <CardHeader className="space-y-2">
            <CardTitle className="text-xl md:text-2xl">Create your account</CardTitle>
            <CardDescription>
              Join our platform to find opportunities or great talent
            </CardDescription>
            {selectedRole && (
              <div className="mt-2 flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  Selected role: <span className="font-medium capitalize">{selectedRole}</span>
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleChangeRole}
                  className="text-xs hover:bg-secondary"
                >
                  Change role
                </Button>
              </div>
            )}
          </CardHeader>
          <CardContent>
            {error && (
              <Alert variant="destructive" className="mb-4">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Dialog open={showRoleDialog} onOpenChange={setShowRoleDialog}>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Choose your role</DialogTitle>
                  <DialogDescription>Select how you want to use our platform</DialogDescription>
                </DialogHeader>
                <RadioGroup
                  defaultValue={selectedRole || undefined}
                  onValueChange={(value) => handleRoleSelect(value as 'developer' | 'recruiter')}
                  className="flex flex-col space-y-3"
                >
                  <div
                    className="flex cursor-pointer items-center space-x-3 rounded-lg border p-4 transition-colors hover:bg-accent"
                    onClick={() => handleRoleSelect('developer')}
                  >
                    <RadioGroupItem value="developer" id="developer" className="h-5 w-5" />
                    <Label
                      htmlFor="developer"
                      className="flex w-full cursor-pointer flex-col gap-1"
                    >
                      <span className="font-semibold">Developer</span>
                      <span className="text-sm text-muted-foreground">
                        Find your first job opportunity in tech
                      </span>
                    </Label>
                  </div>
                  <div
                    className="flex cursor-pointer items-center space-x-3 rounded-lg border p-4 transition-colors hover:bg-accent"
                    onClick={() => handleRoleSelect('recruiter')}
                  >
                    <RadioGroupItem value="recruiter" id="recruiter" className="h-5 w-5" />
                    <Label
                      htmlFor="recruiter"
                      className="flex w-full cursor-pointer flex-col gap-1"
                    >
                      <span className="font-semibold">Recruiter</span>
                      <span className="text-sm text-muted-foreground">
                        Find great talent for your company
                      </span>
                    </Label>
                  </div>
                </RadioGroup>
              </DialogContent>
            </Dialog>

            {selectedRole && (
              <form onSubmit={handleSubmit}>
                <SignUp
                  path="/sign-up"
                  routing="path"
                  signInUrl="/sign-in"
                  unsafeMetadata={{
                    role: selectedRole,
                    onboardingComplete: false,
                  }}
                />
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SignUpPage;