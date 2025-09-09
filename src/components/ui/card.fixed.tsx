import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, Calendar, User, ChevronRight, Edit, Trash } from "lucide-react";
import { useLanguageStore } from "@/hooks/use-language";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  description?: string;
  status?: "draft" | "submitted" | "approved" | "rejected";
  date?: string;
  createdBy?: string;
  onView?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
}

export function Card({
  title,
  description,
  status = "draft",
  date,
  createdBy,
  className,
  onView,
  onEdit,
  onDelete,
  ...props
}: CardProps) {
  const { isRTL } = useLanguageStore();
  
  const statusLabels = {
    draft: "Draft",
    submitted: "Submitted",
    approved: "Approved",
    rejected: "Rejected",
  };
  
  const ChevronIcon = isRTL ? ChevronRight : ChevronRight;

  return (
    <div
      className={cn(
        "rounded-xl border border-primary/30 bg-background p-5 shadow-sm transition-all duration-200 hover:shadow-md hover:border-primary/50 hover:translate-y-[-4px]",
        className
      )}
      {...props}
    >
      {/* Card Header */}
      <div className="flex items-start justify-between mb-3">
        <h3 className="text-lg font-semibold text-foreground line-clamp-1">{title}</h3>
        <Badge 
          className="border border-primary/30 bg-primary/10 text-primary"
          variant="outline"
        >
          {statusLabels[status]}
        </Badge>
      </div>
      
      {/* Card Body */}
      {description && (
        <div className="mb-4">
          <p className="text-sm text-subtext line-clamp-2">{description}</p>
        </div>
      )}
      
      {/* Card Metadata */}
      <div className="flex flex-col space-y-1 mb-4">
        {date && (
          <div className="flex items-center text-xs text-subtext">
            <Calendar className="h-3 w-3 mr-1.5 text-primary" />
            <span>{date}</span>
          </div>
        )}
        
        {createdBy && (
          <div className="flex items-center text-xs text-subtext">
            <User className="h-3 w-3 mr-1.5 text-primary" />
            <span>{createdBy}</span>
          </div>
        )}
      </div>
      
      {/* Card Actions */}
      <div className="flex items-center justify-between pt-3 border-t border-primary/20">
        <div className="flex items-center space-x-2">
          {onEdit && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onEdit}
              className="h-8 px-2 text-primary hover:bg-primary/10 hover:text-primary"
            >
              <Edit className="h-3.5 w-3.5 mr-1" />
              <span className="text-xs">Edit</span>
            </Button>
          )}
          
          {onDelete && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onDelete}
              className="h-8 px-2 text-subtext hover:bg-primary/10 hover:text-primary"
            >
              <Trash className="h-3.5 w-3.5 mr-1" />
              <span className="text-xs">Delete</span>
            </Button>
          )}
        </div>
        
        {onView && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onView}
            className="h-8 px-3 text-primary hover:bg-primary/10 hover:text-primary flex items-center"
          >
            <span className="text-xs">View</span>
            <ChevronIcon className="h-3.5 w-3.5 ml-1" />
          </Button>
        )}
      </div>
    </div>
  );
}