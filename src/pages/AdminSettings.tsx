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

export default function AdminSettings() {
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
    toast.success("Settings saved successfully!");
  };

  const handleInputChange = (key: string, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">System Settings</h1>
          <p className="text-muted-foreground mt-1">Configure system-wide settings and preferences</p>
        </div>
        
        <Button onClick={handleSave}>
          <Save className="mr-2 h-4 w-4" />
          Save All Changes
        </Button>
      </div>

      <Tabs defaultValue="general" className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="approval">Approval</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="integrations">Integrations</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                General Settings
              </CardTitle>
              <CardDescription>
                Basic system configuration and company information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="companyName">Company Name</Label>
                  <Input
                    id="companyName"
                    value={settings.companyName}
                    onChange={(e) => handleInputChange('companyName', e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="companyEmail">Company Email</Label>
                  <Input
                    id="companyEmail"
                    type="email"
                    value={settings.companyEmail}
                    onChange={(e) => handleInputChange('companyEmail', e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="timezone">Timezone</Label>
                  <Select value={settings.timezone} onValueChange={(value) => handleInputChange('timezone', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="UTC">UTC</SelectItem>
                      <SelectItem value="America/New_York">Eastern Time</SelectItem>
                      <SelectItem value="America/Chicago">Central Time</SelectItem>
                      <SelectItem value="America/Denver">Mountain Time</SelectItem>
                      <SelectItem value="America/Los_Angeles">Pacific Time</SelectItem>
                      <SelectItem value="Europe/London">London</SelectItem>
                      <SelectItem value="Europe/Berlin">Berlin</SelectItem>
                      <SelectItem value="Asia/Tokyo">Tokyo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="currency">Default Currency</Label>
                  <Select value={settings.currency} onValueChange={(value) => handleInputChange('currency', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="USD">USD - US Dollar</SelectItem>
                      <SelectItem value="EUR">EUR - Euro</SelectItem>
                      <SelectItem value="GBP">GBP - British Pound</SelectItem>
                      <SelectItem value="CAD">CAD - Canadian Dollar</SelectItem>
                      <SelectItem value="AUD">AUD - Australian Dollar</SelectItem>
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
                Approval Workflow Settings
              </CardTitle>
              <CardDescription>
                Configure approval thresholds and workflow requirements
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="autoApprovalThreshold">Auto-Approval Threshold</Label>
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
                    Requests below this amount are auto-approved
                  </span>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Require Manager Approval</Label>
                    <p className="text-sm text-muted-foreground">All requests must be approved by direct manager</p>
                  </div>
                  <Switch
                    checked={settings.requireManagerApproval}
                    onCheckedChange={(checked) => handleInputChange('requireManagerApproval', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Require Accountant Approval</Label>
                    <p className="text-sm text-muted-foreground">Requests above threshold require accountant approval</p>
                  </div>
                  <Switch
                    checked={settings.requireAccountantApproval}
                    onCheckedChange={(checked) => handleInputChange('requireAccountantApproval', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Require Final Manager Approval</Label>
                    <p className="text-sm text-muted-foreground">High-value requests require final manager approval</p>
                  </div>
                  <Switch
                    checked={settings.requireFinalManagerApproval}
                    onCheckedChange={(checked) => handleInputChange('requireFinalManagerApproval', checked)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="approvalTimeout">Approval Timeout (Days)</Label>
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
                    Auto-escalate if no response within this period
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
                Notification Settings
              </CardTitle>
              <CardDescription>
                Configure how and when users receive notifications
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Email Notifications</Label>
                    <p className="text-sm text-muted-foreground">Send notifications via email</p>
                  </div>
                  <Switch
                    checked={settings.emailNotifications}
                    onCheckedChange={(checked) => handleInputChange('emailNotifications', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Slack Integration</Label>
                    <p className="text-sm text-muted-foreground">Send notifications to Slack channels</p>
                  </div>
                  <Switch
                    checked={settings.slackIntegration}
                    onCheckedChange={(checked) => handleInputChange('slackIntegration', checked)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Reminder Frequency</Label>
                <Select value={settings.reminderFrequency} onValueChange={(value) => handleInputChange('reminderFrequency', value)}>
                  <SelectTrigger className="max-w-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="never">Never</SelectItem>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-4">
                <h4 className="font-medium">Notification Triggers</h4>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label>PR Submission</Label>
                    <p className="text-sm text-muted-foreground">Notify when new PR is submitted</p>
                  </div>
                  <Switch
                    checked={settings.notifyOnSubmission}
                    onCheckedChange={(checked) => handleInputChange('notifyOnSubmission', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>PR Approval</Label>
                    <p className="text-sm text-muted-foreground">Notify when PR is approved</p>
                  </div>
                  <Switch
                    checked={settings.notifyOnApproval}
                    onCheckedChange={(checked) => handleInputChange('notifyOnApproval', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>PR Rejection</Label>
                    <p className="text-sm text-muted-foreground">Notify when PR is rejected</p>
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
                Security Settings
              </CardTitle>
              <CardDescription>
                Configure security policies and file upload restrictions
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="sessionTimeout">Session Timeout (Minutes)</Label>
                  <Input
                    id="sessionTimeout"
                    type="number"
                    value={settings.sessionTimeout}
                    onChange={(e) => handleInputChange('sessionTimeout', Number(e.target.value))}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="passwordMinLength">Minimum Password Length</Label>
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
                  <Label>Require Multi-Factor Authentication</Label>
                  <p className="text-sm text-muted-foreground">Require MFA for all user accounts</p>
                </div>
                <Switch
                  checked={settings.requireMFA}
                  onCheckedChange={(checked) => handleInputChange('requireMFA', checked)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="allowedFileTypes">Allowed File Types</Label>
                <Input
                  id="allowedFileTypes"
                  value={settings.allowedFileTypes}
                  onChange={(e) => handleInputChange('allowedFileTypes', e.target.value)}
                  placeholder="pdf,doc,docx,xls,xlsx,jpg,png"
                />
                <p className="text-sm text-muted-foreground">Comma-separated list of allowed file extensions</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="maxFileSize">Maximum File Size (MB)</Label>
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
                System Integrations
              </CardTitle>
              <CardDescription>
                Configure external system integrations and data backups
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>ERP Integration</Label>
                    <p className="text-sm text-muted-foreground">Connect to external ERP system</p>
                  </div>
                  <Switch
                    checked={settings.erpIntegration}
                    onCheckedChange={(checked) => handleInputChange('erpIntegration', checked)}
                  />
                </div>

                {settings.erpIntegration && (
                  <div className="space-y-4 pl-4 border-l-2 border-gray-200">
                    <div className="space-y-2">
                      <Label htmlFor="erpEndpoint">ERP API Endpoint</Label>
                      <Input
                        id="erpEndpoint"
                        value={settings.erpEndpoint}
                        onChange={(e) => handleInputChange('erpEndpoint', e.target.value)}
                        placeholder="https://api.erp-system.com/v1"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="erpApiKey">ERP API Key</Label>
                      <Input
                        id="erpApiKey"
                        type="password"
                        value={settings.erpApiKey}
                        onChange={(e) => handleInputChange('erpApiKey', e.target.value)}
                        placeholder="Enter API key"
                      />
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label>Backup Frequency</Label>
                <Select value={settings.backupFrequency} onValueChange={(value) => handleInputChange('backupFrequency', value)}>
                  <SelectTrigger className="max-w-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="hourly">Hourly</SelectItem>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-4">
                <h4 className="font-medium">System Maintenance</h4>
                <div className="grid gap-4 md:grid-cols-2">
                  <Button variant="outline">
                    <Database className="mr-2 h-4 w-4" />
                    Backup Database
                  </Button>
                  <Button variant="outline">
                    <FileText className="mr-2 h-4 w-4" />
                    Export Audit Log
                  </Button>
                  <Button variant="outline">
                    <Users className="mr-2 h-4 w-4" />
                    Sync User Directory
                  </Button>
                  <Button variant="outline">
                    <Settings className="mr-2 h-4 w-4" />
                    System Health Check
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
