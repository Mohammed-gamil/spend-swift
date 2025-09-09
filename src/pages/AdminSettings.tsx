import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { 
  Settings, 
  Save, 
  Mail, 
  Shield, 
  DollarSign, 
  Clock,
  Bell,
  Database,
  FileText,
  Users
} from "lucide-react";
import toast from "react-hot-toast";
import { useTranslation } from "@/hooks/use-translation";

export default function AdminSettings() {
  const { t } = useTranslation();
  const [settings, setSettings] = useState({
    // General Settings
    companyName: "Acme Corporation",
    companyEmail: "admin@acme.com",
    timezone: "UTC",
    currency: "USD",
    
    // Approval Settings
    autoApprovalThreshold: 1000,
    requireManagerApproval: true,
    requireAccountantApproval: true,
    requireFinalManagerApproval: true,
    approvalTimeoutDays: 7,
    
    // Notification Settings
    emailNotifications: true,
    slackIntegration: false,
    reminderFrequency: "daily",
    notifyOnSubmission: true,
    notifyOnApproval: true,
    notifyOnRejection: true,
    
    // Security Settings
    sessionTimeout: 480, // minutes
    passwordMinLength: 8,
    requireMFA: false,
    allowedFileTypes: "pdf,doc,docx,xls,xlsx,jpg,png",
    maxFileSize: 10, // MB
    
    // Integration Settings
    erpIntegration: false,
    erpEndpoint: "",
    erpApiKey: "",
    backupFrequency: "daily"
  });

  const handleSave = () => {
    // Here you would save to the backend
    toast.success(t('admin.settings.saveSuccess'));
  };

  const handleInputChange = (key: string, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">{t('admin.settings.title')}</h1>
          <p className="text-muted-foreground mt-1">{t('admin.settings.subtitle')}</p>
        </div>
        
        <Button onClick={handleSave}>
          <Save className="mr-2 h-4 w-4" />
          {t('admin.settings.saveButton')}
        </Button>
      </div>

      <Tabs defaultValue="general" className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="general">{t('admin.settings.tabs.general')}</TabsTrigger>
          <TabsTrigger value="approval">{t('admin.settings.tabs.approval')}</TabsTrigger>
          <TabsTrigger value="notifications">{t('admin.settings.tabs.notifications')}</TabsTrigger>
          <TabsTrigger value="security">{t('admin.settings.tabs.security')}</TabsTrigger>
          <TabsTrigger value="integrations">{t('admin.settings.tabs.integrations')}</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                {t('admin.settings.general.title')}
              </CardTitle>
              <CardDescription>
                {t('admin.settings.general.description')}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="companyName">{t('admin.settings.general.companyName')}</Label>
                  <Input
                    id="companyName"
                    value={settings.companyName}
                    onChange={(e) => handleInputChange('companyName', e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="companyEmail">{t('admin.settings.general.companyEmail')}</Label>
                  <Input
                    id="companyEmail"
                    type="email"
                    value={settings.companyEmail}
                    onChange={(e) => handleInputChange('companyEmail', e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="timezone">{t('admin.settings.general.timezone')}</Label>
                  <Select value={settings.timezone} onValueChange={(value) => handleInputChange('timezone', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="UTC">UTC</SelectItem>
                      <SelectItem value="America/New_York">{t('admin.settings.timezones.new_york')}</SelectItem>
                      <SelectItem value="America/Chicago">{t('admin.settings.timezones.chicago')}</SelectItem>
                      <SelectItem value="America/Denver">{t('admin.settings.timezones.denver')}</SelectItem>
                      <SelectItem value="America/Los_Angeles">{t('admin.settings.timezones.los_angeles')}</SelectItem>
                      <SelectItem value="Europe/London">{t('admin.settings.timezones.london')}</SelectItem>
                      <SelectItem value="Europe/Berlin">{t('admin.settings.timezones.berlin')}</SelectItem>
                      <SelectItem value="Asia/Tokyo">{t('admin.settings.timezones.tokyo')}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="currency">{t('admin.settings.general.currency')}</Label>
                  <Select value={settings.currency} onValueChange={(value) => handleInputChange('currency', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="USD">{t('admin.settings.currencies.usd')}</SelectItem>
                      <SelectItem value="EUR">{t('admin.settings.currencies.eur')}</SelectItem>
                      <SelectItem value="GBP">{t('admin.settings.currencies.gbp')}</SelectItem>
                      <SelectItem value="CAD">{t('admin.settings.currencies.cad')}</SelectItem>
                      <SelectItem value="AUD">{t('admin.settings.currencies.aud')}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="approval" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                {t('admin.settings.approval.title')}
              </CardTitle>
              <CardDescription>
                {t('admin.settings.approval.description')}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="autoApprovalThreshold">{t('admin.settings.approval.autoApprovalThreshold')}</Label>
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-gray-400" />
                  <Input
                    id="autoApprovalThreshold"
                    type="number"
                    value={settings.autoApprovalThreshold}
                    onChange={(e) => handleInputChange('autoApprovalThreshold', Number(e.target.value))}
                    className="max-w-xs"
                  />
                  <span className="text-sm text-gray-600">
                    {t('admin.settings.approval.autoApprovalThresholdHint')}
                  </span>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>{t('admin.settings.approval.requireManagerApproval')}</Label>
                    <p className="text-sm text-muted-foreground">{t('admin.settings.approval.requireManagerApprovalHint')}</p>
                  </div>
                  <Switch
                    checked={settings.requireManagerApproval}
                    onCheckedChange={(checked) => handleInputChange('requireManagerApproval', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>{t('admin.settings.approval.requireAccountantApproval')}</Label>
                    <p className="text-sm text-muted-foreground">{t('admin.settings.approval.requireAccountantApprovalHint')}</p>
                  </div>
                  <Switch
                    checked={settings.requireAccountantApproval}
                    onCheckedChange={(checked) => handleInputChange('requireAccountantApproval', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>{t('admin.settings.approval.requireFinalManagerApproval')}</Label>
                    <p className="text-sm text-muted-foreground">{t('admin.settings.approval.requireFinalManagerApprovalHint')}</p>
                  </div>
                  <Switch
                    checked={settings.requireFinalManagerApproval}
                    onCheckedChange={(checked) => handleInputChange('requireFinalManagerApproval', checked)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="approvalTimeout">{t('admin.settings.approval.approvalTimeout')}</Label>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-gray-400" />
                  <Input
                    id="approvalTimeout"
                    type="number"
                    value={settings.approvalTimeoutDays}
                    onChange={(e) => handleInputChange('approvalTimeoutDays', Number(e.target.value))}
                    className="max-w-xs"
                  />
                  <span className="text-sm text-gray-600">
                    {t('admin.settings.approval.approvalTimeoutHint')}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                {t('admin.settings.notifications.title')}
              </CardTitle>
              <CardDescription>
                {t('admin.settings.notifications.description')}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>{t('admin.settings.notifications.emailNotifications')}</Label>
                    <p className="text-sm text-muted-foreground">{t('admin.settings.notifications.emailNotificationsHint')}</p>
                  </div>
                  <Switch
                    checked={settings.emailNotifications}
                    onCheckedChange={(checked) => handleInputChange('emailNotifications', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>{t('admin.settings.notifications.slackIntegration')}</Label>
                    <p className="text-sm text-muted-foreground">{t('admin.settings.notifications.slackIntegrationHint')}</p>
                  </div>
                  <Switch
                    checked={settings.slackIntegration}
                    onCheckedChange={(checked) => handleInputChange('slackIntegration', checked)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>{t('admin.settings.notifications.reminderFrequency')}</Label>
                <Select value={settings.reminderFrequency} onValueChange={(value) => handleInputChange('reminderFrequency', value)}>
                  <SelectTrigger className="max-w-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="never">{t('admin.settings.frequencies.never')}</SelectItem>
                    <SelectItem value="daily">{t('admin.settings.frequencies.daily')}</SelectItem>
                    <SelectItem value="weekly">{t('admin.settings.frequencies.weekly')}</SelectItem>
                    <SelectItem value="monthly">{t('admin.settings.frequencies.monthly')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-4">
                <h4 className="font-medium">{t('admin.settings.notifications.triggersTitle')}</h4>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label>{t('admin.settings.notifications.onSubmission')}</Label>
                    <p className="text-sm text-muted-foreground">{t('admin.settings.notifications.onSubmissionHint')}</p>
                  </div>
                  <Switch
                    checked={settings.notifyOnSubmission}
                    onCheckedChange={(checked) => handleInputChange('notifyOnSubmission', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>{t('admin.settings.notifications.onApproval')}</Label>
                    <p className="text-sm text-muted-foreground">{t('admin.settings.notifications.onApprovalHint')}</p>
                  </div>
                  <Switch
                    checked={settings.notifyOnApproval}
                    onCheckedChange={(checked) => handleInputChange('notifyOnApproval', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>{t('admin.settings.notifications.onRejection')}</Label>
                    <p className="text-sm text-muted-foreground">{t('admin.settings.notifications.onRejectionHint')}</p>
                  </div>
                  <Switch
                    checked={settings.notifyOnRejection}
                    onCheckedChange={(checked) => handleInputChange('notifyOnRejection', checked)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                {t('admin.settings.security.title')}
              </CardTitle>
              <CardDescription>
                {t('admin.settings.security.description')}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="sessionTimeout">{t('admin.settings.security.sessionTimeout')}</Label>
                  <Input
                    id="sessionTimeout"
                    type="number"
                    value={settings.sessionTimeout}
                    onChange={(e) => handleInputChange('sessionTimeout', Number(e.target.value))}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="passwordMinLength">{t('admin.settings.security.passwordMinLength')}</Label>
                  <Input
                    id="passwordMinLength"
                    type="number"
                    value={settings.passwordMinLength}
                    onChange={(e) => handleInputChange('passwordMinLength', Number(e.target.value))}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>{t('admin.settings.security.requireMFA')}</Label>
                  <p className="text-sm text-muted-foreground">{t('admin.settings.security.requireMFAHint')}</p>
                </div>
                <Switch
                  checked={settings.requireMFA}
                  onCheckedChange={(checked) => handleInputChange('requireMFA', checked)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="allowedFileTypes">{t('admin.settings.security.allowedFileTypes')}</Label>
                <Input
                  id="allowedFileTypes"
                  value={settings.allowedFileTypes}
                  onChange={(e) => handleInputChange('allowedFileTypes', e.target.value)}
                  placeholder="pdf,doc,docx,xls,xlsx,jpg,png"
                />
                <p className="text-sm text-muted-foreground">{t('admin.settings.security.allowedFileTypesHint')}</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="maxFileSize">{t('admin.settings.security.maxFileSize')}</Label>
                <Input
                  id="maxFileSize"
                  type="number"
                  value={settings.maxFileSize}
                  onChange={(e) => handleInputChange('maxFileSize', Number(e.target.value))}
                  className="max-w-xs"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="integrations" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                {t('admin.settings.integrations.title')}
              </CardTitle>
              <CardDescription>
                {t('admin.settings.integrations.description')}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>{t('admin.settings.integrations.erpIntegration')}</Label>
                    <p className="text-sm text-muted-foreground">{t('admin.settings.integrations.erpIntegrationHint')}</p>
                  </div>
                  <Switch
                    checked={settings.erpIntegration}
                    onCheckedChange={(checked) => handleInputChange('erpIntegration', checked)}
                  />
                </div>

                {settings.erpIntegration && (
                  <div className="space-y-4 pl-4 border-l-2 border-gray-200">
                    <div className="space-y-2">
                      <Label htmlFor="erpEndpoint">{t('admin.settings.integrations.erpApiEndpoint')}</Label>
                      <Input
                        id="erpEndpoint"
                        value={settings.erpEndpoint}
                        onChange={(e) => handleInputChange('erpEndpoint', e.target.value)}
                        placeholder="https://api.erp-system.com/v1"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="erpApiKey">{t('admin.settings.integrations.erpApiKey')}</Label>
                      <Input
                        id="erpApiKey"
                        type="password"
                        value={settings.erpApiKey}
                        onChange={(e) => handleInputChange('erpApiKey', e.target.value)}
                        placeholder={t('admin.settings.integrations.erpApiKeyPlaceholder')}
                      />
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label>{t('admin.settings.integrations.backupFrequency')}</Label>
                <Select value={settings.backupFrequency} onValueChange={(value) => handleInputChange('backupFrequency', value)}>
                  <SelectTrigger className="max-w-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="hourly">{t('admin.settings.frequencies.hourly')}</SelectItem>
                    <SelectItem value="daily">{t('admin.settings.frequencies.daily')}</SelectItem>
                    <SelectItem value="weekly">{t('admin.settings.frequencies.weekly')}</SelectItem>
                    <SelectItem value="monthly">{t('admin.settings.frequencies.monthly')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-4">
                <h4 className="font-medium">{t('admin.settings.integrations.maintenanceTitle')}</h4>
                <div className="grid gap-4 md:grid-cols-2">
                  <Button variant="outline">
                    <Database className="mr-2 h-4 w-4" />
                    {t('admin.settings.integrations.backupDb')}
                  </Button>
                  <Button variant="outline">
                    <FileText className="mr-2 h-4 w-4" />
                    {t('admin.settings.integrations.exportLog')}
                  </Button>
                  <Button variant="outline">
                    <Users className="mr-2 h-4 w-4" />
                    {t('admin.settings.integrations.syncDir')}
                  </Button>
                  <Button variant="outline">
                    <Settings className="mr-2 h-4 w-4" />
                    {t('admin.settings.integrations.healthCheck')}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
