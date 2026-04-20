export const demoUsers = [
  {
    name: 'Ananya Sharma',
    email: 'applicant@example.com',
    phone: '9876543210',
    password: 'Password@123',
    role: 'applicant'
  },
  {
    name: 'Rahul Mehta',
    email: 'admin@example.com',
    phone: '9876500001',
    password: 'Password@123',
    role: 'admin'
  },
  {
    name: 'Priya Finance',
    email: 'financier@example.com',
    phone: '9876500002',
    password: 'Password@123',
    role: 'financier'
  }
];

export const demoApplications = [
  {
    applicantEmail: 'applicant@example.com',
    applicantName: 'Ananya Sharma',
    loanType: 'home-loan',
    employmentType: 'salaried',
    requestedAmount: 4500000,
    monthlyIncome: 120000,
    monthlyObligations: 26000,
    creditScore: 712,
    tenureMonths: 240,
    interestRate: 8.8,
    propertyValue: 6800000,
    identityDetails: {
      aadhaarName: 'Ananya Sharma',
      panName: 'Ananya Sharma',
      dateOfBirth: '1992-08-17'
    },
    notes: [
      {
        authorRole: 'admin',
        message: 'All identity details match and income documents are consistent.'
      }
    ]
  }
];
