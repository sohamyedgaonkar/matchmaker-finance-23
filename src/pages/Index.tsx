import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, FileSpreadsheet, Target, BarChart3, Shield } from "lucide-react";
import { Link } from "react-router-dom";
import Navigation from "@/components/Navigation";
import heroImage from "@/assets/hero-finance.jpg";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-background via-finance-secondary/50 to-background"></div>
        <div className="container mx-auto px-4 relative">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <h1 className="text-5xl lg:text-6xl font-bold text-foreground leading-tight">
                  Finance
                  <span className="text-finance-primary block">Reconciliation</span>
                  <span className="text-muted-foreground">Made Simple</span>
                </h1>
                <p className="text-xl text-muted-foreground max-w-lg">
                  Automatically match and reconcile your company and party transaction data. 
                  Upload, analyze, and get results in minutes, not hours.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Button asChild size="lg" className="text-lg px-8">
                  <Link to="/upload">
                    Get Started
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Link>
                </Button>
                <Button variant="outline" size="lg" className="text-lg px-8">
                  View Demo
                </Button>
              </div>
              
              <div className="flex items-center gap-8 pt-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-finance-primary">99.5%</div>
                  <div className="text-sm text-muted-foreground">Accuracy Rate</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-finance-primary">50ms</div>
                  <div className="text-sm text-muted-foreground">Avg Match Time</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-finance-primary">24/7</div>
                  <div className="text-sm text-muted-foreground">Available</div>
                </div>
              </div>
            </div>
            
            <div className="relative">
              <img 
                src={heroImage} 
                alt="Finance reconciliation dashboard" 
                className="rounded-2xl shadow-finance w-full"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-finance-primary/20 to-transparent rounded-2xl"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-4xl font-bold text-foreground">
              Powerful Reconciliation Features
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Everything you need to streamline your financial reconciliation process
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="shadow-card border-0">
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 bg-finance-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FileSpreadsheet className="w-8 h-8 text-finance-primary" />
                </div>
                <CardTitle>Smart Upload</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center">
                  Support for multiple file formats including CSV, Excel, and more. 
                  Intelligent data parsing and validation.
                </CardDescription>
              </CardContent>
            </Card>
            
            <Card className="shadow-card border-0">
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Target className="w-8 h-8 text-accent" />
                </div>
                <CardTitle>Precise Matching</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center">
                  Advanced algorithms match transactions based on amount, date, 
                  reference numbers, and custom criteria.
                </CardDescription>
              </CardContent>
            </Card>
            
            <Card className="shadow-card border-0">
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 bg-finance-warning/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <BarChart3 className="w-8 h-8 text-finance-warning" />
                </div>
                <CardTitle>Detailed Reports</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center">
                  Comprehensive reconciliation reports with match confidence scores 
                  and discrepancy analysis.
                </CardDescription>
              </CardContent>
            </Card>
            
            <Card className="shadow-card border-0">
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-8 h-8 text-destructive" />
                </div>
                <CardTitle>Secure Processing</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center">
                  Bank-level security with encrypted data transmission 
                  and secure cloud processing infrastructure.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="bg-gradient-to-r from-finance-primary to-finance-primary/80 rounded-3xl p-12 text-center text-primary-foreground">
            <h2 className="text-4xl font-bold mb-4">
              Ready to Streamline Your Reconciliation?
            </h2>
            <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
              Join thousands of finance teams already using our platform to save time and reduce errors.
            </p>
            <Button asChild size="lg" variant="secondary" className="text-lg px-8">
              <Link to="/upload">
                Start Reconciliation Now
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;