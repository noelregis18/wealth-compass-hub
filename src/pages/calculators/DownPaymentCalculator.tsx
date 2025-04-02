
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
  Cell
} from "recharts";
import Layout from "@/components/layout/Layout";
import CalculatorLayout from "@/components/calculator/CalculatorLayout";
import SliderInput from "@/components/calculator/SliderInput";
import ResultCard from "@/components/calculator/ResultCard";

const DownPaymentCalculator = () => {
  const [propertyValue, setPropertyValue] = useState(3000000);
  const [downPaymentPercent, setDownPaymentPercent] = useState(20);
  const [loanTerm, setLoanTerm] = useState(20);
  const [interestRate, setInterestRate] = useState(8);
  
  // Results
  const [downPaymentAmount, setDownPaymentAmount] = useState(0);
  const [loanAmount, setLoanAmount] = useState(0);
  const [monthlyPayment, setMonthlyPayment] = useState(0);
  const [ltvRatio, setLtvRatio] = useState(0);
  
  // Format currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(value);
  };

  // Calculate down payment and related metrics
  useEffect(() => {
    calculateDownPayment();
  }, [propertyValue, downPaymentPercent, loanTerm, interestRate]);

  const calculateDownPayment = () => {
    // Down payment amount
    const downPayment = propertyValue * (downPaymentPercent / 100);
    setDownPaymentAmount(downPayment);
    
    // Loan amount
    const loan = propertyValue - downPayment;
    setLoanAmount(loan);
    
    // LTV ratio
    setLtvRatio((loan / propertyValue) * 100);
    
    // Monthly payment calculation
    const monthlyRate = interestRate / 100 / 12;
    const totalPayments = loanTerm * 12;
    
    // Calculate monthly payment
    const x = Math.pow(1 + monthlyRate, totalPayments);
    const monthly = (loan * x * monthlyRate) / (x - 1);
    
    setMonthlyPayment(monthly);
  };

  // Chart data preparation
  const prepareChartData = () => {
    // Create array of different down payment percentages
    const percentages = [];
    for (let i = 5; i <= 40; i += 5) {
      percentages.push(i);
    }
    
    return percentages.map(percent => {
      const downPayment = propertyValue * (percent / 100);
      const loan = propertyValue - downPayment;
      const monthlyRate = interestRate / 100 / 12;
      const totalPayments = loanTerm * 12;
      const x = Math.pow(1 + monthlyRate, totalPayments);
      const monthly = (loan * x * monthlyRate) / (x - 1);
      
      return {
        percent,
        downPayment,
        monthlyPayment: monthly,
      };
    });
  };
  
  const chartData = prepareChartData();

  // Pie chart data
  const pieData = [
    { name: "Down Payment", value: downPaymentAmount },
    { name: "Loan Amount", value: loanAmount },
  ];

  const COLORS = ["#3B82F6", "#10B981"];

  return (
    <Layout>
      <CalculatorLayout 
        title="Down Payment Calculator" 
        description="Calculate the optimal down payment for your home purchase"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">Property Details</h3>
            
            <SliderInput
              label="Property Value"
              value={propertyValue}
              setValue={setPropertyValue}
              min={500000}
              max={10000000}
              step={100000}
              formatValue={(value) => formatCurrency(value).replace("₹", "")}
              unit="₹"
            />
            
            <SliderInput
              label="Down Payment Percentage"
              value={downPaymentPercent}
              setValue={setDownPaymentPercent}
              min={5}
              max={50}
              step={1}
              formatValue={(value) => value.toFixed(1)}
              unit="%"
            />
            
            <SliderInput
              label="Loan Term"
              value={loanTerm}
              setValue={setLoanTerm}
              min={5}
              max={30}
              step={1}
              unit="years"
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
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Down Payment Summary</h3>
            
            <div className="grid grid-cols-1 gap-4 mb-6">
              <ResultCard
                title="Down Payment Amount"
                value={formatCurrency(downPaymentAmount)}
                description="Amount you need to pay upfront"
              />
              <ResultCard
                title="Loan Amount"
                value={formatCurrency(loanAmount)}
                description="Amount you need to borrow"
              />
              <ResultCard
                title="Monthly Payment"
                value={formatCurrency(monthlyPayment)}
                description="Monthly mortgage payment"
                className="bg-gradient-blue text-white"
              />
              <ResultCard
                title="Loan-to-Value Ratio"
                value={`${ltvRatio.toFixed(1)}%`}
                description="Percentage of the property financed by the loan"
              />
            </div>
            
            <div className="h-64 mb-4">
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
          </div>
        </div>
        
        <div className="mt-8">
          <h3 className="text-lg font-semibold mb-4">Down Payment Comparison</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={chartData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="percent" 
                  label={{ value: 'Down Payment %', position: 'insideBottom', offset: -5 }} 
                />
                <YAxis 
                  yAxisId="left"
                  tickFormatter={(value) => `₹${(value / 1000).toFixed(0)}K`} 
                />
                <YAxis 
                  yAxisId="right" 
                  orientation="right"
                  tickFormatter={(value) => `₹${(value / 1000).toFixed(0)}K`} 
                />
                <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                <Legend />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="downPayment"
                  name="Down Payment"
                  stroke="#3B82F6"
                  activeDot={{ r: 8 }}
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="monthlyPayment"
                  name="Monthly Payment"
                  stroke="#10B981"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-4">Breakdown by Down Payment Percentage</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full border-collapse">
                <thead>
                  <tr className="bg-secondary">
                    <th className="px-4 py-2 text-left">Down Payment %</th>
                    <th className="px-4 py-2 text-right">Down Payment Amount</th>
                    <th className="px-4 py-2 text-right">Loan Amount</th>
                    <th className="px-4 py-2 text-right">Monthly Payment</th>
                  </tr>
                </thead>
                <tbody>
                  {chartData.map((item, index) => (
                    <tr 
                      key={index} 
                      className={`border-b border-border hover:bg-secondary/50 ${
                        item.percent === downPaymentPercent ? "bg-primary/10" : ""
                      }`}
                    >
                      <td className="px-4 py-2">{item.percent}%</td>
                      <td className="px-4 py-2 text-right">
                        {formatCurrency(item.downPayment)}
                      </td>
                      <td className="px-4 py-2 text-right">
                        {formatCurrency(propertyValue - item.downPayment)}
                      </td>
                      <td className="px-4 py-2 text-right">
                        {formatCurrency(item.monthlyPayment)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </CalculatorLayout>
    </Layout>
  );
};

export default DownPaymentCalculator;
