
import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { SectionHeader } from "@/components/ui/section-header";
import { Button } from "@/components/ui/button";
import { Check, CreditCard, Image, FileVideo2, Clock, Shield, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

// Mock package data
const packages = [
  {
    id: "starter",
    name: "Starter",
    price: 49,
    period: "month",
    description: "Perfect for small businesses getting started with AI content",
    features: [
      "50 image generations per month",
      "5 video generations per month",
      "Access to 5 AI models",
      "Standard resolution outputs",
      "Email support"
    ],
    highlighted: false,
  },
  {
    id: "professional",
    name: "Professional",
    price: 149,
    period: "month",
    description: "For growing brands with higher content needs",
    features: [
      "200 image generations per month",
      "20 video generations per month",
      "Access to all AI models",
      "High resolution outputs",
      "Priority support",
      "Custom prompt templates"
    ],
    highlighted: true,
  },
  {
    id: "enterprise",
    name: "Enterprise",
    price: 399,
    period: "month",
    description: "Maximum flexibility for large brands and agencies",
    features: [
      "500 image generations per month",
      "50 video generations per month",
      "Early access to new models",
      "Ultra high resolution outputs",
      "Dedicated account manager",
      "API access",
      "Custom model training"
    ],
    highlighted: false,
  }
];

// Mock invoice data
const mockInvoices = [
  {
    id: "INV-001",
    date: "2023-05-01",
    amount: 149,
    status: "Paid",
    package: "Professional",
  },
  {
    id: "INV-002",
    date: "2023-04-01",
    amount: 149,
    status: "Paid",
    package: "Professional",
  },
  {
    id: "INV-003",
    date: "2023-03-01",
    amount: 49,
    status: "Paid",
    package: "Starter",
  }
];

const Packages = () => {
  const [billingPeriod, setBillingPeriod] = useState<"month" | "year">("month");
  const [selectedPackage, setSelectedPackage] = useState("professional");
  
  const getYearlyPrice = (monthlyPrice: number) => {
    // 20% discount for yearly plans
    return Math.round(monthlyPrice * 12 * 0.8);
  };

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto space-y-8">
        <SectionHeader
          title="Subscription & Billing"
          description="Manage your subscription plan and billing information"
        />

        {/* Current plan summary */}
        <div className="bg-card rounded-lg shadow-card p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-semibold">Current Plan: Professional</h3>
              <p className="text-muted-foreground">Your plan renews on June 1, 2023</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline">Change Payment Method</Button>
              <Button className="bg-cta hover:bg-cta-600">Manage Plan</Button>
            </div>
          </div>
          
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-accent/50 rounded-lg p-4 flex items-start gap-4">
              <div className="bg-primary/10 p-2 rounded-md text-primary">
                <Image className="h-5 w-5" />
              </div>
              <div>
                <h4 className="font-medium">Image Generations</h4>
                <div className="mt-2 h-2 w-full bg-secondary rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-primary rounded-full transition-all duration-500"
                    style={{ width: '35%' }}
                  />
                </div>
                <p className="text-xs text-muted-foreground mt-1">70 / 200 used this month</p>
              </div>
            </div>
            
            <div className="bg-accent/50 rounded-lg p-4 flex items-start gap-4">
              <div className="bg-primary/10 p-2 rounded-md text-primary">
                <FileVideo2 className="h-5 w-5" />
              </div>
              <div>
                <h4 className="font-medium">Video Generations</h4>
                <div className="mt-2 h-2 w-full bg-secondary rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-primary rounded-full transition-all duration-500"
                    style={{ width: '15%' }}
                  />
                </div>
                <p className="text-xs text-muted-foreground mt-1">3 / 20 used this month</p>
              </div>
            </div>
            
            <div className="bg-accent/50 rounded-lg p-4 flex items-start gap-4">
              <div className="bg-primary/10 p-2 rounded-md text-primary">
                <Clock className="h-5 w-5" />
              </div>
              <div>
                <h4 className="font-medium">Renewal</h4>
                <p className="text-sm mt-1">Your plan will renew automatically</p>
                <p className="text-xs text-muted-foreground mt-1">Next billing date: June 1, 2023</p>
              </div>
            </div>
          </div>
        </div>

        {/* Plan selection */}
        <section>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <h2 className="text-2xl font-bold tracking-tight">Available Plans</h2>
            <div className="bg-accent/50 rounded-full p-1 flex">
              <button
                className={cn(
                  "px-4 py-2 rounded-full text-sm font-medium transition-colors",
                  billingPeriod === "month" ? "bg-card shadow-sm" : "hover:bg-card/50"
                )}
                onClick={() => setBillingPeriod("month")}
              >
                Monthly
              </button>
              <button
                className={cn(
                  "px-4 py-2 rounded-full text-sm font-medium transition-colors",
                  billingPeriod === "year" ? "bg-card shadow-sm" : "hover:bg-card/50"
                )}
                onClick={() => setBillingPeriod("year")}
              >
                Yearly <span className="text-xs text-cta">Save 20%</span>
              </button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {packages.map((pkg) => (
              <div
                key={pkg.id}
                className={cn(
                  "bg-card rounded-lg shadow-card overflow-hidden transition-all duration-300",
                  pkg.highlighted ? "ring-2 ring-primary md:scale-105" : "",
                  selectedPackage === pkg.id ? "ring-2 ring-primary" : ""
                )}
              >
                {pkg.highlighted && (
                  <div className="bg-primary text-primary-foreground py-1 px-4 text-center text-sm font-medium">
                    Popular choice
                  </div>
                )}
                <div className="p-6">
                  <h3 className="text-xl font-semibold">{pkg.name}</h3>
                  <div className="mt-2 flex items-start">
                    <span className="text-3xl font-bold">
                      ${billingPeriod === "month" ? pkg.price : getYearlyPrice(pkg.price)}
                    </span>
                    <span className="text-muted-foreground ml-1 mt-1">
                      /{billingPeriod === "month" ? "mo" : "yr"}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">
                    {pkg.description}
                  </p>
                  
                  <div className="mt-6 flex flex-col gap-2">
                    {pkg.features.map((feature, index) => (
                      <div key={index} className="flex items-start gap-2">
                        <div className="text-primary mt-0.5">
                          <Check className="h-4 w-4" />
                        </div>
                        <span className="text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>
                  
                  <Button
                    className={cn(
                      "w-full mt-6",
                      selectedPackage === pkg.id
                        ? "bg-primary hover:bg-primary-600"
                        : pkg.highlighted
                        ? "bg-cta hover:bg-cta-600"
                        : "bg-primary/80 hover:bg-primary"
                    )}
                    onClick={() => setSelectedPackage(pkg.id)}
                  >
                    {selectedPackage === pkg.id ? "Current Plan" : "Select Plan"}
                  </Button>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-6 text-center text-sm text-muted-foreground">
            <p>All plans include a 14-day money-back guarantee</p>
            <p className="mt-1 flex items-center justify-center gap-1">
              <Shield className="h-4 w-4" />
              Secure payment processing with Stripe
            </p>
          </div>
        </section>

        {/* Payment methods */}
        <section>
          <SectionHeader
            title="Payment Methods"
            description="Manage your saved payment methods"
          />
          
          <div className="bg-card rounded-lg shadow-card overflow-hidden">
            <div className="p-4 flex items-center gap-4 border-b">
              <div className="bg-accent/50 p-2 rounded-md">
                <CreditCard className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <h4 className="font-medium">Visa ending in 4242</h4>
                <p className="text-sm text-muted-foreground">Expires 12/25</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs bg-accent px-2 py-0.5 rounded-full">Default</span>
                <Button variant="outline" size="sm">Edit</Button>
                <Button variant="outline" size="sm">Remove</Button>
              </div>
            </div>
            
            <div className="p-4 text-center">
              <Button variant="outline">
                <CreditCard className="h-4 w-4 mr-2" />
                Add Payment Method
              </Button>
            </div>
          </div>
        </section>

        {/* Billing history */}
        <section>
          <SectionHeader
            title="Billing History"
            description="View and download your past invoices"
          />
          
          <div className="bg-card rounded-lg shadow-card overflow-hidden">
            <div className="p-4 border-b">
              <div className="flex justify-between items-center text-sm font-medium text-muted-foreground">
                <span className="w-1/4">Invoice</span>
                <span className="w-1/4">Date</span>
                <span className="w-1/4">Amount</span>
                <span className="w-1/4 text-right">Status</span>
              </div>
            </div>
            
            {mockInvoices.map((invoice) => (
              <div 
                key={invoice.id}
                className="p-4 border-b last:border-b-0 flex justify-between items-center hover:bg-accent/50 transition-colors"
              >
                <div className="w-1/4">
                  <span className="font-medium">{invoice.id}</span>
                  <p className="text-xs text-muted-foreground">{invoice.package} Plan</p>
                </div>
                <span className="w-1/4 text-sm">{invoice.date}</span>
                <span className="w-1/4 text-sm">${invoice.amount}.00</span>
                <div className="w-1/4 text-right">
                  <span className={cn(
                    "text-xs px-2 py-1 rounded-full",
                    invoice.status === "Paid" 
                      ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                      : "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200"
                  )}>
                    {invoice.status}
                  </span>
                </div>
              </div>
            ))}
            
            <div className="p-4 text-center">
              <Button variant="outline" size="sm">
                View All Invoices
              </Button>
            </div>
          </div>
        </section>
      </div>
    </DashboardLayout>
  );
};

export default Packages;
