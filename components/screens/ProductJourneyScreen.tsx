
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
import LeafIcon from '../icons/LeafIcon'; // Using generic leaf for product icon

interface JourneyStep {
    id: string;
    nameKey: string;
    date: string;
    location: string;
    details: string;
    icon: React.ElementType;
    // New fields for extended details
    operator?: string;
    temperature?: string;
    humidity?: string;
    blockchainHash?: string;
}

const ProductJourneyScreen: React.FC = () => {
  const navigate = useNavigate();
  const { productId, setProductId } = useAppState();
  const { t } = useTranslation();
  const [expandedStepId, setExpandedStepId] = useState<string | null>(null);

  const MOCK_JOURNEY_DATA: JourneyStep[] = [
    { 
        id: 'step-1',
        nameKey: 'harvested', 
        date: '2024-07-15', 
        location: 'Green Valley Farms, Karnataka', 
        details: 'Batch #FARM-451, Tulsi (Holy Basil). Harvested during early morning hours for maximum potency.',
        icon: HarvestIcon,
        operator: 'Ramesh Kumar',
        temperature: '24°C',
        humidity: '65%',
        blockchainHash: '0x3a1...8f9'
    },
    { 
        id: 'step-2',
        nameKey: 'labTested', 
        date: '2024-07-16', 
        location: 'AgriSafe Labs, Bangalore', 
        details: 'Passed all quality checks. Tested for heavy metals, pesticides, and microbial content. Confidence: 98.7%.',
        icon: BeakerIcon,
        operator: 'Dr. Sarah Lee',
        blockchainHash: '0x7b2...2c1'
    },
    { 
        id: 'step-3',
        nameKey: 'processed', 
        date: '2024-07-18', 
        location: 'HerbalCare Factory, Mysore', 
        details: 'Processed into final extract form. Gentle extraction method used to preserve active compounds. Batch #FACT-982.',
        icon: FactoryIcon,
        operator: 'Unit 4 Team',
        temperature: '45°C (Extraction)',
        blockchainHash: '0x9c3...4d2'
    },
    { 
        id: 'step-4',
        nameKey: 'packaged', 
        date: '2024-07-19', 
        location: 'HerbalCare Factory, Mysore', 
        details: 'Packaged in eco-friendly, UV-protective glass bottles. Sealed for freshness and quality assurance.',
        icon: PackageIcon,
        operator: 'Auto-Pack System',
        blockchainHash: '0x1d4...5e3'
    },
    { 
        id: 'step-5',
        nameKey: 'shipped', 
        date: '2024-07-20', 
        location: 'Central Distribution Hub', 
        details: 'Shipped to retailer via temperature-controlled logistics. Tracking #SHP-675.',
        icon: TruckIcon,
        operator: 'Logistics Partner',
        temperature: '22°C (Transit)',
        blockchainHash: '0x5e5...6f4'
    },
  ];

  const handleDone = () => {
    setProductId(null);
    navigate('/dashboard/customer');
  };

  const toggleStep = (id: string) => {
    setExpandedStepId(prev => prev === id ? null : id);
  };

  if (!productId) {
    return (
      <div className="w-full max-w-sm mx-auto flex flex-col h-full bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-2xl shadow-2xl items-center justify-center p-6">
        <h2 className="text-xl font-bold">No product data found.</h2>
        <p className="text-gray-800 dark:text-gray-400 mt-2 mb-6">Please scan a product QR code first.</p>
        <Button variant="secondary" onClick={() => navigate('/dashboard/customer')}>Go to Scanner</Button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-sm mx-auto flex flex-col h-full bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-2xl shadow-2xl overflow-hidden">
      <header className="flex items-center p-4 bg-green-700 text-white sticky top-0 z-20">
        <button onClick={handleDone} className="p-2 -ml-2">
          <ArrowLeftIcon className="h-6 w-6" />
        </button>
        <h1 className="text-xl font-bold mx-auto">{t('productJourney')}</h1>
        <div className="w-6"></div>
      </header>

      <div className="flex-grow overflow-y-auto">
        {/* Product Header Card */}
        <div className="bg-green-600 text-white p-6 pb-12 rounded-b-[2.5rem] shadow-lg relative z-10 mb-4">
             <div className="flex flex-col items-center">
                <div className="bg-white/20 p-4 rounded-full mb-3 backdrop-blur-sm">
                    <LeafIcon className="h-12 w-12 text-white" />
                </div>
                <h2 className="font-mono text-lg font-bold tracking-wider">{productId}</h2>
                <div className="mt-3 flex items-center gap-2 bg-white/90 text-green-800 px-3 py-1 rounded-full text-xs font-bold uppercase shadow-sm">
                    <ShieldIcon className="h-3 w-3" />
                    <span>{t('verifiedAuthentic')}</span>
                </div>
             </div>
        </div>

        <div className="px-6 pb-6 relative">
            {/* Timeline Line */}
            <div className="absolute top-0 bottom-0 left-[43px] w-0.5 bg-gray-200 dark:bg-gray-700"></div>

            <div className="space-y-6">
                {MOCK_JOURNEY_DATA.map((step, index) => {
                    const isExpanded = expandedStepId === step.id;
                    const isLast = index === MOCK_JOURNEY_DATA.length - 1;

                    return (
                    <div key={step.id} className="relative z-0 animate-fade-in" style={{ animationDelay: `${index * 100}ms` }}>
                        <div className="flex items-start gap-4">
                            {/* Timeline Node */}
                            <div className={`relative z-10 flex-shrink-0 h-9 w-9 flex items-center justify-center rounded-full border-4 border-white dark:border-gray-800 shadow-sm ${isLast ? 'bg-green-600 text-white' : 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300'}`}>
                                <step.icon className="h-4 w-4" />
                            </div>

                            {/* Content Card */}
                            <div 
                                className={`flex-1 bg-white dark:bg-gray-700 rounded-xl shadow-sm border border-gray-100 dark:border-gray-600 overflow-hidden transition-all duration-300 ${isExpanded ? 'ring-2 ring-green-500 dark:ring-green-400' : 'hover:shadow-md cursor-pointer'}`}
                                onClick={() => toggleStep(step.id)}
                            >
                                <div className="p-4">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h3 className="font-bold text-gray-900 dark:text-white text-lg">{t(step.nameKey)}</h3>
                                            <p className="text-xs text-gray-500 dark:text-gray-400 font-medium mt-0.5">{step.date}</p>
                                        </div>
                                        {isExpanded ? (
                                            <ChevronUpIcon className="h-5 w-5 text-gray-400" />
                                        ) : (
                                            <ChevronDownIcon className="h-5 w-5 text-gray-400" />
                                        )}
                                    </div>
                                    
                                    <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">{step.location}</p>

                                    {/* Collapsed Preview */}
                                    {!isExpanded && (
                                         <p className="text-xs text-gray-400 mt-2 font-medium">{t('expandDetails')}</p>
                                    )}

                                    {/* Expanded Details */}
                                    {isExpanded && (
                                        <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-600 animate-fade-in-fast">
                                            <div className="space-y-3 text-sm">
                                                <div>
                                                    <span className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide">{t('notes')}</span>
                                                    <p className="text-gray-800 dark:text-gray-200 mt-1">{step.details}</p>
                                                </div>
                                                
                                                <div className="grid grid-cols-2 gap-4">
                                                    {step.operator && (
                                                        <div>
                                                            <span className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide">{t('operator')}</span>
                                                            <p className="text-gray-800 dark:text-gray-200">{step.operator}</p>
                                                        </div>
                                                    )}
                                                    {step.temperature && (
                                                        <div>
                                                            <span className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide">{t('temperature')}</span>
                                                            <p className="text-gray-800 dark:text-gray-200">{step.temperature}</p>
                                                        </div>
                                                    )}
                                                    {step.humidity && (
                                                        <div>
                                                            <span className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide">{t('humidity')}</span>
                                                            <p className="text-gray-800 dark:text-gray-200">{step.humidity}</p>
                                                        </div>
                                                    )}
                                                </div>

                                                {step.blockchainHash && (
                                                    <div className="pt-2">
                                                         <button 
                                                            className="w-full flex items-center justify-center gap-2 py-2 px-3 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg text-green-700 dark:text-green-400 text-xs font-bold transition-colors"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                alert(`Blockchain Record:\n${step.blockchainHash}\n\n(This would open a block explorer in a real app)`);
                                                            }}
                                                        >
                                                            <ExternalLinkIcon className="h-3 w-3" />
                                                            {t('viewBlockchainRecord')}
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                )})}
            </div>
        </div>
      </div>
      
      <div className="p-4 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-20">
          <Button variant="secondary" onClick={handleDone}>
              {t('scanAnotherProduct')}
          </Button>
      </div>
    </div>
  );
};

export default ProductJourneyScreen;
