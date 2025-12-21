
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppState, useTranslation } from '../../App';
import Button from '../common/Button';
import ArrowLeftIcon from '../icons/ArrowLeftIcon';
import HarvestIcon from '../icons/HarvestIcon';
import BeakerIcon from '../icons/BeakerIcon';
import FactoryIcon from '../icons/FactoryIcon';
import PackageIcon from '../icons/PackageIcon';
import TruckIcon from '../icons/TruckIcon';
import ShieldIcon from '../icons/ShieldIcon';
import ChevronDownIcon from '../icons/ChevronDownIcon';
import ChevronUpIcon from '../icons/ChevronUpIcon';
import ExternalLinkIcon from '../icons/ExternalLinkIcon';
import LeafIcon from '../icons/LeafIcon';
import MapPinIcon from '../icons/MapPinIcon';
import FileTextIcon from '../icons/FileTextIcon';

interface JourneyStep {
    id: string;
    nameKey: string;
    date: string;
    location: string;
    details: string;
    icon: React.ElementType;
    operator?: string;
    blockchainHash?: string;
}

const ProductJourneyScreen: React.FC = () => {
  const navigate = useNavigate();
  const { productId, setProductId } = useAppState();
  const { t } = useTranslation();
  const [expandedStepId, setExpandedStepId] = useState<string | null>(null);

  const MOCK_JOURNEY_DATA: JourneyStep[] = [
    { id: 'step-1', nameKey: 'harvested', date: '2024-07-15', location: 'Green Valley Farms', details: 'Fresh Tulsi harvested.', icon: HarvestIcon, blockchainHash: '0x3a1...8f9' },
    { id: 'step-2', nameKey: 'labTested', date: '2024-07-16', location: 'AgriSafe Labs', details: 'Passed all safety checks.', icon: BeakerIcon, blockchainHash: '0x7b2...2c1' },
    { id: 'step-3', nameKey: 'processed', date: '2024-07-18', location: 'HerbalCare Factory', details: 'Extraction complete.', icon: FactoryIcon, blockchainHash: '0x9c3...4d2' },
  ];

  const handleDone = () => {
    setProductId(null);
    navigate('/dashboard/customer');
  };

  if (!productId) {
    return (
      <div className="w-full max-w-sm mx-auto flex flex-col h-full bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-2xl shadow-2xl items-center justify-center p-6 animate-fade-in">
        <h2 className="text-xl font-bold">No product data found.</h2>
        <Button variant="secondary" onClick={() => navigate('/dashboard/customer')}>Go to Scanner</Button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-sm mx-auto flex flex-col h-full bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-2xl shadow-2xl overflow-hidden animate-fade-in">
      <header className="flex items-center p-4 bg-green-700 text-white sticky top-0 z-20">
        <button onClick={handleDone} className="p-2 -ml-2"><ArrowLeftIcon className="h-6 w-6" /></button>
        <h1 className="text-xl font-bold mx-auto">{t('productJourney')}</h1>
        <div className="w-6"></div>
      </header>
      <div className="flex-grow overflow-y-auto p-6">
        <h2 className="font-mono text-lg font-bold mb-6 text-center">{productId}</h2>
        <div className="space-y-6 relative">
            <div className="absolute top-0 bottom-0 left-[17px] w-0.5 bg-gray-200 dark:bg-gray-700"></div>
            {MOCK_JOURNEY_DATA.map((step) => (
                <div key={step.id} className="relative pl-10">
                    <div className="absolute left-0 top-0 h-9 w-9 bg-green-100 rounded-full flex items-center justify-center border-2 border-white dark:border-gray-800"><step.icon className="h-4 w-4 text-green-700" /></div>
                    <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-xl border">
                        <h3 className="font-bold">{t(step.nameKey)}</h3>
                        <p className="text-xs text-gray-500 mb-2">{step.date}</p>
                        <p className="text-sm">{step.details}</p>
                    </div>
                </div>
            ))}
        </div>
      </div>
      <div className="p-4 border-t"><Button variant="secondary" onClick={handleDone}>{t('scanAnotherProduct')}</Button></div>
    </div>
  );
};

export default ProductJourneyScreen;
