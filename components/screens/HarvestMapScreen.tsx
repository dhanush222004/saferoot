
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from '../../App';
import { HarvestZone, ZoneType } from '../../types';
import Spinner from '../common/Spinner';
import ArrowLeftIcon from '../icons/ArrowLeftIcon';

const MOCK_HARVEST_ZONES: HarvestZone[] = [
  { id: 'zone-a', name: 'North Forest', boundaries: { top: '10%', left: '15%', width: '30%', height: '25%', borderRadius: '10px' }, allowedHerbs: ['Tulsi'], zoneType: ZoneType.Harvest },
  { id: 'zone-d', name: 'Govt Area', boundaries: { top: '5%', left: '50%', width: '45%', height: '30%'}, allowedHerbs: ['Amla'], zoneType: ZoneType.Permitted },
];

const HarvestMapScreen: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [userPosition, setUserPosition] = useState<{ top: string; left: string } | null>(null);
  const [isLoadingLocation, setIsLoadingLocation] = useState(true);
  const [selectedZone, setSelectedZone] = useState<HarvestZone | null>(null);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      () => {
        setUserPosition({ top: '40%', left: '40%' });
        setIsLoadingLocation(false);
      },
      () => setIsLoadingLocation(false)
    );
  }, []);

  return (
    <div className="w-full max-w-sm mx-auto flex flex-col h-full bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden animate-fade-in">
      <header className="flex items-center p-4 bg-green-700 text-white sticky top-0 z-20">
        <button onClick={() => navigate(-1)} className="p-2 -ml-2"><ArrowLeftIcon className="h-6 w-6" /></button>
        <h1 className="text-xl font-bold mx-auto">{t('harvestZoneMap')}</h1>
        <div className="w-6"></div>
      </header>
      <div className="flex-grow relative bg-green-50 dark:bg-gray-700">
        {MOCK_HARVEST_ZONES.map((zone) => (
          <div key={zone.id} className="absolute border-2 bg-green-500/20 border-green-500 cursor-pointer" style={zone.boundaries} onClick={() => setSelectedZone(zone)} />
        ))}
        {userPosition && (
          <div className="absolute transform -translate-x-1/2 -translate-y-1/2 h-4 w-4 bg-blue-500 rounded-full border-2 border-white" style={{ top: userPosition.top, left: userPosition.left, zIndex: 10 }} />
        )}
        {isLoadingLocation && <div className="absolute inset-0 flex items-center justify-center bg-white/50"><Spinner /></div>}
      </div>
      <div className="p-3 bg-white/80 dark:bg-gray-900/80 border-t">
        {selectedZone ? <p>{selectedZone.name}</p> : <p className="text-sm">{t('mapLegend')}</p>}
      </div>
    </div>
  );
};

export default HarvestMapScreen;
