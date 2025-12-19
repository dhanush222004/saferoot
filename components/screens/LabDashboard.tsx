import React, { useState, useRef, useCallback } from 'react';
import { useHistory } from 'react-router-dom';
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
  const history = useHistory();
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
    if (fileInputRef.current) {
        fileInputRef.current.value = '';
    }
    setTouched(prev => ({ ...prev, labReport: true }));
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({ batchId: true, herbSpecies: true, weight: true, labReport: true });
    
    if (!validateForm()) {
      return;
    }
    
    setIsLoading(true);

    try {
        if (!labReport) throw new Error("No file selected");

        const result = await verifyLabReport(labReport, batchId, herbSpecies, parseFloat(weight));
        setVerificationResult(result);
        history.push('/verification');
    } catch (err: any) {
        setErrors({ form: err.message || 'Verification failed. Please try again.' });
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-sm mx-auto flex flex-col h-full bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-2xl shadow-2xl overflow-hidden">
      <header className="flex items-center p-4 bg-green-700 text-white sticky top-0">
        <button onClick={() => history.push('/select-role')} className="p-2 -ml-2">
          <ArrowLeftIcon className="h-6 w-6" />
        </button>
        <h1 className="text-xl font-bold mx-auto">{t('uploadTestResults')}</h1>
        <div className="w-6"></div>
      </header>

      <div className="flex-grow flex flex-col p-6 overflow-y-auto">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-900 dark:text-gray-300 mb-1">{t('batchId')}</label>
            <Input 
              name="batchId" type="text" placeholder="e.g., 123456" 
              value={batchId} onChange={(e) => setBatchId(e.target.value)} onBlur={handleBlur}
              isInvalid={touched.batchId && !!errors.batchId}
              className="!bg-gray-100 dark:!bg-gray-700 !text-gray-900 dark:!text-gray-200"
            />
            {touched.batchId && errors.batchId && <p className="text-red-500 text-xs mt-1">{errors.batchId}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-900 dark:text-gray-300 mb-1">{t('herbSpecies')}</label>
            <Input 
              name="herbSpecies" type="text" placeholder="e.g., Ashwagandha"
              value={herbSpecies} onChange={(e) => setHerbSpecies(e.target.value)} onBlur={handleBlur}
              isInvalid={touched.herbSpecies && !!errors.herbSpecies}
              className="!bg-gray-100 dark:!bg-gray-700 !text-gray-900 dark:!text-gray-200"
            />
             {touched.herbSpecies && errors.herbSpecies && <p className="text-red-500 text-xs mt-1">{errors.herbSpecies}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-900 dark:text-gray-300 mb-1">{t('weightKg')}</label>
            <Input 
              name="weight" type="number" placeholder="e.g., 50"
              value={weight} onChange={(e) => setWeight(e.target.value)} onBlur={handleBlur}
              isInvalid={touched.weight && !!errors.weight}
              className="!bg-gray-100 dark:!bg-gray-700 !text-gray-900 dark:!text-gray-200"
            />
            {touched.weight && errors.weight && <p className="text-red-500 text-xs mt-1">{errors.weight}</p>}
          </div>

          <div>
              <label className="block text-sm font-medium text-gray-900 dark:text-gray-300 mb-1">{t('uploadLabReport')}</label>
              <input
                name="labReport"
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
                accept=".pdf,.jpg,.jpeg,.png"
              />
              {labReport ? (
                <div className="relative p-3 border-2 border-dashed border-green-500 dark:border-green-400 bg-green-50 dark:bg-green-900/20 rounded-xl flex items-center justify-between animate-fade-in-fast">
                  <div className="flex items-center gap-3 overflow-hidden">
                    <FileTextIcon className="h-8 w-8 text-green-600 dark:text-green-400 flex-shrink-0" />
                    <p className="text-sm text-gray-900 dark:text-gray-200 truncate font-medium" title={fileName}>{fileName}</p>
                  </div>
                  <button
                    type="button"
                    onClick={handleRemoveFile}
                    className="p-1 rounded-full text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors flex-shrink-0 ml-2"
                    aria-label="Remove file"
                  >
                    <XIcon className="h-5 w-5" />
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isLoading}
                  className={`w-full text-center py-8 px-4 bg-gray-50 dark:bg-gray-700 border-2 border-dashed rounded-xl hover:border-green-500 dark:hover:border-green-400 hover:bg-green-50 dark:hover:bg-green-900/20 transition-all duration-150 ease-in-out ${touched.labReport && errors.labReport ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'}`}
                >
                  <UploadIcon className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                  <span className="text-gray-600 dark:text-gray-300 font-medium">{t('clickToUpload')}</span>
                  <span className="block text-xs text-gray-400 mt-1">PDF, JPG, PNG</span>
                </button>
              )}
              {touched.labReport && errors.labReport && <p className="text-red-500 text-xs mt-1">{errors.labReport}</p>}
          </div>

          {errors.form && <p className="text-red-500 text-sm text-center bg-red-50 dark:bg-red-900/20 p-2 rounded-lg">{errors.form}</p>}

          <div className="pt-4">
            <Button variant="primary" type="submit" disabled={isLoading}>
              {isLoading ? (
                  <div className="flex items-center justify-center gap-2">
                      <Spinner size="h-5 w-5" />
                      <span>{t('analyzingReport')}</span>
                  </div>
              ) : t('submitForAiVerification')}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LabDashboard;