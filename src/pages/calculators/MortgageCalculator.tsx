
import React, { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { 
  LineChart, 
  Line, 
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

const MortgageCalculator = () => {
  const [loanAmount, setLoanAmount] = useState(3000000); // 30 Lakhs
  const [interestRate, setInterestRate] = useState(8.5); // 8.5%
  const [loanTerm, setLoanTerm] = useState(15); // 15 years
  const [downPayment, setDownPayment] = useState(1000000); // 10 Lakhs
  const [propertyValue, setPropertyValue] = useState(4000000); // 40 Lakhs
  
  // Calculations
  const [monthlyPayment, setMonthlyPayment] = useState(0);
  const [totalPayment, setTotalPayment] = useState(0);
  const [totalInterest, setTotalInterest] = useState(0);
  const [amortizationSchedule, setAmortizationSchedule] = useState<any[]>([]);

  // Format currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(value);
  };

  // Format percentage
  const formatPercent = (value: number) => {
    return `${value}%`;
  };

  // Calculate mortgage details
  useEffect(() => {
    calculateMortgage();
  }, [loanAmount, interestRate, loanTerm]);

  const calculateMortgage = () => {
    // Monthly interest rate
    const monthlyRate = interestRate / 100 / 12;
    
    // Total number of payments
    const totalPayments = loanTerm * 12;
    
    // Calculate monthly payment
    const x = Math.pow(1 + monthlyRate, totalPayments);
    const monthly = (loanAmount * x * monthlyRate) / (x - 1);
    
    setMonthlyPayment(monthly);
    setTotalPayment(monthly * totalPayments);
    setTotalInterest(monthly * totalPayments - loanAmount);
    
    // Generate amortization schedule
    generateAmortizationSchedule(loanAmount, monthlyRate, monthly, totalPayments);
  };

  const generateAmortizationSchedule = (
    principal: number,
    monthlyRate: number,
    monthlyPayment: number,
    totalPayments: number
  ) => {
    let balance = principal;
    const schedule = [];
    let totalPrincipal = 0;
    let totalInterest = 0;

    // Create yearly data for the chart
    for (let year = 1; year <= loanTerm; year++) {
      let yearlyPrincipal = 0;
      let yearlyInterest = 0;

      for (let month = 1; month <= 12; month++) {
        if ((year - 1) * 12 + month <= totalPayments) {
          const interestPayment = balance * monthlyRate;
          const principalPayment = monthlyPayment - interestPayment;
          
          balance -= principalPayment;
          
          yearlyPrincipal += principalPayment;
          yearlyInterest += interestPayment;
        }
      }

      totalPrincipal += yearlyPrincipal;
      totalInterest += yearlyInterest;

      schedule.push({
        year,
        balance: Math.max(0, balance),
        principalPaid: yearlyPrincipal,
        interestPaid: yearlyInterest,
        totalPrincipal,
        totalInterest,
      });
    }

    setAmortizationSchedule(schedule);
  };

  const COLORS = ["#3B82F6", "#6366F1", "#EC4899"];

  // Pie chart data for payment breakdown
  const pieChartData = [
    { name: "Principal", value: loanAmount },
    { name: "Interest", value: totalInterest },
    { name: "Down Payment", value: downPayment },
  ];

  return (
    <Layout>
      <CalculatorLayout 
        title="Mortgage Calculator" 
        description="Calculate your mortgage payments, interest, and amortization schedule"
      >
        <Tabs defaultValue="calculator">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="calculator">Calculator</TabsTrigger>
            <TabsTrigger value="amortization">Amortization Schedule</TabsTrigger>
          </TabsList>
          
          <TabsContent value="calculator" className="space-y-4 pt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold">Property Details</h3>
                  <p className="text-sm text-muted-foreground">
                    Enter the details of the property and loan terms
                  </p>
                </div>
                
                <SliderInput
                  label="Property Value"
                  value={propertyValue}
                  setValue={(value) => {
                    setPropertyValue(value);
                    // Update loan amount based on down payment
                    setLoanAmount(value - downPayment);
                  }}
                  min={1000000}
                  max={10000000}
                  step={100000}
                  formatValue={(value) => formatCurrency(value).replace("₹", "")}
                  unit="₹"
                />
                
                <SliderInput
                  label="Down Payment"
                  value={downPayment}
                  setValue={(value) => {
                    setDownPayment(value);
                    // Update loan amount based on property value
                    setLoanAmount(propertyValue - value);
                  }}
                  min={0}
                  max={propertyValue * 0.5}
                  step={50000}
                  formatValue={(value) => formatCurrency(value).replace("₹", "")}
                  unit="₹"
                />
                
                <SliderInput
                  label="Loan Amount"
                  value={loanAmount}
                  setValue={(value) => {
                    setLoanAmount(value);
                    // Update down payment based on property value
                    setDownPayment(propertyValue - value);
                  }}
                  min={500000}
                  max={propertyValue}
                  step={100000}
                  formatValue={(value) => formatCurrency(value).replace("₹", "")}
                  unit="₹"
                />
                
                <SliderInput
                  label="Interest Rate"
                  value={interestRate}
                  setValue={setInterestRate}
                  min={4}
                  max={15}
                  step={0.1}
                  formatValue={(value) => value.toFixed(1)}
                  unit="%"
                />
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Loan Term (Years)</label>
                  <Select
                    value={loanTerm.toString()}
                    onValueChange={(value) => setLoanTerm(Number(value))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select loan term" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="5">5 years</SelectItem>
                      <SelectItem value="10">10 years</SelectItem>
                      <SelectItem value="15">15 years</SelectItem>
                      <SelectItem value="20">20 years</SelectItem>
                      <SelectItem value="25">25 years</SelectItem>
                      <SelectItem value="30">30 years</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div>
                <div className="space-y-2 mb-6">
                  <h3 className="text-lg font-semibold">Mortgage Summary</h3>
                  <p className="text-sm text-muted-foreground">
                    Review your mortgage payment details
                  </p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <ResultCard
                    title="Monthly Payment"
                    value={formatCurrency(monthlyPayment)}
                  />
                  <ResultCard
                    title="Total of All Payments"
                    value={formatCurrency(totalPayment)}
                  />
                  <ResultCard
                    title="Total Interest"
                    value={formatCurrency(totalInterest)}
                  />
                  <ResultCard
                    title="Loan-to-Value Ratio"
                    value={`${((loanAmount / propertyValue) * 100).toFixed(1)}%`}
                    description="Percentage of property financed"
                  />
                </div>
                
                <div className="mt-8">
                  <h3 className="text-sm font-medium mb-4">Payment Breakdown</h3>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={pieChartData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        >
                          {pieChartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="amortization">
            <div className="pt-4">
              <h3 className="text-lg font-semibold mb-4">Amortization Schedule</h3>
              
              <div className="h-72 mb-8">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={amortizationSchedule}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="year" label={{ value: 'Years', position: 'insideBottom', offset: -5 }} />
                    <YAxis tickFormatter={(value) => `₹${(value / 100000).toFixed(0)}L`} />
                    <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="balance"
                      name="Remaining Balance"
                      stroke="#3B82F6"
                      activeDot={{ r: 8 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="totalPrincipal"
                      name="Principal Paid"
                      stroke="#6366F1"
                    />
                    <Line
                      type="monotone"
                      dataKey="totalInterest"
                      name="Interest Paid"
                      stroke="#EC4899"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              
              <div className="overflow-x-auto">
                <table className="min-w-full border-collapse">
                  <thead>
                    <tr className="bg-secondary">
                      <th className="px-4 py-2 text-left">Year</th>
                      <th className="px-4 py-2 text-right">Principal Paid</th>
                      <th className="px-4 py-2 text-right">Interest Paid</th>
                      <th className="px-4 py-2 text-right">Total Paid</th>
                      <th className="px-4 py-2 text-right">Remaining Balance</th>
                    </tr>
                  </thead>
                  <tbody>
                    {amortizationSchedule.map((item, index) => (
                      <tr key={index} className="border-b border-border hover:bg-secondary/50">
                        <td className="px-4 py-2">{item.year}</td>
                        <td className="px-4 py-2 text-right">{formatCurrency(item.principalPaid)}</td>
                        <td className="px-4 py-2 text-right">{formatCurrency(item.interestPaid)}</td>
                        <td className="px-4 py-2 text-right">{formatCurrency(item.principalPaid + item.interestPaid)}</td>
                        <td className="px-4 py-2 text-right">{formatCurrency(item.balance)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CalculatorLayout>
    </Layout>
  );
};

export default MortgageCalculator;
