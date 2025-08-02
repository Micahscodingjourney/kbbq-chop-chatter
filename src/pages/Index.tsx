import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tablet, Smartphone, Settings, QrCode } from "lucide-react";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-hero flex items-center justify-center p-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-primary-foreground mb-4">
            QuickSplit KBBQ
          </h1>
          <p className="text-xl text-primary-foreground/80 mb-2">
            Smart Bill Splitting for Korean BBQ Restaurants
          </p>
          <p className="text-primary-foreground/60">
            Pre-assign shared items during ordering • Real-time split calculation • Individual confirmation
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="hover:shadow-glow transition-all duration-300">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                <Tablet className="h-8 w-8 text-primary" />
              </div>
              <CardTitle className="text-xl">Server Interface</CardTitle>
              <p className="text-text-secondary">Tablet interface for taking orders and managing splits</p>
            </CardHeader>
            <CardContent>
              <Link to="/server">
                <Button variant="korean" size="lg" className="w-full">
                  Launch Server Tablet
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:shadow-glow transition-all duration-300">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                <Smartphone className="h-8 w-8 text-primary" />
              </div>
              <CardTitle className="text-xl">Diner Experience</CardTitle>
              <p className="text-text-secondary">Mobile interface for diners to join and confirm bills</p>
            </CardHeader>
            <CardContent>
              <Link to="/diner">
                <Button variant="korean" size="lg" className="w-full">
                  Join as Diner
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        <div className="text-center mt-12">
          <p className="text-primary-foreground/60 text-sm">
            Demo interfaces with mock data • Ready for Supabase integration
          </p>
        </div>
      </div>
    </div>
  );
};

export default Index;
