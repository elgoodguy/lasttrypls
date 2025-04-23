/**
 * English translations for the application.
 * 
 * Structure:
 * - Each top-level key represents a feature or section of the app
 * - Nested keys represent specific UI elements or messages
 * - All keys must match the types defined in types.ts
 * 
 * Usage:
 * - Use the t() function from react-i18next to access translations
 * - Example: t('common.welcome') -> "Welcome"
 * 
 * Formatting:
 * - Use {variable} for dynamic content
 * - Use HTML tags for formatting when needed
 * - Keep translations concise and clear
 */

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
    hi: 'Hi',
    back: 'Back',
    buttons: {
      change: 'Change'
    }
  },
  navigation: {
    home: 'Home',
    favorites: 'Favorites',
    orders: 'Orders',
    wallet: 'Wallet',
    profile: 'Profile',
    setlocation: 'Set Location',
    guest: 'Guest',
    search: 'Search',
    notifications: 'Notifications'
  },
  address: {
    title: 'Addresses',
    add: 'Add address',
    addNew: 'New address',
    addSuccess: 'Address added successfully!',
    addError: 'Error adding address',
    updateSuccess: 'Address updated successfully!',
    updateError: 'Error updating address',
    deleteSuccess: 'Address deleted successfully!',
    deleteError: 'Error deleting address',
    deleteErrorUnauthorized: 'You are not authorized to delete this address',
    search: 'Search address',
    searchTitle: 'Search Address',
    searchPlaceholder: 'Enter an address',
    searchAddress: 'Search Address',
    useLocation: 'Use my location',
    useMyLocation: 'Use my location',
    manage: 'Manage Addresses',
    setPrimary: 'Set as Primary',
    addTitle: 'Add Address',
    editTitle: 'Edit Address',
    modalDescription: 'Enter your address details',
    forceModalDescription: 'Please add an address to continue',
    gettingLocation: 'Getting location...',
    deliverTo: 'Deliver to',
    loading: 'Loading...',
    googleMapsError: 'Error loading Google Maps',
    locationError: 'Error getting location',
    manualEntryRequired: 'Search and geolocation features are not available. Please enter your address manually.',
    details: {
      street: 'Street Address',
      interior: 'Interior Number',
      example: 'Example',
      neighborhood: 'Neighborhood',
      city: 'City',
      zipCode: 'ZIP Code',
      instructions: 'Delivery Instructions'
    },
    save: 'Save Address',
    empty: 'No saved addresses',
    noneSaved: 'No saved addresses'
  },
  auth: {
    login: {
      title: 'Log In',
      description: 'Log in to access your account',
      button: 'Log In',
      haveAccount: 'Already have an account?'
    },
    signup: {
      title: 'Sign Up',
      description: 'Create an account to get started',
      button: 'Sign Up',
      noAccount: "Don't have an account?"
    },
    form: {
      email: 'Email',
      emailPlaceholder: 'you@example.com',
      password: 'Password',
      processing: 'Processing...'
    },
    oauth: {
      continueWith: 'Or continue with',
      google: 'Google',
      phone: 'Phone (OTP)'
    },
    messages: {
      verificationNeeded: 'Signup successful, but user needs verification. Please check your email.',
      signupSuccess: 'Signup successful! You are now logged in.',
      checkEmail: 'Signup successful! Please check your email to verify your account.',
      loginSuccess: 'Login successful!',
      unexpectedError: 'An unexpected error occurred.',
      oauthError: 'Failed to sign in with'
    },
    logout: 'Log Out'
  },
  profile: {
    title: 'Profile Settings',
    description: 'Manage your account details',
    personalInfo: {
      title: 'Personal Information',
      fullName: 'Full Name',
      fullNamePlaceholder: 'Enter your full name',
      fullNameRequired: 'Full name is required',
      email: 'Email',
      emailPlaceholder: 'you@email.com',
      saveChanges: 'Save Changes',
      updateSuccess: 'Profile updated successfully!',
      updateError: 'Failed to update profile: ',
      loadError: 'Error loading profile'
    },
    security: {
      title: 'Security',
      description: 'Manage your password',
      changePassword: 'Change Password'
    },
    preferences: 'Preferences',
    prefsDescription: 'Configure your language and theme',
    setLanguage: 'Language',
    setTheme: 'Theme',
    addresses: {
      title: 'My Addresses',
      add: 'Add Address',
      primary: 'Primary Address',
      noAddresses: 'You haven\'t added any addresses. Add your first delivery address.',
      confirmDelete: 'Are you sure you want to delete this address?'
    },
    loginRequired: 'Login required',
    loginMessage: 'Log in to see this page'
  },
  store: {
    minOrder: 'Minimum order',
    noMinimum: 'No minimum',
    cashback: 'Cashback',
    free: 'Free',
    deliveryTime: 'Delivery Time',
    status: {
      open: 'Open',
      schedule: 'Scheduled',
      closed: 'Closed'
    },
    list: {
      all: 'All',
      near: 'Stores near',
      noStores: 'No stores found delivering to',
      inCategory: 'in'
    }
  },
  landing: {
    login: 'Login',
    signup: 'Sign up',
    continueAsGuest: 'Continue as Guest',
    benefits: {
      title: 'Why create an account?',
      saveAddresses: 'Save and manage your delivery addresses',
      trackOrders: 'Track your orders in real-time',
      manageWallet: 'Manage your wallet and payments',
      saveFavorites: 'Save your favorite stores and items'
    },
    hero: {
      title: 'Your favorite stores, delivered to your door',
      subtitle: 'Get everything you need from local stores delivered in minutes',
      cta: 'Start shopping'
    }
  },
  favorites: {
    title: 'My Favorites',
    empty: 'No favorites yet',
    loginRequired: 'Login required',
    loginMessage: 'Log in to see your favorites'
  },
  orders: {
    title: 'My Orders',
    empty: 'No recent orders',
    loginRequired: 'Login required',
    loginMessage: 'Log in to see your orders'
  },
  wallet: {
    title: 'My Wallet',
    empty: 'No funds available',
    loginRequired: 'Login required',
    loginMessage: 'Log in to see your wallet'
  },
  notifications: {
    title: 'Notifications',
    empty: 'You have no notifications yet'
  },
  error: {
    notFound: {
      title: 'Page Not Found',
      description: 'The page you are looking for does not exist.',
      action: 'Go back home'
    }
  },
  product: {
    description: {
      classicBurger: 'Classic burger with lettuce, tomato, and cheese'
    },
    outOfStock: 'Out of stock',
    addToCart: 'Add to cart',
    quantity: 'Quantity',
    notes: 'Special Instructions',
    notesPlaceholder: 'Add any special instructions or requests',
    included: 'Included',
    addedToCart: 'Item added to cart!'
  },
  cart: {
    title: 'Your Cart',
    description: 'Review your products before proceeding to checkout',
    storeIdLabel: 'Store ID:',
    productImageAlt: 'Image',
    notesPlaceholder: 'General Order Notes',
    continueShopping: 'Continue Shopping',
    proceedToCheckout: 'Proceed to Checkout'
  },
  checkout: {
    title: 'Checkout',
    sections: {
      deliveryAddress: 'Delivery Address',
      payment: 'Payment Method',
      contact: 'Contact Information',
      tip: 'Add a Tip',
      order: 'Order Summary',
      note: 'Order Notes'
    },
    labels: {
      subtotal: 'Subtotal',
      total: 'Total',
      deliveryFee: 'Delivery Fee',
      tip: 'Tip',
      notes: 'Additional Notes'
    },
    placeholders: {
      notes: 'Add any special instructions or requests'
    },
    buttons: {
      placeOrder: 'Place Order',
      addNewAddress: 'Add New Address',
      selectPayment: 'Select Payment Method',
      addContact: 'Add Contact Info',
      addTip: 'Add Tip',
      change: 'Change'
    },
    addressSelector: {
      title: 'Select Delivery Address'
    },
    noDeliveryAddress: 'Please add a delivery address'
  }
}; 