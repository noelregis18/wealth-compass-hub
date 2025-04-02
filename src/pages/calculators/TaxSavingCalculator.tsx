
import React, { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from "recharts";
import Layout from "@/components/layout/Layout";
import CalculatorLayout from "@/components/calculator/CalculatorLayout";
import SliderInput from "@/components/calculator/SliderInput";
import ResultCard from "@/components/calculator/ResultCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const TaxSavingCalculator = () => {
  const [income, setIncome] = useState(1200000);
  const [investments, setInvestments] = useState({
    epf: 21600,
    ppf: 150000,
    elss: 50000,
    nps: 50000,
    lifeInsurance: 25000,
    homeLoan: 200000,
    medicalInsurance: 25000,
    education: 0,
  });
  
  // Tax slabs
  const taxSlabs = {
    oldRegime: [
      { limit: 250000, rate: 0 },
      { limit: 500000, rate: 5 },
      { limit: 1000000, rate: 20 },
      { limit: Infinity, rate: 30 },
    ],
    newRegime: [
      { limit: 300000, rate: 0 },
      { limit: 600000, rate: 5 },
      { limit: 900000, rate: 10 },
      { limit: 1200000, rate: 15 },
      { limit: 1500000, rate: 20 },
      { limit: Infinity, rate: 30 },
    ],
  };
  
  // Results
  const [taxSavings, setTaxSavings] = useState(0);
  const [oldRegimeTax, setOldRegimeTax] = useState(0);
  const [newRegimeTax, setNewRegimeTax] = useState(0);
  const [betterRegime, setBetterRegime] = useState<"old" | "new">("old");
  const [deductions, setDeductions] = useState(0);
  const [taxableIncome, setTaxableIncome] = useState(0);
  
  // Format currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(value);
  };

  // Calculate tax details
  useEffect(() => {
    calculateTax();
  }, [income, investments]);

  const calculateTax = () => {
    // Calculate total deductions under Section 80C
    const section80C = Math.min(
      investments.epf + investments.ppf + investments.elss + investments.lifeInsurance,
      150000 // 80C limit
    );
    
    // NPS deduction under Section 80CCD(1B)
    const npsDeduction = Math.min(investments.nps, 50000);
    
    // Home loan principal repayment (part of 80C)
    // and interest (Section 24)
    const homeLoanDeduction = investments.homeLoan;
    
    // Medical insurance under Section 80D
    const medicalInsurance = Math.min(investments.medicalInsurance, 25000);
    
    // Education loan interest under Section 80E
    const educationLoan = investments.education;
    
    // Calculate total deductions
    const totalDeductions = section80C + npsDeduction + homeLoanDeduction + medicalInsurance + educationLoan;
    
    // Calculate taxable income
    const taxable = Math.max(0, income - totalDeductions);
    
    // Calculate tax under old regime
    const oldTax = calculateTaxForRegime(taxable, taxSlabs.oldRegime);
    
    // Calculate tax under new regime
    const newTax = calculateTaxForRegime(income, taxSlabs.newRegime); // No deductions in new regime
    
    // Determine better regime
    const isBetterOld = oldTax <= newTax;
    
    // Calculate tax savings
    const maxTaxWithoutDeductions = calculateTaxForRegime(income, taxSlabs.oldRegime);
    const savings = maxTaxWithoutDeductions - (isBetterOld ? oldTax : newTax);
    
    // Update state
    setOldRegimeTax(oldTax);
    setNewRegimeTax(newTax);
    setBetterRegime(isBetterOld ? "old" : "new");
    setDeductions(totalDeductions);
    setTaxableIncome(taxable);
    setTaxSavings(savings);
  };

  const calculateTaxForRegime = (amount: number, slabs: { limit: number; rate: number }[]) => {
    let remainingAmount = amount;
    let tax = 0;
    let previousLimit = 0;
    
    for (const slab of slabs) {
      const taxableInSlab = Math.min(remainingAmount, slab.limit - previousLimit);
      tax += (taxableInSlab * slab.rate) / 100;
      remainingAmount -= taxableInSlab;
      previousLimit = slab.limit;
      
      if (remainingAmount <= 0) break;
    }
    
    // Add cess (4% of tax)
    tax += tax * 0.04;
    
    return tax;
  };

  // Handle investment change
  const handleInvestmentChange = (key: keyof typeof investments, value: number) => {
    setInvestments({ ...investments, [key]: value });
  };

  // Prepare data for charts
  const prepareInvestmentsData = () => {
    return Object.entries(investments).map(([key, value]) => ({
      name: formatInvestmentName(key),
      value,
      isZero: value === 0,
    }));
  };
  
  const formatInvestmentName = (key: string) => {
    const map: Record<string, string> = {
      epf: "EPF",
      ppf: "PPF",
      elss: "ELSS",
      nps: "NPS",
      lifeInsurance: "Life Insurance",
      homeLoan: "Home Loan",
      medicalInsurance: "Medical Insurance",
      education: "Education Loan",
    };
    
    return map[key] || key;
  };

  // Chart data
  const investmentsData = prepareInvestmentsData().filter(item => !item.isZero);
  const regimeComparisonData = [
    { name: "Old Regime", value: oldRegimeTax },
    { name: "New Regime", value: newRegimeTax },
  ];
  
  // Colors
  const COLORS = ["#3B82F6", "#10B981", "#EC4899", "#F97316", "#8B5CF6", "#FBBF24"];
  const REGIME_COLORS = { old: "#3B82F6", new: "#10B981" };

  return (
    <Layout>
      <CalculatorLayout 
        title="Tax Saving Calculator" 
        description="Calculate tax savings through various investments and deductions"
      >
        <Tabs defaultValue="calculator">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="calculator">Calculator</TabsTrigger>
            <TabsTrigger value="investments">Investments</TabsTrigger>
            <TabsTrigger value="comparison">Regime Comparison</TabsTrigger>
          </TabsList>
          
          <TabsContent value="calculator" className="space-y-4 pt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-semibold mb-4">Income Details</h3>
                
                <SliderInput
                  label="Annual Income"
                  value={income}
                  setValue={setIncome}
                  min={300000}
                  max={5000000}
                  step={50000}
                  formatValue={(value) => formatCurrency(value).replace("₹", "")}
                  unit="₹"
                />
                
                <div className="space-y-4 mt-8">
                  <h3 className="text-lg font-semibold">Key Investments</h3>
                  
                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <Label htmlFor="ppf" className="text-sm font-medium">
                        Public Provident Fund (PPF)
                      </Label>
                      <SliderInput
                        label=""
                        value={investments.ppf}
                        setValue={(value) => handleInvestmentChange("ppf", value)}
                        min={0}
                        max={150000}
                        step={1000}
                        formatValue={(value) => formatCurrency(value).replace("₹", "")}
                        unit="₹"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="elss" className="text-sm font-medium">
                        Equity Linked Savings Scheme (ELSS)
                      </Label>
                      <SliderInput
                        label=""
                        value={investments.elss}
                        setValue={(value) => handleInvestmentChange("elss", value)}
                        min={0}
                        max={150000}
                        step={1000}
                        formatValue={(value) => formatCurrency(value).replace("₹", "")}
                        unit="₹"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="nps" className="text-sm font-medium">
                        National Pension Scheme (NPS)
                      </Label>
                      <SliderInput
                        label=""
                        value={investments.nps}
                        setValue={(value) => handleInvestmentChange("nps", value)}
                        min={0}
                        max={150000}
                        step={1000}
                        formatValue={(value) => formatCurrency(value).replace("₹", "")}
                        unit="₹"
                      />
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-4">Tax Summary</h3>
                
                <div className="grid grid-cols-1 gap-4 mb-6">
                  <ResultCard
                    title="Tax Savings"
                    value={formatCurrency(taxSavings)}
                    description="Total tax saved through deductions and investments"
                    className="bg-gradient-blue text-white"
                  />
                  <ResultCard
                    title={`Better Tax Regime: ${betterRegime === "old" ? "Old" : "New"}`}
                    value={formatCurrency(betterRegime === "old" ? oldRegimeTax : newRegimeTax)}
                    description={`You save ${formatCurrency(Math.abs(oldRegimeTax - newRegimeTax))} by choosing this regime`}
                  />
                  <ResultCard
                    title="Total Deductions"
                    value={formatCurrency(deductions)}
                    description="Eligible deductions under various sections"
                  />
                  <ResultCard
                    title="Taxable Income"
                    value={formatCurrency(taxableIncome)}
                    description="Income after all eligible deductions"
                  />
                </div>
                
                <div className="h-72">
                  <h4 className="text-sm font-medium mb-4">Tax Regime Comparison</h4>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={regimeComparisonData}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis tickFormatter={(value) => `₹${(value / 1000).toFixed(0)}K`} />
                      <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                      <Legend />
                      <Bar 
                        dataKey="value" 
                        name="Tax Amount" 
                        fill="#3B82F6"
                        shape={(props: any) => {
                          return (
                            <rect
                              {...props}
                              fill={props.x === 0 ? REGIME_COLORS.old : REGIME_COLORS.new}
                              stroke={props.name === betterRegime ? "#000" : "none"}
                              strokeWidth={props.name === betterRegime ? 2 : 0}
                            />
                          );
                        }}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="investments" className="pt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-semibold mb-4">Investment Details</h3>
                
                <div className="space-y-6">
                  <div>
                    <Label className="text-sm font-medium">
                      Employee Provident Fund (EPF)
                    </Label>
                    <SliderInput
                      label=""
                      value={investments.epf}
                      setValue={(value) => handleInvestmentChange("epf", value)}
                      min={0}
                      max={200000}
                      step={1000}
                      formatValue={(value) => formatCurrency(value).replace("₹", "")}
                      unit="₹"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Your contribution to EPF, typically 12% of basic salary
                    </p>
                  </div>
                  
                  <div>
                    <Label className="text-sm font-medium">
                      Life Insurance Premium
                    </Label>
                    <SliderInput
                      label=""
                      value={investments.lifeInsurance}
                      setValue={(value) => handleInvestmentChange("lifeInsurance", value)}
                      min={0}
                      max={100000}
                      step={1000}
                      formatValue={(value) => formatCurrency(value).replace("₹", "")}
                      unit="₹"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Annual premium for life insurance policies
                    </p>
                  </div>
                  
                  <div>
                    <Label className="text-sm font-medium">
                      Home Loan (Principal + Interest)
                    </Label>
                    <SliderInput
                      label=""
                      value={investments.homeLoan}
                      setValue={(value) => handleInvestmentChange("homeLoan", value)}
                      min={0}
                      max={500000}
                      step={10000}
                      formatValue={(value) => formatCurrency(value).replace("₹", "")}
                      unit="₹"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Principal (80C) and interest (24) payments on home loan
                    </p>
                  </div>
                  
                  <div>
                    <Label className="text-sm font-medium">
                      Medical Insurance Premium
                    </Label>
                    <SliderInput
                      label=""
                      value={investments.medicalInsurance}
                      setValue={(value) => handleInvestmentChange("medicalInsurance", value)}
                      min={0}
                      max={50000}
                      step={1000}
                      formatValue={(value) => formatCurrency(value).replace("₹", "")}
                      unit="₹"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Annual premium for health insurance (80D)
                    </p>
                  </div>
                  
                  <div>
                    <Label className="text-sm font-medium">
                      Education Loan Interest
                    </Label>
                    <SliderInput
                      label=""
                      value={investments.education}
                      setValue={(value) => handleInvestmentChange("education", value)}
                      min={0}
                      max={100000}
                      step={1000}
                      formatValue={(value) => formatCurrency(value).replace("₹", "")}
                      unit="₹"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Interest paid on education loan (80E)
                    </p>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-4">Investment Summary</h3>
                
                <div className="h-72 mb-6">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={investmentsData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      >
                        {investmentsData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                
                <div className="overflow-y-auto max-h-64">
                  <table className="min-w-full border-collapse">
                    <thead>
                      <tr className="bg-secondary">
                        <th className="px-4 py-2 text-left">Investment</th>
                        <th className="px-4 py-2 text-right">Amount</th>
                        <th className="px-4 py-2 text-left">Tax Section</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-border hover:bg-secondary/50">
                        <td className="px-4 py-2">EPF</td>
                        <td className="px-4 py-2 text-right">{formatCurrency(investments.epf)}</td>
                        <td className="px-4 py-2">80C</td>
                      </tr>
                      <tr className="border-b border-border hover:bg-secondary/50">
                        <td className="px-4 py-2">PPF</td>
                        <td className="px-4 py-2 text-right">{formatCurrency(investments.ppf)}</td>
                        <td className="px-4 py-2">80C</td>
                      </tr>
                      <tr className="border-b border-border hover:bg-secondary/50">
                        <td className="px-4 py-2">ELSS</td>
                        <td className="px-4 py-2 text-right">{formatCurrency(investments.elss)}</td>
                        <td className="px-4 py-2">80C</td>
                      </tr>
                      <tr className="border-b border-border hover:bg-secondary/50">
                        <td className="px-4 py-2">Life Insurance</td>
                        <td className="px-4 py-2 text-right">{formatCurrency(investments.lifeInsurance)}</td>
                        <td className="px-4 py-2">80C</td>
                      </tr>
                      <tr className="border-b border-border hover:bg-secondary/50">
                        <td className="px-4 py-2">NPS</td>
                        <td className="px-4 py-2 text-right">{formatCurrency(investments.nps)}</td>
                        <td className="px-4 py-2">80CCD(1B)</td>
                      </tr>
                      <tr className="border-b border-border hover:bg-secondary/50">
                        <td className="px-4 py-2">Home Loan</td>
                        <td className="px-4 py-2 text-right">{formatCurrency(investments.homeLoan)}</td>
                        <td className="px-4 py-2">80C & 24</td>
                      </tr>
                      <tr className="border-b border-border hover:bg-secondary/50">
                        <td className="px-4 py-2">Medical Insurance</td>
                        <td className="px-4 py-2 text-right">{formatCurrency(investments.medicalInsurance)}</td>
                        <td className="px-4 py-2">80D</td>
                      </tr>
                      <tr className="border-b border-border hover:bg-secondary/50">
                        <td className="px-4 py-2">Education Loan</td>
                        <td className="px-4 py-2 text-right">{formatCurrency(investments.education)}</td>
                        <td className="px-4 py-2">80E</td>
                      </tr>
                      <tr className="font-medium bg-secondary/50">
                        <td className="px-4 py-2">Total Investments</td>
                        <td className="px-4 py-2 text-right">
                          {formatCurrency(Object.values(investments).reduce((a, b) => a + b, 0))}
                        </td>
                        <td className="px-4 py-2"></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                
                <div className="mt-6 p-4 rounded-lg border bg-secondary/20">
                  <h4 className="font-medium mb-2">Section 80C Limit Status</h4>
                  <div className="flex items-center space-x-2">
                    <div className="h-2 flex-grow bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-blue-500 rounded-full" 
                        style={{ 
                          width: `${Math.min(100, (investments.epf + investments.ppf + investments.elss + investments.lifeInsurance) / 150000 * 100)}%` 
                        }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium">
                      {formatCurrency(Math.min(investments.epf + investments.ppf + investments.elss + investments.lifeInsurance, 150000))} / {formatCurrency(150000)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="comparison" className="pt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-semibold mb-4">Tax Regime Comparison</h3>
                
                <div className="p-4 rounded-lg border bg-secondary/20 mb-6">
                  <h4 className="font-medium mb-2">Your Better Choice</h4>
                  <div className="flex items-center">
                    <div className={`text-2xl font-bold ${
                      betterRegime === 'old' ? 'text-blue-500' : 'text-green-500'
                    }`}>
                      {betterRegime === 'old' ? 'Old Regime' : 'New Regime'}
                    </div>
                    <div className="ml-4 text-lg">
                      Saves you {formatCurrency(Math.abs(oldRegimeTax - newRegimeTax))}
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="p-4 rounded-lg border bg-secondary/20">
                    <h4 className="font-medium mb-2">Old Regime</h4>
                    <p className="text-xl font-semibold">{formatCurrency(oldRegimeTax)}</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Total tax liability under old regime
                    </p>
                    <div className="mt-4">
                      <h5 className="text-sm font-medium mb-1">Key Features</h5>
                      <ul className="text-sm list-disc pl-5 space-y-1">
                        <li>Allows multiple deductions and exemptions</li>
                        <li>Beneficial if you have significant investments</li>
                        <li>Taxable income: {formatCurrency(taxableIncome)}</li>
                        <li>Total deductions: {formatCurrency(deductions)}</li>
                      </ul>
                    </div>
                  </div>
                  
                  <div className="p-4 rounded-lg border bg-secondary/20">
                    <h4 className="font-medium mb-2">New Regime</h4>
                    <p className="text-xl font-semibold">{formatCurrency(newRegimeTax)}</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Total tax liability under new regime
                    </p>
                    <div className="mt-4">
                      <h5 className="text-sm font-medium mb-1">Key Features</h5>
                      <ul className="text-sm list-disc pl-5 space-y-1">
                        <li>Lower tax rates but minimal deductions</li>
                        <li>Beneficial if you have limited investments</li>
                        <li>Taxable income: {formatCurrency(income)}</li>
                        <li>Total deductions: {formatCurrency(0)}</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-4">Tax Breakdown</h3>
                
                <div className="h-72 mb-6">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={[
                        {
                          name: "Without Investments",
                          value: calculateTaxForRegime(income, taxSlabs.oldRegime),
                        },
                        {
                          name: "With Investments (Old)",
                          value: oldRegimeTax,
                        },
                        {
                          name: "New Regime",
                          value: newRegimeTax,
                        },
                      ]}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis tickFormatter={(value) => `₹${(value / 1000).toFixed(0)}K`} />
                      <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                      <Legend />
                      <Bar dataKey="value" name="Tax Amount" fill="#3B82F6" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold mb-4">Tax Slab Rates</h3>
                  
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-medium mb-2">Old Regime</h4>
                      <div className="overflow-y-auto max-h-48">
                        <table className="min-w-full border-collapse">
                          <thead>
                            <tr className="bg-secondary">
                              <th className="px-4 py-2 text-left">Income Range</th>
                              <th className="px-4 py-2 text-right">Rate</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr className="border-b border-border hover:bg-secondary/50">
                              <td className="px-4 py-2">Up to ₹2.5 Lakh</td>
                              <td className="px-4 py-2 text-right">0%</td>
                            </tr>
                            <tr className="border-b border-border hover:bg-secondary/50">
                              <td className="px-4 py-2">₹2.5 Lakh to ₹5 Lakh</td>
                              <td className="px-4 py-2 text-right">5%</td>
                            </tr>
                            <tr className="border-b border-border hover:bg-secondary/50">
                              <td className="px-4 py-2">₹5 Lakh to ₹10 Lakh</td>
                              <td className="px-4 py-2 text-right">20%</td>
                            </tr>
                            <tr className="border-b border-border hover:bg-secondary/50">
                              <td className="px-4 py-2">Above ₹10 Lakh</td>
                              <td className="px-4 py-2 text-right">30%</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-medium mb-2">New Regime</h4>
                      <div className="overflow-y-auto max-h-48">
                        <table className="min-w-full border-collapse">
                          <thead>
                            <tr className="bg-secondary">
                              <th className="px-4 py-2 text-left">Income Range</th>
                              <th className="px-4 py-2 text-right">Rate</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr className="border-b border-border hover:bg-secondary/50">
                              <td className="px-4 py-2">Up to ₹3 Lakh</td>
                              <td className="px-4 py-2 text-right">0%</td>
                            </tr>
                            <tr className="border-b border-border hover:bg-secondary/50">
                              <td className="px-4 py-2">₹3 Lakh to ₹6 Lakh</td>
                              <td className="px-4 py-2 text-right">5%</td>
                            </tr>
                            <tr className="border-b border-border hover:bg-secondary/50">
                              <td className="px-4 py-2">₹6 Lakh to ₹9 Lakh</td>
                              <td className="px-4 py-2 text-right">10%</td>
                            </tr>
                            <tr className="border-b border-border hover:bg-secondary/50">
                              <td className="px-4 py-2">₹9 Lakh to ₹12 Lakh</td>
                              <td className="px-4 py-2 text-right">15%</td>
                            </tr>
                            <tr className="border-b border-border hover:bg-secondary/50">
                              <td className="px-4 py-2">₹12 Lakh to ₹15 Lakh</td>
                              <td className="px-4 py-2 text-right">20%</td>
                            </tr>
                            <tr className="border-b border-border hover:bg-secondary/50">
                              <td className="px-4 py-2">Above ₹15 Lakh</td>
                              <td className="px-4 py-2 text-right">30%</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CalculatorLayout>
    </Layout>
  );
};

export default TaxSavingCalculator;
