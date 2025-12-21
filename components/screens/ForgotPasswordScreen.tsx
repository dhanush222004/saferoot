
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from '../../App';
import { generateOTP } from '../../services/aiService';
import { validatePassword, validateOtp, PasswordValidationResult } from '../../utils/validation';
import Button from '../common/Button';
import Input from '../common/Input';
import Spinner from '../common/Spinner';
import PasswordStrengthIndicator from '../common/PasswordStrengthIndicator';
import ArrowLeftIcon from '../icons/ArrowLeftIcon';
import UserIcon from '../icons/UserIcon';
import LockIcon from '../icons/LockIcon';
import CheckCircleIcon from '../icons/CheckCircleIcon';

const ForgotPasswordScreen: React.FC = () => {
  const [step, setStep] = useState(1);
  const [userId, setUserId] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [passwordValidation, setPasswordValidation] = useState<PasswordValidationResult>(validatePassword(''));

  const navigate = useNavigate();
  const { t } = useTranslation();

  useEffect(() => {
    setPasswordValidation(validatePassword(newPassword));
  }, [newPassword]);

  const handleIdSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) return;
    setLoading(true);
    try {
      await generateOTP();
      setStep(2);
    } catch (err) {
      setErrors({ form: 'OTP Error' });
    }
    setLoading(false);
  };

  const handleResetSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) return;
    setLoading(true);
    setTimeout(() => {
      setStep(3);
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="w-full max-w-sm mx-auto flex flex-col items-center p-4 animate-fade-in">
      <header className="w-full flex items-center mb-8">
        <button onClick={() => navigate('/login')} className="p-2 -ml-2"><ArrowLeftIcon className="h-6 w-6" /></button>
        <h1 className="text-2xl font-bold mx-auto">{t('resetPassword')}</h1>
        <div className="w-6"></div>
      </header>
      {step === 1 && (
        <form onSubmit={handleIdSubmit} className="w-full space-y-4">
          <Input icon={<UserIcon className="w-5 h-5" />} placeholder={t('userId')} value={userId} onChange={e=>setUserId(e.target.value)} />
          <Button type="submit" variant="primary" disabled={loading}>{loading ? <Spinner /> : t('getOtp')}</Button>
        </form>
      )}
      {step === 2 && (
        <form onSubmit={handleResetSubmit} className="w-full space-y-4">
          <Input placeholder={t('otp')} value={otp} onChange={e=>setOtp(e.target.value)} />
          <Input type="password" placeholder={t('newPassword')} value={newPassword} onChange={e=>setNewPassword(e.target.value)} />
          <Button type="submit" variant="primary" disabled={loading}>{t('resetPassword')}</Button>
        </form>
      )}
      {step === 3 && (
        <div className="text-center space-y-6">
          <CheckCircleIcon className="h-20 w-20 text-green-500 mx-auto" />
          <Button onClick={() => navigate('/login')} variant="secondary">{t('returnToLogin')}</Button>
        </div>
      )}
    </div>
  );
};

export default ForgotPasswordScreen;
