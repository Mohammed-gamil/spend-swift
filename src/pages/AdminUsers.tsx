import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Plus, 
  Search, 
  Filter, 
  Edit, 
  Trash2, 
  UserCheck, 
  UserX,
  Mail,
  Calendar,
  Shield,
  Users,
  MoreHorizontal
} from "lucide-react";
import { format } from "date-fns";
import { ar as arSA } from "date-fns/locale";
import { User, UserRole } from "@/types";
import toast from "react-hot-toast";
import { useTranslation } from "@/hooks/use-translation";

export default function AdminUsers() {
  const { t, language } = useTranslation();
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    role: "USER" as UserRole,
    status: "active" as "active" | "inactive"
  });

  // Mock data
  const mockUsers: User[] = [
    {
      id: "1",
      name: "John Smith",
      email: "john@company.com",
      role: "ADMIN",
      status: "active",
      avatar: "",
      createdAt: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000),
      lastLoginAt: new Date(Date.now() - 2 * 60 * 60 * 1000)
    },
    {
      id: "2",
      name: "Sarah Ahmed",
      email: "sarah@company.com",
      role: "USER",
      status: "active",
      avatar: "",
      createdAt: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000),
      lastLoginAt: new Date(Date.now() - 4 * 60 * 60 * 1000)
    },
    {
      id: "3",
      name: "Mohamed Ali",
      email: "mohamed@company.com",
      role: "DIRECT_MANAGER",
      status: "active",
      avatar: "",
      createdAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000),
      lastLoginAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
    },
    {
      id: "4",
      name: "Lisa Chen",
      email: "lisa@company.com",
      role: "ACCOUNTANT",
      status: "active",
      avatar: "",
      createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000),
      lastLoginAt: new Date(Date.now() - 30 * 60 * 1000)
    },
    {
      id: "5",
      name: "Ahmed Hassan",
      email: "ahmed@company.com",
      role: "FINAL_MANAGER",
      status: "inactive",
      avatar: "",
      createdAt: new Date(Date.now() - 200 * 24 * 60 * 60 * 1000),
      lastLoginAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    }
  ];

  const stats = [
    { title: t('admin.users.stats.total'), value: mockUsers.length, icon: Users },
    { title: t('admin.users.stats.active'), value: mockUsers.filter(u => u.status === "active").length, icon: UserCheck },
    { title: t('admin.users.stats.inactive'), value: mockUsers.filter(u => u.status === "inactive").length, icon: UserX },
    { title: t('admin.users.stats.admins'), value: mockUsers.filter(u => u.role === "ADMIN").length, icon: Shield }
  ];

  const filteredUsers = mockUsers.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === "all" || user.role === roleFilter;
    const matchesStatus = statusFilter === "all" || user.status === statusFilter;
    return matchesSearch && matchesRole && matchesStatus;
  });

  const handleCreateUser = () => {
    toast.success(t('admin.users.toast.created').replace('{name}', newUser.name));
    setIsCreateDialogOpen(false);
    setNewUser({ name: "", email: "", role: "USER", status: "active" });
  };

  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setIsEditDialogOpen(true);
  };

  const handleDeleteUser = (userId: string) => {
    toast.success(t('admin.users.toast.deleted'));
  };

  const handleToggleStatus = (userId: string) => {
    toast.success(t('admin.users.toast.statusUpdated'));
  };

  const getRoleBadgeVariant = (role: UserRole) => {
    switch (role) {
      case "ADMIN": return "destructive";
      case "FINAL_MANAGER": return "default";
      case "DIRECT_MANAGER": return "secondary";
      case "ACCOUNTANT": return "outline";
      default: return "secondary";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{t('admin.users.title')}</h1>
          <p className="text-muted-foreground">
            {t('admin.users.subtitle')}
          </p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              {t('admin.users.addUser')}
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{t('admin.users.createDialog.title')}</DialogTitle>
              <DialogDescription>
                {t('admin.users.createDialog.description')}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">{t('admin.users.createDialog.fullName')}</Label>
                <Input
                  id="name"
                  value={newUser.name}
                  onChange={(e) => setNewUser(prev => ({ ...prev, name: e.target.value }))}
                  placeholder={t('admin.users.createDialog.fullNamePlaceholder')}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">{t('admin.users.createDialog.email')}</Label>
                <Input
                  id="email"
                  type="email"
                  value={newUser.email}
                  onChange={(e) => setNewUser(prev => ({ ...prev, email: e.target.value }))}
                  placeholder={t('admin.users.createDialog.emailPlaceholder')}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="role">{t('admin.users.createDialog.role')}</Label>
                <Select value={newUser.role} onValueChange={(value: UserRole) => setNewUser(prev => ({ ...prev, role: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="USER">{t('roles.USER')}</SelectItem>
                    <SelectItem value="DIRECT_MANAGER">{t('roles.DIRECT_MANAGER')}</SelectItem>
                    <SelectItem value="ACCOUNTANT">{t('roles.ACCOUNTANT')}</SelectItem>
                    <SelectItem value="FINAL_MANAGER">{t('roles.FINAL_MANAGER')}</SelectItem>
                    <SelectItem value="ADMIN">{t('roles.ADMIN')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                {t('common.cancel')}
              </Button>
              <Button onClick={handleCreateUser}>{t('admin.users.createDialog.createUser')}</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>{t('admin.users.list.title')}</CardTitle>
          <CardDescription>
            {t('admin.users.list.subtitle')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder={t('admin.users.list.searchPlaceholder')}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder={t('admin.users.list.filterRole')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('admin.users.list.allRoles')}</SelectItem>
                <SelectItem value="USER">{t('roles.USER')}</SelectItem>
                <SelectItem value="DIRECT_MANAGER">{t('roles.DIRECT_MANAGER')}</SelectItem>
                <SelectItem value="ACCOUNTANT">{t('roles.ACCOUNTANT')}</SelectItem>
                <SelectItem value="FINAL_MANAGER">{t('roles.FINAL_MANAGER')}</SelectItem>
                <SelectItem value="ADMIN">{t('roles.ADMIN')}</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder={t('admin.users.list.filterStatus')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('admin.users.list.allStatuses')}</SelectItem>
                <SelectItem value="active">{t('admin.users.list.statusActive')}</SelectItem>
                <SelectItem value="inactive">{t('admin.users.list.statusInactive')}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Users List */}
          <div className="space-y-4">
            {filteredUsers.map((user) => (
              <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <Avatar>
                    <AvatarImage src={user.avatar} />
                    <AvatarFallback>
                      {user.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                    <div className="font-medium">{user.name}</div>
                    <div className="text-sm text-muted-foreground flex items-center gap-2">
                      <Mail className="h-3 w-3" />
                      {user.email}
                    </div>
                    <div className="text-xs text-muted-foreground flex items-center gap-2 mt-1">
                      <Calendar className="h-3 w-3" />
                      {t('admin.users.list.lastLogin')}: {user.lastLoginAt ? format(user.lastLoginAt, "MMM dd, yyyy", { locale: language === 'ar' ? arSA : undefined }) : t('admin.users.list.never')}
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <Badge variant={getRoleBadgeVariant(user.role)}>
                    {t((`roles.${user.role}`) as any)}
                  </Badge>
                  <Badge variant={user.status === "active" ? "default" : "secondary"}>
                    {user.status === 'active' ? t('admin.users.list.statusActive') : t('admin.users.list.statusInactive')}
                  </Badge>
                  <div className="flex space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEditUser(user)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleToggleStatus(user.id)}
                    >
                      {user.status === "active" ? (
                        <UserX className="h-4 w-4" />
                      ) : (
                        <UserCheck className="h-4 w-4" />
                      )}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDeleteUser(user.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Edit User Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('admin.users.editDialog.title')}</DialogTitle>
            <DialogDescription>
              {t('admin.users.editDialog.description')}
            </DialogDescription>
          </DialogHeader>
          {selectedUser && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="edit-name">{t('admin.users.createDialog.fullName')}</Label>
                <Input
                  id="edit-name"
                  defaultValue={selectedUser.name}
                  placeholder={t('admin.users.createDialog.fullNamePlaceholder')}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-email">{t('admin.users.createDialog.email')}</Label>
                <Input
                  id="edit-email"
                  type="email"
                  defaultValue={selectedUser.email}
                  placeholder={t('admin.users.createDialog.emailPlaceholder')}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-role">{t('admin.users.createDialog.role')}</Label>
                <Select defaultValue={selectedUser.role}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="USER">{t('roles.USER')}</SelectItem>
                    <SelectItem value="DIRECT_MANAGER">{t('roles.DIRECT_MANAGER')}</SelectItem>
                    <SelectItem value="ACCOUNTANT">{t('roles.ACCOUNTANT')}</SelectItem>
                    <SelectItem value="FINAL_MANAGER">{t('roles.FINAL_MANAGER')}</SelectItem>
                    <SelectItem value="ADMIN">{t('roles.ADMIN')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              {t('common.cancel')}
            </Button>
            <Button onClick={() => {
              toast.success(t('admin.users.toast.updated'));
              setIsEditDialogOpen(false);
            }}>
              {t('admin.users.editDialog.save')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
