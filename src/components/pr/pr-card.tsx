import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { StatusBadge } from "@/components/ui/status-badge";
import { PurchaseRequest } from "@/types";
import { 
  Calendar, 
  DollarSign, 
  User, 
  Clock, 
  Eye,
  ExternalLink
} from "lucide-react";
import { formatDistanceToNow, format } from "date-fns";

interface PRCardProps {
  pr: PurchaseRequest;
  onView: (id: string) => void;
  showRequester?: boolean;
  compact?: boolean;
}

export function PRCard({ pr, onView, showRequester = true, compact = false }: PRCardProps) {
  const totalAmount = pr.items.reduce((sum, item) => sum + item.total, 0);
  const isOverdue = pr.neededByDate < new Date() && !['FUNDS_TRANSFERRED', 'FINAL_APPROVED'].includes(pr.state);
  
  return (
    <Card className="group hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 cursor-pointer hover:scale-[1.02] border-0 bg-gradient-card" onClick={() => onView(pr.id)}>
      <CardHeader className={`pb-3 ${compact ? 'py-3' : ''}`}>
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="font-semibold text-foreground truncate group-hover:text-primary transition-all duration-300 group-hover:translate-x-1">
                {pr.title}
              </h3>
              <StatusBadge state={pr.state} className="animate-scale-in" />
            </div>
            
            {!compact && (
              <p className="text-sm text-muted-foreground line-clamp-2 mb-3 transition-opacity group-hover:opacity-80">
                {pr.description}
              </p>
            )}
            
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <span className="flex items-center gap-1 transition-colors group-hover:text-primary">
                <span className="font-mono font-medium">#{pr.id.slice(-6)}</span>
              </span>
              
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {formatDistanceToNow(pr.createdAt, { addSuffix: true })}
              </span>
              
              {showRequester && pr.requester && (
                <span className="flex items-center gap-1">
                  <User className="h-3 w-3" />
                  {pr.requester.name}
                </span>
              )}
            </div>
          </div>
          
          {showRequester && pr.requester && (
            <Avatar className="h-8 w-8 ml-3 transition-transform group-hover:scale-110">
              <AvatarImage src={pr.requester.avatar} />
              <AvatarFallback className="bg-muted text-xs">
                {pr.requester.name.split(' ').map(n => n[0]).join('').toUpperCase()}
              </AvatarFallback>
            </Avatar>
          )}
        </div>
      </CardHeader>
      
      <CardContent className={`pt-0 ${compact ? 'py-3' : ''}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {/* Amount */}
            <div className="flex items-center gap-1 text-sm group-hover:scale-105 transition-transform">
              <DollarSign className="h-4 w-4 text-success transition-colors" />
              <span className="font-semibold text-foreground gradient-text">
                {totalAmount.toLocaleString()} {pr.currency}
              </span>
            </div>
            
            {/* Needed By Date */}
            <div className="flex items-center gap-1 text-sm">
              <Calendar className="h-4 w-4 text-muted-foreground transition-colors group-hover:text-primary" />
              <span className={`${isOverdue ? 'text-destructive font-medium animate-pulse-soft' : 'text-muted-foreground'} transition-colors`}>
                {format(pr.neededByDate, 'MMM dd')}
              </span>
              {isOverdue && (
                <Badge variant="destructive" className="text-xs px-1.5 py-0 animate-bounce-subtle">
                  Overdue
                </Badge>
              )}
            </div>
            
            {/* Category */}
            <Badge variant="outline" className="text-xs hover:bg-primary/10 transition-colors">
              {pr.category}
            </Badge>
          </div>
          
          <Button 
            variant="ghost" 
            size="sm" 
            className="opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-gradient-primary-soft hover:scale-105"
            onClick={(e) => {
              e.stopPropagation();
              onView(pr.id);
            }}
          >
            <Eye className="h-4 w-4 mr-1" />
            View
            <ExternalLink className="h-3 w-3 ml-1" />
          </Button>
        </div>
        
        {/* Current Approver Info */}
        {pr.currentApprover && (
          <div className="mt-3 pt-3 border-t border-border/50 animate-slide-up">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span>Pending with:</span>
              <Avatar className="h-5 w-5 transition-transform hover:scale-125">
                <AvatarImage src={pr.currentApprover.avatar} />
                <AvatarFallback className="bg-primary/10 text-primary text-xs">
                  {pr.currentApprover.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <span className="font-medium hover:text-primary transition-colors cursor-default">{pr.currentApprover.name}</span>
              <Badge variant="outline" className="text-xs hover:bg-primary/10 transition-colors">
                {pr.currentApprover.role}
              </Badge>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}