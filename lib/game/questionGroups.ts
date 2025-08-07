// lib/game/questionGroups.ts

export interface Question {
  id: number;
  isDynamic?: boolean;
  emoji: string;
  title: string;
  description: string;
  placeholder: string;
  needsAI: boolean;
  validationFunction?: string;
  dynamicData?: any; // Store the generated dynamic data
}

export interface QuestionGroup {
  groupId: string;
  title: string;
  description: string;
  questions: Question[];
  requiredCorrect: number;
  maxWrong: number;
  reward?: {
      title: string;
      description: string;
      level: number;
  };
}
  
  // Question Group 1: Taste the Continent
  const tasteTheContinentQuestions: Question[] = [
    {
        id: 1,
        emoji: '🇦🇫',
        title: 'Write the name of an African country that has at least one star on its flag.',
        description: '',
        placeholder: 'Enter country name...',
        needsAI: false,
        validationFunction: 'validateAfricanCountryWithStar'
    },
    {
        id: 2,
        emoji: '🏙️',
        title: 'Write the most populous city in the country you just named.',
        description: 'Hint: it\'s not always the capital.',
        placeholder: 'Enter city name...',
        needsAI: false,
        validationFunction: 'validateMostPopulousCity'
    },
    {
        id: 3,
        isDynamic: true,
        emoji: '🍲',
        title: '{snackName} is a popular snack in which country?',
        description: 'Something that locals love — and no, "fried rice" is not the vibe.',
        placeholder: 'Enter Country...',
        needsAI: false,
        validationFunction: 'validateTraditionalDish'
    },
    {
        id: 4,
        emoji: '🧭',
        title: 'Write the name of a country that shares a land border with the one from Q1.',
        description: 'Yes, land only. Boats don\'t count.',
        placeholder: 'Enter neighboring country...',
        needsAI: false,
        validationFunction: 'validateNeighboringCountry'
    },
    {
        id: 5,
        isDynamic: true,
        emoji: '🗣️',
        title: 'The local language {languageName} is mostly spoken in which country?',
        description: 'Real languages with real roots in African culture.',
        placeholder: 'Enter country name...',
        needsAI: false,
        validationFunction: 'validateLocalLanguage'
    },
    {
        id: 6,
        isDynamic: true,
        emoji: '🎵',
        title: 'The music artist {artistName} is from which country?',
        description: 'Bonus if you can hum one of their songs. Double bonus if it\'s on your playlist already.',
        placeholder: 'Enter country name...',
        needsAI: false,
        validationFunction: 'validateMusicalArtist'
    },
    {
        id: 7,
        emoji: '💰',
        title: 'What is the official currency used in the country from Q4?',
        description: 'The money they use for everyday transactions.',
        placeholder: 'Enter currency name...',
        needsAI: false,
        validationFunction: 'validateCurrency'
    },
    {
        id: 8,
        isDynamic: true,
        emoji: '🔤',
        title: 'Unscramble this word — it\'s a city in the country from Q4: {scrambledCity}',
        description: 'We\'ve scrambled a major city from your Q4 country.',
        placeholder: 'Enter unscrambled city name...',
        needsAI: false,
        validationFunction: 'validateUnscrambledCity'
    },
    {
      id: 9,
      emoji: '🧭',
      title: 'Chaos Riddle: Populous City Quest',
      description: `Using the NECWS acronym for African regions (North, East, Central, West, South),  
  start at your Q1 country's region,  
  move 8 steps forward in a circular manner,  
  then name the **second most populous city** in the region you land on.`,
      placeholder: 'Enter the city name...',
      needsAI: false,
      validationFunction: 'validateSecondMostPopulousCity'
  },
    {
        id: 10,
        emoji: '💱',
        title: 'Time-travel to independence',
        description: `1. Pick any **African country that borders exactly 3 other countries**.  
        2. Find the **year of independence of any one of its neighboring countries**.
        
        Type the year of independence of one of its neighbors below.`,
        placeholder: 'Enter independence year...',
        needsAI: false,
        validationFunction: 'validateTimeTravelIndependence'
    }
  ];
  
  // Question Group 2: Spice Routes (Example)
  const spiceRoutesQuestions: Question[] = [
    {
      id: 1,
      emoji: '🌶️',
      title: 'Name an Asian country famous for its spice trade.',
      description: 'Think historical spice routes and aromatic markets.',
      placeholder: 'Enter country name...',
      needsAI: false,
      validationFunction: 'validateSpiceCountry'
    },
    {
      id: 2,
      emoji: '🏺',
      title: 'What spice is this country most famous for producing?',
      description: 'The one that made traders cross oceans.',
      placeholder: 'Enter spice name...',
      needsAI: false,
      validationFunction: 'validateFamousSpice'
    },
    // Add more questions...
  ];
  

export const QUESTION_GROUPS: QuestionGroup[] = [
  {
      groupId: 'taste-the-continent',
      title: 'Taste the Continent',
      description: 'Explore 2 countries, unlock food knowledge, and maybe win some snacks.',
      questions: tasteTheContinentQuestions,
      requiredCorrect: 10,
      maxWrong: 3,
      reward: {
          title: 'Taster\'s Passport – Level 1',
          description: '+ Mini coupon sent to your email',
          level: 1
      }
  },  {
    groupId: 'new-spice-routes',
    title: 'LETS PLAY BALL',
    description: 'Explore 2 countries, unlock food knowledge, and maybe win some snacks.',
    questions: spiceRoutesQuestions,
    requiredCorrect: 10,
    maxWrong: 3,
    reward: {
        title: 'Taster\'s Passport – Level 1',
        description: '+ Mini coupon sent to your email',
        level: 1
    }
}
];
