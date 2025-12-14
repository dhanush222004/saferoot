import { GoogleGenAI, Type } from '@google/genai';
import { NewsArticle, NewsCategory } from '../types';
import GovernmentIcon from '../components/icons/GovernmentIcon';
import SunCloudIcon from '../components/icons/SunCloudIcon';
import TrendingUpIcon from '../components/icons/TrendingUpIcon';
import AIIcon from '../components/icons/AIIcon';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const categoryIconMap = {
    [NewsCategory.Policy]: GovernmentIcon,
    [NewsCategory.Weather]: SunCloudIcon,
    [NewsCategory.Market]: TrendingUpIcon,
    [NewsCategory.Technology]: AIIcon,
};

export const getAgricultureNews = async (): Promise<NewsArticle[]> => {
    console.log("AI Service: Fetching agriculture news from Gemini...");

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: `Act as an agricultural news correspondent for India. 
            Generate a list of 5 recent, realistic, and relevant news article summaries for Indian farmers.
            For each article, provide a title, a brief summary (around 25-30 words), a credible source (e.g., Krishi Jagran, Reuters, The Hindu BusinessLine), and a category.
            The category must be one of the following: "Policy", "Weather", "Market Update", or "Technology".
            Respond ONLY with a JSON object that strictly follows the provided schema.`,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        articles: {
                            type: Type.ARRAY,
                            items: {
                                type: Type.OBJECT,
                                properties: {
                                    title: { type: Type.STRING },
                                    summary: { type: Type.STRING },
                                    source: { type: Type.STRING },
                                    category: { 
                                        type: Type.STRING,
                                        enum: [NewsCategory.Policy, NewsCategory.Weather, NewsCategory.Market, NewsCategory.Technology]
                                    },
                                },
                                required: ["title", "summary", "source", "category"]
                            }
                        }
                    },
                    required: ["articles"]
                }
            }
        });
        
        const jsonString = response.text.trim();
        const aiResult = JSON.parse(jsonString);

        if (!aiResult.articles) {
            throw new Error("AI response did not contain 'articles' array.");
        }

        const newsArticles: NewsArticle[] = aiResult.articles.map((article: any, index: number) => ({
            id: `news-${Date.now()}-${index}`,
            title: article.title,
            summary: article.summary,
            category: article.category as NewsCategory,
            source: article.source,
            icon: categoryIconMap[article.category as NewsCategory] || GovernmentIcon,
        }));
        
        console.log("AI Service: Successfully fetched and parsed news articles.", newsArticles);
        return newsArticles;

    } catch (error) {
        console.error("AI Service: Error fetching or parsing news from Gemini", error);
        throw new Error("Could not fetch news from AI service.");
    }
};