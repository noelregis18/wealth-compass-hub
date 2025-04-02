
import React, { useState, useEffect } from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from "recharts";
import Layout from "@/components/layout/Layout";
import CalculatorLayout from "@/components/calculator/CalculatorLayout";
import SliderInput from "@/components/calculator/SliderInput";
import ResultCard from "@/components/calculator/ResultCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const SalaryCalculator = () => {
  const [basicSalary, setBasicSalary] = useState(50000);
  const [hraPercentage, setHraPercentage] = useState(40);
  const [specialAllowance, setSpecialAllowance] = useState(20000);
  const [pf, setPf] = useState(true);
  const [professionalTax, setProfessionalTax] = useState(200);
  const [otherDeductions, setOtherDeductions] = useState(0);
  const [bonusAmount, setBonusAmount] = useState(100000);
  const [bonusMonths, setBonusMonths] = useState([3, 9]); // March and September
  
  // Results
  const [monthlySalary, setMonthlySalary] = useState({
    gross: 0,
    deductions: 0,
    netPay: 0,
    components: {} as Record<string, number>
  });
  
  const [annualSalary, setAnnualSalary] = useState({
    gross: 0,
    deductions: 0,
    netPay: 0,
    monthly: [] as any[]
  });
  
  // Format currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(value);
  };

  // Calculate salary details
  useEffect(() => {
    calculateSalary();
  }, [basicSalary, hraPercentage, specialAllowance, pf, professionalTax, otherDeductions, bonusAmount, bonusMonths]);

  const calculateSalary = () => {
    // Calculate HRA
    const hra = (basicSalary * hraPercentage) / 100;
    
    // Calculate PF (if enabled)
    const pfAmount = pf ? Math.min(basicSalary * 0.12, 1800) : 0;
    
    // Calculate gross monthly salary
    const monthlyGross = basicSalary + hra + specialAllowance;
    
    // Calculate monthly deductions
    const monthlyDeductions = pfAmount + professionalTax + otherDeductions;
    
    // Calculate monthly net pay
    const monthlyNetPay = monthlyGross - monthlyDeductions;
    
    // Update monthly salary details
    setMonthlySalary({
      gross: monthlyGross,
      deductions: monthlyDeductions,
      netPay: monthlyNetPay,
      components: {
        "Basic Salary": basicSalary,
        "HRA": hra,
        "Special Allowance": specialAllowance,
        "PF": -pfAmount,
        "Professional Tax": -professionalTax,
        "Other Deductions": -otherDeductions
      }
    });
    
    // Calculate annual salary details
    const monthly = [];
    let annualGross = 0;
    let annualDeductions = 0;
    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    
    for (let month = 0; month < 12; month++) {
      // Check if this month has bonus
      const hasBonus = bonusMonths.includes(month);
      const bonus = hasBonus ? bonusAmount : 0;
      
      // Calculate monthly values
      const gross = monthlyGross + bonus;
      const deductions = monthlyDeductions;
      const netPay = gross - deductions;
      
      // Add to annual totals
      annualGross += gross;
      annualDeductions += deductions;
      
      monthly.push({
        month: monthNames[month],
        gross,
        deductions,
        netPay,
        hasBonus
      });
    }
    
    // Calculate annual net pay
    const annualNetPay = annualGross - annualDeductions;
    
    // Update annual salary details
    setAnnualSalary({
      gross: annualGross,
      deductions: annualDeductions,
      netPay: annualNetPay,
      monthly
    });
  };

  // Prepare data for charts
  const prepareSalaryBreakdown = () => {
    const components = Object.entries(monthlySalary.components);
    
    return components.map(([name, value]) => ({
      name,
      value: Math.abs(value), // Use absolute value for chart
      isDeduction: value < 0 // Flag for deductions
    }));
  };
  
  const salaryBreakdown = prepareSalaryBreakdown();
  
  // Colors for charts
  const COLORS = ["#3B82F6", "#10B981", "#EC4899", "#F97316", "#8B5CF6", "#FBBF24"];
  const DEDUCTION_COLOR = "#EF4444";

  return (
    <Layout>
      <CalculatorLayout 
        title="Salary Calculator" 
        description="Calculate your take-home salary and view salary breakdown"
      >
        <Tabs defaultValue="monthly">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="monthly">Monthly Salary</TabsTrigger>
            <TabsTrigger value="annual">Annual Projection</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>
          
          <TabsContent value="monthly" className="space-y-4 pt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-semibold mb-4">Salary Details</h3>
                
                <SliderInput
                  label="Basic Salary"
                  value={basicSalary}
                  setValue={setBasicSalary}
                  min={10000}
                  max={500000}
                  step={1000}
                  formatValue={(value) => formatCurrency(value).replace("₹", "")}
                  unit="₹"
                />
                
                <SliderInput
                  label="HRA Percentage"
                  value={hraPercentage}
                  setValue={setHraPercentage}
                  min={0}
                  max={100}
                  step={1}
                  unit="%"
                />
                
                <SliderInput
                  label="Special Allowance"
                  value={specialAllowance}
                  setValue={setSpecialAllowance}
                  min={0}
                  max={100000}
                  step={1000}
                  formatValue={(value) => formatCurrency(value).replace("₹", "")}
                  unit="₹"
                />
                
                <div className="grid grid-cols-2 gap-4 mb-6 mt-6">
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="pf"
                      checked={pf}
                      onChange={(e) => setPf(e.target.checked)}
                      className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                    />
                    <label htmlFor="pf" className="text-sm font-medium">
                      Provident Fund (12% of Basic)
                    </label>
                  </div>
                  
                  <div className="flex flex-col space-y-2">
                    <Label htmlFor="professional-tax" className="text-sm font-medium">
                      Professional Tax
                    </Label>
                    <Input
                      id="professional-tax"
                      type="number"
                      min="0"
                      value={professionalTax}
                      onChange={(e) => setProfessionalTax(Number(e.target.value))}
                      className="w-full"
                    />
                  </div>
                </div>
                
                <div className="mt-4">
                  <Label htmlFor="other-deductions" className="text-sm font-medium">
                    Other Deductions
                  </Label>
                  <Input
                    id="other-deductions"
                    type="number"
                    min="0"
                    value={otherDeductions}
                    onChange={(e) => setOtherDeductions(Number(e.target.value))}
                    className="w-full mt-2"
                  />
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-4">Salary Summary</h3>
                
                <div className="grid grid-cols-1 gap-4 mb-6">
                  <ResultCard
                    title="Gross Salary"
                    value={formatCurrency(monthlySalary.gross)}
                    description="Total monthly earnings before deductions"
                  />
                  <ResultCard
                    title="Total Deductions"
                    value={formatCurrency(monthlySalary.deductions)}
                    description="Total monthly deductions from salary"
                  />
                  <ResultCard
                    title="Net Pay"
                    value={formatCurrency(monthlySalary.netPay)}
                    description="Take-home salary after deductions"
                    className="bg-gradient-blue text-white"
                  />
                </div>
                
                <div className="h-72">
                  <h4 className="text-sm font-medium mb-4">Salary Breakdown</h4>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={salaryBreakdown}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      >
                        {salaryBreakdown.map((entry, index) => (
                          <Cell 
                            key={`cell-${index}`} 
                            fill={entry.isDeduction ? DEDUCTION_COLOR : COLORS[index % COLORS.length]} 
                          />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
            
            <div className="mt-6">
              <h3 className="text-lg font-semibold mb-4">Salary Components</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full border-collapse">
                  <thead>
                    <tr className="bg-secondary">
                      <th className="px-4 py-2 text-left">Component</th>
                      <th className="px-4 py-2 text-right">Amount</th>
                      <th className="px-4 py-2 text-right">Percentage of Gross</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(monthlySalary.components).map(([component, amount], index) => (
                      <tr key={index} className="border-b border-border hover:bg-secondary/50">
                        <td className="px-4 py-2">{component}</td>
                        <td className={`px-4 py-2 text-right ${amount < 0 ? "text-red-500" : ""}`}>
                          {formatCurrency(amount)}
                        </td>
                        <td className="px-4 py-2 text-right">
                          {((Math.abs(amount) / monthlySalary.gross) * 100).toFixed(1)}%
                        </td>
                      </tr>
                    ))}
                    <tr className="font-medium bg-secondary/50">
                      <td className="px-4 py-2">Net Salary</td>
                      <td className="px-4 py-2 text-right">{formatCurrency(monthlySalary.netPay)}</td>
                      <td className="px-4 py-2 text-right">
                        {((monthlySalary.netPay / monthlySalary.gross) * 100).toFixed(1)}%
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="annual" className="pt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <div>
                <h3 className="text-lg font-semibold mb-4">Annual Summary</h3>
                
                <div className="grid grid-cols-1 gap-4 mb-6">
                  <ResultCard
                    title="Annual Gross Salary"
                    value={formatCurrency(annualSalary.gross)}
                    description="Total yearly earnings including bonuses"
                  />
                  <ResultCard
                    title="Annual Deductions"
                    value={formatCurrency(annualSalary.deductions)}
                    description="Total yearly deductions from salary"
                  />
                  <ResultCard
                    title="Annual Net Pay"
                    value={formatCurrency(annualSalary.netPay)}
                    description="Yearly take-home salary after deductions"
                    className="bg-gradient-blue text-white"
                  />
                </div>
                
                <div className="p-4 rounded-lg border bg-secondary/20 mt-6">
                  <h4 className="font-medium mb-2">Bonus Details</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Amount</p>
                      <p className="text-lg font-semibold">{formatCurrency(bonusAmount)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Frequency</p>
                      <p className="text-lg font-semibold">{bonusMonths.length}x per year</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-4">Monthly Distribution</h3>
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={annualSalary.monthly}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis tickFormatter={(value) => `₹${(value / 1000).toFixed(0)}K`} />
                      <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                      <Legend />
                      <Bar dataKey="netPay" name="Net Pay" fill="#3B82F6" />
                      <Bar dataKey="deductions" name="Deductions" fill="#EF4444" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
            
            <div className="mt-6">
              <h3 className="text-lg font-semibold mb-4">Monthly Breakdown</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full border-collapse">
                  <thead>
                    <tr className="bg-secondary">
                      <th className="px-4 py-2 text-left">Month</th>
                      <th className="px-4 py-2 text-right">Gross Salary</th>
                      <th className="px-4 py-2 text-right">Deductions</th>
                      <th className="px-4 py-2 text-right">Net Pay</th>
                      <th className="px-4 py-2 text-center">Bonus</th>
                    </tr>
                  </thead>
                  <tbody>
                    {annualSalary.monthly.map((month, index) => (
                      <tr 
                        key={index} 
                        className={`border-b border-border hover:bg-secondary/50 ${
                          month.hasBonus ? "bg-primary/10" : ""
                        }`}
                      >
                        <td className="px-4 py-2">{month.month}</td>
                        <td className="px-4 py-2 text-right">{formatCurrency(month.gross)}</td>
                        <td className="px-4 py-2 text-right">{formatCurrency(month.deductions)}</td>
                        <td className="px-4 py-2 text-right">{formatCurrency(month.netPay)}</td>
                        <td className="px-4 py-2 text-center">
                          {month.hasBonus ? "✓" : ""}
                        </td>
                      </tr>
                    ))}
                    <tr className="font-medium bg-secondary/50">
                      <td className="px-4 py-2">Total</td>
                      <td className="px-4 py-2 text-right">{formatCurrency(annualSalary.gross)}</td>
                      <td className="px-4 py-2 text-right">{formatCurrency(annualSalary.deductions)}</td>
                      <td className="px-4 py-2 text-right">{formatCurrency(annualSalary.netPay)}</td>
                      <td className="px-4 py-2"></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="settings" className="pt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-semibold mb-4">Bonus Settings</h3>
                
                <SliderInput
                  label="Bonus Amount"
                  value={bonusAmount}
                  setValue={setBonusAmount}
                  min={0}
                  max={1000000}
                  step={10000}
                  formatValue={(value) => formatCurrency(value).replace("₹", "")}
                  unit="₹"
                />
                
                <div className="mt-6">
                  <Label className="text-sm font-medium mb-2">Bonus Months</Label>
                  <div className="grid grid-cols-3 gap-2 mt-2">
                    {["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"].map((month, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id={`month-${index}`}
                          checked={bonusMonths.includes(index)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setBonusMonths([...bonusMonths, index].sort());
                            } else {
                              setBonusMonths(bonusMonths.filter(m => m !== index));
                            }
                          }}
                          className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                        />
                        <label htmlFor={`month-${index}`} className="text-sm">
                          {month}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="mt-6 p-4 rounded-lg border bg-secondary/20">
                  <h4 className="font-medium mb-2">About Provident Fund</h4>
                  <p className="text-sm text-muted-foreground">
                    Employee Provident Fund (EPF) is a retirement benefit scheme where both 
                    the employee and employer contribute 12% of the basic salary. 
                    The calculator considers employee contribution only.
                  </p>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-4">Salary Comparison</h3>
                <div className="h-72 mb-6">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={[
                        {
                          name: "Monthly",
                          gross: monthlySalary.gross,
                          net: monthlySalary.netPay,
                        },
                        {
                          name: "Annual (Average)",
                          gross: annualSalary.gross / 12,
                          net: annualSalary.netPay / 12,
                        }
                      ]}
                      layout="vertical"
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" tickFormatter={(value) => `₹${(value / 1000).toFixed(0)}K`} />
                      <YAxis dataKey="name" type="category" />
                      <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                      <Legend />
                      <Bar dataKey="gross" name="Gross Salary" fill="#3B82F6" />
                      <Bar dataKey="net" name="Net Salary" fill="#10B981" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                
                <div className="space-y-4">
                  <div className="p-4 rounded-lg border bg-secondary/20">
                    <h4 className="font-medium mb-2">Take-Home Salary Ratio</h4>
                    <p className="text-xl font-semibold">
                      {((monthlySalary.netPay / monthlySalary.gross) * 100).toFixed(1)}%
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Percentage of gross salary you take home after deductions
                    </p>
                  </div>
                  
                  <div className="p-4 rounded-lg border bg-secondary/20">
                    <h4 className="font-medium mb-2">Bonus Impact</h4>
                    <p className="text-xl font-semibold">
                      {formatCurrency((annualSalary.gross - (monthlySalary.gross * 12)) / 12)}
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Average monthly increase due to bonuses
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

export default SalaryCalculator;
