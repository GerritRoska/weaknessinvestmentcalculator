import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import {
  DollarSign,
  Percent,
  Calendar,
  TrendingUp,
  ArrowDownUp,
  Coffee,
  Utensils,
  Film,
  Beer,
  ShoppingBag,
} from "lucide-react";
import InvestmentChart from "./InvestmentChart";
import SummaryCards from "./SummaryCards";
import ComparisonFeature from "./ComparisonFeature";
import CoffeeCalculator, { WeaknessData } from "./CoffeeCalculator";

interface CalculatorPanelProps {
  className?: string;
}

// Import WEAKNESS_OPTIONS from CoffeeCalculator to use in the weakness list
const WEAKNESS_OPTIONS = [
  {
    value: "coffee",
    label: "Coffee",
    icon: Coffee,
    description: "That morning brew that keeps you functioning like a human",
    color: "bg-amber-100 text-amber-800",
  },
  {
    value: "eating_out",
    label: "Eating Out",
    icon: Utensils,
    description: "Because cooking is hard and delivery apps are easy",
    color: "bg-red-100 text-red-800",
  },
  {
    value: "movies",
    label: "Movies",
    icon: Film,
    description:
      "Your regular escape into other worlds (with overpriced popcorn)",
    color: "bg-blue-100 text-blue-800",
  },
  {
    value: "drinks",
    label: "Drinks",
    icon: Beer,
    description: "Those social lubricants that make you think you can dance",
    color: "bg-yellow-100 text-yellow-800",
  },
  {
    value: "shopping",
    label: "Shopping",
    icon: ShoppingBag,
    description: "Things you absolutely 'need' according to targeted ads",
    color: "bg-pink-100 text-pink-800",
  },
];

const CalculatorPanel: React.FC<CalculatorPanelProps> = ({
  className = "",
}) => {
  // Default state values for calculator parameters
  const [initialInvestment, setInitialInvestment] = useState<number>(10000);
  const [monthlyContribution, setMonthlyContribution] = useState<number>(500);
  const [timeYears, setTimeYears] = useState<number>(20);
  const [returnRate, setReturnRate] = useState<number>(7);
  const [inflationRate, setInflationRate] = useState<number>(2.5);
  const [showRealReturns, setShowRealReturns] = useState<boolean>(false);
  const [currentAge, setCurrentAge] = useState<number>(30);
  const [retirementAge, setRetirementAge] = useState<number>(65);
  const [weaknessData, setWeaknessData] = useState<WeaknessData>({
    id: crypto.randomUUID(),
    type: "coffee",
    cost: 5,
    frequency: "daily",
    timesPerFrequency: 1,
  });

  // State for multiple weaknesses
  const [weaknessList, setWeaknessList] = useState<WeaknessData[]>([]);
  const [showMultipleWeaknesses, setShowMultipleWeaknesses] =
    useState<boolean>(false);

  // Calculate investment growth data for chart
  const calculateInvestmentGrowth = () => {
    const data = [];
    let balance = initialInvestment;

    // Calculate annual savings from not buying the weakness
    const getAnnualWeaknessSavings = (weakness: WeaknessData) => {
      const { cost, timesPerFrequency, frequency } = weakness;
      const frequencyMultiplier =
        frequency === "daily" ? 365 : frequency === "weekly" ? 52 : 12;

      return cost * timesPerFrequency * frequencyMultiplier;
    };

    // Calculate total annual savings from all weaknesses
    let annualWeaknessSavings = getAnnualWeaknessSavings(weaknessData);

    // Add savings from all weaknesses in the list if multiple mode is enabled
    if (showMultipleWeaknesses && weaknessList.length > 0) {
      weaknessList.forEach((weakness) => {
        annualWeaknessSavings += getAnnualWeaknessSavings(weakness);
      });
    }

    const monthlyWeaknessSavings = annualWeaknessSavings / 12;

    // Add monthly weakness savings to monthly contribution
    const effectiveMonthlyContribution =
      monthlyContribution + monthlyWeaknessSavings;

    // Calculate years until retirement based on current age and retirement age
    const yearsUntilRetirement = Math.max(0, retirementAge - currentAge);
    // Use either the manually set timeYears or the calculated years until retirement, whichever is greater
    const calculationPeriod = Math.max(timeYears, yearsUntilRetirement);

    for (let year = 0; year <= calculationPeriod; year++) {
      // Calculate real value by adjusting for inflation
      const realValue = balance / Math.pow(1 + inflationRate / 100, year);

      const baseContribution =
        year === 0
          ? initialInvestment
          : initialInvestment + monthlyContribution * 12 * year;

      const weaknessContribution = annualWeaknessSavings * year;

      data.push({
        year,
        value: Math.round(balance),
        realValue: Math.round(realValue),
        contribution: baseContribution,
        weaknessContribution,
        totalContribution: baseContribution + weaknessContribution,
      });

      // Calculate next year's balance
      balance =
        balance * (1 + returnRate / 100) + effectiveMonthlyContribution * 12;
    }

    return data;
  };

  const investmentData = calculateInvestmentGrowth();

  // Calculate years until retirement based on current age and retirement age
  const yearsUntilRetirement = Math.max(0, retirementAge - currentAge);
  // Use either the manually set timeYears or the calculated years until retirement, whichever is greater
  const calculationPeriod = Math.max(timeYears, yearsUntilRetirement);

  // Calculate summary metrics using retirement age
  const finalAmount = investmentData[yearsUntilRetirement].value;
  const totalContributions =
    investmentData[yearsUntilRetirement].totalContribution ||
    investmentData[yearsUntilRetirement].contribution;
  const weaknessContribution =
    investmentData[yearsUntilRetirement].weaknessContribution || 0;
  const interestEarned = finalAmount - totalContributions;

  // Calculate weakness metrics
  const calculateWeaknessMetrics = () => {
    if (showMultipleWeaknesses && weaknessList.length > 0) {
      // For multiple weaknesses, calculate combined metrics
      const totalWeaknessCount = weaknessList.length + 1; // +1 for the current weakness
      const averageCost = weaknessContribution / totalWeaknessCount;

      return {
        cost: averageCost,
        itemCount: Math.floor(weaknessContribution / averageCost),
        type: "items",
        isMultiple: true,
      };
    } else {
      // For single weakness
      const { cost, type } = weaknessData;
      const itemCount = cost > 0 ? Math.floor(weaknessContribution / cost) : 0;
      const weaknessType =
        type === "coffee"
          ? "coffees"
          : type === "eating_out"
            ? "meals"
            : type === "movies"
              ? "movie tickets"
              : type === "drinks"
                ? "drinks"
                : "items";
      return { cost, itemCount, type: weaknessType, isMultiple: false };
    }
  };

  const {
    cost,
    itemCount,
    type: selectedWeaknessType,
    isMultiple,
  } = calculateWeaknessMetrics();

  // Format currency values
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <Card className={`bg-white p-4 sm:p-6 rounded-xl shadow-md ${className}`}>
      <CardContent className="p-0">
        <div className="flex flex-col space-y-6 sm:space-y-8">
          <div className="pb-4 border-b border-gray-200">
            <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-6 text-sm text-gray-600">
              <div className="flex items-center gap-1.5">
                <span>Created by Gerrit Roska</span>
                <a
                  href="https://www.linkedin.com/in/gerritroska/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 transition-colors inline-flex items-center"
                  aria-label="Gerrit Roska's LinkedIn profile"
                  onClick={(e) => {
                    e.preventDefault();
                    window.open(
                      "https://www.linkedin.com/in/gerritroska/",
                      "_blank",
                      "noopener,noreferrer",
                    );
                  }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="w-5 h-5"
                  >
                    <path d="M20.5 2h-17A1.5 1.5 0 002 3.5v17A1.5 1.5 0 003.5 22h17a1.5 1.5 0 001.5-1.5v-17A1.5 1.5 0 0020.5 2zM8 19H5v-9h3zM6.5 8.25A1.75 1.75 0 118.3 6.5a1.78 1.78 0 01-1.8 1.75zM19 19h-3v-4.74c0-1.42-.6-1.93-1.38-1.93A1.74 1.74 0 0013 14.19a.66.66 0 000 .14V19h-3v-9h2.9v1.3a3.11 3.11 0 012.7-1.4c1.55 0 3.36.86 3.36 3.66z"></path>
                  </svg>
                </a>
              </div>
              <div className="flex items-center gap-1.5">
                <span>Inspired by Jack Skywalker's blog</span>
                <a
                  href="https://thrivently.substack.com/p/from-20s-to-millions-a-guide-to-effortless"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 transition-colors inline-flex items-center"
                  aria-label="Jack Skywalker's blog post"
                  onClick={(e) => {
                    e.preventDefault();
                    window.open(
                      "https://thrivently.substack.com/p/from-20s-to-millions-a-guide-to-effortless",
                      "_blank",
                      "noopener,noreferrer",
                    );
                  }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="w-5 h-5"
                  >
                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                    <polyline points="15 3 21 3 21 9"></polyline>
                    <line x1="10" y1="14" x2="21" y2="3"></line>
                  </svg>
                </a>
              </div>
            </div>
          </div>

          <div className="w-full">
            <div className="space-y-6 sm:space-y-8">
              <div className="flex items-center justify-end mb-4 mt-2">
                <div className="flex items-center space-x-2 flex-shrink-0">
                  <Switch
                    id="multiple-weaknesses"
                    checked={showMultipleWeaknesses}
                    onCheckedChange={setShowMultipleWeaknesses}
                  />
                  <Label
                    htmlFor="multiple-weaknesses"
                    className="text-sm sm:text-base"
                  >
                    Combine multiple weaknesses
                  </Label>
                </div>
              </div>

              {showMultipleWeaknesses ? (
                <div className="space-y-6 w-full">
                  <CoffeeCalculator
                    onChange={setWeaknessData}
                    onAdd={(newWeakness) => {
                      setWeaknessList((prev) => [...prev, newWeakness]);
                    }}
                    defaultValues={weaknessData}
                    isMultipleMode={true}
                  />

                  {weaknessList.length > 0 && (
                    <div className="mt-6 space-y-4">
                      <h3 className="text-lg font-semibold">
                        Your Weakness List
                      </h3>
                      <div className="space-y-2 overflow-x-auto">
                        {weaknessList.map((weakness, index) => {
                          const option = WEAKNESS_OPTIONS.find(
                            (opt) => opt.value === weakness.type,
                          );
                          const Icon = option?.icon || Coffee;
                          return (
                            <div
                              key={weakness.id}
                              className="flex items-center justify-between p-2 sm:p-3 bg-gray-50 rounded-md min-w-[280px]"
                            >
                              <div className="flex items-center space-x-2 sm:space-x-3">
                                <div
                                  className={`p-1.5 rounded-full ${option?.color || "bg-primary/10"}`}
                                >
                                  <Icon className="h-4 w-4" />
                                </div>
                                <div>
                                  <p className="text-sm sm:text-base font-medium">
                                    {option?.label || "Item"}
                                  </p>
                                  <p className="text-xs sm:text-sm text-gray-500">
                                    ${weakness.cost} ×{" "}
                                    {weakness.timesPerFrequency}{" "}
                                    {weakness.frequency}
                                  </p>
                                </div>
                              </div>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-xs sm:text-sm px-2 sm:px-3"
                                onClick={() => {
                                  setWeaknessList((prev) =>
                                    prev.filter((_, i) => i !== index),
                                  );
                                }}
                              >
                                Remove
                              </Button>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <CoffeeCalculator
                  onChange={setWeaknessData}
                  defaultValues={weaknessData}
                />
              )}

              <Separator />

              <div className="space-y-3 sm:space-y-4">
                <h2 className="text-xl sm:text-2xl font-semibold">
                  Personal Information
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="current-age">
                        Current Age: {currentAge}
                      </Label>
                    </div>
                    <Slider
                      id="current-age"
                      min={18}
                      max={80}
                      step={1}
                      value={[currentAge]}
                      onValueChange={(value) => setCurrentAge(value[0])}
                      className="w-full"
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="retirement-age">
                        Retirement Age: {retirementAge}
                      </Label>
                    </div>
                    <Slider
                      id="retirement-age"
                      min={Math.max(currentAge + 1, 55)}
                      max={90}
                      step={1}
                      value={[retirementAge]}
                      onValueChange={(value) => setRetirementAge(value[0])}
                      className="w-full"
                    />
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-3 sm:space-y-4">
                <h2 className="text-xl sm:text-2xl font-semibold">
                  Investment Parameters
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label
                        htmlFor="return-rate"
                        className="flex items-center"
                      >
                        <TrendingUp className="h-4 w-4 mr-2" />
                        Return Rate: {returnRate}%
                      </Label>
                    </div>
                    <Slider
                      id="return-rate"
                      min={1}
                      max={15}
                      step={0.5}
                      value={[returnRate]}
                      onValueChange={(value) => setReturnRate(value[0])}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>1%</span>
                      <span>15%</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label
                        htmlFor="inflation-rate"
                        className="flex items-center"
                      >
                        <Percent className="h-4 w-4 mr-2" />
                        Inflation Rate: {inflationRate}%
                      </Label>
                    </div>
                    <Slider
                      id="inflation-rate"
                      min={0}
                      max={10}
                      step={0.5}
                      value={[inflationRate]}
                      onValueChange={(value) => setInflationRate(value[0])}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>0%</span>
                      <span>10%</span>
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-3 sm:space-y-4">
                <h2 className="text-xl sm:text-2xl font-semibold">
                  Investment Growth with Savings
                </h2>
                <div className="h-[300px] sm:h-[350px] md:h-[400px] w-full">
                  <InvestmentChart
                    data={investmentData}
                    showRealReturns={showRealReturns}
                    title="Investment Growth with Weakness Savings"
                  />
                </div>
              </div>

              <Separator />

              <div className="space-y-3 sm:space-y-4">
                <h2 className="text-xl sm:text-2xl font-semibold">
                  Investment Summary
                </h2>
                <SummaryCards
                  finalAmount={finalAmount}
                  totalContributions={totalContributions}
                  interestEarned={interestEarned}
                  inflationAdjusted={showRealReturns}
                  returnRate={returnRate}
                  weaknessContribution={weaknessContribution}
                  weaknessItemCount={itemCount}
                  weaknessType={selectedWeaknessType}
                  isMultipleWeaknesses={isMultiple}
                  weaknessCount={
                    showMultipleWeaknesses ? weaknessList.length + 1 : 1
                  }
                />
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CalculatorPanel;
