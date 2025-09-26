'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, CheckCircle, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import StepApplicationForm from '@/components/step-form';
import { toast } from 'sonner';
import { usePlayerStorage } from '@/hooks/use-player-storage';

import { FormStep } from '@/components/step-form';
import { User, Calendar, Shield, Trophy } from 'lucide-react';

export const playerFormSteps: FormStep[] = [
    {
        title: "Personal Info",
        description: "Basic player information",
        icon: <User className="w-5 h-5" />,
        fields: [
            {
                name: "firstName",
                label: "First name",
                type: "text",
                required: true,
            },
            {
                name: "lastName",
                label: "Last name", 
                type: "text",
                required: true,
            },
            {
                name: "birthday",
                label: "Birthday",
                type: "date",
                required: true,
            },
            {
                name: "avatar",
                label: "Player Photo (optional)",
                type: "file",
                required: false,
                accept: "image/*"
            }
        ]
    },
    {
        title: "Player Details",
        description: "Position and skill information",
        icon: <Trophy className="w-5 h-5" />,
        fields: [
            {
                name: "position",
                label: "Preferred Position",
                type: "select",
                required: true,
                options: [
                    "Goalkeeper",
                    "Defender", 
                    "Midfielder",
                    "Forward",
                    "Winger"
                ],
            },
            {
                name: "skillLevel",
                label: "Skill Level",
                type: "select",
                required: true,
                options: [
                    "Beginner",
                    "Intermediate", 
                    "Advanced",
                    "Professional"
                ],
            },
            {
                name: "previousExperience",
                label: "Previous Club/Team Experience",
                type: "textarea",
                required: false,
                placeholder: "Tell us about your football experience..."
            }
        ]
    },
    {
        title: "Additional Info",
        description: "License and category details", 
        icon: <Shield className="w-5 h-5" />,
        fields: [
            {
                name: "licensed",
                label: "Licensed Player",
                type: "select",
                required: true,
                options: [
                    { label: "Yes", value: "yes" },
                    { label: "No", value: "no" }
                ]
            },
            {
                name: "clubCategory",
                label: "Club Category",
                type: "select",
                required: false,
                options: [
                    "Youth Academy",
                    "Amateur Club",
                    "Semi-Professional",
                    "Professional",
                    "Recreational"
                ],
            },
            {
                name: "genderCategory", 
                label: "Gender Category",
                type: "select",
                required: true,
                options: [
                    "Male",
                    "Female", 
                    "Mixed",
                    "Other"
                ],
            }
        ]
    },
    {
        title: "Final Details",
        description: "Complete player registration",
        icon: <Calendar className="w-5 h-5" />,
        fields: [
            {
                name: "medicalConditions",
                label: "Medical Conditions or Allergies",
                type: "textarea",
                required: false,
                placeholder: "Any medical conditions we should be aware of..."
            },
            {
                name: "emergencyContact",
                label: "Emergency Contact Name",
                type: "text",
                required: true,
            },
            {
                name: "emergencyPhone",
                label: "Emergency Contact Phone",
                type: "phone",
                required: true,
                placeholder: "+1 (555) 000-0000"
            },
            {
                name: "parentalConsent",
                label: "I confirm parental consent for players under 18",
                type: "checkbox",
                required: true,
                condition: (formData: any) => {
                    if (!formData.birthday) return false;
                    const age = new Date().getFullYear() - new Date(formData.birthday).getFullYear();
                    return age < 18;
                }
            },
            {
                name: "termsAgreement",
                label: "I agree to the club terms and conditions",
                type: "checkbox", 
                required: true,
            }
        ]
    }
];


const CreatePlayerPage: React.FC = () => {
  const router = useRouter();
  const { addPlayer } = usePlayerStorage();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [createdPlayer, setCreatedPlayer] = useState<any>(null);

  const handleSubmit = async (formData: any) => {
    setIsSubmitting(true);
    
    try {
      // Simulate processing time for better UX
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Process avatar if uploaded
      let avatarUrl = undefined;
      if (formData.avatar && formData.avatar[0]) {
        // Convert file to base64 for localStorage
        const file = formData.avatar[0];
        const reader = new FileReader();
        
        avatarUrl = await new Promise<string>((resolve) => {
          reader.onload = (e) => resolve(e.target?.result as string);
          reader.readAsDataURL(file);
        });
      }

      // Calculate age from birthday
      const age = new Date().getFullYear() - new Date(formData.birthday).getFullYear();

      // Create player profile
      const playerData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        birthday: formData.birthday,
        position: formData.position,
        skillLevel: formData.skillLevel as 'Beginner' | 'Intermediate' | 'Advanced' | 'Professional',
        licensed: formData.licensed as 'yes' | 'no',
        clubCategory: formData.clubCategory,
        genderCategory: formData.genderCategory,
        previousExperience: formData.previousExperience,
        medicalConditions: formData.medicalConditions,
        emergencyContact: formData.emergencyContact,
        emergencyPhone: formData.emergencyPhone,
        avatar: avatarUrl,
      };

      // Add player to localStorage
      const newPlayer = addPlayer(playerData);
      setCreatedPlayer(newPlayer);
      setSubmitSuccess(true);

      // Show success toast
      toast.success('Player profile created successfully!', {
        description: `${formData.firstName} ${formData.lastName} has been added to your team.`,
      });

    } catch (error) {
      console.error('Error creating player:', error);
      toast.error('Failed to create player profile', {
        description: 'Please try again or contact support if the problem persists.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoToPlayers = () => {
    router.push('/players');
  };

  const handleCreateAnother = () => {
    setSubmitSuccess(false);
    setCreatedPlayer(null);
    window.location.reload(); // Reset form
  };

  // Success State
  if (submitSuccess && createdPlayer) {
    return (
      <div className="min-h-screen bg-background">
        {/* Header */}
        <div className="sticky top-0 z-40 bg-background/80 backdrop-blur-sm border-b border-border">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center space-x-4">
              <Button 
                variant="ghost" 
                size="icon"
                onClick={handleGoToPlayers}
                className="transition-all duration-300 hover:scale-110 hover:bg-accent"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-foreground">Player Created Successfully!</h1>
                <p className="text-sm text-muted-foreground">Profile has been saved to your team</p>
              </div>
            </div>
          </div>
        </div>

        {/* Success Content */}
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-2xl mx-auto">
            <Card className="border-green-200 bg-green-50/50 animate-in fade-in slide-in-from-bottom-4 duration-1000">
              <CardContent className="p-8 text-center space-y-6">
                {/* Success Icon */}
                <div className="relative mx-auto w-20 h-20">
                  <div className="absolute inset-0 bg-green-500/20 rounded-full animate-pulse"></div>
                  <div className="relative w-20 h-20 bg-green-500 rounded-full flex items-center justify-center">
                    <CheckCircle className="h-10 w-10 text-white" />
                  </div>
                </div>

                {/* Success Message */}
                <div className="space-y-2">
                  <h2 className="text-2xl font-bold text-green-800">
                    Welcome to the team, {createdPlayer.firstName}!
                  </h2>
                  <p className="text-green-700">
                    Player profile has been successfully created and saved locally.
                  </p>
                </div>

                {/* Player Summary */}
                <div className="bg-white/50 rounded-lg p-6 space-y-4">
                  <div className="flex items-center justify-center space-x-4">
                    {createdPlayer.avatar ? (
                      <img 
                        src={createdPlayer.avatar} 
                        alt={`${createdPlayer.firstName} ${createdPlayer.lastName}`}
                        className="w-16 h-16 rounded-full object-cover border-2 border-green-200"
                      />
                    ) : (
                      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center border-2 border-green-200">
                        <span className="text-green-600 font-bold text-lg">
                          {createdPlayer.firstName[0]}{createdPlayer.lastName[0]}
                        </span>
                      </div>
                    )}
                    <div className="text-left">
                      <p className="font-semibold text-lg text-foreground">
                        {createdPlayer.firstName} {createdPlayer.lastName}
                      </p>
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline" className="text-xs">
                          {createdPlayer.position}
                        </Badge>
                        <Badge variant="secondary" className="text-xs">
                          {createdPlayer.skillLevel}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button 
                    onClick={handleGoToPlayers}
                    className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 transition-all duration-300 hover:scale-105"
                  >
                    View All Players
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={handleCreateAnother}
                    className="border-green-300 text-green-700 hover:bg-green-50 px-6 py-3 transition-all duration-300 hover:scale-105"
                  >
                    Create Another Player
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-background/80 backdrop-blur-sm border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center space-x-4">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => router.push('/players')}
              className="transition-all duration-300 hover:scale-110 hover:bg-accent"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Create Player Profile</h1>
              <p className="text-sm text-muted-foreground">Add a new player to your team</p>
            </div>
          </div>
        </div>
      </div>

      {/* Form Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Progress Info */}
          <div className="mb-8 text-center animate-in fade-in slide-in-from-top-4 duration-700">
            <div className="inline-flex items-center space-x-2 bg-primary/10 rounded-full px-4 py-2 text-sm font-medium text-primary">
              <AlertCircle className="h-4 w-4" />
              <span>Complete all steps to create the player profile</span>
            </div>
          </div>

          {/* Step Form */}
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-1000">
            <StepApplicationForm
              metaDataName="createPlayer"
              steps={playerFormSteps}
              onSubmit={handleSubmit}
              className="!max-w-none !my-0 !shadow-lg !bg-card !p-8 !rounded-2xl !border"
              allowStepNavigation={true}
              submitButtonText={isSubmitting ? "Creating Player..." : "Create Player" as string}
              isSubmitting={isSubmitting}
            />
          </div>

          {/* Help Text */}
          <div className="mt-8 text-center animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-300">
            <p className="text-sm text-muted-foreground">
              All player data is saved locally in your browser. 
              <br />
              You can manage and view players from the <Button variant="link" className="p-0 h-auto text-primary" onClick={handleGoToPlayers}>Players page</Button>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatePlayerPage;
