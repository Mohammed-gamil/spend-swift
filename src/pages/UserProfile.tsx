import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  User, 
  Mail, 
  Phone, 
  Building2, 
  Shield, 
  Bell, 
  Globe, 
  Key,
  Camera,
  Save,
  Eye,
  EyeOff
} from 'lucide-react';
import { useAuthStore } from '@/stores/authStore';
import { useTranslation } from '@/hooks/use-translation';
import { toast } from 'react-hot-toast';
import { profileApi } from '@/lib/api';

const profileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().optional(),
  position: z.string().optional(),
  bio: z.string().max(500, 'Bio must be less than 500 characters').optional(),
});

const passwordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string().min(1, 'Please confirm your password'),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type ProfileFormData = z.infer<typeof profileSchema>;
type PasswordFormData = z.infer<typeof passwordSchema>;

export default function UserProfile() {
  const { t } = useTranslation();
  const { user, updateUser } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Profile form
  const profileForm = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || '',
      position: user?.position || '',
      bio: '',
    },
  });

  // Password form
  const passwordForm = useForm<PasswordFormData>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  // Notification settings
  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    sms: false,
    request_updates: true,
    approval_reminders: true,
    system_updates: false,
  });

  // Load notification preferences on component mount
  useEffect(() => {
    const loadNotificationPreferences = async () => {
      try {
        const response = await profileApi.getNotificationPreferences();
        setNotifications(response.preferences);
      } catch (error) {
        console.error('Failed to load notification preferences:', error);
      }
    };

    if (user) {
      loadNotificationPreferences();
    }
  }, [user]);

  const onSubmitProfile = async (data: ProfileFormData) => {
    setIsLoading(true);
    try {
      const response = await profileApi.updateProfile({
        name: data.name,
        phone: data.phone || '',
        position: data.position || '',
        bio: data.bio || '',
      });
      
      // Update user in store
      if (user) {
        updateUser({
          ...user,
          name: data.name,
          phone: data.phone,
          position: data.position,
        });
      }
      
      toast.success(response.message || 'Profile updated successfully!');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmitPassword = async (data: PasswordFormData) => {
    setIsLoading(true);
    try {
      const response = await profileApi.changePassword({
        current_password: data.currentPassword,
        new_password: data.newPassword,
        confirm_password: data.confirmPassword,
      });
      
      toast.success(response.message || 'Password changed successfully!');
      passwordForm.reset();
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to change password';
      const errors = error.response?.data?.errors;
      
      if (errors?.current_password) {
        toast.error(errors.current_password[0]);
      } else {
        toast.error(errorMessage);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleAvatarUpload = () => {
    // Create a file input element
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        setIsLoading(true);
        try {
          const response = await profileApi.uploadAvatar(file);
          toast.success(response.message || 'Avatar uploaded successfully!');
          
          // Update user in store
          if (user) {
            updateUser({
              ...user,
              avatar: response.avatar_url,
            });
          }
        } catch (error: any) {
          toast.error(error.response?.data?.message || 'Failed to upload avatar');
        } finally {
          setIsLoading(false);
        }
      }
    };
    input.click();
  };

  const handleSaveNotifications = async () => {
    setIsLoading(true);
    try {
      const response = await profileApi.updateNotificationPreferences(notifications);
      toast.success(response.message || 'Notification preferences saved!');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to save preferences');
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">Please log in to view your profile.</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold gradient-text">Profile Settings</h1>
          <p className="text-muted-foreground mt-1">
            Manage your account settings and preferences
          </p>
        </div>
      </div>

      {/* Profile Overview Card */}
      <Card className="border-primary/20">
        <CardContent className="pt-6">
          <div className="flex items-start gap-6">
            <div className="relative">
              <Avatar className="h-24 w-24 border-4 border-primary/20">
                <AvatarImage src={user.avatar} />
                <AvatarFallback className="text-2xl font-bold bg-gradient-primary text-white">
                  {user.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <Button
                size="sm"
                className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full"
                onClick={handleAvatarUpload}
              >
                <Camera className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="flex-1">
              <h2 className="text-2xl font-semibold">{user.name}</h2>
              <p className="text-muted-foreground">{user.email}</p>
              {user.position && (
                <p className="text-sm text-muted-foreground mt-1">{user.position}</p>
              )}
              
              <div className="flex items-center gap-4 mt-4">
                <Badge variant="outline" className="bg-primary/10">
                  <Shield className="h-3 w-3 mr-1" />
                  {user.role}
                </Badge>
                {user.department_id && (
                  <Badge variant="outline">
                    <Building2 className="h-3 w-3 mr-1" />
                    Department {user.department_id}
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Settings Tabs */}
      <Tabs defaultValue="profile" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="profile" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            Profile
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-2">
            <Key className="h-4 w-4" />
            Security
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="preferences" className="flex items-center gap-2">
            <Globe className="h-4 w-4" />
            Preferences
          </TabsTrigger>
        </TabsList>

        {/* Profile Tab */}
        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>
                Update your personal details and contact information
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={profileForm.handleSubmit(onSubmitProfile)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="name"
                        placeholder="Enter your full name"
                        className="pl-10"
                        {...profileForm.register('name')}
                      />
                    </div>
                    {profileForm.formState.errors.name && (
                      <p className="text-sm text-destructive">
                        {profileForm.formState.errors.name.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="Enter your email"
                        className="pl-10"
                        disabled
                        {...profileForm.register('email')}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Email cannot be changed. Contact administrator if needed.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="phone"
                        placeholder="Enter your phone number"
                        className="pl-10"
                        {...profileForm.register('phone')}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="position">Position</Label>
                    <div className="relative">
                      <Building2 className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="position"
                        placeholder="Enter your position"
                        className="pl-10"
                        {...profileForm.register('position')}
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    placeholder="Tell us about yourself..."
                    className="min-h-[100px]"
                    {...profileForm.register('bio')}
                  />
                  <p className="text-xs text-muted-foreground">
                    Maximum 500 characters
                  </p>
                </div>

                <div className="flex justify-end">
                  <Button type="submit" disabled={isLoading}>
                    {isLoading && <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />}
                    <Save className="mr-2 h-4 w-4" />
                    Save Changes
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Tab */}
        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
              <CardDescription>
                Manage your password and security preferences
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={passwordForm.handleSubmit(onSubmitPassword)} className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="currentPassword">Current Password</Label>
                    <div className="relative">
                      <Key className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="currentPassword"
                        type={showCurrentPassword ? 'text' : 'password'}
                        placeholder="Enter your current password"
                        className="pl-10 pr-10"
                        {...passwordForm.register('currentPassword')}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3"
                        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                      >
                        {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                    {passwordForm.formState.errors.currentPassword && (
                      <p className="text-sm text-destructive">
                        {passwordForm.formState.errors.currentPassword.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="newPassword">New Password</Label>
                    <div className="relative">
                      <Key className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="newPassword"
                        type={showNewPassword ? 'text' : 'password'}
                        placeholder="Enter your new password"
                        className="pl-10 pr-10"
                        {...passwordForm.register('newPassword')}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                      >
                        {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                    {passwordForm.formState.errors.newPassword && (
                      <p className="text-sm text-destructive">
                        {passwordForm.formState.errors.newPassword.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm New Password</Label>
                    <div className="relative">
                      <Key className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="confirmPassword"
                        type={showConfirmPassword ? 'text' : 'password'}
                        placeholder="Confirm your new password"
                        className="pl-10 pr-10"
                        {...passwordForm.register('confirmPassword')}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      >
                        {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                    {passwordForm.formState.errors.confirmPassword && (
                      <p className="text-sm text-destructive">
                        {passwordForm.formState.errors.confirmPassword.message}
                      </p>
                    )}
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Password Requirements</h3>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• At least 8 characters long</li>
                    <li>• Contains uppercase and lowercase letters</li>
                    <li>• Contains at least one number</li>
                    <li>• Contains at least one special character</li>
                  </ul>
                </div>

                <div className="flex justify-end">
                  <Button type="submit" disabled={isLoading}>
                    {isLoading && <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />}
                    <Key className="mr-2 h-4 w-4" />
                    Change Password
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications Tab */}
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>
                Choose how you want to receive notifications
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Notification Channels</h3>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Email Notifications</Label>
                      <p className="text-sm text-muted-foreground">
                        Receive notifications via email
                      </p>
                    </div>
                    <Switch
                      checked={notifications.email}
                      onCheckedChange={(checked) => 
                        setNotifications(prev => ({ ...prev, email: checked }))
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Push Notifications</Label>
                      <p className="text-sm text-muted-foreground">
                        Receive browser push notifications
                      </p>
                    </div>
                    <Switch
                      checked={notifications.push}
                      onCheckedChange={(checked) => 
                        setNotifications(prev => ({ ...prev, push: checked }))
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>SMS Notifications</Label>
                      <p className="text-sm text-muted-foreground">
                        Receive text message notifications
                      </p>
                    </div>
                    <Switch
                      checked={notifications.sms}
                      onCheckedChange={(checked) => 
                        setNotifications(prev => ({ ...prev, sms: checked }))
                      }
                    />
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Notification Types</h3>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Request Updates</Label>
                      <p className="text-sm text-muted-foreground">
                        Get notified when your requests are updated
                      </p>
                    </div>
                    <Switch
                      checked={notifications.request_updates}
                      onCheckedChange={(checked) => 
                        setNotifications(prev => ({ ...prev, request_updates: checked }))
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Approval Reminders</Label>
                      <p className="text-sm text-muted-foreground">
                        Get reminded about pending approvals
                      </p>
                    </div>
                    <Switch
                      checked={notifications.approval_reminders}
                      onCheckedChange={(checked) => 
                        setNotifications(prev => ({ ...prev, approval_reminders: checked }))
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>System Updates</Label>
                      <p className="text-sm text-muted-foreground">
                        Get notified about system maintenance and updates
                      </p>
                    </div>
                    <Switch
                      checked={notifications.system_updates}
                      onCheckedChange={(checked) => 
                        setNotifications(prev => ({ ...prev, system_updates: checked }))
                      }
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <Button onClick={handleSaveNotifications} disabled={isLoading}>
                  {isLoading && <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />}
                  <Save className="mr-2 h-4 w-4" />
                  Save Preferences
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Preferences Tab */}
        <TabsContent value="preferences">
          <Card>
            <CardHeader>
              <CardTitle>Application Preferences</CardTitle>
              <CardDescription>
                Customize your application experience
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>Language</Label>
                  <Select defaultValue={user?.language_preference || "en"}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select language" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="ar">العربية</SelectItem>
                      <SelectItem value="fr">Français</SelectItem>
                      <SelectItem value="es">Español</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Time Zone</Label>
                  <Select defaultValue={user?.timezone || "UTC"}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select timezone" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="UTC">UTC (GMT+0)</SelectItem>
                      <SelectItem value="America/New_York">Eastern Time (GMT-5)</SelectItem>
                      <SelectItem value="America/Los_Angeles">Pacific Time (GMT-8)</SelectItem>
                      <SelectItem value="Europe/London">Central European Time (GMT+1)</SelectItem>
                      <SelectItem value="Australia/Sydney">Australian Eastern Time (GMT+10)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Date Format</Label>
                  <Select defaultValue={user?.date_format || "Y-m-d"}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select date format" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="d/m/Y">DD/MM/YYYY</SelectItem>
                      <SelectItem value="m/d/Y">MM/DD/YYYY</SelectItem>
                      <SelectItem value="Y-m-d">YYYY-MM-DD</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Currency</Label>
                  <Select defaultValue={user?.currency || "USD"}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select currency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="USD">USD ($)</SelectItem>
                      <SelectItem value="EUR">EUR (€)</SelectItem>
                      <SelectItem value="GBP">GBP (£)</SelectItem>
                      <SelectItem value="EGP">EGP (£E)</SelectItem>
                      <SelectItem value="SAR">SAR (SR)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex justify-end">
                <Button onClick={() => toast.success('Preferences saved!')}>
                  <Save className="mr-2 h-4 w-4" />
                  Save Preferences
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}