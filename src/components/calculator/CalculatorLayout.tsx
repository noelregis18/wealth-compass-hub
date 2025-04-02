
import React from "react";
import { Card } from "@/components/ui/card";

interface CalculatorLayoutProps {
  title: string;
  description: string;
  children: React.ReactNode;
}

const CalculatorLayout: React.FC<CalculatorLayoutProps> = ({
  title,
  description,
  children,
}) => {
  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <div className="text-center mb-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-2 bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
          {title}
        </h1>
        <p className="text-muted-foreground">{description}</p>
      </div>

      <Card className="max-w-4xl mx-auto border border-border/50 shadow-lg">
        <div className="p-6">{children}</div>
      </Card>

      <div className="mt-8 text-sm text-center text-muted-foreground">
        <p>
          Note: This calculator provides estimates for planning purposes only and 
          should not be considered as financial advice.
        </p>
      </div>
    </div>
  );
};

export default CalculatorLayout;
