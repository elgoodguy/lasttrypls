import { TranslationResources } from '../src/types';
import { enTranslations } from '../src/translations/en';
import { esTranslations } from '../src/translations/es';
import process from 'node:process';

type ValidationError = {
  type: 'missing' | 'extra' | 'mismatch';
  key: string;
  language?: 'en' | 'es';
  message: string;
};

// Helper type to get all possible paths in an object type
type Paths<T> = T extends object
  ? {
      [K in keyof T]: K extends string
        ? T[K] extends object
          ? `${K}.${Paths<T[K]>}`
          : K
        : never;
    }[keyof T]
  : never;

// Get all possible paths from TranslationResources type
type TranslationPaths = Paths<TranslationResources>;

function validateTranslations(): ValidationError[] {
  const errors: ValidationError[] = [];
  
  // Helper function to get all keys from an object
  const getAllKeys = (obj: any, prefix = ''): string[] => {
    return Object.entries(obj).reduce((keys: string[], [key, value]) => {
      const newKey = prefix ? `${prefix}.${key}` : key;
      if (typeof value === 'object' && value !== null) {
        return [...keys, ...getAllKeys(value, newKey)];
      }
      return [...keys, newKey];
    }, []);
  };

  // Get all keys from translation files
  const enKeys = getAllKeys(enTranslations);
  const esKeys = getAllKeys(esTranslations);

  // Create a set of expected keys based on the type structure
  const expectedKeys = new Set<string>();
  const addKeysFromType = (obj: any, prefix = '') => {
    Object.keys(obj).forEach(key => {
      const newKey = prefix ? `${prefix}.${key}` : key;
      expectedKeys.add(newKey);
      if (typeof obj[key] === 'object' && obj[key] !== null) {
        addKeysFromType(obj[key], newKey);
      }
    });
  };

  // Use the English translations as a template for the expected structure
  addKeysFromType(enTranslations);

  // Check for missing keys in translations
  expectedKeys.forEach(key => {
    if (!enKeys.includes(key)) {
      errors.push({
        type: 'missing',
        key,
        language: 'en',
        message: `Missing key in English translations: ${key}`
      });
    }
    if (!esKeys.includes(key)) {
      errors.push({
        type: 'missing',
        key,
        language: 'es',
        message: `Missing key in Spanish translations: ${key}`
      });
    }
  });

  // Check for extra keys in translations
  enKeys.forEach(key => {
    if (!expectedKeys.has(key)) {
      errors.push({
        type: 'extra',
        key,
        language: 'en',
        message: `Extra key in English translations: ${key}`
      });
    }
  });

  esKeys.forEach(key => {
    if (!expectedKeys.has(key)) {
      errors.push({
        type: 'extra',
        key,
        language: 'es',
        message: `Extra key in Spanish translations: ${key}`
      });
    }
  });

  // Check for structural mismatches
  const checkStructure = (obj1: any, obj2: any, prefix = '') => {
    Object.keys(obj1).forEach(key => {
      const newPrefix = prefix ? `${prefix}.${key}` : key;
      if (typeof obj1[key] === 'object' && obj1[key] !== null) {
        if (typeof obj2[key] !== 'object' || obj2[key] === null) {
          errors.push({
            type: 'mismatch',
            key: newPrefix,
            message: `Structural mismatch at ${newPrefix}`
          });
        } else {
          checkStructure(obj1[key], obj2[key], newPrefix);
        }
      }
    });
  };

  checkStructure(enTranslations, esTranslations);

  return errors;
}

// Run validation
const errors = validateTranslations();

if (errors.length > 0) {
  console.error('Translation validation failed:');
  errors.forEach(error => {
    console.error(`[${error.type}] ${error.message}`);
  });
  process.exit(1);
} else {
  console.log('Translation validation passed successfully!');
  process.exit(0);
} 