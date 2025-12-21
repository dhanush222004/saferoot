
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from '../../App';
import { searchHerbs } from '../../services/herbDatabaseService';
import { MedicinalHerb } from '../../types';
import Spinner from '../common/Spinner';
import Input from '../common/Input';
import ArrowLeftIcon from '../icons/ArrowLeftIcon';
import SearchIcon from '../icons/SearchIcon';

const HerbDatabaseScreen: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [query, setQuery] = useState('');
  const [herbs, setHerbs] = useState<MedicinalHerb[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const performSearch = useCallback(async (searchQuery: string) => {
    setIsLoading(true);
    try {
        const results = await searchHerbs(searchQuery);
        setHerbs(results);
    } catch (error) {
        setHerbs([]);
    } finally {
        setIsLoading(false);
    }
  }, []);

  useEffect(() => { performSearch(''); }, [performSearch]);

  useEffect(() => {
    const handler = setTimeout(() => performSearch(query), 300);
    return () => clearTimeout(handler);
  }, [query, performSearch]);

  return (
    <div className="w-full max-w-sm mx-auto flex flex-col h-full bg-gray-100 dark:bg-gray-900 rounded-2xl shadow-2xl overflow-hidden animate-fade-in">
      <header className="flex items-center p-4 bg-green-700 text-white sticky top-0">
        <button onClick={() => navigate('/select-role')} className="p-2 -ml-2"><ArrowLeftIcon className="h-6 w-6" /></button>
        <h1 className="text-xl font-bold mx-auto">{t('herbDatabase')}</h1>
        <div className="w-6"></div>
      </header>
      <div className="p-4">
        <Input icon={<SearchIcon className="w-5 h-5" />} type="search" placeholder={t('searchHerbsPlaceholder')} value={query} onChange={e => setQuery(e.target.value)} />
      </div>
      <div className="flex-grow p-4 pt-0 overflow-y-auto">
        {isLoading ? <div className="flex justify-center h-full items-center"><Spinner /></div> : (
          <ul className="space-y-4">
            {herbs.map(herb => (
              <li key={herb.id} className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm">
                <h3 className="font-bold">{herb.name}</h3>
                <p className="text-xs italic">{herb.scientificName}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default HerbDatabaseScreen;
