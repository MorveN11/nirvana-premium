'use client';

import { useUser } from '@clerk/nextjs';
import { zodResolver } from '@hookform/resolvers/zod';
import { CheckIcon, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';

import LoadingButton from '@/components/forms/loading-button';
import LocationInput from '@/components/forms/location-input';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { mockLanguages, mockSkills } from '@/features/jobs/lib/mock';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import { toast } from 'sonner';
import { Step } from '../lib/types';
import { developerFormSchema, DeveloperFormValues } from '../lib/validations';

interface StepFields {
  personal: ['firstName', 'lastName'];
  skills: ['skills', 'specialty', 'yearsOfExperience', 'spokenLanguages'];
  preferences: ['modality', 'expectedSalary', 'portfolioUrl'];
}

export default function DeveloperOnboardingForm() {
  const { user, isSignedIn, isLoaded } = useUser();
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);

  const form = useForm<DeveloperFormValues>({
    resolver: zodResolver(developerFormSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      location: '',
      skills: [],
      specialization: 'Frontend',
      yearsOfExperience: 0,
      spokenLanguages: [],
      modality: 'Remote',
      expectedSalary: 0,
      portfolioUrl: '',
    },
  });

  const {
    handleSubmit,
    watch,
    setValue,
    control,
    formState: { isSubmitting },
  } = form;

  const onSubmit = async (data: DeveloperFormValues) => {
    if (!user) return;

    try {
      await user.update({
        unsafeMetadata: {
          ...user.unsafeMetadata,
          onboardingComplete: true,
        },
      });

      console.log('Developer data ready for backend:', data);

      toast.success('Profile created successfully!');
      router.push('/dashboard');
    } catch (error) {
      console.error('Error updating onboarding status:', error);
      toast.error('Something went wrong. Please try again.');
    }
  };

  const stepFields: StepFields = {
    personal: ['firstName', 'lastName'],
    skills: ['skills', 'specialty', 'yearsOfExperience', 'spokenLanguages'],
    preferences: ['modality', 'expectedSalary', 'portfolioUrl'],
  } as const;

  const steps: Step[] = [
    {
      id: 'personal',
      name: 'Personal Information',
    },
    {
      id: 'skills',
      name: 'Skills & Experience',
    },
    {
      id: 'preferences',
      name: 'Work Preferences',
    },
  ];

  const nextStep = async () => {
    const fields = stepFields[steps[currentStep].id];
    const isValid = await form.trigger(fields);

    if (isValid) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const previousStep = () => {
    setCurrentStep((prev) => prev - 1);
  };

  if (!isLoaded || !isSignedIn) {
    return null;
  }

  return (
    <div className="container mx-auto max-w-3xl py-8">
      <div className="mb-8">
        <nav aria-label="Progress">
          <ol role="list" className="flex items-center">
            {steps.map((step, index) => (
              <li
                key={step.id}
                className={cn(
                  'relative',
                  index !== steps.length - 1 ? 'pr-8 sm:pr-20' : '',
                  'flex items-center',
                )}
              >
                <div
                  className={cn(
                    'relative flex h-8 w-8 items-center justify-center rounded-full',
                    currentStep > index
                      ? 'bg-primary text-primary-foreground'
                      : currentStep === index
                        ? 'border-2 border-primary bg-background'
                        : 'border-2 border-muted bg-background',
                  )}
                >
                  {currentStep > index ? (
                    <CheckIcon className="h-5 w-5" />
                  ) : (
                    <span>{index + 1}</span>
                  )}
                </div>
                {index !== steps.length - 1 && (
                  <div
                    className={cn(
                      'absolute left-0 top-4 -z-10 h-0.5 w-full',
                      currentStep > index ? 'bg-primary' : 'bg-muted',
                    )}
                  />
                )}
                <span className="absolute left-0 top-10 text-sm font-medium">{step.name}</span>
              </li>
            ))}
          </ol>
        </nav>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{steps[currentStep].name}</CardTitle>
          <CardDescription>
            {currentStep === 0
              ? 'Enter your personal information'
              : currentStep === 1
                ? 'Tell us about your skills and experience'
                : 'Share your work preferences'}
          </CardDescription>
        </CardHeader>
        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <CardContent className="space-y-4">
              {currentStep === 0 && (
                <>
                  <FormField
                    control={control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>First Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter your first name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={control}
                    name="lastName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Last Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter your last name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={control}
                    name="location"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Location</FormLabel>
                        <FormControl>
                          <LocationInput onLocationSelected={field.onChange} ref={field.ref} />
                        </FormControl>
                        {watch('location') && (
                          <div className="flex items-center gap-1">
                            <button
                              type="button"
                              onClick={() => {
                                setValue('location', '', {
                                  shouldValidate: true,
                                });
                              }}
                            >
                              <X className="h-5 w-5" />
                            </button>
                            <span className="text-sm">{watch('location')}</span>
                          </div>
                        )}
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </>
              )}

              {currentStep === 1 && (
                <>
                  <FormField
                    control={control}
                    name="skills"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Required Skills</FormLabel>
                        <div className="grid grid-cols-3 gap-4">
                          {mockSkills.map((skill) => (
                            <FormItem
                              key={skill.id}
                              className="flex items-start space-x-3 space-y-0"
                            >
                              <FormControl>
                                <Checkbox
                                  checked={field.value.includes(skill.id)}
                                  onCheckedChange={(checked) => {
                                    const newValue = checked
                                      ? [...field.value, skill.id]
                                      : field.value.filter((value) => value !== skill.id);
                                    field.onChange(newValue);
                                  }}
                                />
                              </FormControl>
                              <FormLabel className="font-normal">{skill.name}</FormLabel>
                            </FormItem>
                          ))}
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={control}
                    name="specialization"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Specialization</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select specialization" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Frontend">Frontend</SelectItem>
                            <SelectItem value="Backend">Backend</SelectItem>
                            <SelectItem value="DevOps">DevOps</SelectItem>
                            <SelectItem value="Architect">Architect</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="yearsOfExperience"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Years of Experience</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            {...field}
                            onChange={(e) => field.onChange(Number(e.target.value))}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={control}
                    name="spokenLanguages"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Required Languages</FormLabel>
                        <div className="grid grid-cols-3 gap-4">
                          {mockLanguages.map((language) => (
                            <FormItem
                              key={language.id}
                              className="flex items-start space-x-3 space-y-0"
                            >
                              <FormControl>
                                <Checkbox
                                  checked={field.value.includes(language.id)}
                                  onCheckedChange={(checked) => {
                                    const newValue = checked
                                      ? [...field.value, language.id]
                                      : field.value.filter((value) => value !== language.id);
                                    field.onChange(newValue);
                                  }}
                                />
                              </FormControl>
                              <FormLabel className="font-normal">{language.name}</FormLabel>
                            </FormItem>
                          ))}
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </>
              )}

              {currentStep === 2 && (
                <>
                  <FormField
                    control={control}
                    name="modality"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Modality</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select modality" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Remote">Remote</SelectItem>
                            <SelectItem value="OnSite">On Site</SelectItem>
                            <SelectItem value="Hybrid">Hybrid</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={control}
                    name="expectedSalary"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Expected Hourly Rate (USD)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            {...field}
                            onChange={(e) => field.onChange(Number(e.target.value))}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={control}
                    name="portfolioUrl"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Portfolio URL</FormLabel>
                        <FormControl>
                          <Input placeholder="https://your-portfolio.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={control}
                    name="profilePicture"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Upload a profile image</FormLabel>
                        <FormControl>
                          <Input type="file" accept="image/*" placeholder="A file" {...field} />
                        </FormControl>
                        <FormDescription>Upload your profile picture</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </>
              )}
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button
                type="button"
                variant="outline"
                onClick={previousStep}
                disabled={currentStep === 0}
              >
                Previous
              </Button>
              {currentStep === steps.length - 1 ? (
                <LoadingButton type="submit" loading={isSubmitting} disabled={isSubmitting}>
                  {isSubmitting ? 'Submitting...' : 'Complete Profile'}
                </LoadingButton>
              ) : (
                <Button type="button" onClick={nextStep}>
                  Next
                </Button>
              )}
            </CardFooter>
          </form>
        </Form>
      </Card>
    </div>
  );
}