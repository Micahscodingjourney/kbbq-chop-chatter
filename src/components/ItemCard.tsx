import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Minus, Plus, Users, User } from "lucide-react";
import { cn } from "@/lib/utils";

interface MenuItem {
  id: string;
  name: string;
  price: number;
  category: string;
  description?: string;
}

interface OrderItem {
  id: string;
  menuItem: MenuItem;
  quantity: number;
  isShared: boolean;
  assignedTo?: string[];
}

interface Diner {
  id: string;
  name: string;
}

interface ItemCardProps {
  item: MenuItem;
  order?: OrderItem;
  diners: Diner[];
  onQuantityChange?: (itemId: string, quantity: number) => void;
  onSharingToggle?: (itemId: string, isShared: boolean) => void;
  onAssignmentChange?: (itemId: string, dinerIds: string[]) => void;
  showAddButton?: boolean;
  onAddItem?: (item: MenuItem) => void;
}

export default function ItemCard({
  item,
  order,
  diners,
  onQuantityChange,
  onSharingToggle,
  onAssignmentChange,
  showAddButton = false,
  onAddItem
}: ItemCardProps) {
  const [isShared, setIsShared] = useState(order?.isShared ?? false);
  const quantity = order?.quantity ?? 0;
  const assignedDiners = order?.assignedTo ?? [];

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity < 0) return;
    onQuantityChange?.(item.id, newQuantity);
  };

  const handleSharingToggle = () => {
    const newSharedState = !isShared;
    setIsShared(newSharedState);
    onSharingToggle?.(item.id, newSharedState);
  };

  const handleAssignmentChange = (dinerIds: string[]) => {
    onAssignmentChange?.(item.id, dinerIds);
  };

  const getSplitInfo = () => {
    if (!isShared || diners.length === 0) return null;
    
    const splitAmount = item.price / diners.length;
    return `Split ${diners.length} ways: $${splitAmount.toFixed(2)} each`;
  };

  const getAssignedDinerNames = () => {
    return assignedDiners
      .map(id => diners.find(d => d.id === id)?.name)
      .filter(Boolean)
      .join(", ");
  };

  if (showAddButton) {
    return (
      <div className="bg-surface border rounded-lg p-4 shadow-card hover:shadow-elevated transition-all duration-200">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h4 className="font-medium text-text-primary">{item.name}</h4>
            {item.description && (
              <p className="text-sm text-text-secondary mt-1">{item.description}</p>
            )}
          </div>
          <span className="font-semibold text-primary">${item.price.toFixed(2)}</span>
        </div>
        
        <Button 
          onClick={() => onAddItem?.(item)}
          variant="tablet" 
          size="sm" 
          className="w-full"
        >
          Add to Order
        </Button>
      </div>
    );
  }

  return (
    <div className="bg-surface border rounded-lg p-4 shadow-card">
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1">
          <h4 className="font-medium text-text-primary">{item.name}</h4>
          {item.description && (
            <p className="text-xs text-text-secondary mt-1">{item.description}</p>
          )}
        </div>
        <span className="font-semibold text-primary ml-2">${item.price.toFixed(2)}</span>
      </div>

      {quantity > 0 && (
        <div className="space-y-3">
          {/* Quantity Control */}
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Quantity</span>
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleQuantityChange(quantity - 1)}
                className="h-8 w-8 p-0"
              >
                <Minus className="h-3 w-3" />
              </Button>
              <span className="w-8 text-center font-medium">{quantity}</span>
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleQuantityChange(quantity + 1)}
                className="h-8 w-8 p-0"
              >
                <Plus className="h-3 w-3" />
              </Button>
            </div>
          </div>

          {/* Sharing Toggle */}
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Split Type</span>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant={isShared ? "shared" : "outline"}
                onClick={handleSharingToggle}
                className="flex items-center gap-1"
              >
                <Users className="h-3 w-3" />
                Shared
              </Button>
              <Button
                size="sm"
                variant={!isShared ? "individual" : "outline"}
                onClick={handleSharingToggle}
                className="flex items-center gap-1"
              >
                <User className="h-3 w-3" />
                Individual
              </Button>
            </div>
          </div>

          {/* Assignment/Split Info */}
          {isShared ? (
            <div className="bg-split-shared/10 border border-split-shared/20 rounded p-2">
              <p className="text-xs text-split-shared font-medium">
                {getSplitInfo()}
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              <label className="text-sm font-medium">Assign to:</label>
              <Select 
                value={assignedDiners[0] || ""} 
                onValueChange={(value) => handleAssignmentChange([value])}
              >
                <SelectTrigger className="h-8">
                  <SelectValue placeholder="Select diner" />
                </SelectTrigger>
                <SelectContent className="bg-surface border z-50">
                  {diners.map((diner) => (
                    <SelectItem key={diner.id} value={diner.id}>
                      {diner.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {assignedDiners.length > 0 && (
                <div className="bg-split-individual/10 border border-split-individual/20 rounded p-2">
                  <p className="text-xs text-split-individual font-medium">
                    Assigned to: {getAssignedDinerNames()}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Total for this item */}
          <div className="pt-2 border-t">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Item Total</span>
              <span className="font-semibold text-primary">
                ${(item.price * quantity).toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}