
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
  AreaChart,
  Area
} from "recharts";
import Layout from "@/components/layout/Layout";
import CalculatorLayout from "@/components/calculator/CalculatorLayout";
import SliderInput from "@/components/calculator/SliderInput";
import ResultCard from "@/components/calculator/ResultCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const SWPCalculator = () => {
  const [initialInvestment, setInitialInvestment] = useState(2000000);
  const [monthlyWithdrawal, setMonthlyWithdrawal] = useState(15000);
  const [expectedReturn, setExpectedReturn] = useState(10);
  const [withdrawalPeriod, setWithdrawalPeriod] = useState(15);
  
  // Results
  const [totalWithdrawals, setTotalWithdrawals] = useState(0);
  const [finalCorpus, setFinalCorpus] = useState(0);
  const [monthlyBreakdown, setMonthlyBreakdown] = useState<any[]>([]);
  const [yearlyBreakdown, setYearlyBreakdown] = useState<any[]>([]);
  
  // Format currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(value);
  };

  // Calculate SWP
  useEffect(() => {
    calculateSWP();
  }, [initialInvestment, monthlyWithdrawal, expectedReturn, withdrawalPeriod]);

  const calculateSWP = () => {
    const monthlyRate = expectedReturn / 100 / 12;
    const totalMonths = withdrawalPeriod * 12;
    
    let currentInvestment = initialInvestment;
    let totalWithdrawn = 0;
    const monthlyData = [];
    const yearlyData = [];
    
    for (let month = 1; month <= totalMonths; month++) {
      // Calculate monthly return
      const monthlyReturn = currentInvestment * monthlyRate;
      
      // Update total investment after return
      currentInvestment += monthlyReturn;
      
      // Withdraw monthly amount
      currentInvestment -= monthlyWithdrawal;
      totalWithdrawn += monthlyWithdrawal;
      
      // Store data for every 3 months
      if (month % 3 === 0 || month === 1 || month === totalMonths) {
        monthlyData.push({
          month,
          investment: currentInvestment,
          withdrawn: totalWithdrawn,
          returns: monthlyReturn,
        });
      }
      
      // Store yearly data
      if (month % 12 === 0) {
        yearlyData.push({
          year: month / 12,
          investment: currentInvestment,
          withdrawn: monthlyWithdrawal * 12,
          cumulativeWithdrawal: totalWithdrawn,
          yearReturn: currentInvestment * Math.pow(1 + monthlyRate, 12) - currentInvestment,
        });
      }
    }
    
    setTotalWithdrawals(totalWithdrawn);
    setFinalCorpus(currentInvestment);
    setMonthlyBreakdown(monthlyData);
    setYearlyBreakdown(yearlyData);
  };

  // Calculate sustainability
  const calculateSustainability = () => {
    const annualWithdrawal = monthlyWithdrawal * 12;
    const withdrawalRate = (annualWithdrawal / initialInvestment) * 100;
    
    // Determine sustainability status
    let status;
    if (finalCorpus <= 0) {
      status = "Not Sustainable";
    } else if (withdrawalRate <= expectedReturn * 0.7) {
      status = "Highly Sustainable";
    } else if (withdrawalRate <= expectedReturn * 0.9) {
      status = "Moderately Sustainable";
    } else {
      status = "Marginally Sustainable";
    }
    
    return {
      rate: withdrawalRate,
      status,
    };
  };
  
  const sustainability = calculateSustainability();

  return (
    <Layout>
      <CalculatorLayout 
        title="SWP Calculator" 
        description="Calculate your Systematic Withdrawal Plan for regular income from investments"
      >
        <Tabs defaultValue="calculator">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="calculator">Calculator</TabsTrigger>
            <TabsTrigger value="projection">Detailed Projection</TabsTrigger>
          </TabsList>
          
          <TabsContent value="calculator" className="space-y-4 pt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-semibold mb-4">SWP Details</h3>
                
                <SliderInput
                  label="Initial Investment"
                  value={initialInvestment}
                  setValue={setInitialInvestment}
                  min={500000}
                  max={10000000}
                  step={100000}
                  formatValue={(value) => formatCurrency(value).replace("₹", "")}
                  unit="₹"
                />
                
                <SliderInput
                  label="Monthly Withdrawal"
                  value={monthlyWithdrawal}
                  setValue={setMonthlyWithdrawal}
                  min={5000}
                  max={100000}
                  step={1000}
                  formatValue={(value) => formatCurrency(value).replace("₹", "")}
                  unit="₹"
                />
                
                <SliderInput
                  label="Expected Annual Return"
                  value={expectedReturn}
                  setValue={setExpectedReturn}
                  min={5}
                  max={15}
                  step={0.5}
                  formatValue={(value) => value.toFixed(1)}
                  unit="%"
                />
                
                <SliderInput
                  label="Withdrawal Period"
                  value={withdrawalPeriod}
                  setValue={setWithdrawalPeriod}
                  min={5}
                  max={30}
                  step={1}
                  unit="years"
                />
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-4">SWP Summary</h3>
                
                <div className="grid grid-cols-1 gap-4">
                  <ResultCard
                    title="Total Withdrawals"
                    value={formatCurrency(totalWithdrawals)}
                    description="Total amount withdrawn over the period"
                  />
                  <ResultCard
                    title="Final Corpus"
                    value={formatCurrency(finalCorpus)}
                    description="Remaining investment amount after the period"
                    className={`${finalCorpus > 0 ? "bg-gradient-blue text-white" : "bg-red-500 text-white"}`}
                  />
                  <ResultCard
                    title="Annual Withdrawal Rate"
                    value={`${sustainability.rate.toFixed(2)}%`}
                    description={`Status: ${sustainability.status}`}
                  />
                  <ResultCard
                    title="Monthly Income"
                    value={formatCurrency(monthlyWithdrawal)}
                    description="Your regular monthly income"
                  />
                </div>
                
                <div className="mt-8">
                  <h4 className="text-sm font-medium mb-4">Corpus Over Time</h4>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={monthlyBreakdown}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis 
                          dataKey="month" 
                          label={{ value: 'Months', position: 'insideBottom', offset: -5 }} 
                        />
                        <YAxis tickFormatter={(value) => `₹${(value / 100000).toFixed(1)}L`} />
                        <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                        <Legend />
                        <Line
                          type="monotone"
                          dataKey="investment"
                          name="Remaining Corpus"
                          stroke="#3B82F6"
                          activeDot={{ r: 8 }}
                        />
                        <Line
                          type="monotone"
                          dataKey="withdrawn"
                          name="Total Withdrawn"
                          stroke="#10B981"
                          strokeDasharray="5 5"
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="projection" className="pt-4">
            <div className="space-y-8">
              <div>
                <h3 className="text-lg font-semibold mb-4">Yearly Projection</h3>
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      data={yearlyBreakdown}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis 
                        dataKey="year" 
                        label={{ value: 'Years', position: 'insideBottom', offset: -5 }} 
                      />
                      <YAxis tickFormatter={(value) => `₹${(value / 100000).toFixed(1)}L`} />
                      <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                      <Legend />
                      <Area 
                        type="monotone" 
                        dataKey="investment" 
                        name="Corpus" 
                        stroke="#3B82F6" 
                        fill="#3B82F6" 
                        fillOpacity={0.2} 
                      />
                      <Area 
                        type="monotone" 
                        dataKey="cumulativeWithdrawal" 
                        name="Cumulative Withdrawal" 
                        stroke="#10B981" 
                        fill="#10B981"
                        fillOpacity={0.2} 
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-4">Yearly Breakdown</h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full border-collapse">
                    <thead>
                      <tr className="bg-secondary">
                        <th className="px-4 py-2 text-left">Year</th>
                        <th className="px-4 py-2 text-right">Yearly Withdrawal</th>
                        <th className="px-4 py-2 text-right">Yearly Return</th>
                        <th className="px-4 py-2 text-right">Remaining Corpus</th>
                        <th className="px-4 py-2 text-right">Cumulative Withdrawal</th>
                      </tr>
                    </thead>
                    <tbody>
                      {yearlyBreakdown.map((item, index) => (
                        <tr key={index} className="border-b border-border hover:bg-secondary/50">
                          <td className="px-4 py-2">{item.year}</td>
                          <td className="px-4 py-2 text-right">{formatCurrency(item.withdrawn)}</td>
                          <td className="px-4 py-2 text-right">{formatCurrency(item.yearReturn)}</td>
                          <td className="px-4 py-2 text-right">{formatCurrency(item.investment)}</td>
                          <td className="px-4 py-2 text-right">{formatCurrency(item.cumulativeWithdrawal)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-4">SWP Sustainability Analysis</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className={`p-4 rounded-lg border ${
                    sustainability.status === "Highly Sustainable" ? "bg-green-50 border-green-200" :
                    sustainability.status === "Moderately Sustainable" ? "bg-yellow-50 border-yellow-200" :
                    "bg-red-50 border-red-200"
                  }`}>
                    <h4 className="font-medium mb-2">Withdrawal Rate</h4>
                    <p className="text-2xl font-semibold">{sustainability.rate.toFixed(2)}%</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Annual withdrawal as percentage of initial investment
                    </p>
                  </div>
                  <div className={`p-4 rounded-lg border ${
                    sustainability.status === "Highly Sustainable" ? "bg-green-50 border-green-200" :
                    sustainability.status === "Moderately Sustainable" ? "bg-yellow-50 border-yellow-200" :
                    "bg-red-50 border-red-200"
                  }`}>
                    <h4 className="font-medium mb-2">Sustainability Status</h4>
                    <p className="text-2xl font-semibold">{sustainability.status}</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Based on withdrawal rate vs. expected returns
                    </p>
                  </div>
                  <div className={`p-4 rounded-lg border ${
                    finalCorpus > initialInvestment ? "bg-green-50 border-green-200" :
                    finalCorpus > 0 ? "bg-yellow-50 border-yellow-200" :
                    "bg-red-50 border-red-200"
                  }`}>
                    <h4 className="font-medium mb-2">Final Corpus Percentage</h4>
                    <p className="text-2xl font-semibold">
                      {((finalCorpus / initialInvestment) * 100).toFixed(2)}%
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Percentage of initial investment remaining
                    </p>
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

export default SWPCalculator;
