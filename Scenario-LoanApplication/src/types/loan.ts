export interface LoanApplicationData {
    personalInfo: {
        fullName: string;
        email: string;
        phone: string;
        address: string;
    };
    financialInfo: {
        annualIncome: string;
        monthlyDebt: string;
        employmentStatus: string;
        employmentLength: string;
        creditHistory: string;
    };
    loanDetails: {
        carPrice: string;
        downPayment: string;
        loanTerm: string;
        vehicleType: string;
    };
}