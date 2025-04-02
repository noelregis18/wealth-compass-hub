
import React, { useState, useEffect } from "react";
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
  Cell,
} from "recharts";
import Layout from "@/components/layout/Layout";
import CalculatorLayout from "@/components/calculator/CalculatorLayout";
import SliderInput from "@/components/calculator/SliderInput";
import ResultCard from "@/components/calculator/ResultCard";

const EMICalculator = () => {
  const [loanAmount, setLoanAmount] = useState(500000);
  const [interestRate, setInterestRate] = useState(10);
  const [loanTerm, setLoanTerm] = useState(3);
  
  // Results
  const [monthlyEMI, setMonthlyEMI] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);
  const [totalInterest, setTotalInterest] = useState(0);
  const [monthlyBreakdown, setMonthlyBreakdown] = useState<any[]>([]);
  
  // Format currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(value);
  };

  // Calculate EMI when inputs change
  useEffect(() => {
    calculateEMI();
  }, [loanAmount, interestRate, loanTerm]);

  const calculateEMI = () => {
    // Monthly interest rate
    const monthlyRate = interestRate / 100 / 12;
    
    // Total number of payments
    const numberOfPayments = loanTerm * 12;
    
    // Calculate EMI
    const emi =
      (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) /
      (Math.pow(1 + monthlyRate, numberOfPayments) - 1);
    
    setMonthlyEMI(emi);
    setTotalAmount(emi * numberOfPayments);
    setTotalInterest(emi * numberOfPayments - loanAmount);
    
    // Calculate monthly breakdown
    calculateMonthlyBreakdown(loanAmount, monthlyRate, emi, numberOfPayments);
  };

  const calculateMonthlyBreakdown = (
    principal: number,
    monthlyRate: number,
    emi: number,
    numberOfPayments: number
  ) => {
    let balance = principal;
    const breakdown = [];
    
    for (let month = 1; month <= numberOfPayments; month++) {
      const interestPayment = balance * monthlyRate;
      const principalPayment = emi - interestPayment;
      
      balance -= principalPayment;
      
      if (month % 3 === 0 || month === 1 || month === numberOfPayments) {
        breakdown.push({
          month,
          principalPaid: principalPayment,
          interestPaid: interestPayment,
          balance: Math.max(0, balance),
          emi,
        });
      }
    }
    
    setMonthlyBreakdown(breakdown);
  };

  // Pie chart data
  const pieData = [
    { name: "Principal", value: loanAmount },
    { name: "Interest", value: totalInterest },
  ];

  const COLORS = ["#3B82F6", "#EC4899"];

  return (
    <Layout>
      <CalculatorLayout 
        title="EMI Calculator" 
        description="Calculate your Equated Monthly Installment (EMI) for loans"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">Loan Details</h3>
            
            <SliderInput
              label="Loan Amount"
              value={loanAmount}
              setValue={setLoanAmount}
              min={50000}
              max={5000000}
              step={10000}
              formatValue={(value) => formatCurrency(value).replace("₹", "")}
              unit="₹"
            />
            
            <SliderInput
              label="Interest Rate"
              value={interestRate}
              setValue={setInterestRate}
              min={5}
              max={25}
              step={0.1}
              formatValue={(value) => value.toFixed(1)}
              unit="%"
            />
            
            <SliderInput
              label="Loan Tenure"
              value={loanTerm}
              setValue={setLoanTerm}
              min={1}
              max={7}
              step={1}
              unit="years"
            />
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8">
              <ResultCard
                title="Monthly EMI"
                value={formatCurrency(monthlyEMI)}
                className="sm:col-span-2"
              />
              <ResultCard
                title="Total Amount"
                value={formatCurrency(totalAmount)}
              />
              <ResultCard
                title="Total Interest"
                value={formatCurrency(totalInterest)}
              />
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Payment Breakdown</h3>
            
            <div className="h-64 mb-8">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
            
            <h3 className="text-lg font-semibold mb-4">EMI Payments Over Time</h3>
            
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={monthlyBreakdown}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" label={{ value: 'Month', position: 'insideBottom', offset: -5 }} />
                  <YAxis tickFormatter={(value) => `₹${(value / 1000).toFixed(0)}K`} />
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
                    dataKey="emi"
                    name="EMI Amount"
                    stroke="#10B981"
                    strokeDasharray="5 5"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
        
        <div className="mt-8">
          <h3 className="text-lg font-semibold mb-4">EMI Schedule (Selected Months)</h3>
          
          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse">
              <thead>
                <tr className="bg-secondary">
                  <th className="px-4 py-2 text-left">Month</th>
                  <th className="px-4 py-2 text-right">EMI</th>
                  <th className="px-4 py-2 text-right">Principal</th>
                  <th className="px-4 py-2 text-right">Interest</th>
                  <th className="px-4 py-2 text-right">Balance</th>
                </tr>
              </thead>
              <tbody>
                {monthlyBreakdown.map((item, index) => (
                  <tr key={index} className="border-b border-border hover:bg-secondary/50">
                    <td className="px-4 py-2">{item.month}</td>
                    <td className="px-4 py-2 text-right">{formatCurrency(item.emi)}</td>
                    <td className="px-4 py-2 text-right">{formatCurrency(item.principalPaid)}</td>
                    <td className="px-4 py-2 text-right">{formatCurrency(item.interestPaid)}</td>
                    <td className="px-4 py-2 text-right">{formatCurrency(item.balance)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </CalculatorLayout>
    </Layout>
  );
};

export default EMICalculator;
