import { TranslationResources } from '../types';

export const enTranslations: TranslationResources = {
  common: {
    welcome: 'Welcome',
    loading: 'Loading...',
    error: 'An error occurred',
    save: 'Save',
    cancel: 'Cancel',
    delete: 'Delete',
    edit: 'Edit',
    saving: 'Saving...',
    confirm: 'Confirm',
    continue: 'Continue',
    min: 'Min.',
    search: 'Search stores or products...',
    hi: 'Hi, there!',
    back: 'Back'
  },
  navigation: {
    home: 'Home',
    about: 'About',
    contact: 'Contact',
    favorites: 'Favorites',
    orders: 'Orders',
    wallet: 'Wallet',
    cart: 'Cart',
    profile: 'Profile',
    search: 'Search',
    setlocation: 'Set location',
    notifications: 'Notifications'
  },
  address: {
    title: 'Delivery Addresses',
    add: 'Add address',
    addNew: 'New address',
    search: 'Search address',
    useLocation: 'Use my location',
    manage: 'Manage addresses',
    setPrimary: 'Set as primary',
    addTitle: 'Add Address',
    editTitle: 'Edit Address',
    modalDescription: 'Add or edit your address',
    forceModalDescription: 'Please add an address to continue',
    deliverTo: 'Deliver to:',
    loading: 'Loading addresses...',
    googleMapsError: 'Google Maps service is not available',
    locationError: 'Error getting location',
    manualEntryRequired: 'Search and geolocation features are not available. Please enter your address manually.',
    details: {
      street: 'Street and number',
      interior: 'Interior number (optional)',
      neighborhood: 'Neighborhood',
      city: 'City',
      zipCode: 'ZIP Code',
      instructions: 'Delivery instructions (optional)',
      example: 'Ex: Ring the bell twice'
    },
    save: 'Save address',
    empty: 'No saved addresses'
  },
  auth: {
    email: 'Email',
    password: 'Password',
    confirmPassword: 'Confirm Password',
    forgotPassword: 'Forgot Password?',
    rememberMe: 'Remember Me',
    noAccount: "Don't have an account?",
    haveAccount: 'Already have an account?',
    logout: 'Log Out',
    signup: 'Sign Up',
    login: 'Log In'
  },
  profile: {
    title: 'Profile Settings',
    description: 'Manage your account details',
    preferences: 'Preferences',
    prefsDescription: 'Set your language and theme',
    setLanguage: 'Language',
    setTheme: 'Theme'
  },
  store: {
    nearLocation: 'Stores near {location}',
    categories: {
      all: 'All',
      restaurants: 'Restaurants',
      cafes: 'Cafes',
      food: 'Food'
    },
    status: {
      open: 'Open',
      closed: 'Closed',
      schedule: 'Schedule'
    },
    minOrder: 'Min. Order',
    noMinimum: 'No minimum',
    deliveryTime: 'min',
    rating: 'Rating',
    reviews: 'reviews',
    cashback: 'Cashback',
    free: 'Free'
  },
  wallet: {
    title: 'My Wallet',
    empty: 'No payment methods configured'
  },
  favorites: {
    title: 'My Favorites',
    empty: 'No favorites yet'
  },
  orders: {
    title: 'My Orders',
    empty: 'No recent orders'
  },
  error: {
    notFound: {
      title: '404',
      description: 'Page not found',
      action: 'Back to home'
    }
  },
  product: {
    description: {
      classicBurger: 'Delicious burger with beef, lettuce, tomato and cheese'
    }
  }
}; 