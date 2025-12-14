import { MedicinalHerb } from '../types';
import LeafIcon from '../components/icons/LeafIcon'; // Reusing icons

const MOCK_HERB_DB: MedicinalHerb[] = [
    {
        id: 'herb1',
        name: 'Tulsi (Holy Basil)',
        scientificName: 'Ocimum tenuiflorum',
        imageUrl: LeafIcon,
        uses: ['Reduces stress & anxiety', 'Boosts immunity', 'Anti-inflammatory', 'Treats cough & cold'],
        source: 'National Medicinal Plants Board, India',
        sourceUrl: 'https://www.nmpb.nic.in/',
    },
    {
        id: 'herb2',
        name: 'Ashwagandha (Indian Ginseng)',
        scientificName: 'Withania somnifera',
        imageUrl: LeafIcon,
        uses: ['Adaptogen (stress relief)', 'Improves brain function', 'Increases strength', 'Lowers blood sugar'],
        source: 'National Medicinal Plants Board, India',
        sourceUrl: 'https://www.nmpb.nic.in/',
    },
    {
        id: 'herb3',
        name: 'Turmeric (Haldi)',
        scientificName: 'Curcuma longa',
        imageUrl: LeafIcon,
        uses: ['Potent anti-inflammatory', 'Powerful antioxidant', 'Improves joint health', 'Aids digestion'],
        source: 'National Medicinal Plants Board, India',
        sourceUrl: 'https://www.nmpb.nic.in/',
    },
    {
        id: 'herb4',
        name: 'Brahmi',
        scientificName: 'Bacopa monnieri',
        imageUrl: LeafIcon,
        uses: ['Enhances memory & concentration', 'Reduces anxiety', 'Antioxidant properties'],
        source: 'National Medicinal Plants Board, India',
        sourceUrl: 'https://www.nmpb.nic.in/',
    },
];

export const searchHerbs = async (query: string): Promise<MedicinalHerb[]> => {
    console.log(`Searching herb database for: "${query}"`);
    await new Promise(resolve => setTimeout(resolve, 500));
    const lowerCaseQuery = query.toLowerCase();

    if (!lowerCaseQuery) {
        return MOCK_HERB_DB;
    }

    return MOCK_HERB_DB.filter(herb => 
        herb.name.toLowerCase().includes(lowerCaseQuery) ||
        herb.scientificName.toLowerCase().includes(lowerCaseQuery) ||
        herb.uses.some(use => use.toLowerCase().includes(lowerCaseQuery))
    );
};
