'use client';

import { useState } from 'react';
import {
  Settings,
  Globe,
  Shield,
  Bell,
  CreditCard,
  Save,
  Loader2,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export function SettingsPage() {
  const [saving, setSaving] = useState(false);

  // General
  const [siteName, setSiteName] = useState('Learnova');
  const [siteDescription, setSiteDescription] = useState(
    'A modern online learning platform'
  );
  const [contactEmail, setContactEmail] = useState('admin@learnova.com');
  const [supportPhone, setSupportPhone] = useState('+1 (555) 000-0000');
  const [maintenanceMode, setMaintenanceMode] = useState(false);

  // Security
  const [maxLoginAttempts, setMaxLoginAttempts] = useState('5');
  const [passwordMinLength, setPasswordMinLength] = useState('8');
  const [requireUppercase, setRequireUppercase] = useState(true);
  const [requireNumbers, setRequireNumbers] = useState(true);
  const [requireSymbols, setRequireSymbols] = useState(false);
  const [sessionTimeout, setSessionTimeout] = useState('30');
  const [twoFactorRequired, setTwoFactorRequired] = useState(false);

  // Notifications
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [newCourseAlert, setNewCourseAlert] = useState(true);
  const [newUserAlert, setNewUserAlert] = useState(true);
  const [withdrawalAlert, setWithdrawalAlert] = useState(true);
  const [systemAlerts, setSystemAlerts] = useState(true);

  // Payments
  const [currency, setCurrency] = useState('USD');
  const [taxRate, setTaxRate] = useState('10');
  const [minWithdrawal, setMinWithdrawal] = useState('50');
  const [payoutSchedule, setPayoutSchedule] = useState('monthly');
  const [enabledMethods, setEnabledMethods] = useState<string[]>([
    'credit_card',
    'paypal',
    'bank_transfer',
  ]);

  const togglePaymentMethod = (method: string) => {
    setEnabledMethods((prev) =>
      prev.includes(method)
        ? prev.filter((m) => m !== method)
        : [...prev, method]
    );
  };

  const handleSave = (section: string) => {
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
    }, 1000);
  };

  const paymentMethodOptions = [
    { id: 'credit_card', label: 'Credit Card', icon: CreditCard },
    { id: 'paypal', label: 'PayPal', icon: Globe },
    { id: 'bank_transfer', label: 'Bank Transfer', icon: CreditCard },
    { id: 'crypto', label: 'Crypto', icon: Shield },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">
          System Settings
        </h1>
        <p className="text-sm text-[#7C8597] mt-1">
          Configure platform settings and preferences
        </p>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="general" className="space-y-4">
        <TabsList className="bg-[#12131A] border border-[#2B2F3E] p-1 h-10 flex flex-wrap">
          <TabsTrigger
            value="general"
            className="data-[state=active]:bg-[#1D2030] data-[state=active]:text-white text-[#7C8597] text-sm font-medium rounded-lg px-4 transition-colors"
          >
            <Globe className="w-4 h-4 mr-1.5" />
            General
          </TabsTrigger>
          <TabsTrigger
            value="security"
            className="data-[state=active]:bg-[#1D2030] data-[state=active]:text-white text-[#7C8597] text-sm font-medium rounded-lg px-4 transition-colors"
          >
            <Shield className="w-4 h-4 mr-1.5" />
            Security
          </TabsTrigger>
          <TabsTrigger
            value="notifications"
            className="data-[state=active]:bg-[#1D2030] data-[state=active]:text-white text-[#7C8597] text-sm font-medium rounded-lg px-4 transition-colors"
          >
            <Bell className="w-4 h-4 mr-1.5" />
            Notifications
          </TabsTrigger>
          <TabsTrigger
            value="payments"
            className="data-[state=active]:bg-[#1D2030] data-[state=active]:text-white text-[#7C8597] text-sm font-medium rounded-lg px-4 transition-colors"
          >
            <CreditCard className="w-4 h-4 mr-1.5" />
            Payments
          </TabsTrigger>
        </TabsList>

        {/* General Tab */}
        <TabsContent value="general" className="mt-4">
          <Card className="bg-[#12131A] border-[#2B2F3E] shadow-none">
            <CardHeader>
              <CardTitle className="text-base font-semibold text-white">
                General Settings
              </CardTitle>
              <CardDescription className="text-[#7C8597] text-sm">
                Configure your platform&apos;s basic information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-sm text-[#B6BCC8] font-medium">
                    Site Name
                  </Label>
                  <Input
                    value={siteName}
                    onChange={(e) => setSiteName(e.target.value)}
                    className="h-11 rounded-xl bg-[#0B0B12] border-[#2B2F3E] text-white placeholder:text-[#5A6178] text-sm focus-visible:border-[#4F46E5] focus-visible:ring-[#4F46E5]/20"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm text-[#B6BCC8] font-medium">
                    Contact Email
                  </Label>
                  <Input
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                    className="h-11 rounded-xl bg-[#0B0B12] border-[#2B2F3E] text-white placeholder:text-[#5A6178] text-sm focus-visible:border-[#4F46E5] focus-visible:ring-[#4F46E5]/20"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-sm text-[#B6BCC8] font-medium">
                  Description
                </Label>
                <Input
                  value={siteDescription}
                  onChange={(e) => setSiteDescription(e.target.value)}
                  className="h-11 rounded-xl bg-[#0B0B12] border-[#2B2F3E] text-white placeholder:text-[#5A6178] text-sm focus-visible:border-[#4F46E5] focus-visible:ring-[#4F46E5]/20"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-sm text-[#B6BCC8] font-medium">
                    Support Phone
                  </Label>
                  <Input
                    value={supportPhone}
                    onChange={(e) => setSupportPhone(e.target.value)}
                    className="h-11 rounded-xl bg-[#0B0B12] border-[#2B2F3E] text-white placeholder:text-[#5A6178] text-sm focus-visible:border-[#4F46E5] focus-visible:ring-[#4F46E5]/20"
                  />
                </div>
                <div className="flex items-end">
                  <div className="flex items-center justify-between p-4 rounded-xl bg-[#0B0B12] border border-[#2B2F3E] w-full">
                    <div>
                      <p className="text-sm font-medium text-[#B6BCC8]">
                        Maintenance Mode
                      </p>
                      <p className="text-xs text-[#5A6178] mt-0.5">
                        Disable the platform for maintenance
                      </p>
                    </div>
                    <Switch
                      checked={maintenanceMode}
                      onCheckedChange={setMaintenanceMode}
                    />
                  </div>
                </div>
              </div>

              <Separator className="bg-[#2B2F3E]" />

              <div className="flex justify-end">
                <Button
                  className="bg-gradient-to-r from-[#4F46E5] to-[#4338CA] hover:from-[#6366F1] hover:to-[#4F46E5] text-white font-semibold text-sm shadow-lg shadow-[#4F46E5]/20"
                  onClick={() => handleSave('general')}
                  disabled={saving}
                >
                  {saving ? (
                    <Loader2 className="w-4 h-4 mr-1.5 animate-spin" />
                  ) : (
                    <Save className="w-4 h-4 mr-1.5" />
                  )}
                  Save Changes
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Tab */}
        <TabsContent value="security" className="mt-4">
          <Card className="bg-[#12131A] border-[#2B2F3E] shadow-none">
            <CardHeader>
              <CardTitle className="text-base font-semibold text-white">
                Security Settings
              </CardTitle>
              <CardDescription className="text-[#7C8597] text-sm">
                Configure authentication and security policies
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-sm text-[#B6BCC8] font-medium">
                    Max Login Attempts
                  </Label>
                  <Input
                    type="number"
                    value={maxLoginAttempts}
                    onChange={(e) => setMaxLoginAttempts(e.target.value)}
                    className="h-11 rounded-xl bg-[#0B0B12] border-[#2B2F3E] text-white placeholder:text-[#5A6178] text-sm focus-visible:border-[#4F46E5] focus-visible:ring-[#4F46E5]/20"
                  />
                  <p className="text-xs text-[#5A6178]">
                    Lock account after this many failed attempts
                  </p>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm text-[#B6BCC8] font-medium">
                    Password Min Length
                  </Label>
                  <Input
                    type="number"
                    value={passwordMinLength}
                    onChange={(e) => setPasswordMinLength(e.target.value)}
                    className="h-11 rounded-xl bg-[#0B0B12] border-[#2B2F3E] text-white placeholder:text-[#5A6178] text-sm focus-visible:border-[#4F46E5] focus-visible:ring-[#4F46E5]/20"
                  />
                  <p className="text-xs text-[#5A6178]">
                    Minimum characters required for passwords
                  </p>
                </div>
              </div>

              <Separator className="bg-[#2B2F3E]" />

              <div>
                <p className="text-sm font-medium text-[#B6BCC8] mb-4">
                  Password Requirements
                </p>
                <div className="space-y-4">
                  {[
                    {
                      label: 'Require Uppercase Letters',
                      desc: 'At least one uppercase letter (A-Z)',
                      checked: requireUppercase,
                      onChange: setRequireUppercase,
                    },
                    {
                      label: 'Require Numbers',
                      desc: 'At least one digit (0-9)',
                      checked: requireNumbers,
                      onChange: setRequireNumbers,
                    },
                    {
                      label: 'Require Symbols',
                      desc: 'At least one special character (!@#$...)',
                      checked: requireSymbols,
                      onChange: setRequireSymbols,
                    },
                  ].map((item) => (
                    <div
                      key={item.label}
                      className="flex items-center justify-between p-3 rounded-lg bg-[#0B0B12] border border-[#1D2030]"
                    >
                      <div>
                        <p className="text-sm font-medium text-[#B6BCC8]">
                          {item.label}
                        </p>
                        <p className="text-xs text-[#5A6178] mt-0.5">
                          {item.desc}
                        </p>
                      </div>
                      <Switch
                        checked={item.checked}
                        onCheckedChange={item.onChange}
                      />
                    </div>
                  ))}
                </div>
              </div>

              <Separator className="bg-[#2B2F3E]" />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-sm text-[#B6BCC8] font-medium">
                    Session Timeout (minutes)
                  </Label>
                  <Input
                    type="number"
                    value={sessionTimeout}
                    onChange={(e) => setSessionTimeout(e.target.value)}
                    className="h-11 rounded-xl bg-[#0B0B12] border-[#2B2F3E] text-white placeholder:text-[#5A6178] text-sm focus-visible:border-[#4F46E5] focus-visible:ring-[#4F46E5]/20"
                  />
                  <p className="text-xs text-[#5A6178]">
                    Auto-logout after inactivity
                  </p>
                </div>
                <div className="flex items-end">
                  <div className="flex items-center justify-between p-4 rounded-xl bg-[#0B0B12] border border-[#2B2F3E] w-full">
                    <div>
                      <p className="text-sm font-medium text-[#B6BCC8]">
                        Two-Factor Auth Required
                      </p>
                      <p className="text-xs text-[#5A6178] mt-0.5">
                        Require 2FA for all admin accounts
                      </p>
                    </div>
                    <Switch
                      checked={twoFactorRequired}
                      onCheckedChange={setTwoFactorRequired}
                    />
                  </div>
                </div>
              </div>

              <Separator className="bg-[#2B2F3E]" />

              <div className="flex justify-end">
                <Button
                  className="bg-gradient-to-r from-[#4F46E5] to-[#4338CA] hover:from-[#6366F1] hover:to-[#4F46E5] text-white font-semibold text-sm shadow-lg shadow-[#4F46E5]/20"
                  onClick={() => handleSave('security')}
                  disabled={saving}
                >
                  {saving ? (
                    <Loader2 className="w-4 h-4 mr-1.5 animate-spin" />
                  ) : (
                    <Save className="w-4 h-4 mr-1.5" />
                  )}
                  Save Changes
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications Tab */}
        <TabsContent value="notifications" className="mt-4">
          <Card className="bg-[#12131A] border-[#2B2F3E] shadow-none">
            <CardHeader>
              <CardTitle className="text-base font-semibold text-white">
                Notification Settings
              </CardTitle>
              <CardDescription className="text-[#7C8597] text-sm">
                Configure how and when you receive notifications
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                {
                  label: 'Email Notifications',
                  desc: 'Receive notifications via email',
                  checked: emailNotifications,
                  onChange: setEmailNotifications,
                },
                {
                  label: 'Push Notifications',
                  desc: 'Receive push notifications in browser',
                  checked: pushNotifications,
                  onChange: setPushNotifications,
                },
                {
                  label: 'New Course Alert',
                  desc: 'Get notified when a new course is submitted',
                  checked: newCourseAlert,
                  onChange: setNewCourseAlert,
                },
                {
                  label: 'New User Alert',
                  desc: 'Get notified when a new user registers',
                  checked: newUserAlert,
                  onChange: setNewUserAlert,
                },
                {
                  label: 'Withdrawal Request Alert',
                  desc: 'Get notified for new withdrawal requests',
                  checked: withdrawalAlert,
                  onChange: setWithdrawalAlert,
                },
                {
                  label: 'System Alerts',
                  desc: 'Critical system notifications and updates',
                  checked: systemAlerts,
                  onChange: setSystemAlerts,
                },
              ].map((item) => (
                <div
                  key={item.label}
                  className="flex items-center justify-between p-4 rounded-xl bg-[#0B0B12] border border-[#1D2030]"
                >
                  <div>
                    <p className="text-sm font-medium text-[#B6BCC8]">
                      {item.label}
                    </p>
                    <p className="text-xs text-[#5A6178] mt-0.5">
                      {item.desc}
                    </p>
                  </div>
                  <Switch
                    checked={item.checked}
                    onCheckedChange={item.onChange}
                  />
                </div>
              ))}

              <Separator className="bg-[#2B2F3E]" />

              <div className="flex justify-end">
                <Button
                  className="bg-gradient-to-r from-[#4F46E5] to-[#4338CA] hover:from-[#6366F1] hover:to-[#4F46E5] text-white font-semibold text-sm shadow-lg shadow-[#4F46E5]/20"
                  onClick={() => handleSave('notifications')}
                  disabled={saving}
                >
                  {saving ? (
                    <Loader2 className="w-4 h-4 mr-1.5 animate-spin" />
                  ) : (
                    <Save className="w-4 h-4 mr-1.5" />
                  )}
                  Save Changes
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Payments Tab */}
        <TabsContent value="payments" className="mt-4">
          <Card className="bg-[#12131A] border-[#2B2F3E] shadow-none">
            <CardHeader>
              <CardTitle className="text-base font-semibold text-white">
                Payment Settings
              </CardTitle>
              <CardDescription className="text-[#7C8597] text-sm">
                Configure payment processing and payout preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-sm text-[#B6BCC8] font-medium">
                    Currency
                  </Label>
                  <Select value={currency} onValueChange={setCurrency}>
                    <SelectTrigger className="w-full h-11 bg-[#0B0B12] border-[#2B2F3E] text-sm text-[#B6BCC8] rounded-xl">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-[#12131A] border-[#2B2F3E]">
                      <SelectItem value="USD" className="text-[#B6BCC8]">USD - US Dollar</SelectItem>
                      <SelectItem value="EUR" className="text-[#B6BCC8]">EUR - Euro</SelectItem>
                      <SelectItem value="GBP" className="text-[#B6BCC8]">GBP - British Pound</SelectItem>
                      <SelectItem value="AED" className="text-[#B6BCC8]">AED - UAE Dirham</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm text-[#B6BCC8] font-medium">
                    Tax Rate (%)
                  </Label>
                  <Input
                    type="number"
                    value={taxRate}
                    onChange={(e) => setTaxRate(e.target.value)}
                    className="h-11 rounded-xl bg-[#0B0B12] border-[#2B2F3E] text-white placeholder:text-[#5A6178] text-sm focus-visible:border-[#4F46E5] focus-visible:ring-[#4F46E5]/20"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-sm text-[#B6BCC8] font-medium">
                    Min Withdrawal Amount
                  </Label>
                  <Input
                    type="number"
                    value={minWithdrawal}
                    onChange={(e) => setMinWithdrawal(e.target.value)}
                    className="h-11 rounded-xl bg-[#0B0B12] border-[#2B2F3E] text-white placeholder:text-[#5A6178] text-sm focus-visible:border-[#4F46E5] focus-visible:ring-[#4F46E5]/20"
                  />
                  <p className="text-xs text-[#5A6178]">
                    Minimum amount required to request a withdrawal
                  </p>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm text-[#B6BCC8] font-medium">
                    Payout Schedule
                  </Label>
                  <Select
                    value={payoutSchedule}
                    onValueChange={setPayoutSchedule}
                  >
                    <SelectTrigger className="w-full h-11 bg-[#0B0B12] border-[#2B2F3E] text-sm text-[#B6BCC8] rounded-xl">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-[#12131A] border-[#2B2F3E]">
                      <SelectItem value="weekly" className="text-[#B6BCC8] capitalize">Weekly</SelectItem>
                      <SelectItem value="biweekly" className="text-[#B6BCC8] capitalize">Bi-weekly</SelectItem>
                      <SelectItem value="monthly" className="text-[#B6BCC8] capitalize">Monthly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Separator className="bg-[#2B2F3E]" />

              <div>
                <p className="text-sm font-medium text-[#B6BCC8] mb-4">
                  Enabled Payment Methods
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {paymentMethodOptions.map((method) => (
                    <div
                      key={method.id}
                      className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-colors ${
                        enabledMethods.includes(method.id)
                          ? 'bg-[#4F46E5]/5 border-[#4F46E5]/20'
                          : 'bg-[#0B0B12] border-[#1D2030] hover:border-[#2B2F3E]'
                      }`}
                      onClick={() => togglePaymentMethod(method.id)}
                    >
                      <Checkbox
                        checked={enabledMethods.includes(method.id)}
                        onCheckedChange={() => togglePaymentMethod(method.id)}
                        className="data-[state=checked]:bg-[#4F46E5] data-[state=checked]:border-[#4F46E5] border-[#2B2F3E] bg-[#12131A]"
                      />
                      <div className="flex items-center gap-2.5">
                        <method.icon
                          className={`w-4 h-4 ${
                            enabledMethods.includes(method.id)
                              ? 'text-[#4F46E5]'
                              : 'text-[#5A6178]'
                          }`}
                        />
                        <span
                          className={`text-sm ${
                            enabledMethods.includes(method.id)
                              ? 'text-white font-medium'
                              : 'text-[#7C8597]'
                          }`}
                        >
                          {method.label}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <Separator className="bg-[#2B2F3E]" />

              <div className="flex justify-end">
                <Button
                  className="bg-gradient-to-r from-[#4F46E5] to-[#4338CA] hover:from-[#6366F1] hover:to-[#4F46E5] text-white font-semibold text-sm shadow-lg shadow-[#4F46E5]/20"
                  onClick={() => handleSave('payments')}
                  disabled={saving}
                >
                  {saving ? (
                    <Loader2 className="w-4 h-4 mr-1.5 animate-spin" />
                  ) : (
                    <Save className="w-4 h-4 mr-1.5" />
                  )}
                  Save Changes
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
