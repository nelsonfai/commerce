// lib/game/validation.ts - Enhanced validation engine
import { 
  COUNTRIES_WITH_STARS, 
  COUNTRY_BORDERS, 
  COUNTRY_CITIES, 
  COUNTRY_CURRENCIES,
  SECOND_MOST_POPULOUS_CITIES_BY_REGION,
  COUNTRIES_WITH_3_BORDERS,
  INDEPENDENCE_YEARS,
  AFRICAN_SNACKS,
  AFRICAN_LANGUAGES,
  AFRICAN_ARTISTS,
  CFA_FRANC_COUNTRIES,
  AFRICAN_CAPITALS,
  UNESCO_SITES_BY_REGION
} from './data';

export interface ValidationContext {
  answer: string;
  questionId: number;
  previousAnswers: string[];
  groupId: string;
  scrambledWord?: string;
  dynamicData?: any;
}

export class ValidationEngine {
  private static instance: ValidationEngine;

  private constructor() {}

  public static getInstance(): ValidationEngine {
    if (!ValidationEngine.instance) {
      ValidationEngine.instance = new ValidationEngine();
    }
    return ValidationEngine.instance;
  }

  async validate(context: ValidationContext, validationFunction: string): Promise<boolean> {
    const method = this.getValidationMethod(validationFunction);
    if (!method) {
      console.warn(`Validation function ${validationFunction} not found`);
      return false;
    }
    return await method.call(this, context);
  }

  private getValidationMethod(functionName: string): Function | null {
    const methods: { [key: string]: Function } = {
      validateAfricanCountryWithStar: this.validateAfricanCountryWithStar,
      validateMostPopulousCity: this.validateMostPopulousCity,
      validateTraditionalDish: this.validateTraditionalDish,
      validateNeighboringCountry: this.validateNeighboringCountry,
      validateLocalLanguage: this.validateLocalLanguage,
      validateMusicalArtist: this.validateMusicalArtist,
      validateCurrency: this.validateCurrency,
      validateUnscrambledCity: this.validateUnscrambledCity,
      validateSecondMostPopulousCity: this.validateSecondMostPopulousCity,
      validateTimeTravelIndependence: this.validateTimeTravelIndependence
    };

    return methods[functionName] || null;
  }

  private async validateAfricanCountryWithStar(context: ValidationContext): Promise<boolean> {
    const trimmedAnswer = context.answer.trim().toLowerCase();
    return COUNTRIES_WITH_STARS.includes(trimmedAnswer.replace(/\s+/g, ' '));
  }

  private async validateMostPopulousCity(context: ValidationContext): Promise<boolean> {
    const country1 = context.previousAnswers[0]?.toLowerCase().trim() || '';
    const correctCity = COUNTRY_CITIES[country1] || '';
    return correctCity === context.answer.trim().toLowerCase();
  }

  private async validateTraditionalDish(context: ValidationContext): Promise<boolean> {
    if (!context.dynamicData?.correctCountry) return false;
    const userAnswer = context.answer.trim().toLowerCase();
    const correctCountry = context.dynamicData.correctCountry.map((c: string) => c.toLowerCase());
    return correctCountry.includes(userAnswer);

  }

  private async validateNeighboringCountry(context: ValidationContext): Promise<boolean> {
    const originalCountry = context.previousAnswers[0]?.toLowerCase().trim() || '';
    const validNeighbors = COUNTRY_BORDERS[originalCountry] || [];
    return validNeighbors.some(neighbor => neighbor === context.answer.trim().toLowerCase());
  }

  private async validateLocalLanguage(context: ValidationContext): Promise<boolean> {
    if (!context.dynamicData?.correctCountry) return false;
    const userAnswer = context.answer.trim().toLowerCase();
    const correctCountry = context.dynamicData.correctCountry.toLowerCase();
    return userAnswer === correctCountry;
  }

  private async validateMusicalArtist(context: ValidationContext): Promise<boolean> {
    if (!context.dynamicData?.correctCountry) return false;
    const userAnswer = context.answer.trim().toLowerCase();
    const correctCountry = context.dynamicData.correctCountry.toLowerCase();
    return userAnswer === correctCountry;
  }

  private async validateCurrency(context: ValidationContext): Promise<boolean> {
    const q4Country = context.previousAnswers[3]?.toLowerCase().trim() || '';
    const correctCurrency = COUNTRY_CURRENCIES[q4Country] || '';
    return correctCurrency === context.answer.trim().toLowerCase();
  }

  private async validateUnscrambledCity(context: ValidationContext): Promise<boolean> {
    if (!context.dynamicData?.originalCity) return false;
    const userAnswer = context.answer.trim().toLowerCase();
    const correctCity = context.dynamicData.originalCity.toLowerCase();
    return userAnswer === correctCity;
  }


  private async validateSecondMostPopulousCity(context: ValidationContext): Promise<boolean> {
    // Get Q1 country and determine its region
    const q1Country = context.previousAnswers[0]?.toLowerCase().trim() || '';
    const region = this.getCountryRegion(q1Country);
  
    // Define NECWS circular region list
    const regions = ['north', 'east', 'central', 'west', 'south'];
    const startIndex = regions.indexOf(region);
  
    // If region not found, fail early
    if (startIndex === -1) return false;
  
    // Move 8 steps forward in a circular manner
    const targetIndex = (startIndex + 8) % regions.length;
    const targetRegion = regions[targetIndex];
  
    // Get the correct answer from our dataset
    const expectedCity = SECOND_MOST_POPULOUS_CITIES_BY_REGION[targetRegion as keyof typeof SECOND_MOST_POPULOUS_CITIES_BY_REGION];
  
    // Normalize and compare user answer
    const userAnswer = context.answer.trim().toLowerCase();
    return expectedCity?.toLowerCase() === userAnswer;
  }
  

  private async validateTimeTravelIndependence(context: ValidationContext): Promise<boolean> {
    const userAnswer = context.answer.trim();
  
    // Flatten all neighbors’ independence years into a Set for fast lookup
    const validYears = new Set<number>();
    Object.values(COUNTRIES_WITH_3_BORDERS).forEach(neighbors => {
      neighbors.forEach(n => {
        const year = INDEPENDENCE_YEARS[n.toLowerCase()];
        if (year) validYears.add(year);
      });
    });
  
    return validYears.has(Number(userAnswer));
  }
  
  

  private getCountryRegion(country: string): string {
    const regionMap: { [key: string]: string } = {
      'morocco': 'north', 'tunisia': 'north', 'egypt': 'north',
      'ethiopia': 'east', 'kenya': 'east', 'tanzania': 'east', 'somalia': 'east',
      'cameroon': 'central', 'central african republic': 'central', 'chad': 'central',
      'senegal': 'west', 'ghana': 'west', 'nigeria': 'west', 'burkina faso': 'west',
      'south africa': 'south', 'zimbabwe': 'south', 'botswana': 'south'
    };
    
    return regionMap[country] || 'west'; // Default to west
  }
}