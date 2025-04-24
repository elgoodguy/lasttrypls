/**
 * Traducciones en español para la aplicación.
 * 
 * Estructura:
 * - Cada clave de primer nivel representa una característica o sección de la app
 * - Las claves anidadas representan elementos específicos de la UI o mensajes
 * - Todas las claves deben coincidir con los tipos definidos en types.ts
 * 
 * Uso:
 * - Usar la función t() de react-i18next para acceder a las traducciones
 * - Ejemplo: t('common.welcome') -> "Bienvenido"
 * 
 * Formato:
 * - Usar {variable} para contenido dinámico
 * - Usar etiquetas HTML para formato cuando sea necesario
 * - Mantener las traducciones concisas y claras
 */

import { TranslationResources } from '../types';

export const esTranslations: TranslationResources = {
  common: {
    welcome: 'Bienvenido',
    loading: 'Cargando...',
    error: 'Ocurrió un error',
    save: 'Guardar',
    cancel: 'Cancelar',
    delete: 'Eliminar',
    edit: 'Editar',
    saving: 'Guardando...',
    confirm: 'Confirmar',
    continue: 'Continuar',
    min: 'Mín.',
    search: 'Buscar tiendas o productos...',
    hi: '¡Hola!',
    back: 'Volver',
    buttons: {
      change: 'Cambiar'
    }
  },
  navigation: {
    home: 'Inicio',
    favorites: 'Favoritos',
    orders: 'Pedidos',
    wallet: 'Billetera',
    profile: 'Perfil',
    setlocation: 'Establecer Ubicación',
    guest: 'Invitado',
    search: 'Buscar',
    notifications: 'Notificaciones'
  },
  address: {
    title: 'Direcciones',
    add: 'Agregar Dirección',
    addNew: 'Agregar Nueva Dirección',
    addSuccess: 'Dirección agregada exitosamente',
    addError: 'Error al agregar dirección',
    updateSuccess: 'Dirección actualizada exitosamente',
    updateError: 'Error al actualizar dirección',
    deleteSuccess: 'Dirección eliminada exitosamente',
    deleteError: 'Error al eliminar dirección',
    deleteErrorUnauthorized: 'No estás autorizado para eliminar esta dirección',
    search: 'Buscar',
    searchTitle: 'Buscar Dirección',
    searchPlaceholder: 'Ingresa tu dirección',
    searchAddress: 'Buscar Dirección',
    useLocation: 'Usar Ubicación',
    useMyLocation: 'Usar Mi Ubicación',
    manage: 'Administrar Direcciones',
    setPrimary: 'Establecer como Principal',
    addTitle: 'Agregar Nueva Dirección',
    editTitle: 'Editar Dirección',
    modalDescription: 'Por favor ingresa los detalles de tu dirección abajo',
    forceModalDescription: 'Por favor agrega una dirección de entrega para continuar',
    gettingLocation: 'Obteniendo tu ubicación...',
    deliverTo: 'Entregar a',
    loading: 'Cargando direcciones...',
    googleMapsError: 'Error al cargar Google Maps',
    locationError: 'Error al obtener tu ubicación',
    manualEntryRequired: 'Entrada manual requerida',
    primary: 'Principal',
    details: {
      street: 'Calle',
      interior: 'Número Interior',
      example: 'Ejemplo: Depto 4B, Suite 123',
      neighborhood: 'Colonia',
      city: 'Ciudad',
      zipCode: 'Código Postal',
      instructions: 'Instrucciones de Entrega',
    },
    save: 'Guardar Dirección',
    empty: 'No se encontraron direcciones',
    noneSaved: 'No hay direcciones guardadas'
  },
  auth: {
    signIn: 'Iniciar Sesión',
    signUp: 'Registrarse',
    signOut: 'Cerrar Sesión',
    login: {
      title: 'Iniciar Sesión',
      description: 'Inicia sesión para acceder a tu cuenta',
      button: 'Iniciar Sesión',
      haveAccount: '¿Ya tienes una cuenta?'
    },
    signup: {
      title: 'Registrarse',
      description: 'Crea una cuenta para comenzar',
      button: 'Registrarse',
      noAccount: '¿No tienes una cuenta?'
    },
    form: {
      email: 'Correo Electrónico',
      emailPlaceholder: 'tú@ejemplo.com',
      password: 'Contraseña',
      processing: 'Procesando...'
    },
    oauth: {
      continueWith: 'O continuar con',
      google: 'Google',
      phone: 'Teléfono (OTP)'
    },
    messages: {
      verificationNeeded: 'Registro exitoso, pero el usuario necesita verificación. Por favor, revisa tu correo electrónico.',
      signupSuccess: '¡Registro exitoso! Ahora estás conectado.',
      checkEmail: '¡Registro exitoso! Por favor, revisa tu correo electrónico para verificar tu cuenta.',
      loginSuccess: '¡Inicio de sesión exitoso!',
      unexpectedError: 'Ocurrió un error inesperado.',
      oauthError: 'Error al iniciar sesión con'
    },
    logout: 'Cerrar Sesión'
  },
  profile: {
    title: 'Configuración de Perfil',
    description: 'Administra los detalles de tu cuenta',
    personalInfo: {
      title: 'Información Personal',
      fullName: 'Nombre Completo',
      fullNamePlaceholder: 'Ingresa tu nombre completo',
      fullNameRequired: 'El nombre completo es requerido',
      email: 'Correo electrónico',
      emailPlaceholder: 'tu@ejemplo.com',
      saveChanges: 'Guardar Cambios',
      updateSuccess: '¡Perfil actualizado exitosamente!',
      updateError: 'Error al actualizar perfil: ',
      loadError: 'Error al cargar perfil'
    },
    security: {
      title: 'Seguridad',
      description: 'Administra tu contraseña',
      changePassword: 'Cambiar Contraseña'
    },
    preferences: 'Preferencias',
    prefsDescription: 'Configura tu idioma y tema',
    setLanguage: 'Idioma',
    setTheme: 'Tema',
    addresses: {
      title: 'Direcciones de Entrega',
      add: 'Agregar Dirección',
      primary: 'Dirección Principal',
      noAddresses: 'No has agregado ninguna dirección. Agrega tu primera dirección de entrega.',
      confirmDelete: '¿Estás seguro que deseas eliminar esta dirección?',
      address: 'Dirección'
    },
    loginRequired: 'Inicio de sesión requerido',
    loginMessage: 'Inicia sesión para ver esta página'
  },
  store: {
    minOrder: 'Pedido Mín.',
    noMinimum: 'Sin mínimo',
    cashback: 'Cashback',
    free: 'Gratis',
    deliveryTime: 'min',
    status: {
      open: 'Abierto',
      closed: 'Cerrado',
      schedule: 'Horario'
    },
    list: {
      all: 'Todo',
      near: 'Tiendas cerca de',
      noStores: 'No hay tiendas que entreguen en',
      inCategory: 'en'
    }
  },
  landing: {
    login: 'Iniciar sesión',
    signup: 'Registrarse',
    continueAsGuest: 'Continuar como invitado',
    benefits: {
      title: '¿Por qué crear una cuenta?',
      saveAddresses: 'Guarda y gestiona tus direcciones de entrega',
      trackOrders: 'Sigue tus pedidos en tiempo real',
      manageWallet: 'Gestiona tu billetera y pagos',
      saveFavorites: 'Guarda tus tiendas y productos favoritos'
    },
    hero: {
      title: 'Tus tiendas favoritas, entregadas en tu puerta',
      subtitle: 'Recibe todo lo que necesitas de tiendas locales en minutos',
      cta: 'Empieza a comprar'
    }
  },
  favorites: {
    title: 'Mis Favoritos',
    empty: 'Aún no hay favoritos',
    loginRequired: 'Inicio de sesión requerido',
    loginMessage: 'Inicia sesión para ver tus favoritos'
  },
  orders: {
    title: 'Mis Pedidos',
    empty: 'No tienes pedidos recientes',
    loginRequired: 'Inicio de sesión requerido',
    loginMessage: 'Inicia sesión para ver tus pedidos'
  },
  wallet: {
    title: 'Mi Billetera',
    empty: 'No hay fondos disponibles',
    loginRequired: 'Inicio de sesión requerido',
    loginMessage: 'Inicia sesión para ver tu billetera'
  },
  notifications: {
    title: 'Notificaciones',
    empty: 'Aún no tienes notificaciones'
  },
  error: {
    notFound: {
      title: 'Página No Encontrada',
      description: 'La página que buscas no existe.',
      action: 'Volver al inicio'
    }
  },
  product: {
    description: {
      classicBurger: 'Hamburguesa clásica con lechuga, tomate y queso'
    },
    outOfStock: 'Agotado',
    addToCart: 'Agregar al carrito',
    quantity: 'Cantidad',
    notes: 'Instrucciones Especiales',
    notesPlaceholder: 'Agrega instrucciones o solicitudes especiales',
    included: 'Incluido',
    addedToCart: '¡Producto añadido al carrito!',
    loadingDetails: 'Cargando detalles del producto...'
  },
  cart: {
    title: 'Carrito de Compras',
    description: 'Tu carrito de compras',
    empty: 'Tu carrito está vacío',
    storeIdLabel: 'ID de Tienda',
    productImageAlt: 'Imagen del producto',
    notesPlaceholder: 'Agregar instrucciones especiales',
    continueShopping: 'Continuar Comprando',
    proceedToCheckout: 'Proceder al Pago'
  },
  checkout: {
    title: 'Finalizar Pedido',
    sections: {
      deliveryAddress: 'Dirección de Entrega',
      payment: 'Método de Pago',
      contact: 'Información de Contacto',
      tip: 'Propina',
      order: 'Tu Pedido',
      note: 'Notas del Pedido',
    },
    deliveryTime: {
      title: 'Horario de Entrega',
      express: 'Entrega Express',
      expressDescription: 'Recibe tu pedido lo antes posible (20-45 mins)',
      scheduled: 'Entrega Programada',
      scheduledDescription: 'Elige una fecha y hora específica para tu entrega',
      selectTime: 'Seleccionar Hora',
      confirm: 'Confirmar Horario',
      change: 'Cambiar Horario',
    },
    labels: {
      subtotal: 'Subtotal',
      deliveryFee: 'Costo de Envío',
      total: 'Total',
    },
    placeholders: {
      notes: 'Agrega instrucciones especiales...',
    },
    buttons: {
      selectPayment: 'Seleccionar Método de Pago',
      addContact: 'Agregar Información de Contacto',
      addTip: 'Agregar Propina',
      placeOrder: 'Realizar Pedido',
    },
    addressSelector: {
      title: 'Seleccionar Dirección de Entrega'
    },
    noDeliveryAddress: 'Por favor selecciona una dirección de entrega',
    emptyCart: 'Tu carrito está vacío',
  }
}; 