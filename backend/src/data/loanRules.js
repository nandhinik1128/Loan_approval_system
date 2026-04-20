const baseValidation = {
  allowedFormats: ['PDF', 'JPG', 'PNG'],
  maxSizeMb: 5
};

const createDocument = (id, label, instructions, required = true, optional = false) => ({
  id,
  label,
  required,
  optional,
  instructions,
  filenameHint: `${id}.pdf`,
  allowedFormats: baseValidation.allowedFormats,
  maxSizeMb: baseValidation.maxSizeMb
});

export const loanRules = {
  'home-loan': {
    title: 'Home Loan',
    documentGroups: [
      {
        title: 'Identity',
        documents: [
          createDocument('aadhaar-card', 'Aadhaar Card', 'Upload a clear copy showing your name, Aadhaar number, and date of birth.'),
          createDocument('pan-card', 'PAN Card', 'Upload the front of your PAN card with name, PAN number, and photo visible.'),
          createDocument('passport', 'Passport', 'Optional. Upload only if available. Keep the photo page fully readable.', false, true)
        ]
      },
      {
        title: 'Address Proof',
        documents: [
          createDocument('utility-bill', 'Utility Bill', 'Upload a recent utility bill with your full name and current address visible.'),
          createDocument('voter-id', 'Voter ID', 'Upload the voter ID showing name, photograph, and address.'),
          createDocument('driving-licence', 'Driving Licence', 'Upload both sides if needed. Ensure the address is visible.'),
          createDocument('passport-address', 'Passport', 'Upload the passport pages that display address details.')
        ]
      },
      {
        title: 'Income - Salaried',
        documents: [
          createDocument('salary-slips-3-months', 'Last 3 months salary slips', 'Upload the latest three months of salary slips in chronological order.'),
          createDocument('bank-statements-6-months', '6 months bank statements', 'Upload six months of salary account statements with transactions readable.'),
          createDocument('form-16', 'Form 16', 'Upload the latest Form 16 issued by your employer.'),
          createDocument('it-returns-2-years', 'IT returns (2 years)', 'Upload acknowledged ITRs for the last two assessment years.')
        ]
      },
      {
        title: 'Income - Self-employed',
        documents: [
          createDocument('it-returns-3-years', 'IT returns (3 years)', 'Upload acknowledged ITRs for the last three assessment years.'),
          createDocument('profit-loss-statement', 'Profit & Loss statement', 'Upload a professionally prepared profit and loss statement.'),
          createDocument('balance-sheet', 'Balance sheet', 'Upload the latest balance sheet with assets and liabilities visible.'),
          createDocument('business-registration-proof', 'Business registration proof', 'Upload GST, incorporation, partnership, or shop registration proof.')
        ]
      },
      {
        title: 'Property Documents',
        documents: [
          createDocument('sale-deed', 'Sale deed / Agreement to sell', 'Upload the executed sale deed or agreement to sell document.'),
          createDocument('title-deed', 'Property title deed', 'Upload the title deed showing the current ownership chain.'),
          createDocument('encumbrance-certificate', 'Encumbrance certificate', 'Upload the latest encumbrance certificate with the relevant period covered.'),
          createDocument('approved-building-plan', 'Approved building plan', 'Upload the approved plan sanctioned by the local authority.'),
          createDocument('builder-society-noc', 'NOC from builder/society', 'Upload a no-objection certificate issued by the builder or society.'),
          createDocument('property-tax-receipts', 'Property tax receipts (last 3 years)', 'Upload the last three years of property tax receipts in readable form.')
        ]
      },
      {
        title: 'Others',
        documents: [
          createDocument('own-contribution-proof', 'Own contribution proof', 'Upload proof of your down payment or own contribution.'),
          createDocument('processing-fee-cheque', 'Processing fee cheque', 'Upload a scan of the cheque issued toward processing fees.')
        ]
      }
    ]
  },
  'personal-loan': {
    title: 'Personal Loan',
    documentGroups: [
      {
        title: 'Identity',
        documents: [
          createDocument('aadhaar-card', 'Aadhaar Card', 'Upload a clear copy showing your name and Aadhaar number.'),
          createDocument('pan-card', 'PAN Card', 'Upload the PAN card with name and PAN number visible.')
        ]
      },
      {
        title: 'Address Proof',
        documents: [
          createDocument('utility-bill', 'Utility Bill', 'Upload a recent utility bill showing your current address.'),
          createDocument('voter-id', 'Voter ID', 'Upload the voter ID with address details.'),
          createDocument('driving-licence', 'Driving Licence', 'Upload the driving licence with address details visible.')
        ]
      },
      {
        title: 'Income - Salaried',
        documents: [
          createDocument('salary-slips-3-months', '3 months salary slips', 'Upload the latest three salary slips.'),
          createDocument('bank-statements-6-months', '3–6 months bank statements', 'Upload bank statements covering at least three months and up to six months.'),
          createDocument('form-16', 'Form 16', 'Upload the latest Form 16 from your employer.')
        ]
      },
      {
        title: 'Income - Self-employed',
        documents: [
          createDocument('it-returns-2-years', 'IT returns (2 years)', 'Upload the last two years of acknowledged ITRs.'),
          createDocument('bank-statements-12-months', 'Bank statements (12 months)', 'Upload twelve months of business or personal bank statements.'),
          createDocument('business-proof', 'Business proof', 'Upload proof of the business entity or trade activity.')
        ]
      },
      {
        title: 'Others',
        documents: [
          createDocument('existing-loan-statements', 'Existing loan statements', 'Upload existing loan statements only if you currently service other loans.', false, true)
        ]
      }
    ]
  },
  'vehicle-loan': {
    title: 'Vehicle Loan',
    documentGroups: [
      {
        title: 'Identity',
        documents: [
          createDocument('aadhaar-card', 'Aadhaar Card', 'Upload a clear Aadhaar copy with name and number visible.'),
          createDocument('pan-card', 'PAN Card', 'Upload the PAN card with photo and PAN visible.'),
          createDocument('driving-licence', 'Driving Licence', 'Upload the driving licence as identity and driving eligibility proof.')
        ]
      },
      {
        title: 'Address Proof',
        documents: [
          createDocument('valid-address-proof', 'Valid address proof', 'Upload any current address proof with a readable address.')
        ]
      },
      {
        title: 'Income',
        documents: [
          createDocument('salary-slips-or-itr', 'Salary slips / IT returns', 'Upload salary slips for salaried applicants or ITRs for self-employed applicants.'),
          createDocument('bank-statements-3-6-months', 'Bank statements (3–6 months)', 'Upload recent bank statements showing repayment capacity.')
        ]
      },
      {
        title: 'Vehicle Documents',
        documents: [
          createDocument('dealer-proforma-invoice', 'Proforma invoice from dealer', 'Upload the dealer proforma invoice for the vehicle purchase.'),
          createDocument('used-vehicle-rc-book', 'RC book', 'For used vehicles, upload the registration certificate or RC book.', false, true),
          createDocument('used-vehicle-insurance', 'Insurance copy', 'For used vehicles, upload the existing insurance copy.', false, true),
          createDocument('used-vehicle-registration-certificate', 'Registration certificate', 'For used vehicles, upload the registration certificate.', false, true)
        ]
      }
    ]
  },
  'business-loan': {
    title: 'Business Loan',
    documentGroups: [
      {
        title: 'Identity',
        documents: [
          createDocument('aadhaar-card', 'Aadhaar Card', 'Upload the personal Aadhaar card with readable details.'),
          createDocument('pan-card-personal', 'PAN Card (personal)', 'Upload the personal PAN card.'),
          createDocument('pan-card-business', 'PAN Card (business)', 'Upload the business PAN card if separately issued.')
        ]
      },
      {
        title: 'Address Proof',
        documents: [
          createDocument('personal-address-proof', 'Personal address proof', 'Upload a personal address proof with readable address.'),
          createDocument('business-address-proof', 'Business address proof', 'Upload a business address proof such as GST certificate or utility bill.')
        ]
      },
      {
        title: 'Business Proof',
        documents: [
          createDocument('gst-registration', 'GST registration', 'Upload the GST registration certificate.'),
          createDocument('business-registration-certificate', 'Business registration certificate / Incorporation certificate', 'Upload the business registration or incorporation certificate.'),
          createDocument('moa-aoa', 'MOA/AOA (company)', 'For companies, upload the Memorandum and Articles of Association.', false, true),
          createDocument('partnership-deed', 'Partnership deed (firm)', 'For partnership firms, upload the partnership deed.', false, true)
        ]
      },
      {
        title: 'Financial Documents',
        documents: [
          createDocument('it-returns-3-years', 'IT returns (3 years)', 'Upload the last three years of ITR acknowledgements.'),
          createDocument('audited-balance-sheets', 'Audited balance sheets (3 years)', 'Upload audited balance sheets for the last three financial years.'),
          createDocument('profit-loss-statements', 'Profit & Loss statements', 'Upload profit and loss statements covering the required period.'),
          createDocument('bank-statements-12-months', 'Bank statements (12 months)', 'Upload the latest twelve months of bank statements.'),
          createDocument('existing-loan-details', 'Existing loan details', 'Upload details of all active business or personal loans.')
        ]
      },
      {
        title: 'Others',
        documents: [
          createDocument('trade-licence', 'Trade licence', 'Upload the current trade licence.', false, true),
          createDocument('msme-udyam-certificate', 'MSME/Udyam certificate', 'Upload the MSME or Udyam certificate if applicable.', false, true)
        ]
      }
    ]
  },
  'education-loan': {
    title: 'Education Loan',
    documentGroups: [
      {
        title: 'Identity',
        documents: [
          createDocument('aadhaar-card-student', 'Aadhaar Card (student)', 'Upload the student Aadhaar card.'),
          createDocument('aadhaar-card-coapplicant', 'Aadhaar Card (co-applicant)', 'Upload the co-applicant Aadhaar card.'),
          createDocument('pan-card-student', 'PAN Card (student)', 'Upload the student PAN card.'),
          createDocument('pan-card-coapplicant', 'PAN Card (co-applicant)', 'Upload the co-applicant PAN card.')
        ]
      },
      {
        title: 'Address Proof',
        documents: [
          createDocument('valid-address-proof', 'Valid proof', 'Upload a current address proof for either the student or co-applicant.')
        ]
      },
      {
        title: 'Academic Documents',
        documents: [
          createDocument('tenth-marksheet', '10th mark sheet', 'Upload the 10th standard marksheet.'),
          createDocument('twelfth-marksheet', '12th mark sheet', 'Upload the 12th standard marksheet.'),
          createDocument('last-qualifying-exam', 'Last qualifying exam marks', 'Upload the last qualifying exam marks or transcript.'),
          createDocument('admission-letter', 'Admission letter', 'Upload the official admission letter from the institution.'),
          createDocument('fee-structure', 'Fee structure', 'Upload the fee structure issued by the institution.')
        ]
      },
      {
        title: 'Income - Co-applicant',
        documents: [
          createDocument('salary-slips-or-itr', 'Salary slips / IT returns', 'Upload salary slips for salaried co-applicants or ITRs for self-employed co-applicants.'),
          createDocument('bank-statements-6-months', 'Bank statements (6 months)', 'Upload six months of bank statements for the co-applicant.')
        ]
      },
      {
        title: 'Others',
        documents: [
          createDocument('scholarship-letter', 'Scholarship letter', 'Upload the scholarship letter if one has been awarded.', false, true),
          createDocument('collateral-documents', 'Collateral documents', 'Upload collateral documents only if the loan amount is above ₹7.5 lakh.', false, true)
        ]
      }
    ]
  },
  'gold-loan': {
    title: 'Gold Loan',
    documentGroups: [
      {
        title: 'Identity',
        documents: [
          createDocument('aadhaar-card', 'Aadhaar Card', 'Upload a clear Aadhaar card copy.'),
          createDocument('pan-card', 'PAN Card', 'Upload the PAN card with visible details.')
        ]
      },
      {
        title: 'Address Proof',
        documents: [
          createDocument('valid-address-proof', 'Valid proof', 'Upload any recent and valid address proof.')
        ]
      },
      {
        title: 'Gold Documents',
        documents: [
          createDocument('gold-purity-certificate', 'Gold purity certificate', 'Upload the purity certificate issued by the jeweller or assay office.'),
          createDocument('purchase-receipt', 'Purchase receipt', 'Upload the original purchase receipt if available.', false, true),
          createDocument('jeweller-valuation-report', 'Jeweller valuation report', 'Upload the gold valuation report from the jeweller.')
        ]
      },
      {
        title: 'Others',
        documents: [
          createDocument('photograph', 'Photograph', 'Upload a recent passport-style photograph.')
        ]
      }
    ]
  },
  'mortgage-loan': {
    title: 'Mortgage / Loan Against Property',
    documentGroups: [
      {
        title: 'Identity',
        documents: [
          createDocument('aadhaar-card', 'Aadhaar Card', 'Upload a clear Aadhaar card copy.'),
          createDocument('pan-card', 'PAN Card', 'Upload the PAN card with photo and number visible.')
        ]
      },
      {
        title: 'Address Proof',
        documents: [
          createDocument('valid-address-proof', 'Valid proof', 'Upload a current address proof document.')
        ]
      },
      {
        title: 'Property',
        documents: [
          createDocument('title-deed', 'Title deed', 'Upload the property title deed.'),
          createDocument('encumbrance-certificate', 'Encumbrance certificate', 'Upload the latest encumbrance certificate.'),
          createDocument('property-tax-receipts', 'Property tax receipts', 'Upload the property tax receipts for the required period.'),
          createDocument('approved-building-plan', 'Approved building plan', 'Upload the approved building plan.'),
          createDocument('valuation-report', 'Valuation report', 'Upload the valuation report from an approved valuer.'),
          createDocument('property-noc', 'NOC', 'Upload the no-objection certificate issued by the relevant authority.')
        ]
      }
    ]
  },
  'agricultural-loan': {
    title: 'Agricultural Loan',
    documentGroups: [
      {
        title: 'Identity',
        documents: [
          createDocument('aadhaar-card', 'Aadhaar Card', 'Upload the Aadhaar card with readable details.'),
          createDocument('pan-card', 'PAN Card', 'Upload the PAN card.')
        ]
      },
      {
        title: 'Address Proof',
        documents: [
          createDocument('valid-address-proof', 'Valid proof', 'Upload a valid address proof document.')
        ]
      },
      {
        title: 'Land Documents',
        documents: [
          createDocument('land-ownership-proof', 'Land ownership proof / Patta', 'Upload the land ownership proof or patta.'),
          createDocument('khasra-khatauni', 'Khasra-Khatauni', 'Upload the Khasra-Khatauni record.'),
          createDocument('land-records', 'Land records', 'Upload the latest land records.'),
          createDocument('crop-details', 'Crop details', 'Upload crop details for the current or next season.')
        ]
      },
      {
        title: 'Others',
        documents: [
          createDocument('kisan-credit-card', 'Kisan Credit Card', 'Upload the Kisan Credit Card if available.', false, true),
          createDocument('bank-statements', 'Bank statements', 'Upload recent bank statements showing inflows and outflows.')
        ]
      }
    ]
  }
};

export function getLoanRule(loanType) {
  return loanRules[loanType] || null;
}

export function getDocumentCatalog(loanType, employmentType) {
  const rule = getLoanRule(loanType);
  if (!rule) {
    return [];
  }

  return rule.documentGroups
    .map((group) => {
      if ((loanType === 'home-loan' || loanType === 'personal-loan') && group.title === 'Income - Salaried' && employmentType !== 'salaried') {
        return null;
      }

      if ((loanType === 'home-loan' || loanType === 'personal-loan') && group.title === 'Income - Self-employed' && employmentType !== 'self-employed') {
        return null;
      }

      if (loanType === 'mortgage-loan' && group.title === 'Income') {
        return null;
      }

      return group;
    })
    .filter(Boolean);
}

export function flattenDocuments(catalog) {
  return catalog.flatMap((group) => group.documents);
}
