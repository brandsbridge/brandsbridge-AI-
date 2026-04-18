import React, { useState, useEffect } from 'react';
import { Contract, ContractParty } from '../../contexts/ContractContext';

interface DigitalContractProps {
  contract: Contract;
  currentPartyId: string;
  onFieldChange?: (field: string, oldValue: string, newValue: string) => void;
  onSignatureReset?: () => void;
}

// Extended contract data for the demo
interface ExtendedContract extends Contract {
  supplierAddress?: string;
  supplierTaxId?: string;
  buyerCR?: string;
  logisticsLicense?: string;
  hsCode?: string;
  containerType?: string;
  loadingPort?: string;
  dischargePort?: string;
  transitTime?: string;
  freightRate?: string;
  temperature?: string;
  certifications?: string[];
  inspection?: string;
  specialConditions?: string;
}

export const DigitalContract: React.FC<DigitalContractProps> = ({
  contract,
  currentPartyId,
  onFieldChange,
  onSignatureReset
}) => {
  const currentParty = contract.parties.find(p => p.id === currentPartyId);

  // Cast to extended contract for demo data
  const extContract = contract as ExtendedContract;

  // Live edit state
  const [editingField, setEditingField] = useState<string | null>(null);
  const [editValue, setEditValue] = useState<string>('');
  const [showResetWarning, setShowResetWarning] = useState(false);

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency
    }).format(amount);
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleFieldFocus = (field: string, currentValue: string) => {
    setEditingField(field);
    setEditValue(currentValue);
  };

  const handleFieldBlur = (field: string, oldValue: string) => {
    if (editValue !== oldValue && editValue.trim()) {
      // Check if all parties have signed - if so, show warning
      const allSigned = contract.parties.every(p => p.signed);
      if (allSigned) {
        setShowResetWarning(true);
        onSignatureReset?.();
      }
      onFieldChange?.(field, oldValue, editValue);
    }
    setEditingField(null);
  };

  const incoterms = ['EXW', 'FCA', 'CPT', 'CIP', 'DAP', 'DPU', 'DDP', 'FOB', 'CFR', 'CIF', 'FAS'];
  const containers = ['20ft Standard', '20ft Refrigerated', '40ft Standard', '40ft HC', '40ft Refrigerated', '40ft Open Top'];
  const certifications = ['Halal', 'ISO 22000', 'HACCP', 'Organic', 'Fair Trade', 'Kosher', 'GMP'];
  const inspectors = ['SGS', 'Bureau Veritas', 'Intertek', 'Cotecna', 'ALS'];

  return (
    <div className="bg-[#F8FAFC] rounded-xl h-full overflow-hidden flex flex-col shadow-2xl">
      {/* Document Header */}
      <div className="bg-gradient-to-r from-[#1a365d] to-[#2c5282] text-white px-8 py-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-serif font-bold tracking-wide">
              INTERNATIONAL TRADE CONTRACT
            </h1>
            <p className="text-blue-200 mt-1 text-sm">
              Contract No: {contract.id.toUpperCase()} | Brands Bridge AI Platform
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs text-blue-200">Contract Value</p>
            <p className="text-3xl font-bold text-white">
              {formatCurrency(contract.totalValue, contract.currency)}
            </p>
          </div>
        </div>
      </div>

      {/* Live Edit Indicator */}
      {editingField && (
        <div className="bg-amber-50 border-b border-amber-200 px-8 py-2 flex items-center gap-2">
          <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse" />
          <span className="text-amber-700 text-sm font-medium">
            {currentParty?.name} is editing this field...
          </span>
        </div>
      )}

      {/* Signature Reset Warning */}
      {showResetWarning && (
        <div className="bg-red-50 border-b border-red-200 px-8 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
              <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div>
              <p className="text-red-700 font-medium">Contract Modified - Signatures Required</p>
              <p className="text-red-600 text-sm">All parties must re-sign this contract.</p>
            </div>
          </div>
          <button
            onClick={() => setShowResetWarning(false)}
            className="px-4 py-1.5 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm"
          >
            Acknowledge
          </button>
        </div>
      )}

      {/* Document Content */}
      <div className="flex-1 overflow-y-auto p-8 font-serif text-gray-800">
        {/* PARTIES SECTION */}
        <section className="mb-8">
          <h2 className="text-lg font-bold text-[#1a365d] border-b-2 border-[#D4AF37] pb-2 mb-6 flex items-center gap-2">
            <span className="text-[#D4AF37]">═══</span>
            PARTIES
            <span className="text-[#D4AF37]">═══</span>
          </h2>

          <div className="grid grid-cols-3 gap-8">
            {/* First Party - Supplier */}
            <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center gap-2 mb-3">
                <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-bold rounded">FIRST PARTY</span>
                <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">SUPPLIER</span>
              </div>
              <h3 className="font-bold text-lg mb-2">OZMO Confectionery Industries</h3>
              <div className="space-y-1 text-sm">
                <p><span className="text-gray-500">Address:</span> Istanbul, Turkey</p>
                <p><span className="text-gray-500">Tax ID:</span> TR-1234567890</p>
                <p><span className="text-gray-500">Representative:</span> Mehmet Yilmaz</p>
                <p><span className="text-gray-500">Email:</span> mehmet@ozmo.com.tr</p>
              </div>
            </div>

            {/* Second Party - Buyer */}
            <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center gap-2 mb-3">
                <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-bold rounded">SECOND PARTY</span>
                <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded">BUYER</span>
              </div>
              <h3 className="font-bold text-lg mb-2">Al Meera Consumer Goods Co.</h3>
              <div className="space-y-1 text-sm">
                <p><span className="text-gray-500">Address:</span> Doha, Qatar</p>
                <p><span className="text-gray-500">CR:</span> 12345</p>
                <p><span className="text-gray-500">Representative:</span> Ahmed Al Rashid</p>
                <p><span className="text-gray-500">Email:</span> a.rashid@almeera.com.qa</p>
              </div>
            </div>

            {/* Third Party - Logistics */}
            <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center gap-2 mb-3">
                <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-bold rounded">THIRD PARTY</span>
                <span className="px-2 py-1 bg-orange-100 text-orange-800 text-xs rounded">LOGISTICS</span>
              </div>
              <h3 className="font-bold text-lg mb-2">Gulf Global Logistics</h3>
              <div className="space-y-1 text-sm">
                <p><span className="text-gray-500">Address:</span> Dubai, UAE</p>
                <p><span className="text-gray-500">License:</span> TR-98765</p>
                <p><span className="text-gray-500">Representative:</span> Sarah Khan</p>
                <p><span className="text-gray-500">Email:</span> sarah@gulfglobal.ae</p>
              </div>
            </div>
          </div>
        </section>

        {/* PRODUCT DETAILS */}
        <section className="mb-8">
          <h2 className="text-lg font-bold text-[#1a365d] border-b-2 border-[#D4AF37] pb-2 mb-6 flex items-center gap-2">
            <span className="text-[#D4AF37]">═══</span>
            PRODUCT DETAILS
            <span className="text-[#D4AF37]">═══</span>
          </h2>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="grid grid-cols-2 gap-x-8 gap-y-4">
              <div>
                <label className="text-xs text-gray-500 uppercase tracking-wide">Product</label>
                <p className="font-semibold text-lg">Premium Chocolate Wafers 750g</p>
              </div>
              <div>
                <label className="text-xs text-gray-500 uppercase tracking-wide">HS Code</label>
                <p className="font-semibold">1905.32</p>
              </div>
              <div>
                <label className="text-xs text-gray-500 uppercase tracking-wide">Quantity</label>
                <p className="font-semibold">1,000 cases (12,000 units)</p>
              </div>
              <div>
                <label className="text-xs text-gray-500 uppercase tracking-wide">Unit Price</label>
                <p className="font-semibold">$2.80 per case</p>
              </div>
              <div className="col-span-2 border-t pt-4 mt-2">
                <label className="text-xs text-gray-500 uppercase tracking-wide">Total Value</label>
                <p className="font-bold text-2xl text-[#1a365d]">
                  $186,000 USD
                  <span className="text-sm font-normal text-gray-500 ml-2">
                    ($2,800 product + $183,200 logistics)
                  </span>
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* COMMERCIAL TERMS */}
        <section className="mb-8">
          <h2 className="text-lg font-bold text-[#1a365d] border-b-2 border-[#D4AF37] pb-2 mb-6 flex items-center gap-2">
            <span className="text-[#D4AF37]">═══</span>
            COMMERCIAL TERMS
            <span className="text-[#D4AF37]">═══</span>
          </h2>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="grid grid-cols-2 gap-6">
              {/* Incoterms - Editable */}
              <div>
                <label className="text-xs text-gray-500 uppercase tracking-wide flex items-center gap-1">
                  Incoterms 2020
                  <svg className="w-3 h-3 text-[#D4AF37]" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                  </svg>
                </label>
                <select
                  value={editingField === 'incoterm' ? editValue : extContract.incoterm || contract.incoterm}
                  onFocus={() => handleFieldFocus('incoterm', contract.incoterm)}
                  onChange={(e) => setEditValue(e.target.value)}
                  onBlur={() => handleFieldBlur('incoterm', contract.incoterm)}
                  className="w-full mt-1 p-2 border border-gray-300 rounded-lg font-semibold focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent"
                >
                  {incoterms.map(term => (
                    <option key={term} value={term}>{term}</option>
                  ))}
                </select>
              </div>

              {/* Currency */}
              <div>
                <label className="text-xs text-gray-500 uppercase tracking-wide">Currency</label>
                <p className="font-semibold mt-2">USD - US Dollar</p>
              </div>

              {/* Payment Terms - Editable */}
              <div className="col-span-2">
                <label className="text-xs text-gray-500 uppercase tracking-wide flex items-center gap-1">
                  Payment Terms
                  <svg className="w-3 h-3 text-[#D4AF37]" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                  </svg>
                </label>
                <textarea
                  value={editingField === 'paymentTerms' ? editValue : contract.paymentTerms}
                  onFocus={() => handleFieldFocus('paymentTerms', contract.paymentTerms)}
                  onChange={(e) => setEditValue(e.target.value)}
                  onBlur={() => handleFieldBlur('paymentTerms', contract.paymentTerms)}
                  className="w-full mt-1 p-2 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent"
                  rows={2}
                />
              </div>

              {/* Lead Time - Editable */}
              <div>
                <label className="text-xs text-gray-500 uppercase tracking-wide flex items-center gap-1">
                  Lead Time (Days)
                  <svg className="w-3 h-3 text-[#D4AF37]" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                  </svg>
                </label>
                <input
                  type="number"
                  value={editingField === 'leadTime' ? editValue : '14'}
                  onFocus={() => handleFieldFocus('leadTime', '14')}
                  onChange={(e) => setEditValue(e.target.value)}
                  onBlur={() => handleFieldBlur('leadTime', '14')}
                  className="w-full mt-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent"
                />
              </div>
            </div>
          </div>
        </section>

        {/* LOGISTICS TERMS */}
        <section className="mb-8">
          <h2 className="text-lg font-bold text-[#1a365d] border-b-2 border-[#D4AF37] pb-2 mb-6 flex items-center gap-2">
            <span className="text-[#D4AF37]">═══</span>
            LOGISTICS TERMS
            <span className="text-[#D4AF37]">═══</span>
          </h2>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="grid grid-cols-3 gap-6">
              {/* Container Type - Editable */}
              <div>
                <label className="text-xs text-gray-500 uppercase tracking-wide flex items-center gap-1">
                  Container Type
                  <svg className="w-3 h-3 text-[#D4AF37]" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                  </svg>
                </label>
                <select
                  value={editingField === 'container' ? editValue : (extContract.containerType || '40ft HC')}
                  onFocus={() => handleFieldFocus('container', '40ft HC')}
                  onChange={(e) => setEditValue(e.target.value)}
                  onBlur={() => handleFieldBlur('container', '40ft HC')}
                  className="w-full mt-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent"
                >
                  {containers.map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              {/* Loading Port */}
              <div>
                <label className="text-xs text-gray-500 uppercase tracking-wide">Loading Port</label>
                <p className="font-semibold mt-2">Mersin, Turkey</p>
              </div>

              {/* Discharge Port */}
              <div>
                <label className="text-xs text-gray-500 uppercase tracking-wide">Discharge Port</label>
                <p className="font-semibold mt-2">Hamad Port, Qatar</p>
              </div>

              {/* Transit Time */}
              <div>
                <label className="text-xs text-gray-500 uppercase tracking-wide">Transit Time</label>
                <p className="font-semibold mt-2">14 days</p>
              </div>

              {/* Freight Rate */}
              <div>
                <label className="text-xs text-gray-500 uppercase tracking-wide">Freight Rate</label>
                <p className="font-semibold text-lg mt-2">$2,200</p>
              </div>

              {/* Temperature */}
              <div>
                <label className="text-xs text-gray-500 uppercase tracking-wide">Temperature</label>
                <p className="font-semibold mt-2">Ambient (15-25°C)</p>
              </div>
            </div>
          </div>
        </section>

        {/* QUALITY STANDARDS */}
        <section className="mb-8">
          <h2 className="text-lg font-bold text-[#1a365d] border-b-2 border-[#D4AF37] pb-2 mb-6 flex items-center gap-2">
            <span className="text-[#D4AF37]">═══</span>
            QUALITY STANDARDS
            <span className="text-[#D4AF37]">═══</span>
          </h2>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="mb-4">
              <label className="text-xs text-gray-500 uppercase tracking-wide">Required Certifications</label>
              <div className="flex flex-wrap gap-3 mt-3">
                {['Halal', 'ISO 22000', 'HACCP'].map(cert => (
                  <label key={cert} className="flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-lg border cursor-pointer hover:bg-gray-100">
                    <input type="checkbox" checked readOnly className="w-4 h-4 text-green-600" />
                    <span className="font-medium">{cert}</span>
                    {cert === 'Halal' && (
                      <span className="text-xs text-red-500 font-semibold">(Mandatory)</span>
                    )}
                  </label>
                ))}
              </div>
            </div>

            {/* Inspection - Editable */}
            <div>
              <label className="text-xs text-gray-500 uppercase tracking-wide flex items-center gap-1">
                Pre-shipment Inspection
                <svg className="w-3 h-3 text-[#D4AF37]" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                </svg>
              </label>
              <select
                value={editingField === 'inspection' ? editValue : 'SGS'}
                onFocus={() => handleFieldFocus('inspection', 'SGS')}
                onChange={(e) => setEditValue(e.target.value)}
                onBlur={() => handleFieldBlur('inspection', 'SGS')}
                className="w-full mt-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent"
              >
                {inspectors.map(ins => (
                  <option key={ins} value={ins}>{ins}</option>
                ))}
              </select>
            </div>
          </div>
        </section>

        {/* SPECIAL CONDITIONS */}
        <section className="mb-8">
          <h2 className="text-lg font-bold text-[#1a365d] border-b-2 border-[#D4AF37] pb-2 mb-6 flex items-center gap-2">
            <span className="text-[#D4AF37]">═══</span>
            SPECIAL CONDITIONS
            <span className="text-[#D4AF37]">═══</span>
          </h2>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <label className="text-xs text-gray-500 uppercase tracking-wide flex items-center gap-1">
              Additional Terms & Conditions
              <svg className="w-3 h-3 text-[#D4AF37]" fill="currentColor" viewBox="0 0 20 20">
                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
              </svg>
            </label>
            <textarea
              value={editingField === 'specialConditions' ? editValue : (extContract.specialConditions || 'Standard terms and conditions apply as per Brands Bridge AI Platform agreement.')}
              onFocus={() => handleFieldFocus('specialConditions', 'Standard terms and conditions apply as per Brands Bridge AI Platform agreement.')}
              onChange={(e) => setEditValue(e.target.value)}
              onBlur={() => handleFieldBlur('specialConditions', 'Standard terms and conditions apply as per Brands Bridge AI Platform agreement.')}
              className="w-full mt-1 p-2 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent"
              rows={4}
              placeholder="Enter any additional terms..."
            />
          </div>
        </section>

        {/* Contract Footer */}
        <div className="mt-8 pt-6 border-t-2 border-gray-300 text-center text-sm text-gray-500">
          <p>This contract is generated and managed on the Brands Bridge AI Platform</p>
          <p className="mt-1">Digital signatures required from all parties for execution</p>
        </div>
      </div>
    </div>
  );
};
