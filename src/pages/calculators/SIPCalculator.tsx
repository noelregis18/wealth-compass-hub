
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
  Cell,
  ReferenceLine,
} from "recharts";
import Layout from "@/components/layout/Layout";
import CalculatorLayout from "@/components/calculator/CalculatorLayout";
import SliderInput from "@/components/calculator/SliderInput";
import ResultCard from "@/components/calculator/ResultCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const SIPCalculator = () => {
  const [monthlyInvestment, setMonthlyInvestment] = useState(10000);
  const [investmentPeriod, setInvestmentPeriod] = useState(10);
  const [expectedReturns, setExpectedReturns] = useState(12);
  
  // Results
  const [totalInvestment, setTotalInvestment] = useState(0);
  const [estimatedReturns, setEstimatedReturns] = useState(0);
  const [totalValue, setTotalValue] = useState(0);
  const [yearlyBreakdown, setYearlyBreakdown] = useState<any[]>([]);
  
  // Format currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(value);
  };

  // Calculate SIP returns when inputs change
  useEffect(() => {
    calculateSIP();
  }, [monthlyInvestment, investmentPeriod, expectedReturns]);

  const calculateSIP = () => {
    // Monthly rate
    const monthlyRate = expectedReturns / 100 / 12;
    
    // Total number of months
    const totalMonths = investmentPeriod * 12;
    
    // Calculate total investment
    const investment = monthlyInvestment * totalMonths;
    
    // Calculate future value using SIP formula
    const futureValue = monthlyInvestment * ((Math.pow(1 + monthlyRate, totalMonths) - 1) / monthlyRate) * (1 + monthlyRate);
    
    setTotalInvestment(investment);
    setTotalValue(futureValue);
    setEstimatedReturns(futureValue - investment);
    
    // Generate yearly breakdown
    calculateYearlyBreakdown(monthlyInvestment, monthlyRate, totalMonths);
  };

  const calculateYearlyBreakdown = (
    monthlyInvestment: number,
    monthlyRate: number,
    totalMonths: number
  ) => {
    const breakdown = [];
    
    for (let year = 1; year <= investmentPeriod; year++) {
      const monthsCompleted = year * 12;
      const investmentTillDate = monthlyInvestment * monthsCompleted;
      
      // Calculate value at the end of each year
      const valueAtEndOfYear = monthlyInvestment * ((Math.pow(1 + monthlyRate, monthsCompleted) - 1) / monthlyRate) * (1 + monthlyRate);
      
      // Returns till date
      const returnsTillDate = valueAtEndOfYear - investmentTillDate;
      
      breakdown.push({
        year,
        investmentAmount: investmentTillDate,
        estimatedReturns: returnsTillDate,
        totalValue: valueAtEndOfYear,
      });
    }
    
    setYearlyBreakdown(breakdown);
  };

  // Colors for the charts
  const COLORS = ["#3B82F6", "#10B981"];

  return (
    <Layout>
      <CalculatorLayout 
        title="SIP Calculator" 
        description="Plan your Systematic Investment Plan and see how your wealth grows over time"
      >
        <Tabs defaultValue="calculator">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="calculator">Calculator</TabsTrigger>
            <TabsTrigger value="chart">Detailed Analysis</TabsTrigger>
          </TabsList>
          
          <TabsContent value="calculator" className="space-y-4 pt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-semibold mb-4">Investment Details</h3>
                
                <SliderInput
                  label="Monthly Investment"
                  value={monthlyInvestment}
                  setValue={setMonthlyInvestment}
                  min={500}
                  max={100000}
                  step={500}
                  formatValue={(value) => formatCurrency(value).replace("₹", "")}
                  unit="₹"
                />
                
                <SliderInput
                  label="Time Period"
                  value={investmentPeriod}
                  setValue={setInvestmentPeriod}
                  min={1}
                  max={30}
                  step={1}
                  unit="years"
                />
                
                <SliderInput
                  label="Expected Return Rate"
                  value={expectedReturns}
                  setValue={setExpectedReturns}
                  min={1}
                  max={30}
                  step={0.5}
                  formatValue={(value) => value.toFixed(1)}
                  unit="%"
                />
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-4">SIP Summary</h3>
                
                <div className="grid grid-cols-1 gap-4">
                  <ResultCard
                    title="Invested Amount"
                    value={formatCurrency(totalInvestment)}
                    description="Total money invested by you"
                  />
                  <ResultCard
                    title="Estimated Returns"
                    value={formatCurrency(estimatedReturns)}
                    description="Returns earned on your investment"
                  />
                  <ResultCard
                    title="Total Value"
                    value={formatCurrency(totalValue)}
                    description="Maturity value of your investment"
                    className="bg-gradient-blue text-white"
                  />
                </div>
                
                <div className="mt-8">
                  <h4 className="text-sm font-medium mb-4">Investment vs. Returns</h4>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={[
                          {
                            name: "Your Investment",
                            value: totalInvestment,
                          },
                          {
                            name: "Total Value",
                            value: totalValue,
                          },
                        ]}
                        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis tickFormatter={(value) => `₹${(value / 1000).toFixed(0)}K`} />
                        <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                        <Legend />
                        <Bar dataKey="value" name="Amount">
                          {[
                            <Cell key="cell-0" fill={COLORS[0]} />,
                            <Cell key="cell-1" fill={COLORS[1]} />,
                          ]}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="chart" className="pt-4">
            <div className="space-y-8">
              <div>
                <h3 className="text-lg font-semibold mb-4">Wealth Growth Over Time</h3>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={yearlyBreakdown}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="year" label={{ value: 'Years', position: 'insideBottom', offset: -5 }} />
                      <YAxis tickFormatter={(value) => `₹${(value / 100000).toFixed(1)}L`} />
                      <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="investmentAmount"
                        name="Invested Amount"
                        stroke="#3B82F6"
                        activeDot={{ r: 8 }}
                      />
                      <Line
                        type="monotone"
                        dataKey="estimatedReturns"
                        name="Estimated Returns"
                        stroke="#EC4899"
                      />
                      <Line
                        type="monotone"
                        dataKey="totalValue"
                        name="Total Value"
                        stroke="#10B981"
                        strokeWidth={2}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-4">Year-by-Year Breakdown</h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full border-collapse">
                    <thead>
                      <tr className="bg-secondary">
                        <th className="px-4 py-2 text-left">Year</th>
                        <th className="px-4 py-2 text-right">Invested Amount</th>
                        <th className="px-4 py-2 text-right">Estimated Returns</th>
                        <th className="px-4 py-2 text-right">Total Value</th>
                      </tr>
                    </thead>
                    <tbody>
                      {yearlyBreakdown.map((item, index) => (
                        <tr key={index} className="border-b border-border hover:bg-secondary/50">
                          <td className="px-4 py-2">{item.year}</td>
                          <td className="px-4 py-2 text-right">{formatCurrency(item.investmentAmount)}</td>
                          <td className="px-4 py-2 text-right">{formatCurrency(item.estimatedReturns)}</td>
                          <td className="px-4 py-2 text-right">{formatCurrency(item.totalValue)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CalculatorLayout>
    </Layout>
  );
};

export default SIPCalculator;
