
  
// african countries with stars on their flags
export const COUNTRIES_WITH_STARS = [
    'ghana', 'ethiopia', 'senegal', 'burkina faso', 'cameroon', 'central african republic',
    'comoros', 'democratic republic of congo', 'djibouti', 'guinea-bissau', 'liberia',
    'mauritania', 'morocco', 'mozambique', 'sao tome and principe', 'somalia', 'south sudan', 'togo'
  ];
  
  // african countries above and their corresponding most populous city (only one per country)
  export const COUNTRY_CITIES: { [key: string]: string } = {
    'ghana': 'accra',
    'ethiopia': 'addis ababa',
    'senegal': 'dakar',
    'burkina faso': 'ouagadougou',
    'cameroon': 'douala',
    'central african republic': 'bangui',
    'comoros': 'moroni',
    'democratic republic of congo': 'kinshasa',
    'djibouti': 'djibouti',
    'guinea-bissau': 'bissau',
    'liberia': 'monrovia',
    'mauritania': 'nouakchott',
    'morocco': 'casablanca',
    'mozambique': 'maputo',
    'sao tome and principe': 'são tomé',
    'somalia': 'mogadishu',
    'south sudan': 'juba',
    'togo': 'lomé'
  };
  
  // african countries above and their neighboring countries
  export const COUNTRY_BORDERS: { [key: string]: string[] } = {
    'ghana': ['burkina faso', 'togo', 'ivory coast'],
    'ethiopia': ['eritrea', 'djibouti', 'somalia', 'kenya', 'south sudan', 'sudan'],
    'senegal': ['mauritania', 'mali', 'guinea', 'guinea-bissau', 'gambia'],
    'burkina faso': ['mali', 'niger', 'benin', 'togo', 'ghana', 'ivory coast'],
    'cameroon': ['nigeria', 'chad', 'central african republic', 'equatorial guinea', 'gabon', 'republic of the congo'],
    'central african republic': ['chad', 'sudan', 'south sudan', 'democratic republic of congo', 'republic of the congo', 'cameroon'],
    'comoros': [],
    'democratic republic of congo': ['republic of the congo', 'central african republic', 'south sudan', 'uganda', 'rwanda', 'burundi', 'tanzania', 'zambia', 'angola'],
    'djibouti': ['eritrea', 'ethiopia', 'somalia'],
    'guinea-bissau': ['senegal', 'guinea'],
    'liberia': ['sierra leone', 'guinea', 'ivory coast'],
    'mauritania': ['western sahara', 'algeria', 'mali', 'senegal'],
    'morocco': ['algeria', 'western sahara'],
    'mozambique': ['tanzania', 'malawi', 'zambia', 'zimbabwe', 'south africa', 'eswatini'],
    'sao tome and principe': [],
    'somalia': ['djibouti', 'ethiopia', 'kenya'],
    'south sudan': ['sudan', 'ethiopia', 'kenya', 'uganda', 'democratic republic of congo', 'central african republic'],
    'togo': ['ghana', 'burkina faso', 'benin']
  };
  
export const COUNTRY_CURRENCIES: { [key: string]: string } = {
  'ghana': 'cedi',
  'ethiopia': 'birr',
  'senegal': 'cfa franc',
  'liberia': 'liberian dollar',
  'burkina faso': 'cfa franc',
  'cameroon': 'cfa franc',
  'morocco': 'dirham',
  'tunisia': 'dinar',
  'togo': 'cfa franc',
  'somalia': 'shilling'
};

// Dynamic data arrays for random selection
export const AFRICAN_SNACKS = [
  { name: 'Biltong', country: ['South Africa', 'Namibia'] },
  { name: 'Chin Chin', country: ['Nigeria', 'Cameroon', 'Ghana'] },
  { name: 'Koeksisters', country: ['South Africa'] },
  { name: 'Plantain Chips', country: ['Ghana', 'Nigeria', 'Cameroon'] },
  { name: 'Mandazi', country: ['Kenya', 'Tanzania', 'Uganda'] },
  { name: 'Sambusa', country: ['Somalia', 'Ethiopia', 'Eritrea', 'Kenya'] },
  { name: 'Akara', country: ['Nigeria', 'Benin', 'Ghana'] },
  { name: 'Maharagwe', country: ['Tanzania', 'Kenya'] },
  { name: 'Mealie Bread', country: ['Zimbabwe', 'South Africa'] },
  { name: 'Fat Cakes (Magwinya)', country: ['Botswana', 'South Africa'] },
  { name: 'Puff-Puff', country: ['Nigeria', 'Cameroon', 'Ghana'] },
  { name: 'Kelewele', country: ['Ghana'] },
  { name: 'Zobo', country: ['Nigeria'] },
  { name: 'Kilishi', country: ['Nigeria', 'Niger'] },
  { name: 'Suya', country: ['Nigeria', 'Cameroon', 'Ghana'] },
  { name: 'Beignets', country: ['Cameroon', 'DR Congo', 'Chad'] },
  { name: 'Grilled Maize', country: ['Kenya', 'Uganda', 'Rwanda'] },
  { name: 'Mofo Gasy', country: ['Madagascar'] },
  { name: 'Alloco', country: ['Ivory Coast', 'Guinea', 'Mali'] },
  { name: 'Pastels', country: ['Senegal', 'Gambia'] },
  { name: 'Nkate Cake', country: ['Ghana'] },
  { name: 'Tamarind Balls', country: ['Sudan', 'South Sudan', 'Ethiopia'] },
  { name: 'Mabuyu (Baobab Candy)', country: ['Kenya', 'Tanzania'] },
  { name: 'Chapati Rolex', country: ['Uganda'] },
  { name: 'Fried Cassava', country: ['Angola', 'Mozambique'] },
  { name: 'Mkate wa Ufuta', country: ['Zanzibar', 'Tanzania'] },
  { name: 'Gnamakoudji (Ginger Drink)', country: ['Ivory Coast', 'Mali'] },
  { name: 'Dabo Kolo', country: ['Ethiopia'] },
  { name: 'Kpekpele', country: ['Togo'] },
  { name: 'Tuo Zaafi Bites', country: ['Ghana'] },
  { name: 'Boerewors Roll', country: ['South Africa'] },
  { name: 'Coconut Candy', country: ['Nigeria'] },
  { name: 'Mushanana Biscuits', country: ['Rwanda'] },
  { name: 'Dèguè', country: ['Burkina Faso', 'Mali', 'Niger'] },
  { name: 'Mbongo Tchobi Bites', country: ['Cameroon'] },
  { name: 'Sfenj', country: ['Morocco', 'Algeria', 'Tunisia'] },
  { name: 'Brik', country: ['Tunisia'] },
  { name: 'Ful Medames Snack Cups', country: ['Egypt', 'Sudan'] },
  { name: 'Matoke Chips', country: ['Uganda'] },
  { name: 'Bagia (Bhajia)', country: ['Kenya', 'Tanzania'] },
  { name: 'Masa', country: ['Nigeria', 'Niger'] },
  { name: 'Yam Balls', country: ['Ghana', 'Nigeria'] },
  { name: 'Koki Corn', country: ['Cameroon'] },
  { name: 'Sweet Potatoes in Syrup', country: ['Mozambique'] },
  { name: 'Deglet Nour Dates', country: ['Algeria', 'Tunisia'] },
  { name: 'Injera Chips', country: ['Ethiopia', 'Eritrea'] },
  { name: 'Seswaa Sliders', country: ['Botswana'] },
  { name: 'Mogodu Bites', country: ['South Africa'] },
  { name: 'Qatayef with Nuts', country: ['Egypt'] },
  { name: 'Mutura', country: ['Kenya'] }
];

export const AFRICAN_LANGUAGES = [
  { name: 'Swahili', country: 'tanzania' },
  { name: 'Amharic', country: 'ethiopia' },
  { name: 'Yoruba', country: 'nigeria' },
  { name: 'Zulu', country: 'south africa' },
  { name: 'Hausa', country: 'nigeria' },
  { name: 'Oromo', country: 'ethiopia' },
  { name: 'Igbo', country: 'nigeria' },
  { name: 'Shona', country: 'zimbabwe' },
  { name: 'Xhosa', country: 'south africa' },
  { name: 'Akan', country: 'ghana' },
  { name: 'Berber', country: 'morocco' },
  { name: 'Tigrinya', country: 'eritrea' },
  { name: 'Somali', country: 'somalia' },
  { name: 'Wolof', country: 'senegal' },
  { name: 'Kinyarwanda', country: 'rwanda' },
  { name: 'Kirundi', country: 'burundi' },
  { name: 'Chichewa', country: 'malawi' },
  { name: 'Tswana', country: 'botswana' },
  { name: 'Sotho', country: 'lesotho' },
  { name: 'Lingala', country: 'democratic republic of congo' },
  { name: 'Fula', country: 'guinea' },
  { name: 'Ewe', country: 'ghana' },
  { name: 'Bemba', country: 'zambia' },
  { name: 'Kanuri', country: 'nigeria' },
  { name: 'Tshiluba', country: 'democratic republic of congo' },
  { name: 'Kikuyu', country: 'kenya' },
  { name: 'Twi', country: 'ghana' },
  { name: 'Fang', country: 'equatorial guinea' },
  { name: 'Ganda', country: 'uganda' },
  { name: 'Luba-Katanga', country: 'democratic republic of congo' },
  { name: 'Ndebele', country: 'zimbabwe' },
  { name: 'Kabyle', country: 'algeria' },
  { name: 'Soninke', country: 'mali' },
  { name: 'Tamasheq', country: 'niger' },
  { name: 'Sango', country: 'central african republic' },
  { name: 'Dioula', country: 'burkina faso' },
  { name: 'Temne', country: 'sierra leone' },
  { name: 'Venda', country: 'south africa' },
  { name: 'Lomwe', country: 'mozambique' },
  { name: 'Kpelle', country: 'liberia' },
  { name: 'Ndau', country: 'mozambique' },
  { name: 'Maasai', country: 'kenya' },
  { name: 'Zarma', country: 'niger' },
  { name: 'Tigré', country: 'eritrea' },
  { name: 'Rundi', country: 'burundi' },
  { name: 'Bubi', country: 'equatorial guinea' },
  { name: 'Mossi', country: 'burkina faso' },
  { name: 'Bassa', country: 'liberia' },
  { name: 'Nuer', country: 'south sudan' }
];

export const AFRICAN_ARTISTS = [
  { name: 'Fela Kuti', country: 'nigeria' },
  { name: 'Burna Boy', country: 'nigeria' },
  { name: 'Wizkid', country: 'nigeria' },
  { name: 'Davido', country: 'nigeria' },
  { name: 'Miriam Makeba', country: 'south africa' },
  { name: 'Hugh Masekela', country: 'south africa' },
  { name: 'Diamond Platnumz', country: 'tanzania' },
  { name: 'Sarkodie', country: 'ghana' },
  { name: 'Cassper Nyovest', country: 'south africa' },
  { name: 'Sauti Sol', country: 'kenya' },
  { name: 'Nasty C', country: 'south africa' },
  { name: 'Tiwa Savage', country: 'nigeria' },
  { name: 'Stonebwoy', country: 'ghana' },
  { name: 'Angelique Kidjo', country: 'benin' },
  { name: 'Salif Keita', country: 'mali' },
  { name: 'Ali Farka Touré', country: 'mali' },
  { name: 'Youssou N’Dour', country: 'senegal' },
  { name: 'Cesária Évora', country: 'cape verde' },
  { name: 'Lucky Dube', country: 'south africa' },
  { name: 'Brenda Fassie', country: 'south africa' },
  { name: 'Oliver Mtukudzi', country: 'zimbabwe' },
  { name: 'Fally Ipupa', country: 'democratic republic of congo' },
  { name: 'Papa Wemba', country: 'democratic republic of congo' },
  { name: 'King Sunny Adé', country: 'nigeria' },
  { name: 'Eddy Kenzo', country: 'uganda' },
  { name: 'Oumou Sangaré', country: 'mali' },
  { name: 'Mzwakhe Mbuli', country: 'south africa' },
  { name: 'Mahmoud Ahmed', country: 'ethiopia' },
  { name: 'Rokia Traoré', country: 'mali' },
  { name: 'Femi Kuti', country: 'nigeria' },
  { name: 'Thomas Mapfumo', country: 'zimbabwe' },
  { name: 'Johnny Clegg', country: 'south africa' },
  { name: 'Seun Kuti', country: 'nigeria' },
  { name: 'Ladysmith Black Mambazo', country: 'south africa' },
  { name: 'Salif Keita', country: 'mali' },
  { name: 'Tinariwen', country: 'mali' },
  { name: 'Tiken Jah Fakoly', country: 'ivory coast' },
  { name: 'Fally Ipupa', country: 'democratic republic of congo' },
  { name: 'Miriam Makeba', country: 'south africa' },
  { name: 'Zahara', country: 'south africa' },
  { name: 'Amadou & Mariam', country: 'mali' },
  { name: 'King Kester Emeneya', country: 'democratic republic of congo' },
  { name: 'Soweto Gospel Choir', country: 'south africa' },
  { name: 'Salma Fayed', country: 'egypt' },
  { name: 'Taurai Mandebvu', country: 'zimbabwe' },
  { name: 'Wizkid', country: 'nigeria' },
  { name: 'Diamond Platnumz', country: 'tanzania' },
  { name: 'Sauti Sol', country: 'kenya' }
];

export const CFA_FRANC_COUNTRIES = [
  'senegal', 'burkina faso', 'cameroon', 'central african republic', 
  'chad', 'republic of the congo', 'equatorial guinea', 'gabon',
  'ivory coast', 'mali', 'niger', 'togo', 'benin'
];

export const AFRICAN_CAPITALS = [
  { name: 'Lagos', country: 'nigeria', length: 5 },
  { name: 'Cairo', country: 'egypt', length: 5 },
  { name: 'Nairobi', country: 'kenya', length: 7 },
  { name: 'Dakar', country: 'senegal', length: 5 },
  { name: 'Accra', country: 'ghana', length: 5 },
  { name: 'Abuja', country: 'nigeria', length: 5 },
  { name: 'Khartoum', country: 'sudan', length: 8 },
  { name: 'Casablanca', country: 'morocco', length: 10 },
  { name: 'Johannesburg', country: 'south africa', length: 12 },
  { name: 'Addis Ababa', country: 'ethiopia', length: 10 }
];

export const UNESCO_SITES_BY_REGION = {
  north: ['Pyramids of Giza', 'Historic Cairo', 'Leptis Magna', 'Carthage'],
  east: ['Rock-Hewn Churches of Lalibela', 'Simien Mountains', 'Mount Kenya', 'Stone Town of Zanzibar'],
  central: ['Sangha Trinational', 'Dja Faunal Reserve', 'Manovo-Gounda St Floris'],
  west: ['Djoudj National Bird Sanctuary', 'Island of Gorée', 'Sukur Cultural Landscape'],
  south: ['Robben Island', 'Drakensberg Park', 'Victoria Falls', 'Great Zimbabwe']
};


export const SECOND_MOST_POPULOUS_CITIES_BY_REGION = {
  north: 'Alexandria', // Egypt
  east: 'Mombasa',     // Kenya
  central: 'Lubumbashi', // DRC
  west: 'Abidjan',     // Côte d'Ivoire
  south: 'Cape Town'   // South Africa
};



export const AFRICAN_CITIES = [
  'Lagos',
  'Abuja',
  'Kano',
  'Cairo',
  'Casablanca',
  'Algiers',
  'Nairobi',
  'Kampala',
  'Harare',
  'Tripoli',
  'Tunis',
  'Luanda',
  'Dakar',
  'Accra',
  'Kigali',
  'Kinshasa',
  'Lubumbashi',
  'Bamako',
  'Ouagadougou',
  'Jos',
  'Mombasa',
  'Antananarivo',
  'Maseru',
  'Gaborone',
  'Windhoek',
  'Lilongwe',
  'Blantyre',
  'Freetown',
  'Monrovia',
  'Conakry',
  'Bissau',
  'Nouakchott',
  'Mogadishu',
  'Asmara',
  'Djibouti',
  'Bujumbura',
  'Dodoma',
  'Zanzibar',
  'Maputo',
  'Beira',
  'Soweto',
  'Durban',
  'Pretoria',
  'Johannesburg',
  'Benghazi',
  'Omdurman',
  'Juba',
  'Ibadan',
  'Benin City'
];



export const COUNTRIES_WITH_3_BORDERS: { [country: string]: string[] } = {
  'eritrea': ['sudan', 'ethiopia', 'djibouti'],
  'gabon': ['equatorial guinea', 'cameroon', 'republic of the congo'],
  'guinea-bissau': ['senegal', 'guinea', 'the gambia'],
  'malawi': ['tanzania', 'mozambique', 'zambia'],
  'rwanda': ['uganda', 'burundi', 'democratic republic of congo'],
  'togo': ['ghana', 'benin', 'burkina faso']
};

export const INDEPENDENCE_YEARS: { [country: string]: number } = {
  'eritrea': 1993,
  'sudan': 1956,
  'ethiopia': 1941, // or never colonized but freed from Italy
  'djibouti': 1977,
  'gabon': 1960,
  'equatorial guinea': 1968,
  'cameroon': 1960,
  'republic of the congo': 1960,
  'guinea-bissau': 1973,
  'senegal': 1960,
  'guinea': 1958,
  'the gambia': 1965,
  'malawi': 1964,
  'tanzania': 1961,
  'mozambique': 1975,
  'zambia': 1964,
  'rwanda': 1962,
  'uganda': 1962,
  'burundi': 1962,
  'democratic republic of congo': 1960,
  'togo': 1960,
  'ghana': 1957,
  'benin': 1960,
  'burkina faso': 1960
};
