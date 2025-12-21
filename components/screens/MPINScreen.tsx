
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth, useTranslation } from '../../App';
import FingerprintIcon from '../icons/FingerprintIcon';
import BackspaceIcon from '../icons/BackspaceIcon';
import Spinner from '../common/Spinner';

const MPIN_LENGTH = 4;

const MPINScreen: React.FC = () => {
  const { user, mpinHash, setMpin, unlockApp, forgotMpin } = useAuth();
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [mode, setMode] = useState(mpinHash ? 'enter' : 'create');
  const [pin, setPin] = useState('');
  const [firstPin, setFirstPin] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isUnlocking, setIsUnlocking] = useState(false);

  const titles: { [key: string]: string } = {
    create: t('createYourMpin'),
    confirm: t('confirmYourMpin'),
    enter: t('enterYourMpin'),
  };

  const handleKeyPress = (key: string) => {
    if (success || isUnlocking) return;
    setError('');
    if (key === 'backspace') {
      setPin(p => p.slice(0, -1));
    } else if (pin.length < MPIN_LENGTH) {
      setPin(p => p + key);
    }
  };

  useEffect(() => {
    if (pin.length !== MPIN_LENGTH) return;
    const processPin = async () => {
      if (mode === 'create') {
        setFirstPin(pin);
        setPin('');
        setMode('confirm');
      } else if (mode === 'confirm') {
        if (pin === firstPin) {
          setSuccess(t('mpinSetSuccess'));
          setIsUnlocking(true);
          setTimeout(() => setMpin(pin), 1000);
        } else {
          setError(t('mpinsDoNotMatch'));
          setPin('');
          setMode('create');
        }
      } else if (mode === 'enter') {
        if (!user) return;
        const expectedHash = `hashed_${pin}_${user.id}`;
        if (expectedHash === mpinHash) {
          setSuccess(t('unlocking'));
          setIsUnlocking(true);
          setTimeout(unlockApp, 1000);
        } else {
          setError(t('incorrectMpin'));
          setPin('');
        }
      }
    };
    processPin();
  }, [pin, mode, firstPin, mpinHash, setMpin, unlockApp, user, t]);

  const KeypadButton: React.FC<{ value: string }> = ({ value }) => (
    <button onClick={() => handleKeyPress(value)} disabled={isUnlocking} className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-100 dark:bg-gray-700 rounded-full text-2xl font-semibold flex items-center justify-center transform active:scale-95 transition-all">
      {value === 'backspace' ? <BackspaceIcon className="w-7 h-7" /> : value}
    </button>
  );

  return (
    <div className="w-full max-w-sm mx-auto flex flex-col items-center justify-between p-4 h-full animate-fade-in">
      <div className="text-center w-full">
        <div className="bg-green-600 rounded-full p-4 mb-4 inline-block"><FingerprintIcon className="h-10 w-10 text-white" /></div>
        <h1 className="text-2xl font-bold">{mode === 'enter' ? t('unlockSafeRoot') : t('mpinSetup')}</h1>
        <p className="text-lg mt-2 min-h-[28px]">{isUnlocking && success ? success : error || titles[mode]}</p>
        <div className="flex justify-center space-x-4 my-4">
            {Array.from({ length: MPIN_LENGTH }).map((_, i) => (
                <div key={i} className={`w-4 h-4 rounded-full transition-all ${pin.length > i ? 'bg-green-600' : 'bg-gray-300'}`} />
            ))}
        </div>
      </div>
      {isUnlocking ? <div className="p-10"><Spinner size="h-12 w-12" /></div> : (
        <div className="grid grid-cols-3 gap-5">
            {'123456789'.split('').map(num => <KeypadButton key={num} value={num} />)}
            <div />
            <KeypadButton value="0" />
            <KeypadButton value="backspace" />
        </div>
      )}
      <div className="mt-4">
        {mode === 'enter' && !isUnlocking && <button onClick={forgotMpin} className="text-red-600 font-bold">{t('forgotMpin')}</button>}
      </div>
    </div>
  );
};

export default MPINScreen;
