// src/app/page.tsx
"use client";
import { useState } from 'react';
import LoanDecisionExplainer from '@/components/LoanDecisionExplainer';
import LoanApplicationForm from '@/components/LoanApplicationForm';
import { LoanApplicationData } from '@/types/loan';

interface TransformedLoanData {
    income_stability: number;
    debt_ratio: number;
    asset_history: number;
    credit_age: number;
}

export default function Home() {
    const [showDecisionExplainer, setShowDecisionExplainer] = useState(false);
    // Update the state type to match TransformedLoanData
    const [applicationData, setApplicationData] = useState<TransformedLoanData | null>(null);
    const handleBack = () => {
        setShowDecisionExplainer(false);
    };
    const handleApplicationSubmit = (data: LoanApplicationData) => {
        const transformedData: TransformedLoanData = {
            income_stability: Number(data.financialInfo.annualIncome),
            debt_ratio: Number(data.financialInfo.monthlyDebt) /
                (Number(data.financialInfo.annualIncome) / 12) * 100,
            asset_history: Number(data.financialInfo.employmentLength) * 12,
            credit_age: Number(data.financialInfo.creditHistory) * 12,
        };

        setApplicationData(transformedData);
        setShowDecisionExplainer(true);
    };

    return (
        <main className="min-h-screen p-4 bg-gray-50">
            {!showDecisionExplainer ? (
                <LoanApplicationForm onSubmit={handleApplicationSubmit} />
            ) : (
                <LoanDecisionExplainer
                    initialData={applicationData ?? {
                        income_stability: 45000,
                        debt_ratio: 10,
                        asset_history: 1,
                        credit_age: 1
                    }}
                    onBack={handleBack}
                />
            )}
        </main>
    );
}