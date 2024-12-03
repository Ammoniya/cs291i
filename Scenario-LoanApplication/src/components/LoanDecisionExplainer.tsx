"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import {Info, AlertCircle, TrendingUp, Building, Calendar, DollarSign, ArrowLeft} from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {Button} from "@/components/ui/button";

interface Factor {
    id: string;
    name: string;
    icon: React.ReactElement;
    weight: number;
    impact: string;
    details: string;
    improvement: string;
    measurement: {
        type: string;
        unit: string;
        min: number;
        max: number;
        current: number;
        format: (value: number) => string;
        thresholds: {
            poor: number;
            medium: number;
            good: number;
            excellent: number;
        };
    };
    calculateScore: (value: number) => number;
}
interface LoanDecisionExplainerProps {
    initialData?: {
        income_stability: number;
        debt_ratio: number;
        asset_history: number;
        credit_age: number;
    };
    onBack?: () => void;
}
const LoanDecisionExplainer = ({ initialData, onBack }: LoanDecisionExplainerProps) => {
    const [measurements, setMeasurements] = useState<Record<string, number>>({
        income_stability: initialData?.income_stability || 45000,
        debt_ratio: initialData?.debt_ratio || 0,
        asset_history: initialData?.asset_history || 1,
        credit_age: initialData?.credit_age || 1
    });

    const [selectedFactor, setSelectedFactor] = useState<Factor | null>(null);
    const [totalScore, setTotalScore] = useState<number>(0);
    const [initialScore, setInitialScore] = useState<number>(0);

    // Calculate initial score once when component mounts
    useEffect(() => {
        let total = 0;
        factors.forEach(factor => {
            // @ts-expect-error
            const currentValue = initialData?.[factor.id] || factor.measurement.current;
            const score = factor.calculateScore(currentValue);
            total += score * factor.weight;
        });
        setInitialScore(total);
    }, []);
    const factors: Factor[] = [
        {
            id: 'income_stability',
            name: 'Annual Income',
            icon: <TrendingUp className="w-6 h-6" />,
            weight: 0.35,
            impact: 'High',
            details: 'Your annual income is below our recommended threshold for the requested loan amount.',
            improvement: 'Consider applying for a smaller loan amount or waiting until your income increases.',
            measurement: {
                type: 'currency',
                unit: 'USD',
                min: 20000,
                max: 200000,
                current: 45000,
                format: (value) => {
                    if (value >= 200000) {
                        return `$200,000+`;
                    }
                    return `$${value.toLocaleString()}`;
                },
                thresholds: {
                    poor: 35000,
                    medium: 50000,
                    good: 75000,
                    excellent: 100000
                }
            },
            calculateScore: (value) => {
                const score = ((value - 20000) / (200000 - 20000)) * 100;
                return Math.min(Math.max(score, 0), 100);
            }
        },
        {
            id: 'debt_ratio',
            name: 'Debt-to-Income Ratio',
            icon: <DollarSign className="w-6 h-6" />,
            weight: 0.30,
            impact: 'Very High',
            details: 'Your monthly debt payments are too high relative to your income.',
            improvement: 'Try to reduce your monthly debt payments or increase your income.',
            measurement: {
                type: 'percentage',
                unit: '%',
                min: 0,
                max: 100,
                current: 45,
                format: (value) => `${value}%`,
                thresholds: {
                    poor: 50,
                    medium: 40,
                    good: 30,
                    excellent: 20
                }
            },
            calculateScore: (value) => {

                return Math.max(0, 100 - value * 1.5);
            }
        },
        {
            id: 'asset_history',
            name: 'Asset History',
            icon: <Building className="w-6 h-6" />,
            weight: 0.20,
            impact: 'Medium',
            details: 'The duration you\'ve held your current assets affects loan eligibility.',
            improvement: 'Maintain your current assets and consider diversifying your portfolio.',
            measurement: {
                type: 'time',
                unit: 'months',
                min: 0,
                max: 60,
                current: 12,
                format: (value) => {
                    if (value >= 60) {
                        return '5+ years';
                    }
                    const years = Math.floor(value / 12);
                    const months = value % 12;
                    if (years === 0) return `${months} months`;
                    if (months === 0) return `${years} years`;
                    return `${years}y ${months}m`;
                },
                thresholds: {
                    poor: 6,
                    medium: 12,
                    good: 24,
                    excellent: 36
                }
            },
            calculateScore: (value) => {
                const score = (value / 60) * 100;
                return Math.min(Math.max(score, 0), 100);
            }
        },
        {
            id: 'credit_age',
            name: 'Credit History Length',
            icon: <Calendar className="w-6 h-6" />,
            weight: 0.15,
            impact: 'Medium',
            details: 'Length of credit history is an important factor in loan decisions.',
            improvement: 'Continue maintaining good credit practices to build history.',
            measurement: {
                type: 'time',
                unit: 'months',
                min: 0,
                max: 120,
                current: 18,
                format: (value) => {
                    if (value >= 120) {
                        return '10+ years';
                    }
                    const years = Math.floor(value / 12);
                    const months = value % 12;
                    if (years === 0) return `${months} months`;
                    if (months === 0) return `${years} years`;
                    return `${years}y ${months}m`;
                },
                thresholds: {
                    poor: 12,
                    medium: 24,
                    good: 36,
                    excellent: 60
                }
            },
            calculateScore: (value) => {
                const score = (value / 120) * 100;
                return Math.min(Math.max(score, 0), 100);
            }
        }
    ];

    const getFactorStatus = (factor: Factor, value: number) => {
        const { thresholds } = factor.measurement;
        // Special handling for Debt-to-Income Ratio
        if (factor.id === 'debt_ratio') {
            if (value <= thresholds.excellent) {
                return { status: 'Excellent', color: 'text-green-600' };
            } else if (value <= thresholds.good) {
                return { status: 'Good', color: 'text-green-500' };
            } else if (value <= thresholds.medium) {
                return { status: 'Medium', color: 'text-yellow-500' };
            } else if (value <= thresholds.poor) {
                return { status: 'Poor', color: 'text-red-500' };
            } else {
                return { status: 'Very Poor', color: 'text-red-600' };
            }
        }
        // Default handling for other
        if (value >= thresholds.excellent) {
            return { status: 'Excellent', color: 'text-green-600' };
        } else if (value >= thresholds.good) {
            return { status: 'Good', color: 'text-green-500' };
        } else if (value >= thresholds.medium) {
            return { status: 'Medium', color: 'text-yellow-500' };
        } else if (value >= thresholds.poor) {
            return { status: 'Poor', color: 'text-red-500' };
        } else {
            return { status: 'Very Poor', color: 'text-red-600' };
        }
    };

    const calculateTotalScore = () => {
        let total = 0;
        factors.forEach(factor => {
            const currentValue = measurements[factor.id] !== undefined ?
                measurements[factor.id] : factor.measurement.current;
            const score = factor.calculateScore(currentValue);
            total += score * factor.weight;
        });
        return total;
    };

    const handleMeasurementChange = (factorId: string, newValue: number[]) => {
        setMeasurements(prev => ({
            ...prev,
            [factorId]: newValue[0]
        }));
    };

    useEffect(() => {
        const newTotalScore = calculateTotalScore();
        setTotalScore(newTotalScore);
    }, [calculateTotalScore, measurements]);

    const getCurrentValue = (factor: Factor) => {
        return measurements[factor.id] !== undefined ?
            measurements[factor.id] : factor.measurement.current;
    };

    const getApprovalStatus = (score: number) => {
        if (score >= 85) {
            return { status: 'Approved', color: 'text-green-600', message: 'High chance of approval' };
        } else if (score >= 75) {
            return { status: 'Potentially Approved', color: 'text-green-500', message: 'Good chance of approval' };
        } else if (score >= 65) {
            return { status: 'Review Required', color: 'text-yellow-500', message: 'Additional review may be needed' };
        } else {
            return { status: 'Not Approved', color: 'text-red-500', message: 'Low chance of approval' };
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-4 space-y-6">
            <div className="flex justify-start">
                <Button
                    variant="ghost"
                    onClick={onBack}
                    className="flex items-center gap-2"
                >
                    <ArrowLeft className="w-4 h-4"/>
                    Back to Application
                </Button>
            </div>

            <Alert className={initialScore >= 85 ? "bg-green-50 border-green-600" : "bg-red-50 border-red-600"}>
                <AlertCircle className={`h-4 w-4 ${initialScore >= 85 ? "text-green-600" : "text-red-600"}`} />
                <AlertTitle className={initialScore >= 85 ? "text-green-600" : "text-red-600"}>
                    Initial Loan Application Status: {initialScore >= 85 ? "APPROVED" : "NOT APPROVED"}
                </AlertTitle>
                <AlertDescription>
                    {initialScore >= 85
                        ? `Congratulations! Your loan application has been approved with an initial score of ${initialScore.toFixed(1)}.`
                        : `Unfortunately, your initial application score of ${initialScore.toFixed(1)} does not meet our approval criteria (minimum 85).`
                    }
                </AlertDescription>
            </Alert>

            <Alert>
                <AlertCircle className="h-4 w-4"/>
                <AlertTitle>Overall Loan Score: {totalScore.toFixed(1)}/100</AlertTitle>
                <AlertDescription>
                    {getApprovalStatus(totalScore).message}
                </AlertDescription>
            </Alert>

            <div className="grid md:grid-cols-2 gap-4">
                {factors.map((factor) => {
                    const currentValue = getCurrentValue(factor);
                    const {status, color} = getFactorStatus(factor, currentValue);

                    return (
                        <Card
                            key={factor.id}
                            className={`cursor-pointer transition-all hover:shadow-lg ${
                                selectedFactor?.id === factor.id ? 'ring-2 ring-blue-500' : ''
                            }`}
                            onClick={() => setSelectedFactor(factor)}
                        >
                            <CardHeader className="flex flex-row items-center space-x-4 pb-2">
                                <div className="p-2 bg-blue-100 rounded-full">
                                    {factor.icon}
                                </div>
                                <div>
                                    <CardTitle className="text-lg">{factor.name}</CardTitle>
                                    <p className="text-sm text-gray-500">Weight: {(factor.weight * 100)}%</p>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    <div className="relative pt-6">
                                        <Slider
                                            value={[currentValue]}
                                            min={factor.measurement.min}
                                            max={factor.measurement.max}
                                            step={1}
                                            className="cursor-pointer"
                                            onValueChange={(value) => handleMeasurementChange(factor.id, value)}
                                        />
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <p className={`text-sm font-medium ${color}`}>{status}</p>
                                        <p className="text-sm text-right">
                                            {factor.measurement.format(currentValue)}
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>

            {selectedFactor && (
                <Card className="mt-6">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Info className="w-5 h-5"/>
                            Detailed Analysis: {selectedFactor.name}
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <h3 className="font-semibold mb-2">Current Situation</h3>
                            <p>{selectedFactor.details}</p>
                        </div>
                        <div>
                            <h3 className="font-semibold mb-2">How to Improve</h3>
                            <p>{selectedFactor.improvement}</p>
                        </div>
                        <div>
                            <h3 className="font-semibold mb-2">Threshold Values</h3>
                            <ul className="space-y-2">
                                <li className="flex items-center gap-2">
                                    <span className="w-3 h-3 bg-red-600 rounded-full"></span>
                                    Very Poor:
                                    Below {selectedFactor.measurement.format(selectedFactor.measurement.thresholds.poor)}
                                </li>
                                <li className="flex items-center gap-2">
                                    <span className="w-3 h-3 bg-red-500 rounded-full"></span>
                                    Poor: {selectedFactor.measurement.format(selectedFactor.measurement.thresholds.poor)} to {selectedFactor.measurement.format(selectedFactor.measurement.thresholds.medium)}
                                </li>
                                <li className="flex items-center gap-2">
                                    <span className="w-3 h-3 bg-yellow-500 rounded-full"></span>
                                    Medium: {selectedFactor.measurement.format(selectedFactor.measurement.thresholds.medium)} to {selectedFactor.measurement.format(selectedFactor.measurement.thresholds.good)}
                                </li>
                                <li className="flex items-center gap-2">
                                    <span className="w-3 h-3 bg-green-500 rounded-full"></span>
                                    Good: {selectedFactor.measurement.format(selectedFactor.measurement.thresholds.good)} to {selectedFactor.measurement.format(selectedFactor.measurement.thresholds.excellent)}
                                </li>
                                <li className="flex items-center gap-2">
                                    <span className="w-3 h-3 bg-green-600 rounded-full"></span>
                                    Excellent: {selectedFactor.measurement.format(selectedFactor.measurement.thresholds.excellent)} or
                                    higher
                                </li>
                            </ul>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
};

export default LoanDecisionExplainer;