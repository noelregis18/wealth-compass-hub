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
  Area,
  PieChart,
  Pie,
  Cell,
  Bar,
  BarChart
} from "recharts";
import Layout from "@/components/layout/Layout";
import CalculatorLayout from "@/components/calculator/CalculatorLayout";
import SliderInput from "@/components/calculator/SliderInput";
import ResultCard from "@/components/calculator/ResultCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const RetirementCalculator = () => {
  const [currentAge, setCurrentAge] = useState(30);
  const [retirementAge, setRetirementAge] = useState(60);
  const [lifeExpectancy, setLifeExpectancy] = useState(85);
  const [currentSavings, setCurrentSavings] = useState(500000);
  const [monthlySavings, setMonthlySavings] = useState(20000);
  const [preRetirementReturn, setPreRetirementReturn] = useState(12);
  const [postRetirementReturn, setPostRetirementReturn] = useState(8);
  const [inflationRate, setInflationRate] = useState(6);
  const [monthlyExpenses, setMonthlyExpenses] = useState(50000);
  
  // Results
  const [retirementCorpus, setRetirementCorpus] = useState(0);
  const [requiredCorpus, setRequiredCorpus] = useState(0);
  const [isAdequate, setIsAdequate] = useState(true);
  const [shortfall, setShortfall] = useState(0);
  const [yearlyProjection, setYearlyProjection] = useState<any[]>([]);
  const [yearsInRetirement, setYearsInRetirement] = useState(0);
  
  // Format currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(value);
  };

  // Format large numbers in crores/lakhs
  const formatLargeNumber = (value: number) => {
    if (value >= 10000000) {
      return `${(value / 10000000).toFixed(2)} Cr`;
    } else if (value >= 100000) {
      return `${(value / 100000).toFixed(2)} L`;
    } else {
      return formatCurrency(value);
    }
  };

  // Calculate retirement details
  useEffect(() => {
    calculateRetirementPlan();
  }, [
    currentAge, 
    retirementAge, 
    lifeExpectancy, 
    currentSavings, 
    monthlySavings, 
    preRetirementReturn, 
    postRetirementReturn, 
    inflationRate, 
    monthlyExpenses
  ]);

  const calculateRetirementPlan = () => {
    // Years till retirement
    const yearsToRetirement = retirementAge - currentAge;
    setYearsInRetirement(lifeExpectancy - retirementAge);
    
    // Calculate corpus at retirement
    let corpus = currentSavings;
    const annualSavings = monthlySavings * 12;
    const yearlyPreReturnRate = preRetirementReturn / 100;
    
    // Pre-retirement growth projection
    const projection = [];
    
    for (let year = 1; year <= yearsToRetirement; year++) {
      // Add returns for the year
      corpus = corpus * (1 + yearlyPreReturnRate) + annualSavings;
      
      projection.push({
        age: currentAge + year,
        phase: "pre-retirement",
        savings: corpus,
        expenses: 0,
        annualContribution: annualSavings,
        annualReturn: corpus * yearlyPreReturnRate - annualSavings * yearlyPreReturnRate / 2, // Approximate
      });
    }
    
    // Set expected retirement corpus
    setRetirementCorpus(corpus);
    
    // Calculate required corpus based on expenses, inflation, and life expectancy
    const yearsAfterRetirement = lifeExpectancy - retirementAge;
    
    // Inflate current monthly expenses to retirement age
    const inflatedMonthlyExpense = 
      monthlyExpenses * Math.pow(1 + inflationRate / 100, yearsToRetirement);
    
    // Calculate required corpus using formula incorporating inflation and returns
    // During retirement, we want to be able to withdraw enough to cover expenses
    // while the remaining corpus continues to grow enough to counter inflation
    const inflationAdjustedReturn = (postRetirementReturn - inflationRate) / 100;
    
    let required;
    if (inflationAdjustedReturn <= 0) {
      // If inflation exceeds returns, we need enough to cover all expenses
      required = inflatedMonthlyExpense * 12 * yearsAfterRetirement;
    } else {
      // Otherwise, we can use the formula for present value of an annuity
      required = 
        (inflatedMonthlyExpense * 12 / inflationAdjustedReturn) * 
        (1 - Math.pow(1 / (1 + inflationAdjustedReturn), yearsAfterRetirement));
    }
    
    setRequiredCorpus(required);
    
    // Check if corpus is adequate
    const adequacyCheck = corpus >= required;
    setIsAdequate(adequacyCheck);
    
    // Calculate shortfall if any
    setShortfall(adequacyCheck ? 0 : required - corpus);
    
    // Continue projection for retirement years
    let remainingCorpus = corpus;
    const yearlyPostReturnRate = postRetirementReturn / 100;
    const yearlyInflationRate = inflationRate / 100;
    let currentYearExpense = inflatedMonthlyExpense * 12;
    
    for (let year = 1; year <= yearsAfterRetirement; year++) {
      // Add returns for the year
      remainingCorpus = remainingCorpus * (1 + yearlyPostReturnRate);
      
      // Subtract expenses for the year
      remainingCorpus -= currentYearExpense;
      
      projection.push({
        age: retirementAge + year,
        phase: "post-retirement",
        savings: Math.max(0, remainingCorpus),
        expenses: currentYearExpense,
        annualContribution: 0,
        annualReturn: remainingCorpus * yearlyPostReturnRate,
      });
      
      // Inflate expenses for next year
      currentYearExpense *= (1 + yearlyInflationRate);
    }
    
    setYearlyProjection(projection);
  };

  // Suggestion on improving planning
  const getSuggestion = () => {
    if (isAdequate) {
      return {
        title: "On Track for Retirement",
        message: "Your current savings plan is adequate for your retirement needs.",
        action: "Consider increasing your retirement age or monthly expenses for a more comfortable retirement."
      };
    } else {
      // Calculate how much additional monthly savings would be needed
      const yearsToRetirement = retirementAge - currentAge;
      const yearlyPreReturnRate = preRetirementReturn / 100;
      
      // Calculate future value factor
      const fvFactor = (Math.pow(1 + yearlyPreReturnRate, yearsToRetirement) - 1) / yearlyPreReturnRate;
      
      // Calculate required additional monthly savings
      const additionalAnnualSavings = shortfall / fvFactor;
      const additionalMonthlySavings = additionalAnnualSavings / 12;
      
      return {
        title: "Action Needed",
        message: `You may face a shortfall of ${formatCurrency(shortfall)} in your retirement corpus.`,
        action: `Consider increasing your monthly savings by ${formatCurrency(additionalMonthlySavings)} or extending your retirement age.`
      };
    }
  };
  
  const suggestion = getSuggestion();
  const COLORS = ["#3B82F6", "#10B981", "#EC4899"];

  return (
    <Layout>
      <CalculatorLayout 
        title="Retirement Calculator" 
        description="Plan your financial future with our comprehensive retirement calculator"
      >
        <Tabs defaultValue="calculator">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="calculator">Calculator</TabsTrigger>
            <TabsTrigger value="projection">Detailed Projection</TabsTrigger>
            <TabsTrigger value="analysis">Analysis</TabsTrigger>
          </TabsList>
          
          <TabsContent value="calculator" className="space-y-4 pt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-semibold mb-4">Personal Details</h3>
                
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <SliderInput
                    label="Current Age"
                    value={currentAge}
                    setValue={setCurrentAge}
                    min={20}
                    max={70}
                    step={1}
                    unit="years"
                  />
                  
                  <SliderInput
                    label="Retirement Age"
                    value={retirementAge}
                    setValue={(value) => {
                      setRetirementAge(Math.max(value, currentAge + 1));
                    }}
                    min={45}
                    max={75}
                    step={1}
                    unit="years"
                  />
                </div>
                
                <SliderInput
                  label="Life Expectancy"
                  value={lifeExpectancy}
                  setValue={(value) => {
                    setLifeExpectancy(Math.max(value, retirementAge + 1));
                  }}
                  min={70}
                  max={100}
                  step={1}
                  unit="years"
                />
                
                <h3 className="text-lg font-semibold mt-8 mb-4">Financial Details</h3>
                
                <SliderInput
                  label="Current Savings"
                  value={currentSavings}
                  setValue={setCurrentSavings}
                  min={0}
                  max={10000000}
                  step={100000}
                  formatValue={(value) => formatCurrency(value).replace("₹", "")}
                  unit="₹"
                />
                
                <SliderInput
                  label="Monthly Savings"
                  value={monthlySavings}
                  setValue={setMonthlySavings}
                  min={5000}
                  max={200000}
                  step={1000}
                  formatValue={(value) => formatCurrency(value).replace("₹", "")}
                  unit="₹"
                />
                
                <SliderInput
                  label="Monthly Expenses (Current)"
                  value={monthlyExpenses}
                  setValue={setMonthlyExpenses}
                  min={10000}
                  max={500000}
                  step={5000}
                  formatValue={(value) => formatCurrency(value).replace("₹", "")}
                  unit="₹"
                />
                
                <div className="grid grid-cols-3 gap-4 mt-6">
                  <SliderInput
                    label="Pre-Retirement Return"
                    value={preRetirementReturn}
                    setValue={setPreRetirementReturn}
                    min={6}
                    max={15}
                    step={0.5}
                    formatValue={(value) => value.toFixed(1)}
                    unit="%"
                  />
                  
                  <SliderInput
                    label="Post-Retirement Return"
                    value={postRetirementReturn}
                    setValue={setPostRetirementReturn}
                    min={4}
                    max={12}
                    step={0.5}
                    formatValue={(value) => value.toFixed(1)}
                    unit="%"
                  />
                  
                  <SliderInput
                    label="Inflation Rate"
                    value={inflationRate}
                    setValue={setInflationRate}
                    min={2}
                    max={10}
                    step={0.5}
                    formatValue={(value) => value.toFixed(1)}
                    unit="%"
                  />
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-4">Retirement Summary</h3>
                
                <div className="grid grid-cols-1 gap-4 mb-6">
                  <ResultCard
                    title="Expected Retirement Corpus"
                    value={formatLargeNumber(retirementCorpus)}
                    description={`At age ${retirementAge}`}
                  />
                  <ResultCard
                    title="Required Retirement Corpus"
                    value={formatLargeNumber(requiredCorpus)}
                    description="Based on your expenses and life expectancy"
                  />
                  <ResultCard
                    title="Retirement Corpus Status"
                    value={isAdequate ? "Adequate" : `${formatCurrency(shortfall)} Shortfall`}
                    description={isAdequate ? "Your savings plan is on track" : "Additional savings needed"}
                    className={isAdequate ? "bg-gradient-blue text-white" : "bg-red-500 text-white"}
                  />
                </div>
                
                <div className={`p-4 rounded-lg border mb-6 ${
                  isAdequate ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"
                }`}>
                  <h4 className="font-medium mb-2">{suggestion.title}</h4>
                  <p className="text-sm mb-2">{suggestion.message}</p>
                  <p className="text-sm font-medium">{suggestion.action}</p>
                </div>
                
                <div className="h-72">
                  <h4 className="text-sm font-medium mb-4">Retirement Corpus Projection</h4>
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      data={yearlyProjection}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis 
                        dataKey="age" 
                        label={{ value: 'Age', position: 'insideBottom', offset: -5 }} 
                      />
                      <YAxis tickFormatter={(value) => `₹${(value / 1000000).toFixed(1)}M`} />
                      <Tooltip 
                        formatter={(value, name) => [
                          formatCurrency(Number(value)), 
                          name === "savings" ? "Corpus" : "Annual Expenses"
                        ]} 
                      />
                      <Legend />
                      <Area 
                        type="monotone" 
                        dataKey="savings" 
                        name="Corpus" 
                        stroke="#3B82F6" 
                        fill="#3B82F6" 
                        fillOpacity={0.6} 
                      />
                      <Area 
                        type="monotone" 
                        dataKey="expenses" 
                        name="Annual Expenses" 
                        stroke="#EC4899" 
                        fill="#EC4899"
                        fillOpacity={0.6} 
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="projection" className="pt-4">
            <div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                <div>
                  <h3 className="text-lg font-semibold mb-4">Corpus Growth</h3>
                  <div className="h-72">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={yearlyProjection}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis 
                          dataKey="age" 
                          label={{ value: 'Age', position: 'insideBottom', offset: -5 }} 
                        />
                        <YAxis tickFormatter={(value) => `₹${(value / 1000000).toFixed(1)}M`} />
                        <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                        <Legend />
                        <Line
                          type="monotone"
                          dataKey="savings"
                          name="Corpus"
                          stroke="#3B82F6"
                          activeDot={{ r: 8 }}
                          strokeWidth={2}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold mb-4">Annual Contributions & Returns</h3>
                  <div className="h-72">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={yearlyProjection.filter(item => item.phase === "pre-retirement")}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="age" />
                        <YAxis tickFormatter={(value) => `₹${(value / 100000).toFixed(1)}L`} />
                        <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                        <Legend />
                        <Bar dataKey="annualContribution" name="Annual Savings" fill="#3B82F6" />
                        <Bar dataKey="annualReturn" name="Annual Returns" fill="#10B981" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
              
              <h3 className="text-lg font-semibold mb-4">Detailed Year-by-Year Projection</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full border-collapse">
                  <thead>
                    <tr className="bg-secondary">
                      <th className="px-4 py-2 text-left">Age</th>
                      <th className="px-4 py-2 text-left">Phase</th>
                      <th className="px-4 py-2 text-right">Annual Contribution</th>
                      <th className="px-4 py-2 text-right">Annual Return</th>
                      <th className="px-4 py-2 text-right">Annual Expenses</th>
                      <th className="px-4 py-2 text-right">Corpus</th>
                    </tr>
                  </thead>
                  <tbody>
                    {yearlyProjection.map((item, index) => (
                      <tr 
                        key={index} 
                        className={`border-b border-border hover:bg-secondary/50 ${
                          item.age === retirementAge ? "bg-primary/10 font-medium" : ""
                        }`}
                      >
                        <td className="px-4 py-2">
                          {item.age === retirementAge ? `${item.age} (Retirement)` : item.age}
                        </td>
                        <td className="px-4 py-2 capitalize">{item.phase}</td>
                        <td className="px-4 py-2 text-right">
                          {formatCurrency(item.annualContribution)}
                        </td>
                        <td className="px-4 py-2 text-right">
                          {formatCurrency(item.annualReturn)}
                        </td>
                        <td className="px-4 py-2 text-right">
                          {formatCurrency(item.expenses)}
                        </td>
                        <td className="px-4 py-2 text-right">
                          {formatCurrency(item.savings)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="analysis" className="pt-4">
            <div className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 rounded-lg border bg-secondary/20">
                  <h4 className="font-medium mb-2">Years Until Retirement</h4>
                  <p className="text-2xl font-semibold">{retirementAge - currentAge} years</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Time to build your retirement corpus
                  </p>
                </div>
                <div className="p-4 rounded-lg border bg-secondary/20">
                  <h4 className="font-medium mb-2">Expected Retirement Duration</h4>
                  <p className="text-2xl font-semibold">{yearsInRetirement} years</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Years your corpus needs to support you
                  </p>
                </div>
                <div className="p-4 rounded-lg border bg-secondary/20">
                  <h4 className="font-medium mb-2">Monthly Income in Retirement</h4>
                  <p className="text-2xl font-semibold">
                    {formatCurrency(monthlyExpenses * Math.pow(1 + inflationRate / 100, retirementAge - currentAge))}
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Inflation-adjusted monthly expenses
                  </p>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-4">Retirement Corpus Breakdown</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="h-72">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={[
                            { 
                              name: "Current Savings", 
                              value: currentSavings * Math.pow(1 + preRetirementReturn / 100, retirementAge - currentAge)
                            },
                            { 
                              name: "Future Contributions", 
                              value: retirementCorpus - (currentSavings * Math.pow(1 + preRetirementReturn / 100, retirementAge - currentAge))
                            },
                            { 
                              name: "Shortfall (if any)", 
                              value: Math.max(0, shortfall)
                            }
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
                  <div>
                    <div className="space-y-4">
                      <div className="p-4 rounded-lg border bg-secondary/20">
                        <h4 className="font-medium mb-2">Current Savings Future Value</h4>
                        <p className="text-xl font-semibold">
                          {formatLargeNumber(currentSavings * Math.pow(1 + preRetirementReturn / 100, retirementAge - currentAge))}
                        </p>
                        <p className="text-sm text-muted-foreground mt-1">
                          Your current savings grow to this amount by retirement
                        </p>
                      </div>
                      <div className="p-4 rounded-lg border bg-secondary/20">
                        <h4 className="font-medium mb-2">Value of Future Contributions</h4>
                        <p className="text-xl font-semibold">
                          {formatLargeNumber(retirementCorpus - (currentSavings * Math.pow(1 + preRetirementReturn / 100, retirementAge - currentAge)))}
                        </p>
                        <p className="text-sm text-muted-foreground mt-1">
                          Value added by your future monthly savings
                        </p>
                      </div>
                      <div className="p-4 rounded-lg border bg-secondary/20">
                        <h4 className="font-medium mb-2">Years Corpus Will Last</h4>
                        <p className="text-xl font-semibold">
                          {isAdequate ? "Beyond Life Expectancy" : 
                            `~${Math.floor(retirementCorpus / (monthlyExpenses * 12 * Math.pow(1 + inflationRate / 100, retirementAge - currentAge)))} years`}
                        </p>
                        <p className="text-sm text-muted-foreground mt-1">
                          {isAdequate ? "Your corpus is sufficient" : "Your corpus will be depleted before life expectancy"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-4">How to Improve Your Plan</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 rounded-lg border bg-secondary/20">
                    <h4 className="font-medium mb-2">Increasing Monthly Savings</h4>
                    <p className="text-lg">
                      Save {formatCurrency(monthlySavings * 1.2)} monthly
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">
                      A 20% increase in monthly savings could add approximately 
                      {" " + formatLargeNumber(monthlySavings * 0.2 * 12 * 
                        ((Math.pow(1 + preRetirementReturn / 100, retirementAge - currentAge) - 1) / 
                        (preRetirementReturn / 100)))} to your retirement corpus.
                    </p>
                  </div>
                  <div className="p-4 rounded-lg border bg-secondary/20">
                    <h4 className="font-medium mb-2">Delaying Retirement</h4>
                    <p className="text-lg">
                      Retire at age {retirementAge + 2}
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Delaying retirement by 2 years could add approximately 
                      {" " + formatLargeNumber(retirementCorpus * 
                        (Math.pow(1 + preRetirementReturn / 100, 2) - 1) + 
                        monthlySavings * 24)} to your retirement corpus.
                    </p>
                  </div>
                  <div className="p-4 rounded-lg border bg-secondary/20">
                    <h4 className="font-medium mb-2">Optimizing Investments</h4>
                    <p className="text-lg">
                      Increase returns by 1%
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Increasing your pre-retirement returns by 1% could add approximately 
                      {" " + formatLargeNumber(retirementCorpus * 
                        (Math.pow(1 + (preRetirementReturn + 1) / 100, retirementAge - currentAge) / 
                        Math.pow(1 + preRetirementReturn / 100, retirementAge - currentAge) - 1))} to your retirement corpus.
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

export default RetirementCalculator;
