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
    back: 'Volver'
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
    title: 'Direcciones de entrega',
    add: 'Agregar dirección',
    addNew: 'Nueva dirección',
    addSuccess: '¡Dirección agregada exitosamente!',
    search: 'Buscar dirección',
    searchTitle: 'Buscar Dirección',
    searchPlaceholder: 'Ingresa una ubicación para buscar',
    searchAddress: 'Buscar dirección',
    useLocation: 'Usar mi ubicación',
    useMyLocation: 'Usar mi ubicación',
    manage: 'Administrar direcciones',
    setPrimary: 'Establecer como principal',
    addTitle: 'Agregar dirección',
    editTitle: 'Editar dirección',
    modalDescription: 'Agregar o editar tu dirección',
    forceModalDescription: 'Por favor agrega una dirección para continuar',
    gettingLocation: 'Obteniendo ubicación...',
    deliverTo: 'Entregar a:',
    loading: 'Cargando direcciones...',
    googleMapsError: 'El servicio de Google Maps no está disponible',
    locationError: 'Error al obtener la ubicación',
    manualEntryRequired: 'Las funciones de búsqueda y geolocalización no están disponibles. Por favor, ingresa tu dirección manually.',
    details: {
      street: 'Calle y número',
      interior: 'Número interior (opcional)',
      neighborhood: 'Colonia',
      city: 'Ciudad',
      zipCode: 'Código Postal',
      instructions: 'Instrucciones de entrega (opcional)',
      example: 'Ej: Tocar el timbre dos veces'
    },
    save: 'Guardar dirección',
    empty: 'No tienes direcciones guardadas',
    noneSaved: 'No hay direcciones guardadas'
  },
  auth: {
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
      noAddresses: 'No has agregado ninguna dirección. Agrega tu primera dirección de entrega.'
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
    title: 'Mis Notificaciones',
    empty: 'No hay notificaciones',
    loginRequired: 'Inicio de sesión requerido',
    loginMessage: 'Inicia sesión para ver tus notificaciones'
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
    quantity: 'Cantidad'
  }
}; 