
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
  PieChart,
  Pie,
  Cell
} from "recharts";
import Layout from "@/components/layout/Layout";
import CalculatorLayout from "@/components/calculator/CalculatorLayout";
import SliderInput from "@/components/calculator/SliderInput";
import ResultCard from "@/components/calculator/ResultCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const MutualFundCalculator = () => {
  const [investmentType, setInvestmentType] = useState<"lumpsum" | "sip">("lumpsum");
  const [investmentAmount, setInvestmentAmount] = useState(100000);
  const [monthlyInvestment, setMonthlyInvestment] = useState(10000);
  const [investmentPeriod, setInvestmentPeriod] = useState(5);
  const [expectedReturn, setExpectedReturn] = useState(12);
  const [expenseRatio, setExpenseRatio] = useState(1.5);
  
  // Results
  const [totalInvestment, setTotalInvestment] = useState(0);
  const [totalReturn, setTotalReturn] = useState(0);
  const [totalValue, setTotalValue] = useState(0);
  const [expensesPaid, setExpensesPaid] = useState(0);
  const [yearlyBreakdown, setYearlyBreakdown] = useState<any[]>([]);
  
  // Format currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(value);
  };

  // Calculate mutual fund returns
  useEffect(() => {
    calculateMutualFundReturns();
  }, [investmentType, investmentAmount, monthlyInvestment, investmentPeriod, expectedReturn, expenseRatio]);

  const calculateMutualFundReturns = () => {
    // Adjust returns for expense ratio
    const netReturn = expectedReturn - expenseRatio;
    const monthlyRate = netReturn / 100 / 12;
    const yearlyRate = netReturn / 100;
    const totalMonths = investmentPeriod * 12;
    
    let totalInvested = 0;
    let finalValue = 0;
    let expensesTotal = 0;
    
    if (investmentType === "lumpsum") {
      // Lumpsum calculation
      totalInvested = investmentAmount;
      
      // Calculate value without expense ratio
      const grossValue = investmentAmount * Math.pow(1 + expectedReturn / 100, investmentPeriod);
      
      // Calculate with expense ratio
      finalValue = investmentAmount * Math.pow(1 + yearlyRate, investmentPeriod);
      
      // Calculate expenses paid
      expensesTotal = grossValue - finalValue;
    } else {
      // SIP calculation
      totalInvested = monthlyInvestment * totalMonths;
      
      // Calculate value without expense ratio
      const grossValue = monthlyInvestment * ((Math.pow(1 + expectedReturn / 100 / 12, totalMonths) - 1) / (expectedReturn / 100 / 12)) * (1 + expectedReturn / 100 / 12);
      
      // Calculate with expense ratio
      finalValue = monthlyInvestment * ((Math.pow(1 + monthlyRate, totalMonths) - 1) / monthlyRate) * (1 + monthlyRate);
      
      // Calculate expenses paid
      expensesTotal = grossValue - finalValue;
    }
    
    setTotalInvestment(totalInvested);
    setTotalValue(finalValue);
    setTotalReturn(finalValue - totalInvested);
    setExpensesPaid(expensesTotal);
    
    // Generate yearly breakdown
    generateYearlyBreakdown(netReturn, yearlyRate, monthlyRate);
  };

  const generateYearlyBreakdown = (
    netReturn: number,
    yearlyRate: number,
    monthlyRate: number
  ) => {
    const breakdown = [];
    
    let runningInvestment = investmentType === "lumpsum" ? investmentAmount : 0;
    let runningValue = runningInvestment;
    
    for (let year = 1; year <= investmentPeriod; year++) {
      let yearlyInvestment = 0;
      let yearValue = 0;
      let yearExpense = 0;
      
      if (investmentType === "lumpsum") {
        // For lumpsum, investment happens only at the beginning
        yearlyInvestment = year === 1 ? investmentAmount : 0;
        
        // Calculate value without expense ratio
        const grossValue = investmentAmount * Math.pow(1 + expectedReturn / 100, year);
        
        // Calculate value with expense ratio
        yearValue = investmentAmount * Math.pow(1 + yearlyRate, year);
        
        // Calculate expense for this year
        yearExpense = grossValue - yearValue;
      } else {
        // For SIP, investment happens every month
        yearlyInvestment = monthlyInvestment * 12;
        runningInvestment += yearlyInvestment;
        
        // Calculate value at the end of the year
        if (year === 1) {
          // First year calculation
          runningValue = 0;
          for (let month = 1; month <= 12; month++) {
            runningValue = runningValue * (1 + monthlyRate) + monthlyInvestment;
          }
        } else {
          // Subsequent years
          const previousValue = runningValue;
          // Previous value grows for a year with monthly contributions
          runningValue = 0;
          runningValue = previousValue * Math.pow(1 + monthlyRate, 12);
          for (let month = 1; month <= 12; month++) {
            const monthlyGrowth = Math.pow(1 + monthlyRate, 12 - month);
            runningValue += monthlyInvestment * monthlyGrowth;
          }
        }
        
        yearValue = runningValue;
        
        // Calculate gross value without expense ratio
        const monthlyRateGross = expectedReturn / 100 / 12;
        let grossValue = 0;
        if (year === 1) {
          grossValue = 0;
          for (let month = 1; month <= 12; month++) {
            grossValue = grossValue * (1 + monthlyRateGross) + monthlyInvestment;
          }
        } else {
          const previousGross = breakdown[year - 2].grossValue;
          grossValue = previousGross * Math.pow(1 + monthlyRateGross, 12);
          for (let month = 1; month <= 12; month++) {
            const monthlyGrowth = Math.pow(1 + monthlyRateGross, 12 - month);
            grossValue += monthlyInvestment * monthlyGrowth;
          }
        }
        
        yearExpense = grossValue - yearValue;
      }
      
      breakdown.push({
        year,
        investment: runningInvestment,
        yearlyInvestment,
        value: yearValue,
        returns: yearValue - runningInvestment,
        expenses: yearExpense,
        grossValue: yearValue + yearExpense,
      });
    }
    
    setYearlyBreakdown(breakdown);
  };

  const COLORS = ["#3B82F6", "#10B981", "#EC4899"];

  return (
    <Layout>
      <CalculatorLayout 
        title="Mutual Fund Calculator" 
        description="Calculate potential returns on your mutual fund investments"
      >
        <Tabs defaultValue="calculator">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="calculator">Calculator</TabsTrigger>
            <TabsTrigger value="analysis">Detailed Analysis</TabsTrigger>
          </TabsList>
          
          <TabsContent value="calculator" className="space-y-4 pt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-semibold mb-4">Investment Details</h3>
                
                <div className="mb-6">
                  <label className="text-sm font-medium">Investment Type</label>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    <button
                      className={`py-2 px-4 rounded-md ${
                        investmentType === "lumpsum" ? "bg-primary text-white" : "bg-secondary"
                      }`}
                      onClick={() => setInvestmentType("lumpsum")}
                    >
                      Lump Sum
                    </button>
                    <button
                      className={`py-2 px-4 rounded-md ${
                        investmentType === "sip" ? "bg-primary text-white" : "bg-secondary"
                      }`}
                      onClick={() => setInvestmentType("sip")}
                    >
                      SIP
                    </button>
                  </div>
                </div>
                
                {investmentType === "lumpsum" ? (
                  <SliderInput
                    label="Investment Amount"
                    value={investmentAmount}
                    setValue={setInvestmentAmount}
                    min={10000}
                    max={10000000}
                    step={10000}
                    formatValue={(value) => formatCurrency(value).replace("₹", "")}
                    unit="₹"
                  />
                ) : (
                  <SliderInput
                    label="Monthly SIP Amount"
                    value={monthlyInvestment}
                    setValue={setMonthlyInvestment}
                    min={500}
                    max={100000}
                    step={500}
                    formatValue={(value) => formatCurrency(value).replace("₹", "")}
                    unit="₹"
                  />
                )}
                
                <SliderInput
                  label="Investment Period"
                  value={investmentPeriod}
                  setValue={setInvestmentPeriod}
                  min={1}
                  max={30}
                  step={1}
                  unit="years"
                />
                
                <SliderInput
                  label="Expected Annual Return"
                  value={expectedReturn}
                  setValue={setExpectedReturn}
                  min={5}
                  max={25}
                  step={0.5}
                  formatValue={(value) => value.toFixed(1)}
                  unit="%"
                />
                
                <SliderInput
                  label="Expense Ratio"
                  value={expenseRatio}
                  setValue={setExpenseRatio}
                  min={0.1}
                  max={5}
                  step={0.1}
                  formatValue={(value) => value.toFixed(1)}
                  unit="%"
                />
                
                <div className="mt-4 p-4 bg-secondary/50 rounded-md">
                  <h4 className="text-sm font-medium mb-2">About Expense Ratio</h4>
                  <p className="text-xs text-muted-foreground">
                    The expense ratio is the annual fee charged by mutual funds for managing your 
                    investments. A lower expense ratio means more of your returns stay with you.
                  </p>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-4">Investment Summary</h3>
                
                <div className="grid grid-cols-1 gap-4">
                  <ResultCard
                    title="Total Investment"
                    value={formatCurrency(totalInvestment)}
                    description="Amount invested by you"
                  />
                  <ResultCard
                    title="Total Return"
                    value={formatCurrency(totalReturn)}
                    description="Profit earned on your investment"
                  />
                  <ResultCard
                    title="Total Expense Paid"
                    value={formatCurrency(expensesPaid)}
                    description="Total fees paid to the fund house"
                  />
                  <ResultCard
                    title="Final Value"
                    value={formatCurrency(totalValue)}
                    description="Estimated value of your investment"
                    className="bg-gradient-blue text-white"
                  />
                </div>
                
                <div className="mt-8">
                  <h4 className="text-sm font-medium mb-4">Investment Breakdown</h4>
                  <div className="h-72">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={[
                            { name: "Investment", value: totalInvestment },
                            { name: "Returns", value: totalReturn },
                            { name: "Expenses", value: expensesPaid },
                          ]}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, percent }) => 
                            `${name}: ${(percent * 100).toFixed(0)}%`
                          }
                        >
                          {[
                            <Cell key="cell-0" fill={COLORS[0]} />,
                            <Cell key="cell-1" fill={COLORS[1]} />,
                            <Cell key="cell-2" fill={COLORS[2]} />
                          ]}
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
          
          <TabsContent value="analysis" className="pt-4">
            <div className="space-y-8">
              <div>
                <h3 className="text-lg font-semibold mb-4">Yearly Growth</h3>
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
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
                      <Line
                        type="monotone"
                        dataKey="investment"
                        name="Total Investment"
                        stroke="#3B82F6"
                        strokeWidth={2}
                      />
                      <Line
                        type="monotone"
                        dataKey="value"
                        name="Fund Value"
                        stroke="#10B981"
                        activeDot={{ r: 8 }}
                        strokeWidth={2}
                      />
                      <Line
                        type="monotone"
                        dataKey="expenses"
                        name="Expenses Paid"
                        stroke="#EC4899"
                        strokeDasharray="5 5"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-4">Impact of Expense Ratio</h3>
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={[
                        {
                          name: "No Expense",
                          value: totalValue + expensesPaid,
                        },
                        {
                          name: "With Expense",
                          value: totalValue,
                        },
                        {
                          name: "Expenses Paid",
                          value: expensesPaid,
                        },
                      ]}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis tickFormatter={(value) => `₹${(value / 100000).toFixed(1)}L`} />
                      <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                      <Legend />
                      <Bar dataKey="value" name="Amount" fill="#3B82F6" />
                    </BarChart>
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
                        <th className="px-4 py-2 text-right">Yearly Investment</th>
                        <th className="px-4 py-2 text-right">Total Investment</th>
                        <th className="px-4 py-2 text-right">Fund Value</th>
                        <th className="px-4 py-2 text-right">Returns</th>
                        <th className="px-4 py-2 text-right">Expenses</th>
                      </tr>
                    </thead>
                    <tbody>
                      {yearlyBreakdown.map((item, index) => (
                        <tr key={index} className="border-b border-border hover:bg-secondary/50">
                          <td className="px-4 py-2">{item.year}</td>
                          <td className="px-4 py-2 text-right">{formatCurrency(item.yearlyInvestment)}</td>
                          <td className="px-4 py-2 text-right">{formatCurrency(item.investment)}</td>
                          <td className="px-4 py-2 text-right">{formatCurrency(item.value)}</td>
                          <td className="px-4 py-2 text-right">{formatCurrency(item.returns)}</td>
                          <td className="px-4 py-2 text-right">{formatCurrency(item.expenses)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-4">Expense Ratio Impact</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 rounded-lg border bg-secondary/20">
                    <h4 className="font-medium mb-2">Current Expense Ratio</h4>
                    <p className="text-2xl font-semibold">{expenseRatio}%</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Total expenses: {formatCurrency(expensesPaid)}
                    </p>
                  </div>
                  <div className="p-4 rounded-lg border bg-secondary/20">
                    <h4 className="font-medium mb-2">% of Returns Lost</h4>
                    <p className="text-2xl font-semibold">
                      {((expensesPaid / (totalReturn + expensesPaid)) * 100).toFixed(2)}%
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Of your potential returns
                    </p>
                  </div>
                  <div className="p-4 rounded-lg border bg-secondary/20">
                    <h4 className="font-medium mb-2">Value Without Expenses</h4>
                    <p className="text-2xl font-semibold">{formatCurrency(totalValue + expensesPaid)}</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Potential value with 0% expense ratio
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

export default MutualFundCalculator;
