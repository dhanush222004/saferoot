
import React, { useState, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../common/Button';
import Input from '../common/Input';
import Spinner from '../common/Spinner';
import ArrowLeftIcon from '../icons/ArrowLeftIcon';
import UploadIcon from '../icons/UploadIcon';
import FileTextIcon from '../icons/FileTextIcon';
import XIcon from '../icons/XIcon';
import { useAppState, useTranslation } from '../../App';
import { verifyLabReport } from '../../services/aiService';
import { validateRequired, validateNumber } from '../../utils/validation';

const LabDashboard: React.FC = () => {
  const [batchId, setBatchId] = useState('');
  const [herbSpecies, setHerbSpecies] = useState('');
  const [weight, setWeight] = useState('');
  const [labReport, setLabReport] = useState<File | null>(null);
  const [fileName, setFileName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [touched, setTouched] = useState<{ [key: string]: boolean }>({});
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const { setVerificationResult } = useAppState();
  const { t } = useTranslation();

  const validateForm = useCallback(() => {
      const newErrors: { [key: string]: string } = {};
      const batchIdError = validateRequired(batchId);
      if (batchIdError) newErrors.batchId = t(batchIdError, { fieldName: t('batchId')});
      const herbSpeciesError = validateRequired(herbSpecies);
      if (herbSpeciesError) newErrors.herbSpecies = t(herbSpeciesError, { fieldName: t('herbSpecies')});
      const weightError = validateRequired(weight) || validateNumber(weight);
      if (weightError) newErrors.weight = t(weightError, { fieldName: t('weightKg')});
      const fileError = validateRequired(labReport);
      if (fileError) newErrors.labReport = t(fileError, { fieldName: t('uploadLabReport')});
      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
  }, [batchId, herbSpecies, weight, labReport, t]);

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setLabReport(file);
    setFileName(file ? file.name : '');
    setTouched(prev => ({ ...prev, labReport: true }));
  };

  const handleRemoveFile = () => {
    setLabReport(null);
    setFileName('');
    if (fileInputRef.current) fileInputRef.current.value = '';
    setTouched(prev => ({ ...prev, labReport: true }));
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({ batchId: true, herbSpecies: true, weight: true, labReport: true });
    if (!validateForm()) return;
    setIsLoading(true);
    try {
        if (!labReport) throw new Error("No file selected");
        const result = await verifyLabReport(labReport, batchId, herbSpecies, parseFloat(weight));
        setVerificationResult(result);
        navigate('/verification');
    } catch (err: any) {
        setErrors({ form: err.message || 'Verification failed.' });
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-sm mx-auto flex flex-col h-full bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-2xl shadow-2xl overflow-hidden animate-fade-in">
      <header className="flex items-center p-4 bg-green-700 text-white sticky top-0">
        <button onClick={() => navigate('/select-role')} className="p-2 -ml-2"><ArrowLeftIcon className="h-6 w-6" /></button>
        <h1 className="text-xl font-bold mx-auto">{t('uploadTestResults')}</h1>
        <div className="w-6"></div>
      </header>
      <div className="flex-grow p-6 overflow-y-auto">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div><label className="block text-sm font-medium mb-1">{t('batchId')}</label><Input name="batchId" type="text" value={batchId} onChange={(e) => setBatchId(e.target.value)} onBlur={handleBlur} isInvalid={touched.batchId && !!errors.batchId} /></div>
          <div><label className="block text-sm font-medium mb-1">{t('herbSpecies')}</label><Input name="herbSpecies" type="text" value={herbSpecies} onChange={(e) => setHerbSpecies(e.target.value)} onBlur={handleBlur} isInvalid={touched.herbSpecies && !!errors.herbSpecies} /></div>
          <div><label className="block text-sm font-medium mb-1">{t('weightKg')}</label><Input name="weight" type="number" value={weight} onChange={(e) => setWeight(e.target.value)} onBlur={handleBlur} isInvalid={touched.weight && !!errors.weight} /></div>
          <div>
              <label className="block text-sm font-medium mb-1">{t('uploadLabReport')}</label>
              <input name="labReport" type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept=".pdf,.jpg,.jpeg,.png" />
              {labReport ? (
                <div className="p-3 border-2 border-dashed border-green-500 bg-green-50 dark:bg-green-900/20 rounded-xl flex items-center justify-between">
                  <div className="flex items-center gap-3 overflow-hidden"><FileTextIcon className="h-8 w-8 text-green-600" /><p className="text-sm truncate" title={fileName}>{fileName}</p></div>
                  <button type="button" onClick={handleRemoveFile} className="p-1"><XIcon className="h-5 w-5" /></button>
                </div>
              ) : (
                <button type="button" onClick={() => fileInputRef.current?.click()} disabled={isLoading} className={`w-full text-center py-8 px-4 border-2 border-dashed rounded-xl transition-all ${touched.labReport && errors.labReport ? 'border-red-500' : 'border-gray-300'}`}>
                  <UploadIcon className="h-8 w-8 mx-auto mb-2 text-gray-400" /><span className="text-gray-600 dark:text-gray-300 font-medium">{t('clickToUpload')}</span>
                </button>
              )}
          </div>
          <div className="pt-4"><Button variant="primary" type="submit" disabled={isLoading}>{isLoading ? t('analyzingReport') : t('submitForAiVerification')}</Button></div>
        </form>
      </div>
    </div>
  );
};

export default LabDashboard;
