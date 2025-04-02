
import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Contact from "./pages/Contact";
import MortgageCalculator from "./pages/calculators/MortgageCalculator";
import EMICalculator from "./pages/calculators/EMICalculator";
import SIPCalculator from "./pages/calculators/SIPCalculator";
import SimpleInterestCalculator from "./pages/calculators/SimpleInterestCalculator";
import CompoundInterestCalculator from "./pages/calculators/CompoundInterestCalculator";
import DownPaymentCalculator from "./pages/calculators/DownPaymentCalculator";
import LeaseCalculator from "./pages/calculators/LeaseCalculator";
import SWPCalculator from "./pages/calculators/SWPCalculator";
import MutualFundCalculator from "./pages/calculators/MutualFundCalculator";
import RetirementCalculator from "./pages/calculators/RetirementCalculator";
import SalaryCalculator from "./pages/calculators/SalaryCalculator";
import TaxSavingCalculator from "./pages/calculators/TaxSavingCalculator";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <BrowserRouter>
          <Sonner />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/calculator/mortgage" element={<MortgageCalculator />} />
            <Route path="/calculator/emi" element={<EMICalculator />} />
            <Route path="/calculator/sip" element={<SIPCalculator />} />
            <Route path="/calculator/simple-interest" element={<SimpleInterestCalculator />} />
            <Route path="/calculator/compound-interest" element={<CompoundInterestCalculator />} />
            <Route path="/calculator/down-payment" element={<DownPaymentCalculator />} />
            <Route path="/calculator/lease" element={<LeaseCalculator />} />
            <Route path="/calculator/swp" element={<SWPCalculator />} />
            <Route path="/calculator/mutual-fund" element={<MutualFundCalculator />} />
            <Route path="/calculator/retirement" element={<RetirementCalculator />} />
            <Route path="/calculator/salary" element={<SalaryCalculator />} />
            <Route path="/calculator/tax-saving" element={<TaxSavingCalculator />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
          <Toaster />
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </React.StrictMode>
);

export default App;
