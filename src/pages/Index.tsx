import React from "react";
import { Link } from "react-router-dom";
import { AreaChart, BadgeDollarSign, Building, Calculator, CreditCard, LineChart, PiggyBank, Wallet } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import Layout from "@/components/layout/Layout";
interface CalculatorCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  to: string;
  className?: string;
}
const CalculatorCard: React.FC<CalculatorCardProps> = ({
  title,
  description,
  icon,
  to,
  className = ""
}) => <Link to={to}>
    <Card className="">
      <CardContent className="p-6">
        <div className="flex flex-col items-center text-center">
          <div className="p-3 rounded-full bg-primary/10 mb-4">
            {icon}
          </div>
          <h3 className="font-semibold mb-2">{title}</h3>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
      </CardContent>
    </Card>
  </Link>;
const Home = () => {
  return <Layout>
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-blue opacity-10 z-0"></div>
        <div className="container mx-auto px-4 py-16 md:py-24 relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
              Wealth Compass Hub
            </h1>
            <p className="text-xl mb-8">
              Your comprehensive suite of financial calculators to make informed decisions
              about loans, investments, and personal finance.
            </p>
          </div>
        </div>
      </section>

      {/* Calculator Categories */}
      <section className="container mx-auto px-4 py-12">
        <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center">
          Financial Calculators
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-primary mb-2">Loan Calculators</h3>
            <CalculatorCard title="Mortgage Calculator" description="Calculate your mortgage payments and see amortization schedule" icon={<Building className="h-6 w-6 text-primary" />} to="/calculator/mortgage" />
            <CalculatorCard title="EMI Calculator" description="Calculate your equated monthly installment for loans" icon={<Calculator className="h-6 w-6 text-primary" />} to="/calculator/emi" />
            <CalculatorCard title="Down Payment Calculator" description="Determine the down payment you need for a property" icon={<Wallet className="h-6 w-6 text-primary" />} to="/calculator/down-payment" />
            <CalculatorCard title="Lease Calculator" description="Understand your lease payments and total cost" icon={<CreditCard className="h-6 w-6 text-primary" />} to="/calculator/lease" />
          </div>

          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-primary mb-2">Investment Calculators</h3>
            <CalculatorCard title="SIP Calculator" description="Calculate returns on Systematic Investment Plans" icon={<AreaChart className="h-6 w-6 text-primary" />} to="/calculator/sip" />
            <CalculatorCard title="Interest Calculator" description="Compare simple and compound interest earnings" icon={<LineChart className="h-6 w-6 text-primary" />} to="/calculator/simple-interest" />
            <CalculatorCard title="SWP Calculator" description="Plan your Systematic Withdrawal Plan" icon={<PiggyBank className="h-6 w-6 text-primary" />} to="/calculator/swp" />
            <CalculatorCard title="Retirement Calculator" description="Plan your retirement savings and income" icon={<PiggyBank className="h-6 w-6 text-primary" />} to="/calculator/retirement" />
          </div>

          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-primary mb-2">Other Calculators</h3>
            <CalculatorCard title="Mutual Fund Calculator" description="Track potential returns on your mutual fund investments" icon={<AreaChart className="h-6 w-6 text-primary" />} to="/calculator/mutual-fund" />
            <CalculatorCard title="Tax Saving Calculator" description="Optimize your tax savings through investments" icon={<BadgeDollarSign className="h-6 w-6 text-primary" />} to="/calculator/tax-saving" />
            <CalculatorCard title="Salary Calculator" description="Calculate take-home pay and deductions" icon={<Wallet className="h-6 w-6 text-primary" />} to="/calculator/salary" />
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="bg-gradient-blue bg-opacity-5 py-12 mt-12">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold">Features</h2>
            <p className="text-muted-foreground mt-2">
              Designed to make financial planning easier and more accessible
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-6 bg-card rounded-lg">
              <h3 className="font-semibold mb-2">Accurate Calculations</h3>
              <p className="text-sm text-muted-foreground">
                Get precise financial calculations based on latest financial formulas
              </p>
            </div>
            <div className="text-center p-6 bg-card rounded-lg">
              <h3 className="font-semibold mb-2">Interactive Visuals</h3>
              <p className="text-sm text-muted-foreground">
                View your financial data with clear and intuitive charts
              </p>
            </div>
            <div className="text-center p-6 bg-card rounded-lg">
              <h3 className="font-semibold mb-2">Accessible Anywhere</h3>
              <p className="text-sm text-muted-foreground">
                Responsive design that works on desktop, tablet, and mobile
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="container mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl md:text-3xl font-bold mb-4">
          Start Making Informed Financial Decisions Today
        </h2>
        <p className="mb-8 text-muted-foreground">
          Use our calculators to plan your financial future with confidence
        </p>
        <Link to="/contact" className="bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-3 rounded-md font-medium transition-colors">
          Get in Touch
        </Link>
      </section>
    </Layout>;
};
export default Home;