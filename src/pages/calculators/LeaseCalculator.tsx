
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
  BarChart,
  Bar,
  Cell
} from "recharts";
import Layout from "@/components/layout/Layout";
import CalculatorLayout from "@/components/calculator/CalculatorLayout";
import SliderInput from "@/components/calculator/SliderInput";
import ResultCard from "@/components/calculator/ResultCard";

const LeaseCalculator = () => {
  const [carPrice, setCarPrice] = useState(1000000);
  const [downPayment, setDownPayment] = useState(200000);
  const [leaseTerm, setLeaseTerm] = useState(36);
  const [interestRate, setInterestRate] = useState(9);
  const [residualValue, setResidualValue] = useState(40);
  
  // Results
  const [monthlyPayment, setMonthlyPayment] = useState(0);
  const [totalLeasePayments, setTotalLeasePayments] = useState(0);
  const [totalCost, setTotalCost] = useState(0);
  const [leasePaymentBreakdown, setLeasePaymentBreakdown] = useState<any[]>([]);
  
  // Format currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(value);
  };

  // Calculate lease details
  useEffect(() => {
    calculateLease();
  }, [carPrice, downPayment, leaseTerm, interestRate, residualValue]);

  const calculateLease = () => {
    // Calculate residual amount
    const residualAmount = carPrice * (residualValue / 100);
    
    // Calculate depreciation amount
    const depreciationAmount = carPrice - downPayment - residualAmount;
    
    // Calculate monthly depreciation
    const monthlyDepreciation = depreciationAmount / leaseTerm;
    
    // Calculate finance charge
    const financeAmount = carPrice - downPayment;
    const monthlyInterest = (financeAmount + residualAmount) * (interestRate / 100) / 12;
    
    // Calculate monthly payment
    const monthly = monthlyDepreciation + monthlyInterest;
    setMonthlyPayment(monthly);
    
    // Calculate total lease payments
    const total = monthly * leaseTerm;
    setTotalLeasePayments(total);
    
    // Calculate total cost (including down payment)
    setTotalCost(total + downPayment);
    
    // Generate lease payment breakdown
    generateLeasePaymentBreakdown(monthly, monthlyDepreciation, monthlyInterest);
  };

  const generateLeasePaymentBreakdown = (
    monthly: number,
    monthlyDepreciation: number,
    monthlyInterest: number
  ) => {
    // Generate chart data for the term
    const breakdown = [];
    const yearlyData = [];
    
    let cumulativeDepreciation = 0;
    let cumulativeInterest = 0;
    
    for (let month = 1; month <= leaseTerm; month++) {
      cumulativeDepreciation += monthlyDepreciation;
      cumulativeInterest += monthlyInterest;
      
      // Only save data for chart at 6-month intervals
      if (month % 6 === 0 || month === leaseTerm) {
        breakdown.push({
          month,
          depreciation: monthlyDepreciation,
          interest: monthlyInterest,
          total: monthly,
          cumulativeDepreciation,
          cumulativeInterest,
          cumulativeTotal: cumulativeDepreciation + cumulativeInterest
        });
      }
      
      // Yearly summary
      if (month % 12 === 0) {
        const year = month / 12;
        yearlyData.push({
          year,
          yearlyDepreciation: monthlyDepreciation * 12,
          yearlyInterest: monthlyInterest * 12,
          yearlyTotal: monthly * 12,
          runningTotal: month * monthly + downPayment
        });
      }
    }
    
    setLeasePaymentBreakdown(breakdown);
  };

  const calculateComparisonData = () => {
    // Compare different lease terms
    const terms = [24, 36, 48, 60];
    return terms.map(term => {
      // Calculate residual value based on term
      // Longer terms have lower residual values
      const adjustedResidualValue = Math.max(20, residualValue - ((term - 36) / 12) * 5);
      const residualAmount = carPrice * (adjustedResidualValue / 100);
      
      // Calculate depreciation amount
      const depreciationAmount = carPrice - downPayment - residualAmount;
      
      // Calculate monthly depreciation
      const monthlyDepreciation = depreciationAmount / term;
      
      // Calculate finance charge
      const financeAmount = carPrice - downPayment;
      const monthlyInterest = (financeAmount + residualAmount) * (interestRate / 100) / 12;
      
      // Calculate monthly payment
      const monthly = monthlyDepreciation + monthlyInterest;
      
      // Calculate total lease cost
      const totalCost = monthly * term + downPayment;
      
      return {
        term,
        monthly,
        totalCost,
        residualValuePercent: adjustedResidualValue
      };
    });
  };
  
  const comparisonData = calculateComparisonData();

  const COLORS = ["#3B82F6", "#10B981"];

  return (
    <Layout>
      <CalculatorLayout 
        title="Lease Calculator" 
        description="Calculate your monthly lease payments and total cost"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">Vehicle Details</h3>
            
            <SliderInput
              label="Vehicle Price"
              value={carPrice}
              setValue={setCarPrice}
              min={500000}
              max={10000000}
              step={50000}
              formatValue={(value) => formatCurrency(value).replace("₹", "")}
              unit="₹"
            />
            
            <SliderInput
              label="Down Payment"
              value={downPayment}
              setValue={setDownPayment}
              min={0}
              max={carPrice * 0.5}
              step={10000}
              formatValue={(value) => formatCurrency(value).replace("₹", "")}
              unit="₹"
            />
            
            <SliderInput
              label="Lease Term"
              value={leaseTerm}
              setValue={setLeaseTerm}
              min={24}
              max={60}
              step={12}
              unit="months"
            />
            
            <SliderInput
              label="Interest Rate"
              value={interestRate}
              setValue={setInterestRate}
              min={5}
              max={20}
              step={0.1}
              formatValue={(value) => value.toFixed(1)}
              unit="%"
            />
            
            <SliderInput
              label="Residual Value"
              value={residualValue}
              setValue={setResidualValue}
              min={20}
              max={60}
              step={1}
              formatValue={(value) => value.toFixed(0)}
              unit="%"
            />
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Lease Summary</h3>
            
            <div className="grid grid-cols-1 gap-4 mb-6">
              <ResultCard
                title="Monthly Lease Payment"
                value={formatCurrency(monthlyPayment)}
                description="Your monthly lease payment amount"
                className="bg-gradient-blue text-white"
              />
              <ResultCard
                title="Total Lease Payments"
                value={formatCurrency(totalLeasePayments)}
                description="Total payments over the lease term"
              />
              <ResultCard
                title="Down Payment"
                value={formatCurrency(downPayment)}
                description="Initial payment amount"
              />
              <ResultCard
                title="Total Lease Cost"
                value={formatCurrency(totalCost)}
                description="Down payment plus lease payments"
              />
              <ResultCard
                title="Residual Value"
                value={formatCurrency(carPrice * (residualValue / 100))}
                description="Estimated value at lease end"
              />
            </div>
            
            <div>
              <h4 className="text-sm font-medium mb-4">Monthly Payment Breakdown</h4>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={[
                      {
                        name: "Depreciation",
                        value: monthlyPayment - ((carPrice - downPayment + carPrice * (residualValue / 100)) * (interestRate / 100) / 12)
                      },
                      {
                        name: "Interest",
                        value: ((carPrice - downPayment + carPrice * (residualValue / 100)) * (interestRate / 100) / 12)
                      }
                    ]}
                    layout="vertical"
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" tickFormatter={(value) => formatCurrency(value)} />
                    <YAxis dataKey="name" type="category" />
                    <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                    <Legend />
                    <Bar dataKey="value" name="Amount">
                      {[
                        <Cell key="cell-0" fill={COLORS[0]} />,
                        <Cell key="cell-1" fill={COLORS[1]} />
                      ]}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-8">
          <h3 className="text-lg font-semibold mb-4">Lease Term Comparison</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={comparisonData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="term" 
                  label={{ value: 'Lease Term (months)', position: 'insideBottom', offset: -5 }} 
                />
                <YAxis 
                  yAxisId="left"
                  tickFormatter={(value) => `₹${(value / 1000).toFixed(0)}K`} 
                />
                <YAxis 
                  yAxisId="right" 
                  orientation="right"
                  tickFormatter={(value) => `₹${(value / 100000).toFixed(1)}L`} 
                />
                <Tooltip formatter={(value, name) => {
                  if (name === "monthly") return formatCurrency(Number(value));
                  if (name === "totalCost") return formatCurrency(Number(value));
                  return value;
                }} />
                <Legend />
                <Bar 
                  yAxisId="left" 
                  dataKey="monthly" 
                  name="Monthly Payment" 
                  fill="#3B82F6" 
                />
                <Bar 
                  yAxisId="right" 
                  dataKey="totalCost" 
                  name="Total Cost" 
                  fill="#10B981" 
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
          
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-4">Lease Term Comparison Table</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full border-collapse">
                <thead>
                  <tr className="bg-secondary">
                    <th className="px-4 py-2 text-left">Term (months)</th>
                    <th className="px-4 py-2 text-right">Monthly Payment</th>
                    <th className="px-4 py-2 text-right">Total Lease Cost</th>
                    <th className="px-4 py-2 text-right">Residual Value %</th>
                  </tr>
                </thead>
                <tbody>
                  {comparisonData.map((item, index) => (
                    <tr 
                      key={index} 
                      className={`border-b border-border hover:bg-secondary/50 ${
                        item.term === leaseTerm ? "bg-primary/10" : ""
                      }`}
                    >
                      <td className="px-4 py-2">{item.term}</td>
                      <td className="px-4 py-2 text-right">
                        {formatCurrency(item.monthly)}
                      </td>
                      <td className="px-4 py-2 text-right">
                        {formatCurrency(item.totalCost)}
                      </td>
                      <td className="px-4 py-2 text-right">
                        {item.residualValuePercent.toFixed(0)}%
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

export default LeaseCalculator;
