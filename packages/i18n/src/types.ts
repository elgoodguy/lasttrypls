export type Language = 'en' | 'es';

export interface CommonTranslations {
  welcome: string;
  loading: string;
  error: string;
  save: string;
  cancel: string;
  delete: string;
  edit: string;
  saving: string;
  confirm: string;
  min: string;
  search: string;
  hi: string;
}

export interface NavigationTranslations {
  home: string;
  about: string;
  contact: string;
  favorites: string;
  orders: string;
  wallet: string;
  cart: string;
  profile: string;
  search: string;
  setlocation: string;
  notifications: string;
}

export interface AddressTranslations {
  title: string;
  add: string;
  addNew: string;
  search: string;
  useLocation: string;
  manage: string;
  setPrimary: string;
  addTitle: string;
  editTitle: string;
  modalDescription: string;
  forceModalDescription: string;
  deliverTo: string;
  loading: string;
  details: {
    street: string;
    interior: string;
    neighborhood: string;
    city: string;
    zipCode: string;
    instructions: string;
    example: string;
  };
  save: string;
  empty: string;
}

export interface AuthTranslations {
  email: string;
  password: string;
  confirmPassword: string;
  forgotPassword: string;
  rememberMe: string;
  noAccount: string;
  haveAccount: string;
  logout: string;
  signup: string;
  login: string;
}

export interface ProfileTranslations {
  title: string;
  description: string;
  preferences: string;
  prefsDescription: string;
  setLanguage: string;
  setTheme: string;
}

export interface TranslationResources {
  common: CommonTranslations;
  navigation: NavigationTranslations;
  address: AddressTranslations;
  auth: AuthTranslations;
  profile: ProfileTranslations;
} 