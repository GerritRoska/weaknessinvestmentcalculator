import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import CalculatorPanel from "./calculator/CalculatorPanel";

const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 p-4 md:p-8">
      <header className="mb-8 text-center">
        <h1 className="text-3xl md:text-4xl font-bold text-slate-800 mb-2">
          Weakness Investment Calculator
        </h1>
        <p className="text-slate-600 max-w-2xl mx-auto">
          See how much your daily habits are costing you and how much you could
          save by investing that money instead. Calculate the true cost of your
          guilty pleasures and watch your potential wealth grow!
        </p>
      </header>

      <main className="max-w-7xl mx-auto">
        <Card className="shadow-lg border-slate-200">
          <CardHeader className="bg-white border-b border-slate-100">
            <CardTitle className="text-xl text-slate-700">
              The Cost of Your Weakness Calculator
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <CalculatorPanel />
          </CardContent>
        </Card>

        <div className="mt-8 text-center text-sm text-slate-500">
          <p>
            This calculator is for illustrative purposes only and does not
            guarantee actual investment results. Always consult with a financial
            advisor before making investment decisions.
          </p>
        </div>
      </main>

      <footer className="mt-12 text-center text-sm text-slate-500">
        <p>
          © {new Date().getFullYear()} Investment Calculator. All rights
          reserved.
        </p>
      </footer>
    </div>
  );
};

export default Home;
