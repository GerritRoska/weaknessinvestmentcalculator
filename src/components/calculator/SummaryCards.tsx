import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ArrowUpIcon,
  ArrowDownIcon,
  TrendingUpIcon,
  Coffee,
  DollarSign,
  ShoppingBag,
} from "lucide-react";

interface SummaryCardProps {
  title: string;
  value: string;
  description?: string;
  percentageChange?: number;
  icon?: React.ReactNode;
}

const SummaryCard = ({
  title = "Summary",
  value = "$0",
  description = "",
  percentageChange,
  icon = <TrendingUpIcon className="h-4 w-4" />,
}: SummaryCardProps) => {
  const isPositive =
    percentageChange === undefined ? true : percentageChange >= 0;

  return (
    <Card className="bg-white">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1 sm:pb-2 px-3 sm:px-6 pt-3 sm:pt-6">
        <CardTitle className="text-xs sm:text-sm font-medium">
          {title}
        </CardTitle>
        <div className="h-4 w-4 text-muted-foreground">{icon}</div>
      </CardHeader>
      <CardContent className="px-3 sm:px-6 py-2 sm:py-3">
        <div className="text-lg sm:text-2xl font-bold">{value}</div>
        <div className="flex flex-wrap items-center space-x-2">
          {percentageChange !== undefined && (
            <span
              className={`flex items-center text-xs ${isPositive ? "text-green-500" : "text-red-500"}`}
            >
              {isPositive ? (
                <ArrowUpIcon className="mr-1 h-3 w-3" />
              ) : (
                <ArrowDownIcon className="mr-1 h-3 w-3" />
              )}
              {Math.abs(percentageChange).toFixed(2)}%
            </span>
          )}
          {description && (
            <p className="text-xs text-muted-foreground mt-1 sm:mt-0">
              {description}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

interface SummaryCardsProps {
  finalAmount?: number;
  totalContributions?: number;
  interestEarned?: number;
  returnRate?: number;
  inflationAdjusted?: boolean;
  weaknessContribution?: number;
  weaknessItemCount?: number;
  weaknessType?: string;
  isMultipleWeaknesses?: boolean;
  weaknessCount?: number;
}

const SummaryCards = ({
  finalAmount = 150000,
  totalContributions = 60000,
  interestEarned = 90000,
  returnRate = 7.5,
  inflationAdjusted = false,
  weaknessContribution = 0,
  weaknessItemCount = 0,
  weaknessType = "coffees",
  isMultipleWeaknesses = false,
  weaknessCount = 1,
}: SummaryCardsProps) => {
  // Format currency values
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(value);
  };

  // Calculate percentage of interest to total
  const interestPercentage = (interestEarned / finalAmount) * 100;

  // Calculate average contribution per weakness when multiple
  const averageContributionPerWeakness =
    isMultipleWeaknesses && weaknessCount > 1
      ? weaknessContribution / weaknessCount
      : weaknessContribution;

  return (
    <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
      <SummaryCard
        title="Final Amount"
        value={formatCurrency(finalAmount)}
        description={inflationAdjusted ? "Inflation adjusted" : "Nominal value"}
        percentageChange={returnRate}
        icon={<TrendingUpIcon className="h-4 w-4" />}
      />
      <SummaryCard
        title="Total Contributions"
        value={formatCurrency(totalContributions)}
        description={`${((totalContributions / finalAmount) * 100).toFixed(0)}% of final amount`}
        icon={<ArrowUpIcon className="h-4 w-4" />}
      />
      <SummaryCard
        title="Interest Earned"
        value={formatCurrency(interestEarned)}
        description={`${interestPercentage.toFixed(0)}% of final amount`}
        percentageChange={interestPercentage}
        icon={<TrendingUpIcon className="h-4 w-4" />}
      />
      {weaknessContribution > 0 && (
        <>
          <SummaryCard
            title={
              isMultipleWeaknesses
                ? "Combined Weakness Savings"
                : "Weakness Savings"
            }
            value={formatCurrency(weaknessContribution)}
            description={
              isMultipleWeaknesses
                ? `Savings from ${weaknessCount} different habits`
                : `That's a lot of ${weaknessType} you didn't buy!`
            }
            percentageChange={(weaknessContribution / totalContributions) * 100}
            icon={
              isMultipleWeaknesses ? (
                <ShoppingBag className="h-4 w-4" />
              ) : (
                <Coffee className="h-4 w-4" />
              )
            }
          />

          {isMultipleWeaknesses && (
            <SummaryCard
              title="Average Savings Per Habit"
              value={formatCurrency(averageContributionPerWeakness)}
              description={`Each habit contributes to your wealth`}
              percentageChange={
                (averageContributionPerWeakness / weaknessContribution) * 100
              }
              icon={<DollarSign className="h-4 w-4" />}
            />
          )}

          <SummaryCard
            title={
              isMultipleWeaknesses
                ? `Items Not Purchased`
                : `${weaknessType.charAt(0).toUpperCase() + weaknessType.slice(1)} Not Purchased`
            }
            value={weaknessItemCount.toString()}
            description={
              isMultipleWeaknesses
                ? `You've made smarter financial choices!`
                : `You saved enough to buy ${weaknessItemCount} ${weaknessType} all at once!`
            }
            icon={
              isMultipleWeaknesses ? (
                <ShoppingBag className="h-4 w-4" />
              ) : (
                <Coffee className="h-4 w-4" />
              )
            }
          />
        </>
      )}
    </div>
  );
};

export default SummaryCards;
