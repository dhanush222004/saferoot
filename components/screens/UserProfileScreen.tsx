
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth, useTranslation } from '../../App';
import { Language } from '../../translations';
import { generateOTP } from '../../services/aiService';
import { validatePassword, validateOtp, PasswordValidationResult } from '../../utils/validation';

import Button from '../common/Button';
import Input from '../common/Input';
import Select from '../common/Select';
import Modal from '../common/Modal';
import Spinner from '../common/Spinner';
import PasswordStrengthIndicator from '../common/PasswordStrengthIndicator';
import ArrowLeftIcon from '../icons/ArrowLeftIcon';
import UserIcon from '../icons/UserIcon';
import ShieldIcon from '../icons/ShieldIcon';
import LockIcon from '../icons/LockIcon';
import CheckCircleIcon from '../icons/CheckCircleIcon';

const UserProfileScreen: React.FC = () => {
  const navigate = useNavigate();
  const { user, login } = useAuth();
  const { t, language, setLanguage } = useTranslation();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalStep, setModalStep] = useState(1);
  const [passwordData, setPasswordData] = useState({ current: '', new: '', confirm: '' });
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [success, setSuccess] = useState('');
  const [passwordValidation, setPasswordValidation] = useState<PasswordValidationResult>(validatePassword(''));
  
  useEffect(() => {
      setPasswordValidation(validatePassword(passwordData.new));
  }, [passwordData.new]);

  if (!user) {
    navigate('/login');
    return null;
  }

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    if (passwordData.current !== user.password) {
        setErrors({ current: t('wrongPassword')});
        return;
    }
    const isNewPasswordValid = Object.values(passwordValidation).every(v => v);
    if (!isNewPasswordValid) {
        setErrors({ new: t('errorPasswordComplexity') });
        return;
    }
    setLoading(true);
    try {
        await generateOTP();
        setModalStep(2);
    } catch (err) {
        setErrors({ form: 'OTP failed.' });
    } finally {
        setLoading(false);
    }
  };

  const handleOtpConfirm = (e: React.FormEvent) => {
      e.preventDefault();
      setErrors({});
      setLoading(true);
      setTimeout(() => {
          const updatedUser = { ...user, password: passwordData.new };
          login(updatedUser);
          setSuccess(t('passwordChangedSuccess'));
          setLoading(false);
          setModalStep(3);
          setTimeout(() => setIsModalOpen(false), 2000);
      }, 1000);
  };

  return (
    <>
      <div className="w-full max-w-sm mx-auto flex flex-col h-full bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200 rounded-2xl shadow-2xl overflow-hidden animate-fade-in">
        <header className="flex items-center p-4 bg-green-700 text-white sticky top-0 z-10">
          <button onClick={() => navigate('/select-role')} className="p-2 -ml-2"><ArrowLeftIcon className="h-6 w-6" /></button>
          <h1 className="text-xl font-bold mx-auto">{t('userProfile')}</h1>
          <div className="w-6"></div>
        </header>
        <div className="p-6 space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-5"><h2 className="font-bold text-lg mb-4">{t('profileDetails')}</h2><p>{user.id}</p></div>
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-5">
            <h2 className="font-bold text-lg mb-4">{t('settings')}</h2>
            <Select value={language} onChange={(e) => setLanguage(e.target.value as Language)}>
                <option value="en">English</option>
                <option value="hi">Hindi</option>
                <option value="ta">Tamil</option>
            </Select>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-5">
            <h2 className="font-bold text-lg mb-4">{t('security')}</h2>
            <Button variant="outline" onClick={() => setIsModalOpen(true)}>{t('changePassword')}</Button>
          </div>
        </div>
      </div>
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={t('changePassword')}>
          <div className="min-h-[300px]">
              {modalStep === 1 && (
                  <form onSubmit={handlePasswordChange} className="space-y-4">
                      <Input type="password" placeholder={t('currentPassword')} value={passwordData.current} onChange={e => setPasswordData(p=>({...p, current: e.target.value}))} />
                      <Input type="password" placeholder={t('newPassword')} value={passwordData.new} onChange={e => setPasswordData(p=>({...p, new: e.target.value}))} />
                      <Button variant="secondary" type="submit" disabled={loading}>{loading ? <Spinner /> : t('getOtp')}</Button>
                  </form>
              )}
              {modalStep === 2 && (
                  <form onSubmit={handleOtpConfirm} className="space-y-4">
                      <Input type="text" placeholder={t('otp')} value={otp} onChange={e => setOtp(e.target.value)} />
                      <Button variant="secondary" type="submit" disabled={loading}>{t('updatePassword')}</Button>
                  </form>
              )}
              {modalStep === 3 && <div className="text-center"><CheckCircleIcon className="h-20 w-20 text-green-500 mx-auto" /><p>{success}</p></div>}
          </div>
      </Modal>
    </>
  );
};

export default UserProfileScreen;
