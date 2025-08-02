import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import DinerList from "@/components/DinerList";
import ItemCard from "@/components/ItemCard";
import BillSummary from "@/components/BillSummary";
import { ShoppingCart, CreditCard, Utensils, Send } from "lucide-react";

// Mock data - replace with real data from Supabase
const mockDiners = [
  { id: "1", name: "Alice Kim", total: 28.50, isConnected: true, hasConfirmed: false },
  { id: "2", name: "Bob Park", total: 31.75, isConnected: true, hasConfirmed: false },
  { id: "3", name: "Carol Lee", total: 25.25, isConnected: true, hasConfirmed: false },
  { id: "4", name: "David Choi", total: 29.00, isConnected: false, hasConfirmed: false },
];

const mockMenuItems = {
  "BBQ": [
    { id: "1", name: "Galbi (Short Ribs)", price: 32.99, category: "BBQ", description: "Premium marinated short ribs" },
    { id: "2", name: "Bulgogi", price: 28.99, category: "BBQ", description: "Marinated sliced beef" },
    { id: "3", name: "Pork Belly", price: 26.99, category: "BBQ", description: "Fresh thick cut pork belly" },
    { id: "4", name: "Spicy Pork", price: 25.99, category: "BBQ", description: "Gochujang marinated pork" },
  ],
  "Sides": [
    { id: "5", name: "Kimchi", price: 8.99, category: "Sides", description: "Fermented cabbage" },
    { id: "6", name: "Japchae", price: 12.99, category: "Sides", description: "Sweet potato noodles" },
    { id: "7", name: "Pajeon", price: 14.99, category: "Sides", description: "Korean scallion pancake" },
  ],
  "Drinks": [
    { id: "8", name: "Soju (Original)", price: 18.99, category: "Drinks", description: "Korean rice wine" },
    { id: "9", name: "Korean Beer", price: 6.99, category: "Drinks", description: "Hite or Cass" },
    { id: "10", name: "Makgeolli", price: 22.99, category: "Drinks", description: "Korean rice wine" },
  ]
};

const mockOrders = [
  { id: "1", menuItem: mockMenuItems.BBQ[0], quantity: 2, isShared: true, assignedTo: [] },
  { id: "2", menuItem: mockMenuItems.BBQ[1], quantity: 1, isShared: false, assignedTo: ["1"] },
  { id: "3", menuItem: mockMenuItems.Drinks[0], quantity: 2, isShared: true, assignedTo: [] },
];

export default function ServerTablet() {
  const [orders, setOrders] = useState(mockOrders);
  const [selectedDiner, setSelectedDiner] = useState<string>("");
  const [activeTab, setActiveTab] = useState("ordering");

  const handleAddItem = (item: any) => {
    const newOrder = {
      id: Date.now().toString(),
      menuItem: item,
      quantity: 1,
      isShared: false,
      assignedTo: selectedDiner ? [selectedDiner] : []
    };
    setOrders([...orders, newOrder]);
  };

  const handleQuantityChange = (itemId: string, quantity: number) => {
    if (quantity === 0) {
      setOrders(orders.filter(o => o.menuItem.id !== itemId));
    } else {
      setOrders(orders.map(o => 
        o.menuItem.id === itemId ? { ...o, quantity } : o
      ));
    }
  };

  const handleSharingToggle = (itemId: string, isShared: boolean) => {
    setOrders(orders.map(o => 
      o.menuItem.id === itemId ? { ...o, isShared, assignedTo: isShared ? [] : o.assignedTo } : o
    ));
  };

  const handleAssignmentChange = (itemId: string, dinerIds: string[]) => {
    setOrders(orders.map(o => 
      o.menuItem.id === itemId ? { ...o, assignedTo: dinerIds } : o
    ));
  };

  // Calculate breakdown for bill summary
  const calculateBreakdown = () => {
    return mockDiners.map(diner => {
      const individualItems = orders
        .filter(o => !o.isShared && o.assignedTo?.includes(diner.id))
        .map(o => ({
          item: o.menuItem,
          quantity: o.quantity,
          total: o.menuItem.price * o.quantity
        }));

      const sharedItems = orders
        .filter(o => o.isShared)
        .map(o => ({
          item: o.menuItem,
          quantity: o.quantity,
          totalPrice: o.menuItem.price * o.quantity,
          portionPrice: (o.menuItem.price * o.quantity) / mockDiners.length,
          splitBetween: mockDiners.length
        }));

      const subtotal = [...individualItems.map(i => i.total), ...sharedItems.map(i => i.portionPrice)]
        .reduce((sum, price) => sum + price, 0);
      
      const tax = subtotal * 0.08875; // NYC tax rate
      const total = subtotal + tax;

      return {
        dinerId: diner.id,
        dinerName: diner.name,
        individualItems,
        sharedItems,
        subtotal,
        tax,
        total
      };
    });
  };

  const totalAmount = orders.reduce((sum, order) => sum + (order.menuItem.price * order.quantity), 0);

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-text-primary">Table 7 - QuickSplit KBBQ</h1>
            <p className="text-text-secondary">Server: Maria • Session started 7:32 PM</p>
          </div>
          <div className="flex items-center gap-4">
            <Badge variant="secondary" className="text-lg px-4 py-2">
              Total: ${totalAmount.toFixed(2)}
            </Badge>
            <Button variant="korean" size="lg" className="flex items-center gap-2">
              <Send className="h-4 w-4" />
              Send to Kitchen
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Panel - Diners */}
          <div className="lg:col-span-1">
            <DinerList 
              diners={mockDiners}
              selectedDinerId={selectedDiner}
              onDinerSelect={setSelectedDiner}
              showTotals={true}
            />
          </div>

          {/* Main Panel */}
          <div className="lg:col-span-2">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="ordering" className="flex items-center gap-2">
                  <Utensils className="h-4 w-4" />
                  Ordering
                </TabsTrigger>
                <TabsTrigger value="current-order" className="flex items-center gap-2">
                  <ShoppingCart className="h-4 w-4" />
                  Current Order ({orders.length})
                </TabsTrigger>
                <TabsTrigger value="checkout" className="flex items-center gap-2">
                  <CreditCard className="h-4 w-4" />
                  Checkout
                </TabsTrigger>
              </TabsList>

              <TabsContent value="ordering" className="space-y-6">
                <div className="space-y-6">
                  {Object.entries(mockMenuItems).map(([category, items]) => (
                    <Card key={category}>
                      <CardHeader>
                        <CardTitle className="text-lg text-primary">{category}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {items.map(item => (
                            <ItemCard
                              key={item.id}
                              item={item}
                              diners={mockDiners}
                              showAddButton={true}
                              onAddItem={handleAddItem}
                            />
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="current-order" className="space-y-6">
                <div className="space-y-4">
                  {orders.length === 0 ? (
                    <div className="text-center py-12 text-text-secondary">
                      <ShoppingCart className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>No items ordered yet</p>
                      <p className="text-sm">Go to Ordering tab to add items</p>
                    </div>
                  ) : (
                    orders.map(order => (
                      <ItemCard
                        key={order.id}
                        item={order.menuItem}
                        order={order}
                        diners={mockDiners}
                        onQuantityChange={handleQuantityChange}
                        onSharingToggle={handleSharingToggle}
                        onAssignmentChange={handleAssignmentChange}
                      />
                    ))
                  )}
                </div>

                {orders.length > 0 && (
                  <div className="flex gap-4">
                    <Button variant="korean" size="lg" className="flex-1">
                      <Send className="h-4 w-4 mr-2" />
                      Send to Kitchen
                    </Button>
                    <Button variant="outline" size="lg" onClick={() => setActiveTab("checkout")}>
                      <CreditCard className="h-4 w-4 mr-2" />
                      Start Checkout
                    </Button>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="checkout" className="space-y-6">
                <BillSummary
                  diners={mockDiners}
                  orders={orders}
                  breakdown={calculateBreakdown()}
                  taxRate={0.08875}
                  isCheckoutMode={true}
                />
                
                <div className="flex gap-4">
                  <Button variant="success" size="lg" className="flex-1">
                    Process Payment
                  </Button>
                  <Button variant="outline" size="lg">
                    Print Receipt
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}