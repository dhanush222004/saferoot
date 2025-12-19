import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useTranslation } from '../../App';
import { getAgricultureNews } from '../../services/newsService';
import { NewsArticle, NewsCategory } from '../../types';
import Spinner from '../common/Spinner';
import ArrowLeftIcon from '../icons/ArrowLeftIcon';

const NewsFeedScreen: React.FC = () => {
  const history = useHistory();
  const { t } = useTranslation();
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<NewsCategory | 'All'>('All');

  useEffect(() => {
    const fetchNews = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const newsData = await getAgricultureNews();
        setNews(newsData);
      } catch (err) {
        setError(t('errorFetchingNews'));
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchNews();
  }, [t]);
  
  const getCategoryStyles = (category: NewsCategory): string => {
      switch(category) {
          case NewsCategory.Policy:
              return 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300';
          case NewsCategory.Weather:
              return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300';
          case NewsCategory.Market:
              return 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300';
          case NewsCategory.Technology:
              return 'bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-300';
          default:
              return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
      }
  }

  const filteredNews = selectedCategory === 'All' 
    ? news 
    : news.filter(article => article.category === selectedCategory);

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex justify-center items-center h-full">
          <Spinner size="h-8 w-8" />
        </div>
      );
    }

    if (error) {
      return (
        <div className="text-center text-red-500 py-10">
          <p>{error}</p>
        </div>
      );
    }

    if (filteredNews.length === 0) {
      return (
        <div className="text-center text-gray-500 dark:text-gray-400 py-10">
          <p>{news.length === 0 ? t('noNewsAvailable') : t('noResultsFound')}</p>
        </div>
      );
    }
    
    return (
        <ul className="space-y-4">
            {filteredNews.map(article => (
                <li key={article.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 animate-fade-in-fast border border-gray-200 dark:border-gray-700">
                    <div className="flex items-start gap-4">
                        <div className={`p-3 rounded-full ${getCategoryStyles(article.category)}`}>
                            <article.icon className="h-6 w-6" />
                        </div>
                        <div className="flex-1">
                            <div className="flex justify-between items-start">
                                <h3 className="font-bold text-md text-gray-900 dark:text-gray-100 leading-tight pr-2">{article.title}</h3>
                                <span className={`text-xs font-semibold px-2 py-1 rounded-full ${getCategoryStyles(article.category)}`}>
                                    {t(`news${article.category.replace(' ', '')}`)}
                                </span>
                            </div>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">{article.summary}</p>
                            <div className="flex justify-between items-center mt-3 text-xs">
                                <span className="text-gray-500 dark:text-gray-400 font-medium">{article.source}</span>
                                <span className="font-semibold text-green-700 dark:text-green-400 cursor-pointer">{t('readMore')} &rarr;</span>
                            </div>
                        </div>
                    </div>
                </li>
            ))}
        </ul>
    );
  };

  return (
    <div className="w-full max-w-sm mx-auto flex flex-col h-full bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200 rounded-2xl shadow-2xl overflow-hidden">
      <header className="flex items-center p-4 bg-green-700 text-white sticky top-0 z-10">
        <button onClick={() => history.push('/select-role')} className="p-2 -ml-2">
          <ArrowLeftIcon className="h-6 w-6" />
        </button>
        <h1 className="text-xl font-bold mx-auto">{t('agricultureNewsFeed')}</h1>
        <div className="w-6"></div>
      </header>

      {/* Categories Filter */}
      <div className="px-4 pt-4 pb-2 flex gap-2 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setSelectedCategory('All')}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors border ${
                selectedCategory === 'All'
                ? 'bg-green-700 text-white border-green-700'
                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
          >
            {t('all')}
          </button>
          {Object.values(NewsCategory).map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors border ${
                    selectedCategory === category
                    ? 'bg-green-700 text-white border-green-700'
                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                  {t(`news${category.replace(' ', '')}`)}
              </button>
          ))}
      </div>

      <div className="flex-grow p-4 overflow-y-auto">
        {renderContent()}
      </div>
    </div>
  );
};

export default NewsFeedScreen;