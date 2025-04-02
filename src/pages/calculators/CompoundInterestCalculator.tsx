
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
import { Card } from "@/components/ui/card";
import { Calculator, PieChart as PieChartIcon, Info } from "lucide-react";

const CompoundInterestCalculator = () => {
  // State variables for calculator inputs
  const [principal, setPrincipal] = useState(10000);
  const [rate, setRate] = useState(8);
  const [time, setTime] = useState(5);
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

  // Calculate interest when inputs change
  useEffect(() => {
    calculateInterest();
  }, [principal, rate, time, compoundFrequency]);

  const calculateInterest = () => {
    // Compound Interest calculation
    const amount = principal * Math.pow(1 + rate / (100 * compoundFrequency), compoundFrequency * time);
    setTotalAmount(amount);
    setInterestEarned(amount - principal);

    // Generate yearly breakdown
    generateYearlyBreakdown();
  };

  const generateYearlyBreakdown = () => {
    const breakdown = [];

    for (let year = 1; year <= time; year++) {
      const amount = principal * Math.pow(1 + rate / (100 * compoundFrequency), compoundFrequency * year);
      const interest = amount - principal;

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
        title="Compound Interest Calculator"
        description="Calculate how your investment grows with the power of compound interest"
      >
        <Tabs defaultValue="calculator">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="calculator" className="flex items-center gap-2">
              <Calculator className="h-4 w-4" />
              <span>Calculator</span>
            </TabsTrigger>
            <TabsTrigger value="breakdown" className="flex items-center gap-2">
              <PieChartIcon className="h-4 w-4" />
              <span>Yearly Breakdown</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="calculator" className="space-y-4 pt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-semibold mb-4">Investment Details</h3>

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
                    title="Maturity Amount"
                    value={formatCurrency(totalAmount)}
                    description="Final value of your investment"
                    className="bg-gradient-to-r from-blue-500 to-blue-700 text-white"
                  />
                </div>

                <div className="mt-8">
                  <h4 className="text-sm font-medium mb-4">Principal vs Interest</h4>
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

        <div className="mt-8 p-6 bg-blue-50 rounded-lg">
          <div className="flex items-start gap-2">
            <Info className="h-5 w-5 text-blue-500 mt-0.5" />
            <div>
              <h3 className="font-semibold mb-2">About Compound Interest</h3>
              <p className="text-sm text-gray-700">
                Compound interest is calculated on the initial principal and also on the accumulated interest over previous periods.
                The formula used is: A = P(1 + r/n)^(nt) where:
              </p>
              <ul className="list-disc pl-5 mt-2 text-sm text-gray-700">
                <li>A = Final amount</li>
                <li>P = Principal</li>
                <li>r = Annual interest rate (decimal)</li>
                <li>n = Compounding frequency per year</li>
                <li>t = Time in years</li>
              </ul>
            </div>
          </div>
        </div>
      </CalculatorLayout>
    </Layout>
  );
};

export default CompoundInterestCalculator;
