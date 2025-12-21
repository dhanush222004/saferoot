
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from '../../App';
import { getAgricultureNews } from '../../services/newsService';
import { NewsArticle, NewsCategory } from '../../types';
import Spinner from '../common/Spinner';
import ArrowLeftIcon from '../icons/ArrowLeftIcon';

const NewsFeedScreen: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<NewsCategory | 'All'>('All');

  useEffect(() => {
    const fetchNews = async () => {
      setIsLoading(true);
      try {
        const newsData = await getAgricultureNews();
        setNews(newsData);
      } catch (err) {
        setError(t('errorFetchingNews'));
      } finally {
        setIsLoading(false);
      }
    };
    fetchNews();
  }, [t]);

  const filteredNews = selectedCategory === 'All' ? news : news.filter(a => a.category === selectedCategory);

  return (
    <div className="w-full max-w-sm mx-auto flex flex-col h-full bg-gray-100 dark:bg-gray-900 rounded-2xl shadow-2xl overflow-hidden animate-fade-in">
      <header className="flex items-center p-4 bg-green-700 text-white sticky top-0">
        <button onClick={() => navigate('/select-role')} className="p-2 -ml-2"><ArrowLeftIcon className="h-6 w-6" /></button>
        <h1 className="text-xl font-bold mx-auto">{t('agricultureNewsFeed')}</h1>
        <div className="w-6"></div>
      </header>
      <div className="flex-grow p-4 overflow-y-auto">
        {isLoading ? <div className="flex justify-center h-full items-center"><Spinner /></div> : (
          <ul className="space-y-4">
            {filteredNews.map(article => (
              <li key={article.id} className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm">
                <h3 className="font-bold">{article.title}</h3>
                <p className="text-sm">{article.summary}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default NewsFeedScreen;
