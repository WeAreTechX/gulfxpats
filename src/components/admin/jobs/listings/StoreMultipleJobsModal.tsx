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

interface StoreMultipleJobsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

interface ParsedJob {
  title: string;
  description?: string;
  company_name?: string;
  type_code?: string;
  industry_code?: string;
  location?: string;
  country_code?: string;
  salary_min?: string;
  salary_max?: string;
  salary_frequency?: string;
  currency_code?: string;
  apply_url?: string;
  isValid: boolean;
  errors: string[];
}

interface UploadResult {
  success: number;
  failed: number;
  errors: { row: number; title: string; error: string }[];
}

type UploadStep = 'upload' | 'preview' | 'uploading' | 'complete';

export default function StoreMultipleJobsModal({ isOpen, onClose, onSuccess }: StoreMultipleJobsModalProps) {
  const [step, setStep] = useState<UploadStep>('upload');
  const [parsedData, setParsedData] = useState<ParsedJob[]>([]);
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
  };

  const validateJob = (job: Partial<ParsedJob>): { isValid: boolean; errors: string[] } => {
    const errors: string[] = [];
    
    // Required fields
    if (!job.title || job.title.trim() === '') {
      errors.push('Job title is required');
    }

    if (!job.description || job.description.trim() === '') {
      errors.push('Description is required');
    }

    if (!job.company_name || job.company_name.trim() === '') {
      errors.push('Company name is required');
    }

    if (!job.type_code || job.type_code.trim() === '') {
      errors.push('Job type is required');
    }

    if (!job.industry_code || job.industry_code.trim() === '') {
      errors.push('Industry is required');
    }

    if (!job.location || job.location.trim() === '') {
      errors.push('Location is required');
    }

    if (!job.country_code || job.country_code.trim() === '') {
      errors.push('Country is required');
    }

    if (!job.currency_code || job.currency_code.trim() === '') {
      errors.push('Currency is required');
    }

    if (!job.apply_url || job.apply_url.trim() === '') {
      errors.push('Apply URL is required');
    }

    // URL validation
    if (job.apply_url && job.apply_url.trim() && !isValidUrl(job.apply_url)) {
      errors.push('Invalid apply URL');
    }

    // Salary validation
    if (job.salary_min && isNaN(Number(job.salary_min))) {
      errors.push('Invalid minimum salary (must be a number)');
    }

    if (job.salary_max && isNaN(Number(job.salary_max))) {
      errors.push('Invalid maximum salary (must be a number)');
    }

    if (job.salary_frequency && !['monthly', 'annually'].includes(job.salary_frequency.toLowerCase())) {
      errors.push('Invalid salary frequency (must be "monthly" or "annually")');
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

  const parseCSV = (text: string): ParsedJob[] => {
    const lines = text.split('\n').filter(line => line.trim());
    if (lines.length < 2) return [];

    // Parse header - normalize by converting to lowercase and trimming
    const csvHeaders = lines[0].split(',').map(h => h.trim().toLowerCase().replace(/["']/g, ''));
    
    // Map CSV headers to ParsedJob fields
    const headerMap: Record<string, keyof ParsedJob> = {
      'title': 'title',
      'description': 'description',
      'company_name': 'company_name',
      'company': 'company_name',
      'type_code': 'type_code',
      'industry_code': 'industry_code',
      'location': 'location',
      'country_code': 'country_code',
      'salary_min': 'salary_min',
      'salary_max': 'salary_max',
      'salary_frequency': 'salary_frequency',
      'currency': 'currency_code',
      'currency_code': 'currency_code',
      'apply_url': 'apply_url',
    };

    // Parse data rows
    const jobs: ParsedJob[] = [];
    
    for (let i = 1; i < lines.length; i++) {
      const values = parseCSVLine(lines[i]);
      
      if (values.length === 0 || values.every(v => !v.trim())) continue;

      const job: Partial<ParsedJob> = {};
      
      csvHeaders.forEach((header, index) => {
        const field = headerMap[header];
        if (field && values[index] !== undefined) {
          const value = values[index].trim();
          if (value) {
            (job as any)[field] = value;
          }
        }
      });

      const validation = validateJob(job);
      
      jobs.push({
        title: job.title || '',
        description: job.description,
        company_name: job.company_name,
        type_code: job.type_code,
        industry_code: job.industry_code,
        location: job.location,
        country_code: job.country_code,
        salary_min: job.salary_min,
        salary_max: job.salary_max,
        salary_frequency: job.salary_frequency,
        currency_code: job.currency_code,
        apply_url: job.apply_url,
        isValid: validation.isValid,
        errors: validation.errors,
      });
    }

    return jobs;
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

  const removeJob = (index: number) => {
    setParsedData(prev => prev.filter((_, i) => i !== index));
  };

  const handleUpload = async () => {
    const validJobs = parsedData.filter(j => j.isValid);
    
    if (validJobs.length === 0) {
      alert('No valid jobs to upload');
      return;
    }

    setStep('uploading');
    setUploadProgress(0);

    const result: UploadResult = {
      success: 0,
      failed: 0,
      errors: [],
    };

    // Upload jobs in batches
    const batchSize = 10;
    const batches = [];
    
    for (let i = 0; i < validJobs.length; i += batchSize) {
      batches.push(validJobs.slice(i, i + batchSize));
    }

    for (let batchIndex = 0; batchIndex < batches.length; batchIndex++) {
      const batch = batches[batchIndex];
      
      try {
        const response = await fetch('/api/jobs/bulk', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            jobs: batch.map(j => ({
              title: j.title,
              description: j.description || null,
              company_name: j.company_name || null,
              type_code: j.type_code || null,
              industry_code: j.industry_code || null,
              location: j.location || null,
              country_code: j.country_code,
              salary_min: j.salary_min ? Number(j.salary_min) : null,
              salary_max: j.salary_max ? Number(j.salary_max) : null,
              salary_frequency: j.salary_frequency?.toLowerCase() || null,
              currency_code: j.currency_code || null,
              apply_url: j.apply_url || null,
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
          batch.forEach((job, idx) => {
            result.errors.push({
              row: batchIndex * batchSize + idx + 1,
              title: job.title,
              error: data.error || 'Unknown error',
            });
          });
        }
      } catch (error) {
        result.failed += batch.length;
        batch.forEach((job, idx) => {
          result.errors.push({
            row: batchIndex * batchSize + idx + 1,
            title: job.title,
            error: 'Network error',
          });
        });
      }

      setUploadProgress(Math.round(((batchIndex + 1) / batches.length) * 100));
    }

    setUploadResult(result);
    setStep('complete');
  };

  const headersRequired = ['title', 'description', 'company_name', 'type_code', 'industry_code', 'location', 'currency_code', 'apply_url'];
  const headers = ['title', 'description', 'company_name', 'type_code', 'industry_code', 'location', 'salary_min', 'salary_max', 'salary_frequency', 'currency_code', 'apply_url'];
  
  const downloadTemplate = () => {
    const sampleRow = [
      'Software Engineer',
      'We are looking for a skilled software engineer...',
      'Acme Corp',
      'full-time',
      'information-technology',
      'Lagos, Nigeria',
      '500000',
      '800000',
      'monthly',
      'NGN',
      'https://acme.com/careers/software-engineer'
    ];

    const csvContent = [headers.join(','), sampleRow.join(',')].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'jobs_template.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const validCount = parsedData.filter(j => j.isValid).length;
  const invalidCount = parsedData.filter(j => !j.isValid).length;

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
              <Dialog.Panel className="w-full max-w-5xl transform overflow-hidden rounded-2xl bg-white shadow-2xl transition-all">
                {/* Header */}
                <div className="relative bg-gradient-to-br from-teal-700 to-teal-800 px-6 py-6 text-white">
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
                    Bulk Upload Jobs
                  </Dialog.Title>
                  <p className="mt-1 text-white/70 text-sm">
                    Upload a CSV file to add multiple jobs at once
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
                          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-teal-700 bg-teal-100 rounded-lg hover:bg-teal-200 transition-colors"
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
                            ? 'border-teal-500 bg-teal-50' 
                            : 'border-slate-300 hover:border-teal-400 hover:bg-slate-50'
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
                        <Upload className={`h-12 w-12 mx-auto mb-4 ${dragActive ? 'text-teal-500' : 'text-slate-400'}`} />
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
                        <p className="text-xs text-slate-500 mt-3">* Required fields are in red</p>
                        <div className="mt-3 text-xs text-slate-600 space-y-1">
                          <p><strong>type_code:</strong> full-time, part-time, contract, internship, freelance</p>
                          <p><strong>industry_code:</strong> information-technology, finance, healthcare, education, energy, etc.</p>
                          <p><strong>currency_code:</strong> NGN, USD, GBP, EUR, etc.</p>
                          <p><strong>salary_frequency:</strong> monthly or annually</p>
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
                          <span className="text-sm text-slate-600">{parsedData.length} jobs</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="flex items-center gap-1.5 text-sm">
                            <Check className="h-4 w-4 text-teal-500" />
                            <span className="text-teal-700 font-medium">{validCount} valid</span>
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
                                <th className="px-4 py-3 text-left font-medium text-slate-700">Title</th>
                                <th className="px-4 py-3 text-left font-medium text-slate-700">Company</th>
                                <th className="px-4 py-3 text-left font-medium text-slate-700">Location</th>
                                <th className="px-4 py-3 text-left font-medium text-slate-700">Type</th>
                                <th className="px-4 py-3 text-left font-medium text-slate-700">Industry</th>
                                <th className="px-4 py-3 text-left font-medium text-slate-700">Salary</th>
                                <th className="px-4 py-3 text-left font-medium text-slate-700">Actions</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                              {parsedData.map((job, index) => (
                                <tr key={index} className={job.isValid ? 'align-top' : 'bg-red-50 align-top'}>
                                  <td className="px-4 py-3">
                                    {job.isValid ? (
                                      <span className="flex items-center justify-center w-6 h-6 bg-teal-100 rounded-full">
                                        <Check className="h-3.5 w-3.5 text-teal-600" />
                                      </span>
                                    ) : (
                                      <div className="relative group">
                                        <span className="flex items-center justify-center w-6 h-6 bg-red-100 rounded-full cursor-help">
                                          <AlertCircle className="h-3.5 w-3.5 text-red-600" />
                                        </span>
                                        <div className="absolute left-full top-1/2 -translate-y-1/2 ml-2 z-50 hidden group-hover:block">
                                          <div className="bg-slate-900 text-white text-xs rounded-lg py-2 px-3 whitespace-nowrap shadow-lg max-w-xs">
                                            <div className="font-medium mb-1">Validation Errors:</div>
                                            <ul className="space-y-0.5">
                                              {job.errors.map((error, i) => (
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
                                  <td className="px-4 py-3 font-medium text-slate-900 max-w-[200px]">
                                    <span className="line-clamp-2">{job.title || <span className="text-red-500 italic">Missing</span>}</span>
                                  </td>
                                  <td className="px-4 py-3 text-slate-600 max-w-[150px]">
                                    <span className="truncate block">{job.company_name || <span className="text-red-500 italic">Missing</span>}</span>
                                  </td>
                                  <td className="px-4 py-3 text-slate-600 max-w-[120px]">
                                    <span className="truncate block">{job.location || <span className="text-red-500 italic">Missing</span>}</span>
                                  </td>
                                  <td className="px-4 py-3 text-slate-600">
                                    {job.type_code || <span className="text-red-500 italic">-</span>}
                                  </td>
                                  <td className="px-4 py-3 text-slate-600">
                                    {job.industry_code || <span className="text-red-500 italic">-</span>}
                                  </td>
                                  <td className="px-4 py-3 text-slate-600">
                                    {job.salary_min || job.salary_max ? (
                                      <span className="text-xs">
                                        {job.currency_code} {job.salary_min}{job.salary_max ? ` - ${job.salary_max}` : ''}
                                      </span>
                                    ) : (
                                      <span className="text-slate-400">-</span>
                                    )}
                                  </td>
                                  <td className="px-4 py-3">
                                    <button
                                      onClick={() => removeJob(index)}
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
                            {invalidCount} jobs have errors and will be skipped
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
                      <Loader2 className="h-12 w-12 animate-spin text-teal-500 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-slate-900 mb-2">
                        Uploading Jobs...
                      </h3>
                      <p className="text-sm text-slate-500 mb-6">
                        Please wait while we add your jobs
                      </p>
                      <div className="w-64 mx-auto bg-slate-200 rounded-full h-2">
                        <div 
                          className="bg-teal-500 h-2 rounded-full transition-all duration-300"
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
                          <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Check className="h-8 w-8 text-teal-600" />
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
                        <div className="bg-teal-50 rounded-xl p-4 text-center">
                          <p className="text-3xl font-bold text-teal-600">{uploadResult.success}</p>
                          <p className="text-sm text-teal-700">Successfully Added</p>
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
                                  <strong>{error.title}</strong>: {error.error}
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
                          className="px-5 py-2.5 text-sm font-medium text-white bg-teal-600 rounded-xl hover:bg-teal-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                        >
                          <Upload className="h-4 w-4" />
                          Upload {validCount} Jobs
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
                        className="px-5 py-2.5 text-sm font-medium text-white bg-teal-600 rounded-xl hover:bg-teal-700 transition-colors"
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
