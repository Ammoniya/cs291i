import React, {useState} from 'react';
import {Card, CardContent, CardHeader, CardTitle, CardFooter} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {AlertCircle} from 'lucide-react';
import {Alert, AlertDescription} from "@/components/ui/alert";
import {LoanApplicationData} from "@/types/loan";

const LoanApplicationForm = ({onSubmit}: {
    onSubmit: (data: {
        personalInfo: { address: string; phone: string; fullName: string; email: string };
        loanDetails: { loanTerm: string; carPrice: string; downPayment: string; vehicleType: string };
        financialInfo: {
            employmentLength: string;
            annualIncome: string;
            monthlyDebt: string;
            employmentStatus: string;
            creditHistory: string
        }
    }) => void
}) => {
    const [formData, setFormData] = useState<LoanApplicationData>({
        personalInfo: {
            fullName: '',
            email: '',
            phone: '',
            address: ''
        },
        financialInfo: {
            annualIncome: '',
            monthlyDebt: '',
            employmentStatus: '',
            employmentLength: '',
            creditHistory: '' // Added new field
        },
        loanDetails: {
            carPrice: '',
            downPayment: '',
            loanTerm: '',
            vehicleType: ''
        }
    });
    const [errors, setErrors] = useState<string[]>([]);
    type FormSection = 'personalInfo' | 'financialInfo' | 'loanDetails';

    type PersonalInfoFields = 'fullName' | 'email' | 'phone' | 'address';
    type FinancialInfoFields =
        'annualIncome'
        | 'monthlyDebt'
        | 'employmentStatus'
        | 'employmentLength'
        | 'creditHistory'; // Added creditHistory
    type LoanDetailsFields = 'carPrice' | 'downPayment' | 'loanTerm' | 'vehicleType';

    type FormFields = PersonalInfoFields | FinancialInfoFields | LoanDetailsFields;
    const handleInputChange = (section: FormSection, field: FormFields, value: string) => {
        setFormData(prev => ({
            ...prev,
            [section]: {
                ...prev[section],
                [field]: value
            }
        }));
    };

    const validateForm = () => {
        const newErrors: string[] = [];

        // Validate Personal Information
        if (!formData.personalInfo.fullName) newErrors.push("Full name is required");
        if (!formData.personalInfo.email) newErrors.push("Email is required");
        if (!formData.personalInfo.phone) newErrors.push("Phone number is required");

        // Validate Financial Information
        if (!formData.financialInfo.annualIncome) newErrors.push("Annual income is required");
        if (!formData.financialInfo.monthlyDebt) newErrors.push("Monthly debt is required");
        if (!formData.financialInfo.employmentStatus) newErrors.push("Employment status is required");

        // Validate Loan Details
        if (!formData.loanDetails.carPrice) newErrors.push("Car price is required");
        if (!formData.loanDetails.downPayment) newErrors.push("Down payment is required");
        if (!formData.loanDetails.loanTerm) newErrors.push("Loan term is required");

        setErrors(newErrors);
        return newErrors.length === 0;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (validateForm()) {
            // Here you would typically send the data to your backend
            // For now, we'll just redirect to the decision explainer
            onSubmit(formData);
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-4 space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle className="text-2xl">Car Loan Application</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-8">
                        {/* Personal Information Section */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold">Personal Information</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="fullName">Full Name</Label>
                                    <Input
                                        id="fullName"
                                        value={formData.personalInfo.fullName}
                                        onChange={(e) => handleInputChange('personalInfo', 'fullName', e.target.value)}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="email">Email</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        value={formData.personalInfo.email}
                                        onChange={(e) => handleInputChange('personalInfo', 'email', e.target.value)}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="phone">Phone Number</Label>
                                    <Input
                                        id="phone"
                                        value={formData.personalInfo.phone}
                                        onChange={(e) => handleInputChange('personalInfo', 'phone', e.target.value)}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="address">Address</Label>
                                    <Input
                                        id="address"
                                        value={formData.personalInfo.address}
                                        onChange={(e) => handleInputChange('personalInfo', 'address', e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Financial Information Section */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold">Financial Information</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="annualIncome">Annual Income ($)</Label>
                                    <Input
                                        id="annualIncome"
                                        type="number"
                                        placeholder="e.g. 50000"
                                        value={formData.financialInfo.annualIncome}
                                        onChange={(e) => handleInputChange('financialInfo', 'annualIncome', e.target.value)}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="monthlyDebt">Total Monthly Debt Payments ($)</Label>
                                    <Input
                                        id="monthlyDebt"
                                        type="number"
                                        placeholder="e.g. 1500"
                                        value={formData.financialInfo.monthlyDebt}
                                        onChange={(e) => handleInputChange('financialInfo', 'monthlyDebt', e.target.value)}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="employmentStatus">Employment Status</Label>
                                    <Select
                                        onValueChange={(value) => handleInputChange('financialInfo', 'employmentStatus', value)}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select status"/>
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="full-time">Full-time</SelectItem>
                                            <SelectItem value="part-time">Part-time</SelectItem>
                                            <SelectItem value="self-employed">Self-employed</SelectItem>
                                            <SelectItem value="unemployed">Unemployed</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="employmentLength">Years at Current Employment</Label>
                                    <Input
                                        id="employmentLength"
                                        type="number"
                                        placeholder="e.g. 5"
                                        value={formData.financialInfo.employmentLength}
                                        onChange={(e) => handleInputChange('financialInfo', 'employmentLength', e.target.value)}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="creditHistory">Years of Credit History</Label>
                                    <Input
                                        id="creditHistory"
                                        type="number"
                                        placeholder="e.g. 7"
                                        value={formData.financialInfo.creditHistory || ''}
                                        onChange={(e) => handleInputChange('financialInfo', 'creditHistory', e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Loan Details Section */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold">Loan Details</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="carPrice">Car Price</Label>
                                    <Input
                                        id="carPrice"
                                        type="number"
                                        value={formData.loanDetails.carPrice}
                                        onChange={(e) => handleInputChange('loanDetails', 'carPrice', e.target.value)}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="downPayment">Down Payment</Label>
                                    <Input
                                        id="downPayment"
                                        type="number"
                                        value={formData.loanDetails.downPayment}
                                        onChange={(e) => handleInputChange('loanDetails', 'downPayment', e.target.value)}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="loanTerm">Loan Term (months)</Label>
                                    <Select
                                        onValueChange={(value) => handleInputChange('loanDetails', 'loanTerm', value)}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select term"/>
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="36">36 months</SelectItem>
                                            <SelectItem value="48">48 months</SelectItem>
                                            <SelectItem value="60">60 months</SelectItem>
                                            <SelectItem value="72">72 months</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="vehicleType">Vehicle Type</Label>
                                    <Select
                                        onValueChange={(value) => handleInputChange('loanDetails', 'vehicleType', value)}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select type"/>
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="new">New</SelectItem>
                                            <SelectItem value="used">Used</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </div>

                        {errors.length > 0 && (
                            <Alert variant="destructive">
                                <AlertCircle className="h-4 w-4"/>
                                <AlertDescription>
                                    <ul className="list-disc pl-4">
                                        {errors.map((error, index) => (
                                            <li key={index}>{error}</li>
                                        ))}
                                    </ul>
                                </AlertDescription>
                            </Alert>
                        )}
                    </form>
                </CardContent>
                <CardFooter>
                    <Button
                        className="w-full"
                        onClick={handleSubmit}
                    >
                        Submit Application
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
};

export default LoanApplicationForm;