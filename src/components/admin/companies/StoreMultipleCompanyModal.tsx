'use client';

import { Fragment, useState, useRef, useCallback } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { 
  X, 
  Upload, 
  FileSpreadsheet, 
  Check, 
  AlertCircle, 
  Loader2, 
  Download,
  Trash2
} from 'lucide-react';
import {getCountryByIso3} from "@/lib/countries";

interface BulkUploadCompanyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

interface ParsedCompany {
  name: string;
  short_description?: string;
  long_description?: string;
  website_url?: string;
  logo_url?: string;
  location?: string;
  country?: string;
  // Metadata fields
  metadata_address?: string;
  metadata_industry?: string;
  metadata_phone?: string;
  metadata_email?: string;
  metadata_linkedin?: string;
  // Contact person fields
  contact_first_name?: string;
  contact_last_name?: string;
  contact_email?: string;
  contact_linkedin?: string;
  isValid: boolean;
  errors: string[];
}

interface UploadResult {
  success: number;
  failed: number;
  errors: { row: number; name: string; error: string }[];
}

type UploadStep = 'upload' | 'preview' | 'uploading' | 'complete';

export default function StoreMultipleCompanyModal({ isOpen, onClose, onSuccess }: BulkUploadCompanyModalProps) {
  const [step, setStep] = useState<UploadStep>('upload');
  const [parsedData, setParsedData] = useState<ParsedCompany[]>([]);
  const [fileName, setFileName] = useState<string>('');
  const [dragActive, setDragActive] = useState(false);
  const [uploadResult, setUploadResult] = useState<UploadResult | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const resetModal = useCallback(() => {
    setStep('upload');
    setParsedData([]);
    setFileName('');
    setUploadResult(null);
    setUploadProgress(0);
  }, []);

  const handleClose = () => {
    resetModal();
    onClose();
  };

  const handleDone = () => {
    handleClose();
    onSuccess();
  }

  const validateCompany = (company: Partial<ParsedCompany>): { isValid: boolean; errors: string[] } => {
    const errors: string[] = [];
    
    // Required fields
    if (!company.name || company.name.trim() === '') {
      errors.push('Company name is required');
    }

    if (!company.short_description || company.short_description.trim() === '') {
      errors.push('Short description is required');
    }

    if (!company.website_url || company.website_url.trim() === '') {
      errors.push('Website URL is required');
    }

    if (!company.location || company.location.trim() === '') {
      errors.push('Location is required');
    }

    if (!company.country || company.country.trim() === '') {
      errors.push('Country is required');
    }

    // URL validations
    if (company.website_url && company.website_url.trim() && !isValidUrl(company.website_url)) {
      errors.push('Invalid website URL');
    }

    if (company.logo_url && company.logo_url.trim() && !isValidUrl(company.logo_url)) {
      errors.push('Invalid logo URL');
    }

    if (company.metadata_linkedin && company.metadata_linkedin.trim() && !isValidUrl(company.metadata_linkedin)) {
      errors.push('Invalid company LinkedIn URL');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  };

  const isValidUrl = (string: string): boolean => {
    try {
      new URL(string);
      return true;
    } catch {
      return false;
    }
  };

  const isValidEmail = (email: string): boolean => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const parseCSV = (text: string): ParsedCompany[] => {
    const lines = text.split('\n').filter(line => line.trim());
    if (lines.length < 2) return [];

    // Parse header - normalize by converting to lowercase and trimming
    const csvHeaders = lines[0].split(',').map(h => h.trim().toLowerCase().replace(/["']/g, ''));
    
    // Map CSV headers to ParsedCompany fields
    // Handles both exact matches and dot notation (metadata.industry -> metadata_industry)
    const headerMap: Record<string, keyof ParsedCompany> = {
      'name': 'name',
      'short_description': 'short_description',
      'long_description': 'long_description',
      'website_url': 'website_url',
      'logo_url': 'logo_url',
      'location': 'location',
      'country': 'country',
      // Metadata fields (with dot notation)
      'metadata.address': 'metadata_address',
      'metadata.industry': 'metadata_industry',
      'metadata.email': 'metadata_email',
      'metadata.phone': 'metadata_phone',
      'metadata.linkedin': 'metadata_linkedin',
      // Contact person fields (with dot notation)
      'contact.first_name': 'contact_first_name',
      'contact.last_name': 'contact_last_name',
      'contact.email': 'contact_email',
      'contact.linkedin': 'contact_linkedin',
    };

    // Parse data rows
    const companies: ParsedCompany[] = [];
    
    for (let i = 1; i < lines.length; i++) {
      const values = parseCSVLine(lines[i]);
      
      if (values.length === 0 || values.every(v => !v.trim())) continue;

      const company: Partial<ParsedCompany> = {};
      
      csvHeaders.forEach((header, index) => {
        const field = headerMap[header];
        if (field && values[index] !== undefined) {
          const value = values[index].trim();
          if (value) {
            (company as any)[field] = value;
          }
        }
      });

      const validation = validateCompany(company);
      
      companies.push({
        name: company.name || '',
        short_description: company.short_description,
        long_description: company.long_description,
        website_url: company.website_url,
        logo_url: company.logo_url,
        location: company.location,
        country: company.country,
        metadata_address: company.metadata_address,
        metadata_industry: company.metadata_industry,
        metadata_email: company.metadata_email,
        metadata_phone: company.metadata_phone,
        metadata_linkedin: company.metadata_linkedin,
        contact_first_name: company.contact_first_name,
        contact_last_name: company.contact_last_name,
        contact_email: company.contact_email,
        contact_linkedin: company.contact_linkedin,
        isValid: validation.isValid,
        errors: validation.errors,
      });
    }

    return companies;
  };

  const parseCSVLine = (line: string): string[] => {
    const result: string[] = [];
    let current = '';
    let inQuotes = false;
    
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        result.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }
    
    result.push(current.trim());
    return result;
  };

  const handleFile = async (file: File) => {
    if (!file.name.endsWith('.csv')) {
      alert('Please upload a CSV file');
      return;
    }

    setFileName(file.name);
    
    const text = await file.text();
    const parsed = parseCSV(text);
    
    if (parsed.length === 0) {
      alert('No valid data found in the CSV file');
      return;
    }

    setParsedData(parsed);
    setStep('preview');
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const removeCompany = (index: number) => {
    setParsedData(prev => prev.filter((_, i) => i !== index));
  };

  const handleUpload = async () => {
    const validCompanies = parsedData.filter(c => c.isValid);
    
    if (validCompanies.length === 0) {
      alert('No valid companies to upload');
      return;
    }

    setStep('uploading');
    setUploadProgress(0);

    const result: UploadResult = {
      success: 0,
      failed: 0,
      errors: [],
    };

    // Upload companies in batches
    const batchSize = 10;
    const batches = [];
    
    for (let i = 0; i < validCompanies.length; i += batchSize) {
      batches.push(validCompanies.slice(i, i + batchSize));
    }

    for (let batchIndex = 0; batchIndex < batches.length; batchIndex++) {
      const batch = batches[batchIndex];
      
      try {
        const response = await fetch('/api/companies/bulk', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            companies: batch.map(c => ({
              name: c.name,
              short_description: c.short_description,
              long_description: c.long_description || null,
              website_url: c.website_url,
              logo_url: c.logo_url || null,
              location: c.location || null,
              country: c.country,
              metadata: {
                address: c.metadata_address || null,
                industry: c.metadata_industry || null,
                phone: c.metadata_phone || null,
                email: c.metadata_email || null,
                linkedin: c.metadata_linkedin || null,
              },
              contact: {
                first_name: c.contact_first_name || null,
                last_name: c.contact_last_name || null,
                email: c.contact_email || null,
                linkedin: c.contact_linkedin || null,
              },
            })),
          }),
        });

        const data = await response.json();

        if (data.success) {
          result.success += data.created || batch.length;
          if (data.errors) {
            result.failed += data.errors.length;
            result.errors.push(...data.errors);
          }
        } else {
          result.failed += batch.length;
          batch.forEach((company, idx) => {
            result.errors.push({
              row: batchIndex * batchSize + idx + 1,
              name: company.name,
              error: data.error || 'Unknown error',
            });
          });
        }
      } catch (error) {
        result.failed += batch.length;
        batch.forEach((company, idx) => {
          result.errors.push({
            row: batchIndex * batchSize + idx + 1,
            name: company.name,
            error: 'Network error',
          });
        });
      }

      setUploadProgress(Math.round(((batchIndex + 1) / batches.length) * 100));
    }


    setUploadResult(result);
    setStep('complete');
  };

  const headersRequired = ['name', 'short_description', 'website_url', 'location', 'country'];
  const headers = ['name', 'short_description', 'long_description', 'website_url', 'logo_url', 'location', 'country', 'metadata.address', 'metadata.industry', 'metadata.email', 'metadata.phone', 'metadata.linkedin', 'contact.first_name', 'contact.last_name', 'contact.email', 'contact.linkedin'];
  const downloadTemplate = () => {
    const sampleRow = ['Acme Corp', 'A technology company', 'A long description ',  'https://acme.com', 'https://acme.com/logo.png', 'New York', 'USA', 'Technology', 'hello@acme.com', '+123456789', 'https://linkedin.com/company/acme', 'John', 'Doe', 'john@doe.com', 'www.linkedin.com/in/johndoe'];

    const csvContent = [headers.join(','), sampleRow.join(',')].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'companies_template.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const validCount = parsedData.filter(c => c.isValid).length;
  const invalidCount = parsedData.filter(c => !c.isValid).length;

  const isUploading = step === 'uploading';

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={() => {}}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-4xl transform overflow-hidden rounded-2xl bg-white shadow-2xl transition-all">
                {/* Header */}
                <div className="relative bg-gradient-to-br from-slate-800 to-slate-900 px-6 py-6 text-white">
                  <button
                    onClick={handleClose}
                    disabled={isUploading}
                    className="absolute right-4 top-4 p-2 text-white/70 hover:text-white rounded-full hover:bg-white/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-white/70"
                  >
                    <X className="h-5 w-5" />
                  </button>

                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                      <FileSpreadsheet className="h-5 w-5 text-white" />
                    </div>
                  </div>

                  <Dialog.Title as="h3" className="text-xl font-bold">
                    Bulk Upload Companies
                  </Dialog.Title>
                  <p className="mt-1 text-white/70 text-sm">
                    Upload a CSV file to add multiple companies at once
                  </p>
                </div>

                {/* Content */}
                <div className="p-6">
                  {/* Step: Upload */}
                  {step === 'upload' && (
                    <div className="space-y-6">
                      {/* Download Template */}
                      <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                        <div>
                          <h4 className="text-sm font-medium text-slate-900">Download CSV Template</h4>
                          <p className="text-xs text-slate-500 mt-1">
                            Use this template to ensure your data is formatted correctly
                          </p>
                        </div>
                        <button
                          onClick={downloadTemplate}
                          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-emerald-700 bg-emerald-100 rounded-lg hover:bg-emerald-200 transition-colors"
                        >
                          <Download className="h-4 w-4" />
                          Download
                        </button>
                      </div>

                      {/* Drop Zone */}
                      <div
                        onDragEnter={handleDrag}
                        onDragLeave={handleDrag}
                        onDragOver={handleDrag}
                        onDrop={handleDrop}
                        onClick={() => fileInputRef.current?.click()}
                        className={`
                          border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-colors
                          ${dragActive 
                            ? 'border-emerald-500 bg-emerald-50' 
                            : 'border-slate-300 hover:border-emerald-400 hover:bg-slate-50'
                          }
                        `}
                      >
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept=".csv"
                          onChange={handleFileInput}
                          className="hidden"
                        />
                        <Upload className={`h-12 w-12 mx-auto mb-4 ${dragActive ? 'text-emerald-500' : 'text-slate-400'}`} />
                        <p className="text-lg font-medium text-slate-700">
                          {dragActive ? 'Drop your CSV file here' : 'Drag and drop your CSV file'}
                        </p>
                        <p className="text-sm text-slate-500 mt-2">
                          or click to browse from your computer
                        </p>
                      </div>

                      {/* Expected Format */}
                      <div className="bg-slate-50 rounded-xl p-4">
                        <h4 className="text-sm font-medium text-slate-900 mb-3">Expected CSV Columns</h4>
                        <div className="flex flex-wrap gap-2">
                          {headers.map(col => (
                            <span
                              key={col}
                              className={`px-2 py-1 text-xs rounded-md ${
                                headersRequired.includes(col) 
                                  ? 'bg-red-100 text-red-700' 
                                  : 'bg-slate-200 text-slate-700'
                              }`}
                            >
                              {col}
                            </span>
                          ))}
                        </div>
                        <p className="text-xs text-slate-500 mt-4">* Required fields in red (other fields can be empty)</p>
                        <div className="mt-2 text-xs text-slate-600 space-y-1">
                          <p><strong>- website_url:</strong> should include full http url</p>
                          <p><strong>- location:</strong> should contain city/region within the country</p>
                          <p><strong>- country:</strong> provide the iso3 value</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Step: Preview */}
                  {step === 'preview' && (
                    <div className="space-y-4">
                      {/* Summary */}
                      <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-2">
                            <FileSpreadsheet className="h-5 w-5 text-slate-500" />
                            <span className="text-sm font-medium text-slate-700">{fileName}</span>
                          </div>
                          <div className="h-4 w-px bg-slate-300" />
                          <span className="text-sm text-slate-600">{parsedData.length} companies</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="flex items-center gap-1.5 text-sm">
                            <Check className="h-4 w-4 text-emerald-500" />
                            <span className="text-emerald-700 font-medium">{validCount} valid</span>
                          </span>
                          {invalidCount > 0 && (
                            <span className="flex items-center gap-1.5 text-sm">
                              <AlertCircle className="h-4 w-4 text-red-500" />
                              <span className="text-red-700 font-medium">{invalidCount} invalid</span>
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Data Table */}
                      <div className="border border-slate-200 rounded-xl overflow-hidden">
                        <div className="max-h-96 overflow-auto">
                          <table className="w-full text-sm">
                            <thead className="bg-slate-50 sticky top-0">
                              <tr>
                                <th className="px-4 py-3 text-left font-medium text-slate-700">Status</th>
                                <th className="px-4 py-3 text-left font-medium text-slate-700">Name</th>
                                <th className="px-4 py-3 text-left font-medium text-slate-700">Location</th>
                                <th className="px-4 py-3 text-left font-medium text-slate-700">Website</th>
                                <th className="px-4 py-3 text-left font-medium text-slate-700">Short Description</th>
                                <th className="px-4 py-3 text-left font-medium text-slate-700">LinkedIn</th>
                                <th className="px-4 py-3 text-left font-medium text-slate-700">Actions</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                              {parsedData.map((company, index) => (
                                <tr key={index} className={company.isValid ? 'align-top' : 'bg-red-50'}>
                                  <td className="px-4 py-3">
                                    {company.isValid ? (
                                      <span className="flex items-center justify-center w-6 h-6 bg-emerald-100 rounded-full">
                                        <Check className="h-3.5 w-3.5 text-emerald-600" />
                                      </span>
                                    ) : (
                                      <div className="relative group">
                                        <span className="flex items-center justify-center w-6 h-6 bg-red-100 rounded-full cursor-help">
                                          <AlertCircle className="h-3.5 w-3.5 text-red-600" />
                                        </span>
                                        <div className="absolute left-full top-1/2 -translate-y-1/2 ml-2 z-50 hidden group-hover:block">
                                          <div className="bg-slate-900 text-white text-xs rounded-lg py-2 px-3 whitespace-nowrap shadow-lg">
                                            <div className="font-medium mb-1">Validation Errors:</div>
                                            <ul className="space-y-0.5">
                                              {company.errors.map((error, i) => (
                                                <li key={i} className="flex items-start gap-1.5">
                                                  <span className="text-red-400 mt-0.5">•</span>
                                                  <span>{error}</span>
                                                </li>
                                              ))}
                                            </ul>
                                            <div className="absolute right-full top-1/2 -translate-y-1/2 border-8 border-transparent border-r-slate-900" />
                                          </div>
                                        </div>
                                      </div>
                                    )}
                                  </td>
                                  <td className="px-4 py-3 font-medium text-slate-900">
                                    {company.name || <span className="text-red-500 italic">Invalid</span>}
                                  </td>
                                  <td className="px-4 py-3  min-w-[200px]">
                                    <p className="text-gray-900 font-medium">{company.country ? getCountryByIso3(company.country)?.name : <span className="text-red-500 italic">Invalid</span>}</p>
                                  </td>
                                  <td className="px-4 py-3 text-slate-600 max-w-[200px] truncate">{company.website_url || <span className="text-red-500 italic">Invalid</span>}</td>
                                  <td className="px-4 py-3 text-slate-600 max-w-[200px] truncate">{company.short_description || <span className="text-red-500 italic">Invalid</span>}</td>
                                  <td className="px-4 py-3 text-slate-600 max-w-[200px] truncate">{company.metadata_linkedin || <span className="text-red-500 italic">Invalid</span>}</td>
                                  <td className="px-4 py-3">
                                    <button
                                      onClick={() => removeCompany(index)}
                                      className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors"
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </button>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>

                      {/* Error Details */}
                      {invalidCount > 0 && (
                        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                          <h4 className="text-sm font-medium text-red-800 mb-2">
                            {invalidCount} companies have errors and will be skipped
                          </h4>
                          <p className="text-xs text-red-600">
                            Hover over the error icon to see details, or remove invalid entries before uploading.
                          </p>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Step: Uploading */}
                  {step === 'uploading' && (
                    <div className="py-12 text-center">
                      <Loader2 className="h-12 w-12 animate-spin text-emerald-500 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-slate-900 mb-2">
                        Uploading Companies...
                      </h3>
                      <p className="text-sm text-slate-500 mb-6">
                        Please wait while we add your companies
                      </p>
                      <div className="w-64 mx-auto bg-slate-200 rounded-full h-2">
                        <div 
                          className="bg-emerald-500 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${uploadProgress}%` }}
                        />
                      </div>
                      <p className="text-sm text-slate-600 mt-2">{uploadProgress}%</p>
                    </div>
                  )}

                  {/* Step: Complete */}
                  {step === 'complete' && uploadResult && (
                    <div className="py-8">
                      <div className="text-center mb-6">
                        {uploadResult.success > 0 ? (
                          <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Check className="h-8 w-8 text-emerald-600" />
                          </div>
                        ) : (
                          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <AlertCircle className="h-8 w-8 text-red-600" />
                          </div>
                        )}
                        <h3 className="text-lg font-semibold text-slate-900 mb-2">
                          Upload Complete
                        </h3>
                      </div>

                      {/* Results Summary */}
                      <div className="grid grid-cols-2 gap-4 mb-6">
                        <div className="bg-emerald-50 rounded-xl p-4 text-center">
                          <p className="text-3xl font-bold text-emerald-600">{uploadResult.success}</p>
                          <p className="text-sm text-emerald-700">Successfully Added</p>
                        </div>
                        <div className="bg-red-50 rounded-xl p-4 text-center">
                          <p className="text-3xl font-bold text-red-600">{uploadResult.failed}</p>
                          <p className="text-sm text-red-700">Failed</p>
                        </div>
                      </div>

                      {/* Error Details */}
                      {uploadResult.errors.length > 0 && (
                        <div className="bg-slate-50 rounded-xl p-4">
                          <h4 className="text-sm font-medium text-slate-900 mb-3">Error Details</h4>
                          <div className="max-h-40 overflow-auto space-y-2">
                            {uploadResult.errors.map((error, index) => (
                              <div key={index} className="flex items-start gap-2 text-sm">
                                <AlertCircle className="h-4 w-4 text-red-500 flex-shrink-0 mt-0.5" />
                                <span className="text-slate-600">
                                  <strong>{error.name}</strong>: {error.error}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Footer */}
                <div className="border-t border-slate-200 px-6 py-4 bg-slate-50 flex justify-between">
                  {step === 'upload' && (
                    <>
                      <div />
                      <button
                        onClick={handleClose}
                        className="px-5 py-2.5 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-xl hover:bg-slate-50 transition-colors"
                      >
                        Cancel
                      </button>
                    </>
                  )}

                  {step === 'preview' && (
                    <>
                      <button
                        onClick={() => setStep('upload')}
                        className="px-5 py-2.5 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-xl hover:bg-slate-50 transition-colors"
                      >
                        Back
                      </button>
                      <div className="flex gap-3">
                        <button
                          onClick={handleClose}
                          className="px-5 py-2.5 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-xl hover:bg-slate-50 transition-colors"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={handleUpload}
                          disabled={validCount === 0}
                          className="px-5 py-2.5 text-sm font-medium text-white bg-emerald-600 rounded-xl hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                        >
                          <Upload className="h-4 w-4" />
                          Upload {validCount} Companies
                        </button>
                      </div>
                    </>
                  )}

                  {step === 'uploading' && (
                    <>
                      <div />
                      <div className="text-sm text-slate-500">Please do not close this window</div>
                    </>
                  )}

                  {step === 'complete' && (
                    <>
                      <button
                        onClick={resetModal}
                        className="px-5 py-2.5 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-xl hover:bg-slate-50 transition-colors"
                      >
                        Upload More
                      </button>
                      <button
                        onClick={handleDone}
                        className="px-5 py-2.5 text-sm font-medium text-white bg-emerald-600 rounded-xl hover:bg-emerald-700 transition-colors"
                      >
                        Done
                      </button>
                    </>
                  )}
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
