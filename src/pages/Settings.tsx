
import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Settings as SettingsIcon, Lock, Bell, Shield, Loader2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface PasswordFormData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

const Settings: React.FC = () => {
  const { admin } = useAuth();
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [twoFactorAuth, setTwoFactorAuth] = useState(false);

  const passwordForm = useForm<PasswordFormData>({
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    }
  });

  const onPasswordSubmit = async (data: PasswordFormData) => {
    if (data.newPassword !== data.confirmPassword) {
      toast({
        title: "Error",
        description: "New passwords do not match",
        variant: "destructive",
      });
      return;
    }

    if (data.newPassword.length < 6) {
      toast({
        title: "Error",
        description: "Password must be at least 6 characters long",
        variant: "destructive",
      });
      return;
    }

    setIsChangingPassword(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Password Updated",
        description: "Your password has been successfully changed.",
      });
      
      passwordForm.reset();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update password. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsChangingPassword(false);
    }
  };

  const handleNotificationChange = (checked: boolean) => {
    setEmailNotifications(checked);
    toast({
      title: "Settings Updated",
      description: `Email notifications ${checked ? 'enabled' : 'disabled'}.`,
    });
  };

  const handleTwoFactorChange = (checked: boolean) => {
    setTwoFactorAuth(checked);
    toast({
      title: "Settings Updated",
      description: `Two-factor authentication ${checked ? 'enabled' : 'disabled'}.`,
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600">Manage your account preferences and security</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Change Password */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Lock className="w-5 h-5" />
              <span>Change Password</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...passwordForm}>
              <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-4">
                <FormField
                  control={passwordForm.control}
                  name="currentPassword"
                  rules={{ required: 'Current password is required' }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Current Password</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="Enter current password" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={passwordForm.control}
                  name="newPassword"
                  rules={{ 
                    required: 'New password is required',
                    minLength: {
                      value: 6,
                      message: 'Password must be at least 6 characters'
                    }
                  }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>New Password</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="Enter new password" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={passwordForm.control}
                  name="confirmPassword"
                  rules={{ required: 'Please confirm your new password' }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirm New Password</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="Confirm new password" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" disabled={isChangingPassword}>
                  {isChangingPassword && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Change Password
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        {/* Notification & Security Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <SettingsIcon className="w-5 h-5" />
              <span>Preferences</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Notifications */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Bell className="w-4 h-4" />
                <Label className="text-sm font-medium">Notifications</Label>
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-sm">Email Notifications</Label>
                  <p className="text-xs text-gray-500">
                    Receive email alerts for important updates
                  </p>
                </div>
                <Switch
                  checked={emailNotifications}
                  onCheckedChange={handleNotificationChange}
                />
              </div>
            </div>

            <Separator />

            {/* Security */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Shield className="w-4 h-4" />
                <Label className="text-sm font-medium">Security</Label>
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-sm">Two-Factor Authentication</Label>
                  <p className="text-xs text-gray-500">
                    Add an extra layer of security to your account
                  </p>
                </div>
                <Switch
                  checked={twoFactorAuth}
                  onCheckedChange={handleTwoFactorChange}
                />
              </div>
            </div>

            <Separator />

            {/* Account Info */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Account Information</Label>
              <div className="text-sm text-gray-600">
                <p>Account ID: {admin?.id}</p>
                <p>Member since: {new Date().toLocaleDateString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Settings;
