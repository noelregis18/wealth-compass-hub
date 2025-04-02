
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const SimpleInterestCalculator = () => {
  const [principal, setPrincipal] = useState(10000);
  const [rate, setRate] = useState(5);
  const [time, setTime] = useState(5);
  const [isCompound, setIsCompound] = useState(false);
  const [compoundFrequency, setCompoundFrequency] = useState(1); // 1=yearly, 4=quarterly, 12=monthly

  // Results
  const [totalAmount, setTotalAmount] = useState(0);
  const [interestEarned, setInterestEarned] = useState(0);
  const [yearlyBreakdown, setYearlyBreakdown] = useState<any[]>([]);

  // Format currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(value);
  };

  // Calculate interest
  useEffect(() => {
    calculateInterest();
  }, [principal, rate, time, isCompound, compoundFrequency]);

  const calculateInterest = () => {
    if (isCompound) {
      // Compound Interest calculation
      const amount = principal * Math.pow(1 + rate / (100 * compoundFrequency), compoundFrequency * time);
      setTotalAmount(amount);
      setInterestEarned(amount - principal);
    } else {
      // Simple Interest calculation
      const interest = principal * rate * time / 100;
      setTotalAmount(principal + interest);
      setInterestEarned(interest);
    }

    // Generate yearly breakdown
    generateYearlyBreakdown();
  };

  const generateYearlyBreakdown = () => {
    const breakdown = [];

    for (let year = 1; year <= time; year++) {
      let amount;
      let interest;

      if (isCompound) {
        amount = principal * Math.pow(1 + rate / (100 * compoundFrequency), compoundFrequency * year);
        interest = amount - principal;
      } else {
        interest = principal * rate * year / 100;
        amount = principal + interest;
      }

      breakdown.push({
        year,
        principal,
        interest,
        amount
      });
    }

    setYearlyBreakdown(breakdown);
  };

  // Colors for charts
  const COLORS = ["#3B82F6", "#10B981"];

  return (
    <Layout>
      <CalculatorLayout
        title={isCompound ? "Compound Interest Calculator" : "Simple Interest Calculator"}
        description={isCompound 
          ? "Calculate the compound interest and final amount on your investments"
          : "Calculate the simple interest and final amount on your investments"}
      >
        <Tabs defaultValue="calculator">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="calculator">Calculator</TabsTrigger>
            <TabsTrigger value="breakdown">Yearly Breakdown</TabsTrigger>
          </TabsList>

          <TabsContent value="calculator" className="space-y-4 pt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-semibold mb-4">Investment Details</h3>

                <div className="flex items-center space-x-2 mb-6">
                  <div className="flex items-center space-x-2">
                    <input 
                      type="radio" 
                      id="simple" 
                      name="interestType" 
                      checked={!isCompound} 
                      onChange={() => setIsCompound(false)}
                      className="w-4 h-4 text-primary"
                    />
                    <label htmlFor="simple">Simple Interest</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input 
                      type="radio" 
                      id="compound" 
                      name="interestType" 
                      checked={isCompound} 
                      onChange={() => setIsCompound(true)}
                      className="w-4 h-4 text-primary"
                    />
                    <label htmlFor="compound">Compound Interest</label>
                  </div>
                </div>

                <SliderInput
                  label="Principal Amount"
                  value={principal}
                  setValue={setPrincipal}
                  min={1000}
                  max={1000000}
                  step={1000}
                  formatValue={(value) => formatCurrency(value).replace("₹", "")}
                  unit="₹"
                />

                <SliderInput
                  label="Interest Rate"
                  value={rate}
                  setValue={setRate}
                  min={1}
                  max={25}
                  step={0.1}
                  formatValue={(value) => value.toFixed(1)}
                  unit="%"
                />

                <SliderInput
                  label="Time Period"
                  value={time}
                  setValue={setTime}
                  min={1}
                  max={30}
                  step={1}
                  unit="years"
                />

                {isCompound && (
                  <div className="space-y-2 mt-4">
                    <label className="text-sm font-medium">Compounding Frequency</label>
                    <div className="grid grid-cols-3 gap-2">
                      <button
                        className={`py-2 px-4 rounded-md ${
                          compoundFrequency === 1 ? "bg-primary text-white" : "bg-secondary"
                        }`}
                        onClick={() => setCompoundFrequency(1)}
                      >
                        Yearly
                      </button>
                      <button
                        className={`py-2 px-4 rounded-md ${
                          compoundFrequency === 4 ? "bg-primary text-white" : "bg-secondary"
                        }`}
                        onClick={() => setCompoundFrequency(4)}
                      >
                        Quarterly
                      </button>
                      <button
                        className={`py-2 px-4 rounded-md ${
                          compoundFrequency === 12 ? "bg-primary text-white" : "bg-secondary"
                        }`}
                        onClick={() => setCompoundFrequency(12)}
                      >
                        Monthly
                      </button>
                    </div>
                  </div>
                )}
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-4">Investment Summary</h3>

                <div className="grid grid-cols-1 gap-4">
                  <ResultCard
                    title="Principal Amount"
                    value={formatCurrency(principal)}
                    description="Initial investment amount"
                  />
                  <ResultCard
                    title="Interest Earned"
                    value={formatCurrency(interestEarned)}
                    description="Total interest earned over time period"
                  />
                  <ResultCard
                    title="Total Amount"
                    value={formatCurrency(totalAmount)}
                    description="Final value of your investment"
                    className="bg-gradient-blue text-white"
                  />
                </div>

                <div className="mt-8">
                  <h4 className="text-sm font-medium mb-4">Principal vs Total Amount</h4>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={[
                            { name: "Principal", value: principal },
                            { name: "Interest", value: interestEarned },
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
                          <Cell fill={COLORS[0]} />
                          <Cell fill={COLORS[1]} />
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

          <TabsContent value="breakdown" className="pt-4">
            <div>
              <h3 className="text-lg font-semibold mb-4">Yearly Growth</h3>
              <div className="h-72 mb-8">
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
                    <YAxis 
                      tickFormatter={(value) => 
                        `₹${(value / 1000).toFixed(0)}K`
                      } 
                    />
                    <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="principal"
                      name="Principal Amount"
                      stroke="#3B82F6"
                      strokeDasharray="5 5"
                    />
                    <Line
                      type="monotone"
                      dataKey="amount"
                      name="Total Amount"
                      stroke="#10B981"
                      activeDot={{ r: 8 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full border-collapse">
                  <thead>
                    <tr className="bg-secondary">
                      <th className="px-4 py-2 text-left">Year</th>
                      <th className="px-4 py-2 text-right">Principal</th>
                      <th className="px-4 py-2 text-right">Interest</th>
                      <th className="px-4 py-2 text-right">Total Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {yearlyBreakdown.map((item, index) => (
                      <tr key={index} className="border-b border-border hover:bg-secondary/50">
                        <td className="px-4 py-2">{item.year}</td>
                        <td className="px-4 py-2 text-right">{formatCurrency(item.principal)}</td>
                        <td className="px-4 py-2 text-right">{formatCurrency(item.interest)}</td>
                        <td className="px-4 py-2 text-right">{formatCurrency(item.amount)}</td>
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

export default SimpleInterestCalculator;
