import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Users, User, Check, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

interface MenuItem {
  id: string;
  name: string;
  price: number;
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
  total: number;
  hasConfirmed: boolean;
}

interface BillBreakdown {
  dinerId: string;
  dinerName: string;
  individualItems: Array<{
    item: MenuItem;
    quantity: number;
    total: number;
  }>;
  sharedItems: Array<{
    item: MenuItem;
    quantity: number;
    totalPrice: number;
    portionPrice: number;
    splitBetween: number;
  }>;
  subtotal: number;
  tax: number;
  total: number;
}

interface BillSummaryProps {
  diners: Diner[];
  orders: OrderItem[];
  breakdown: BillBreakdown[];
  taxRate: number;
  tipPercentage?: number;
  onConfirmSplit?: (dinerId: string) => void;
  onRequestChange?: (dinerId: string) => void;
  showConfirmationButtons?: boolean;
  isCheckoutMode?: boolean;
}

export default function BillSummary({
  diners,
  orders,
  breakdown,
  taxRate,
  tipPercentage = 0,
  onConfirmSplit,
  onRequestChange,
  showConfirmationButtons = false,
  isCheckoutMode = false
}: BillSummaryProps) {
  const totalBill = breakdown.reduce((sum, b) => sum + b.total, 0);
  const tipAmount = totalBill * (tipPercentage / 100);
  const grandTotal = totalBill + tipAmount;

  const allConfirmed = diners.every(d => d.hasConfirmed);
  const confirmedCount = diners.filter(d => d.hasConfirmed).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-text-primary">Bill Summary</h2>
        {isCheckoutMode && (
          <Badge 
            variant={allConfirmed ? "default" : "secondary"}
            className={cn(
              "text-sm",
              allConfirmed 
                ? "bg-success text-success-foreground" 
                : "bg-warning text-warning-foreground"
            )}
          >
            {confirmedCount}/{diners.length} Confirmed
          </Badge>
        )}
      </div>

      {/* Individual Breakdowns */}
      <div className="space-y-4">
        {breakdown.map((dinerBreakdown) => {
          const diner = diners.find(d => d.id === dinerBreakdown.dinerId);
          const isConfirmed = diner?.hasConfirmed ?? false;

          return (
            <div 
              key={dinerBreakdown.dinerId} 
              className={cn(
                "bg-surface border rounded-lg p-4 shadow-card",
                isConfirmed && "ring-2 ring-success bg-success/5"
              )}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-text-primary">
                    {dinerBreakdown.dinerName}
                  </h3>
                  {isCheckoutMode && (
                    <div className="flex items-center gap-1">
                      {isConfirmed ? (
                        <Check className="h-4 w-4 text-success" />
                      ) : (
                        <Clock className="h-4 w-4 text-warning" />
                      )}
                    </div>
                  )}
                </div>
                <span className="text-lg font-bold text-primary">
                  ${dinerBreakdown.total.toFixed(2)}
                </span>
              </div>

              {/* Individual Items */}
              {dinerBreakdown.individualItems.length > 0 && (
                <div className="mb-3">
                  <h4 className="text-sm font-medium text-text-secondary mb-2 flex items-center gap-1">
                    <User className="h-3 w-3" />
                    Individual Items
                  </h4>
                  <div className="space-y-1">
                    {dinerBreakdown.individualItems.map((item, index) => (
                      <div key={index} className="flex justify-between text-sm">
                        <span>{item.quantity}x {item.item.name}</span>
                        <span>${item.total.toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Shared Items */}
              {dinerBreakdown.sharedItems.length > 0 && (
                <div className="mb-3">
                  <h4 className="text-sm font-medium text-text-secondary mb-2 flex items-center gap-1">
                    <Users className="h-3 w-3" />
                    Shared Items (Your Portion)
                  </h4>
                  <div className="space-y-1">
                    {dinerBreakdown.sharedItems.map((item, index) => (
                      <div key={index} className="text-sm">
                        <div className="flex justify-between">
                          <span>{item.quantity}x {item.item.name}</span>
                          <span>${item.portionPrice.toFixed(2)}</span>
                        </div>
                        <div className="text-xs text-text-secondary pl-2">
                          Split {item.splitBetween} ways (${item.totalPrice.toFixed(2)} total)
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <Separator className="my-3" />

              {/* Subtotal and Tax */}
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>${dinerBreakdown.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax ({(taxRate * 100).toFixed(1)}%)</span>
                  <span>${dinerBreakdown.tax.toFixed(2)}</span>
                </div>
                {tipPercentage > 0 && (
                  <div className="flex justify-between">
                    <span>Tip ({tipPercentage}%)</span>
                    <span>${(dinerBreakdown.total * (tipPercentage / 100)).toFixed(2)}</span>
                  </div>
                )}
              </div>

              {/* Confirmation Buttons */}
              {showConfirmationButtons && !isConfirmed && (
                <div className="flex gap-2 mt-4">
                  <Button
                    onClick={() => onConfirmSplit?.(dinerBreakdown.dinerId)}
                    variant="success"
                    className="flex-1"
                  >
                    Confirm Amount
                  </Button>
                  <Button
                    onClick={() => onRequestChange?.(dinerBreakdown.dinerId)}
                    variant="outline"
                    size="sm"
                  >
                    Request Change
                  </Button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Total Summary */}
      <div className="bg-surface-elevated border rounded-lg p-4 shadow-elevated">
        <h3 className="font-semibold text-text-primary mb-3">Total Bill</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>${breakdown.reduce((sum, b) => sum + b.subtotal, 0).toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>Tax</span>
            <span>${breakdown.reduce((sum, b) => sum + b.tax, 0).toFixed(2)}</span>
          </div>
          {tipPercentage > 0 && (
            <div className="flex justify-between">
              <span>Tip ({tipPercentage}%)</span>
              <span>${tipAmount.toFixed(2)}</span>
            </div>
          )}
          <Separator />
          <div className="flex justify-between text-lg font-bold text-primary">
            <span>Grand Total</span>
            <span>${(tipPercentage > 0 ? grandTotal : totalBill).toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}