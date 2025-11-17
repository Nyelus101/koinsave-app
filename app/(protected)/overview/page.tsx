"use client";

import React, { useEffect, useState } from "react";
import { api, Transaction, Budget, Pot } from "@/lib/api"; 
import Spinner from "@/components/Spinner";
import { ChevronRight, DollarSign } from 'lucide-react'; 

// --- 1. Define Hardcoded Primary Balance Data ---
const HARDCODED_BALANCE = {
    current: 4836.00,
    income: 3814.25,
    expenses: 1700.50,
};

// --- 2. Define the Comprehensive Data Structure ---
interface OverviewData {
    balance: typeof HARDCODED_BALANCE;
    transactions: Transaction[];
    budgets: (Budget & { spent: number })[]; // Budgets with the calculated 'spent' field
    pots: Pot[];
    total_saved_pots: number;
    recurring_bills: {
        paid: number;
        upcoming: number;
        dueSoon: number;
    };
}

// --- 3. Overview Page Component ---
export default function OverviewPage() {
    const [data, setData] = useState<OverviewData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);


    // Helper for currency formatting
    const formatCurrency = (amount: number) => `$${Math.abs(amount).toFixed(2)}`;
    
    // --- Data Processing Function (Must be run client-side after API fetch) ---
    // In a real application, these calculations should ideally be done on the backend.
    const processFetchedData = (
        transactions: Transaction[], 
        budgets: Budget[], 
        pots: Pot[]
    ): Omit<OverviewData, 'balance'> => {
        
        // 1. Calculate Spent amount for each Budget
        const budgetSpending: { [key: string]: number } = {};
        for (const tx of transactions) {
            if (tx.amount < 0 && budgets.some(b => b.category === tx.category)) {
                budgetSpending[tx.category] = (budgetSpending[tx.category] || 0) + Math.abs(tx.amount);
            }
        }

        const calculatedBudgets = budgets.map(budget => ({
            ...budget,
            spent: budgetSpending[budget.category] || 0.0
        }));

        // 2. Calculate Total Saved in Pots (for the top card)
        const total_saved_pots = pots.reduce((sum, pot) => sum + pot.total, 0);

        // 3. Calculate Recurring Bills Summary
        const recurringExpensesData = transactions.filter(t => t.recurring && t.amount < 0);
        
        // --- Heuristic Split for Recurring Bills (Based on the structure provided) ---
        // Find transactions older than one month (approximated for paid/upcoming split)
        const oneMonthAgo = new Date();
        oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
        
        let paidBills = 0.0;
        let upcomingBillsTotal = 0.0;

        for (const t of recurringExpensesData) {
            const txDate = new Date(t.date);
            if (txDate < oneMonthAgo) {
                paidBills += Math.abs(t.amount);
            } else {
                upcomingBillsTotal += Math.abs(t.amount);
            }
        }
        
        // Arbitrary split for UI display (35% due soon, 65% upcoming)
        const dueSoon = Math.round(upcomingBillsTotal * 0.35 * 100) / 100;
        const upcoming = Math.round(upcomingBillsTotal * 0.65 * 100) / 100;
        
        const recurring_bills = {
            paid: Math.round(paidBills * 100) / 100,
            upcoming: upcoming,
            dueSoon: dueSoon
        };

        // 4. Filter Pots and Transactions for UI
        const pots_for_ui = pots.slice(0, 4); // Top 4 pots
        const transactions_for_ui = transactions
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
            .slice(0, 5); // Top 5 recent transactions

        return {
            transactions: transactions_for_ui,
            budgets: calculatedBudgets,
            pots: pots_for_ui,
            total_saved_pots,
            recurring_bills,
        };
    };

    useEffect(() => {
        // Fetch all necessary data from API in parallel
        Promise.all([
            api.getTransactions(),
            api.getBudgets(),
            api.getPots(),
        ])
        .then(([transactions, budgets, pots]) => {
            const processedData = processFetchedData(transactions, budgets, pots);
            
            // Combine hardcoded balance with fetched and processed data
            setData({
                balance: HARDCODED_BALANCE,
                ...processedData
            });
            setLoading(false);
        })
        .catch(err => {
            console.error("Failed to load overview data:", err);
+           setError("Failed to load overview data.");
+           setLoading(false);
        });
    }, []);

    if (loading) return <Spinner />;
    if (error) return <div className="p-6 text-red-600">{error}</div>;
    if (!data) return <div className="p-6 text-gray-600">No data available</div>;

    // Derived values for Budgets
    const totalBudgetSpent = data.budgets.reduce((sum, b) => sum + b.spent, 0);
    const totalBudgetLimit = data.budgets.reduce((sum, b) => sum + b.maximum, 0);


    return (
        <div className="flex-1 overflow-y-auto bg-[#f8f9fa] text-[#343a40]">
            <div className="p-6">
                <h2 className="text-3xl font-bold mb-6 text-[#1e293b]">Overview</h2>

                {/* --- 1. Top Card Row (Current Balance, Income, Expenses - HARDCODED) --- */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    
                    {/* Current Balance Card (Black background) */}
                    <div className="p-6 bg-[#1e293b] text-white rounded-xl shadow-xl">
                        <h3 className="text-sm uppercase font-medium opacity-80 mb-1">Current Balance</h3>
                        {/* Uses hardcoded value */}
                        <p className="text-4xl font-extrabold tracking-tight">
                            {formatCurrency(data.balance.current)}
                        </p>
                    </div>

                    {/* Income Card */}
                    <div className="p-6 bg-white rounded-xl shadow-lg border border-gray-100">
                        <h3 className="text-sm uppercase font-medium text-gray-500 mb-1">Income</h3>
                        {/* Uses hardcoded value */}
                        <p className="text-3xl font-bold text-green-600">
                            {formatCurrency(data.balance.income)}
                        </p>
                    </div>

                    {/* Expenses Card */}
                    <div className="p-6 bg-white rounded-xl shadow-lg border border-gray-100">
                        <h3 className="text-sm uppercase font-medium text-gray-500 mb-1">Expenses</h3>
                        {/* Uses hardcoded value */}
                        <p className="text-3xl font-bold text-red-600">
                            {formatCurrency(data.balance.expenses)}
                        </p>
                    </div>
                </div>

                {/* --- 2. Main Content Grid (Pots, Transactions, Budgets, Bills - FETCHED & CALCULATED) --- */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Column (Pots and Transactions - span 2 cols on desktop) */}
                    <div className="lg:col-span-2 space-y-6">
                        
                        {/* Pots Card (FETCHED/CALCULATED) */}
                        <div className="bg-white p-6 rounded-xl shadow-lg">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-xl font-semibold">Pots</h3>
                                <a href="/pots" className="text-sm text-gray-500 hover:text-[#52528c] flex items-center">
                                    See Details <ChevronRight className="w-4 h-4 ml-1" />
                                </a>
                            </div>
                            
                            {/* Total Saved (Calculated from fetched pots) */}
                            <div className="flex items-center space-x-6 mb-4">
                                <div className="p-4 bg-gray-100 rounded-lg flex-shrink-0">
                                    <DollarSign className="w-6 h-6 text-[#52528c]" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Total Saved</p>
                                    <p className="text-3xl font-bold text-[#1e293b]">
                                        {formatCurrency(data.total_saved_pots)}
                                    </p>
                                </div>
                            </div>
                            
                            {/* Individual Pots List (Fetched and sliced) */}
                            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-100">
                                {data.pots.map((pot) => (
                                    <div key={pot.id} className="text-sm">
                                        <p className="font-medium text-[#1e293b]">{pot.name}</p>
                                        <p className="text-gray-500">{formatCurrency(pot.total)}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Transactions Card (FETCHED/FILTERED) */}
                        <div className="bg-white p-6 rounded-xl shadow-lg">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-xl font-semibold">Latest Transactions</h3>
                                <a href="/transactions" className="text-sm text-gray-500 hover:text-[#52528c] flex items-center">
                                    View all <ChevronRight className="w-4 h-4 ml-1" />
                                </a>
                            </div>

                            <div className="space-y-4">
                                {data.transactions.map((tx) => (
                                    <div key={tx.date} className="flex justify-between items-center pb-3 border-b border-gray-100 last:border-b-0">
                                        <div className="flex items-center space-x-3">
                                            {/* Placeholder for avatar/icon */}
                                            <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-xs font-semibold text-[#1e293b] flex-shrink-0">
                                                {tx.name[0]}
                                            </div>
                                            <div>
                                                <p className="font-medium text-[#1e293b]">{tx.name}</p>
                                                <p className="text-xs text-gray-400">{tx.category}</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className={`font-semibold ${tx.amount < 0 ? 'text-red-600' : 'text-green-600'}`}>
                                                {tx.amount < 0 ? "-" : "+"}{formatCurrency(tx.amount)}
                                            </p>
                                            <p className="text-xs text-gray-400">{new Date(tx.date).toLocaleDateString()}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right Column (Budgets and Recurring Bills) */}
                    <div className="lg:col-span-1 space-y-6">
                        
                        {/* Budgets Card (FETCHED/CALCULATED) */}
                        <div className="bg-white p-6 rounded-xl shadow-lg">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-xl font-semibold">Budgets</h3>
                                <a href="/budgets" className="text-sm text-gray-500 hover:text-[#52528c] flex items-center">
                                    See Details <ChevronRight className="w-4 h-4 ml-1" />
                                </a>
                            </div>
                            
                            {/* Doughnut Chart Placeholder */}
                            <div className="flex items-center justify-center h-48 mb-4 relative">
                                <div className="w-40 h-40 rounded-full bg-gray-100 flex items-center justify-center text-center">
                                    <p className="font-bold text-lg text-[#1e293b]">
                                        {formatCurrency(totalBudgetSpent)}
                                        <span className="block text-sm font-normal text-gray-500">of {formatCurrency(totalBudgetLimit)}</span>
                                    </p>
                                </div>
                            </div>
                            
                            {/* Budget Legends/Details (Fetched and calculated) */}
                            <div className="space-y-3 mt-6">
                                {data.budgets.map((budget) => (
                                    <div key={budget.id} className="flex justify-between items-center text-sm">
                                        <div className="flex items-center">
                                            <span className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: budget.theme }}></span>
                                            <span className="text-gray-600">{budget.category}</span>
                                        </div>
                                        <span className="font-medium text-[#1e293b]">{formatCurrency(budget.spent)}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Recurring Bills Card (FETCHED/CALCULATED) */}
                        <div className="bg-white p-6 rounded-xl shadow-lg">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-xl font-semibold">Recurring Bills</h3>
                                <a href="/recurring-bills" className="text-sm text-gray-500 hover:text-[#52528c] flex items-center">
                                    See Details <ChevronRight className="w-4 h-4 ml-1" />
                                </a>
                            </div>
                            
                            {/* Recurring Bill Summary (Calculated from fetched transactions) */}
                            <div className="space-y-3">
                                <div className="flex justify-between items-center border-b pb-2">
                                    <span className="text-gray-600">Paid Bills (Past Month)</span>
                                    <span className="font-bold text-green-600">{formatCurrency(data.recurring_bills.paid)}</span>
                                </div>
                                <div className="flex justify-between items-center border-b pb-2">
                                    <span className="text-gray-600">Total Upcoming</span>
                                    <span className="font-bold text-[#1e293b]">{formatCurrency(data.recurring_bills.upcoming)}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-600">Due Soon</span>
                                    <span className="font-bold text-red-600">{formatCurrency(data.recurring_bills.dueSoon)}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}







// "use client";

// import React, { useEffect, useState } from "react";
// import Navbar from "@/components/Navbar";
// import { api } from "@/lib/api";
// import Spinner from "@/components/Spinner";

// export default function OverviewPage() {
//   const [balance, setBalance] = useState<any>(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     api.getBalance().then((data) => {
//       setBalance(data);
//       setLoading(false);
//     });
//   }, []);

//   if (loading) return <Spinner />;

//   return (
//     <div>
//       {/* <Navbar /> */}
//       <div className="p-6">
//         <h2 className="text-2xl font-bold mb-4">Overview</h2>
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//           <div className="p-4 bg-green-100 rounded shadow">
//             <h3>Current Balance</h3>
//             <p className="text-xl font-bold">${balance.current.toFixed(2)}</p>
//           </div>
//           <div className="p-4 bg-gray-100 rounded shadow">
//             <h3>Income</h3>
//             <p className="text-xl font-bold">${balance.income.toFixed(2)}</p>
//           </div>
//           <div className="p-4 bg-gray-100 rounded shadow">
//             <h3>Expenses</h3>
//             <p className="text-xl font-bold">${balance.expenses.toFixed(2)}</p>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }




