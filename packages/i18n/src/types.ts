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
  continue: string;
  min: string;
  search: string;
  hi: string;
  back: string;
}

export interface NavigationTranslations {
  home: string;
  favorites: string;
  orders: string;
  wallet: string;
  profile: string;
  setlocation: string;
  guest: string;
  search: string;
  notifications: string;
}

export interface AddressTranslations {
  title: string;
  add: string;
  addNew: string;
  addSuccess: string;
  search: string;
  searchTitle: string;
  searchPlaceholder: string;
  searchAddress: string;
  useLocation: string;
  useMyLocation: string;
  manage: string;
  setPrimary: string;
  addTitle: string;
  editTitle: string;
  modalDescription: string;
  forceModalDescription: string;
  gettingLocation: string;
  deliverTo: string;
  loading: string;
  googleMapsError: string;
  locationError: string;
  manualEntryRequired: string;
  details: {
    street: string;
    interior: string;
    example: string;
    neighborhood: string;
    city: string;
    zipCode: string;
    instructions: string;
  };
  save: string;
  empty: string;
  noneSaved: string;
}

export interface AuthTranslations {
  login: {
    title: string;
    description: string;
    button: string;
    haveAccount: string;
  };
  signup: {
    title: string;
    description: string;
    button: string;
    noAccount: string;
  };
  form: {
    email: string;
    emailPlaceholder: string;
    password: string;
    processing: string;
  };
  oauth: {
    continueWith: string;
    google: string;
    phone: string;
  };
  messages: {
    verificationNeeded: string;
    signupSuccess: string;
    checkEmail: string;
    loginSuccess: string;
    unexpectedError: string;
    oauthError: string;
  };
  logout: string;
}

export interface ProfileTranslations {
  title: string;
  description: string;
  personalInfo: {
    title: string;
    fullName: string;
    fullNamePlaceholder: string;
    fullNameRequired: string;
    email: string;
    emailPlaceholder: string;
    saveChanges: string;
    updateSuccess: string;
    updateError: string;
    loadError: string;
  };
  security: {
    title: string;
    description: string;
    changePassword: string;
  };
  preferences: string;
  prefsDescription: string;
  setLanguage: string;
  setTheme: string;
  addresses: {
    title: string;
    add: string;
    primary: string;
    noAddresses: string;
  };
  loginRequired: string;
  loginMessage: string;
}

export interface StoreTranslations {
  minOrder: string;
  noMinimum: string;
  cashback: string;
  free: string;
  deliveryTime: string;
  status: {
    open: string;
    schedule: string;
    closed: string;
  };
  list: {
    all: string;
    near: string;
    noStores: string;
    inCategory: string;
  };
}

export interface WalletTranslations {
  title: string;
  empty: string;
  loginRequired: string;
  loginMessage: string;
}

export interface FavoritesTranslations {
  title: string;
  empty: string;
  loginRequired: string;
  loginMessage: string;
}

export interface OrdersTranslations {
  title: string;
  empty: string;
  loginRequired: string;
  loginMessage: string;
}

export interface ErrorTranslations {
  notFound: {
    title: string;
    description: string;
    action: string;
  };
}

export interface ProductTranslations {
  description: {
    classicBurger: string;
  };
  outOfStock: string;
  addToCart: string;
  quantity: string;
}

export interface LandingTranslations {
  login: string;
  signup: string;
  continueAsGuest: string;
  benefits: {
    title: string;
    saveAddresses: string;
    trackOrders: string;
    manageWallet: string;
    saveFavorites: string;
  };
  hero: {
    title: string;
    subtitle: string;
    cta: string;
  };
}

export interface TranslationResources {
  common: CommonTranslations;
  navigation: NavigationTranslations;
  address: AddressTranslations;
  auth: AuthTranslations;
  profile: ProfileTranslations;
  store: StoreTranslations;
  wallet: WalletTranslations;
  favorites: FavoritesTranslations;
  orders: OrdersTranslations;
  error: ErrorTranslations;
  product: ProductTranslations;
  landing: LandingTranslations;
} 