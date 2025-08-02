import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Check, Clock, Users, User, Smartphone, Wifi, Utensils } from "lucide-react";
import { cn } from "@/lib/utils";

// Mock data
const mockSession = {
  tableNumber: "7",
  restaurantName: "Seoul Garden KBBQ",
  isActive: true,
  serverName: "Maria"
};

const mockBillBreakdown = {
  dinerName: "Alice Kim",
  individualItems: [
    { item: { name: "Bulgogi", price: 28.99 }, quantity: 1, total: 28.99 },
  ],
  sharedItems: [
    { 
      item: { name: "Galbi (Short Ribs)", price: 32.99 }, 
      quantity: 2, 
      totalPrice: 65.98, 
      portionPrice: 16.50, 
      splitBetween: 4 
    },
    { 
      item: { name: "Soju (Original)", price: 18.99 }, 
      quantity: 2, 
      totalPrice: 37.98, 
      portionPrice: 9.50, 
      splitBetween: 4 
    }
  ],
  subtotal: 54.99,
  tax: 4.88,
  suggestedTip: 11.97, // 20%
  total: 71.84
};

export default function DinerPhone() {
  const [step, setStep] = useState<"join" | "waiting" | "checkout" | "confirmed">("join");
  const [dinerName, setDinerName] = useState("");
  const [isConnected, setIsConnected] = useState(false);
  const [currentTotal, setCurrentTotal] = useState(28.50);

  const handleJoinTable = () => {
    if (dinerName.trim()) {
      setIsConnected(true);
      setStep("waiting");
    }
  };

  const handleConfirmAmount = () => {
    setStep("confirmed");
  };

  const handleRequestChange = () => {
    // In real app, would send request to server
    alert("Change request sent to server. They will review your bill.");
  };

  if (step === "join") {
    return (
      <div className="min-h-screen bg-gradient-hero flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 w-12 h-12 bg-primary rounded-full flex items-center justify-center">
              <Smartphone className="h-6 w-6 text-primary-foreground" />
            </div>
            <CardTitle className="text-xl text-text-primary">
              Join Table {mockSession.tableNumber}
            </CardTitle>
            <p className="text-sm text-text-secondary">
              {mockSession.restaurantName}
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-text-primary mb-2 block">
                Enter your name
              </label>
              <Input
                placeholder="Your name"
                value={dinerName}
                onChange={(e) => setDinerName(e.target.value)}
                className="text-center text-lg"
                onKeyPress={(e) => e.key === 'Enter' && handleJoinTable()}
              />
            </div>
            
            <Button 
              onClick={handleJoinTable}
              disabled={!dinerName.trim()}
              variant="korean" 
              size="lg" 
              className="w-full"
            >
              Join Table
            </Button>

            <div className="text-center text-xs text-text-secondary">
              Server: {mockSession.serverName} • Session active
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (step === "waiting") {
    return (
      <div className="min-h-screen bg-background p-4">
        <div className="max-w-md mx-auto space-y-6">
          {/* Header */}
          <div className="text-center space-y-2">
            <div className="flex items-center justify-center gap-2">
              <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
              <span className="text-sm font-medium text-success">Connected</span>
            </div>
            <h1 className="text-xl font-bold text-text-primary">
              {mockSession.restaurantName}
            </h1>
            <p className="text-text-secondary">Table {mockSession.tableNumber} • {dinerName}</p>
          </div>

          {/* Current Status */}
          <Card>
            <CardContent className="pt-6">
              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                  <Utensils className="h-8 w-8 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-text-primary">Ordering in Progress</h3>
                  <p className="text-sm text-text-secondary mt-1">
                    Your server is adding items to the order
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Current Total */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Your Current Total</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <span className="text-text-secondary">Estimated amount:</span>
                <span className="text-2xl font-bold text-primary">
                  ${currentTotal.toFixed(2)}
                </span>
              </div>
              <p className="text-xs text-text-secondary mt-2">
                This amount updates in real-time as items are ordered and split
              </p>
            </CardContent>
          </Card>

          {/* Simulate checkout button (would be triggered by server) */}
          <Button 
            onClick={() => setStep("checkout")} 
            variant="outline" 
            className="w-full"
          >
            Simulate Checkout (Demo)
          </Button>
        </div>
      </div>
    );
  }

  if (step === "checkout") {
    return (
      <div className="min-h-screen bg-background p-4">
        <div className="max-w-md mx-auto space-y-6">
          {/* Header */}
          <div className="text-center space-y-2">
            <h1 className="text-xl font-bold text-text-primary">Your Bill</h1>
            <p className="text-text-secondary">Table {mockSession.tableNumber} • {dinerName}</p>
            <Badge variant="secondary" className="bg-warning text-warning-foreground">
              <Clock className="h-3 w-3 mr-1" />
              Confirmation Required
            </Badge>
          </div>

          {/* Bill Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Bill Breakdown</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Individual Items */}
              {mockBillBreakdown.individualItems.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-text-secondary mb-2 flex items-center gap-1">
                    <User className="h-3 w-3" />
                    Your Individual Items
                  </h4>
                  <div className="space-y-1">
                    {mockBillBreakdown.individualItems.map((item, index) => (
                      <div key={index} className="flex justify-between text-sm">
                        <span>{item.quantity}x {item.item.name}</span>
                        <span>${item.total.toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Shared Items */}
              {mockBillBreakdown.sharedItems.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-text-secondary mb-2 flex items-center gap-1">
                    <Users className="h-3 w-3" />
                    Shared Items (Your Portion)
                  </h4>
                  <div className="space-y-2">
                    {mockBillBreakdown.sharedItems.map((item, index) => (
                      <div key={index} className="text-sm">
                        <div className="flex justify-between">
                          <span>{item.quantity}x {item.item.name}</span>
                          <span>${item.portionPrice.toFixed(2)}</span>
                        </div>
                        <div className="text-xs text-text-secondary pl-2">
                          Your share of ${item.totalPrice.toFixed(2)} (split {item.splitBetween} ways)
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <Separator />

              {/* Totals */}
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>${mockBillBreakdown.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax</span>
                  <span>${mockBillBreakdown.tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-text-secondary">
                  <span>Suggested Tip (20%)</span>
                  <span>${mockBillBreakdown.suggestedTip.toFixed(2)}</span>
                </div>
                <Separator />
                <div className="flex justify-between text-lg font-bold text-primary">
                  <span>Your Total</span>
                  <span>${mockBillBreakdown.total.toFixed(2)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="space-y-3">
            <Button 
              onClick={handleConfirmAmount}
              variant="success" 
              size="lg" 
              className="w-full"
            >
              <Check className="h-4 w-4 mr-2" />
              Confirm This Amount
            </Button>
            
            <Button 
              onClick={handleRequestChange}
              variant="outline" 
              className="w-full"
            >
              Request Change
            </Button>
          </div>

          <p className="text-xs text-text-secondary text-center">
            Once confirmed, your server will process payment through their system
          </p>
        </div>
      </div>
    );
  }

  if (step === "confirmed") {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="max-w-md mx-auto text-center space-y-6">
          <div className="w-20 h-20 bg-success rounded-full flex items-center justify-center mx-auto">
            <Check className="h-10 w-10 text-success-foreground" />
          </div>
          
          <div>
            <h1 className="text-2xl font-bold text-text-primary mb-2">
              Amount Confirmed!
            </h1>
            <p className="text-text-secondary">
              Your portion has been confirmed at <span className="font-semibold text-primary">${mockBillBreakdown.total.toFixed(2)}</span>
            </p>
          </div>

          <Card>
            <CardContent className="pt-6">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Table:</span>
                  <span>{mockSession.tableNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span>Diner:</span>
                  <span>{dinerName}</span>
                </div>
                <div className="flex justify-between">
                  <span>Your Total:</span>
                  <span className="font-semibold">${mockBillBreakdown.total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Status:</span>
                  <Badge variant="default" className="bg-success text-success-foreground text-xs">
                    Confirmed
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <p className="text-sm text-text-secondary">
            Please wait while your server processes payment. Thank you for dining with us!
          </p>
        </div>
      </div>
    );
  }

  return null;
}