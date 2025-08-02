import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface Diner {
  id: string;
  name: string;
  total: number;
  isConnected: boolean;
  hasConfirmed?: boolean;
}

interface DinerListProps {
  diners: Diner[];
  selectedDinerId?: string;
  onDinerSelect?: (dinerId: string) => void;
  showTotals?: boolean;
  showConfirmationStatus?: boolean;
}

export default function DinerList({ 
  diners, 
  selectedDinerId, 
  onDinerSelect, 
  showTotals = true,
  showConfirmationStatus = false 
}: DinerListProps) {
  return (
    <div className="flex flex-wrap gap-3 p-4 bg-surface-elevated rounded-lg border">
      <h3 className="w-full text-sm font-medium text-text-secondary mb-2">
        Diners at Table ({diners.length})
      </h3>
      
      {diners.map((diner) => (
        <div
          key={diner.id}
          onClick={() => onDinerSelect?.(diner.id)}
          className={cn(
            "flex items-center gap-3 p-3 rounded-lg border transition-all duration-200",
            "bg-surface hover:bg-neutral-warm cursor-pointer shadow-card hover:shadow-elevated",
            selectedDinerId === diner.id && "ring-2 ring-primary bg-primary/5",
            !diner.isConnected && "opacity-60"
          )}
        >
          <Avatar className="h-8 w-8">
            <AvatarFallback className="bg-primary text-primary-foreground font-semibold text-sm">
              {diner.name.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          
          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-2">
              <span className="font-medium text-text-primary text-sm truncate">
                {diner.name}
              </span>
              <div className={cn(
                "w-2 h-2 rounded-full transition-colors",
                diner.isConnected ? "bg-success" : "bg-destructive"
              )} />
            </div>
            
            {showTotals && (
              <span className="text-xs text-text-secondary">
                ${diner.total.toFixed(2)}
              </span>
            )}
          </div>
          
          {showConfirmationStatus && (
            <Badge 
              variant={diner.hasConfirmed ? "default" : "secondary"}
              className={cn(
                "ml-auto text-xs",
                diner.hasConfirmed 
                  ? "bg-success text-success-foreground" 
                  : "bg-warning text-warning-foreground"
              )}
            >
              {diner.hasConfirmed ? "Confirmed" : "Pending"}
            </Badge>
          )}
        </div>
      ))}
      
      {diners.length === 0 && (
        <div className="w-full text-center py-8 text-text-secondary">
          <p className="text-sm">No diners have joined yet</p>
          <p className="text-xs mt-1">Share the QR code to get started</p>
        </div>
      )}
    </div>
  );
}