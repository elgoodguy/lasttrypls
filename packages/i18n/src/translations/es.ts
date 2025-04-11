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
    min: 'Min.',
    search: 'Buscar tiendas o productos...',
    hi: '¡Hola!',
    back: 'Volver'
  },
  navigation: {
    home: 'Inicio',
    about: 'Acerca de',
    contact: 'Contacto',
    favorites: 'Favoritos',
    orders: 'Pedidos',
    wallet: 'Billetera',
    cart: 'Carrito',
    profile: 'Perfil',
    search: 'Buscar',
    setlocation: 'Establecer ubicación',
    notifications: 'Notificaciones'
  },
  address: {
    title: 'Direcciones de entrega',
    add: 'Agregar dirección',
    addNew: 'Nueva dirección',
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
    deliverTo: 'Entregar a:',
    loading: 'Cargando direcciones...',
    googleMapsError: 'El servicio de Google Maps no está disponible',
    locationError: 'Error al obtener la ubicación',
    manualEntryRequired: 'Las funciones de búsqueda y geolocalización no están disponibles. Por favor, ingresa tu dirección manualmente.',
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
    email: 'Correo electrónico',
    password: 'Contraseña',
    confirmPassword: 'Confirmar Contraseña',
    forgotPassword: '¿Olvidaste tu contraseña?',
    rememberMe: 'Recordarme',
    noAccount: '¿No tienes una cuenta?',
    haveAccount: '¿Ya tienes una cuenta?',
    logout: 'Cerrar Sesión',
    signup: 'Registrarse',
    login: 'Iniciar Sesión'
  },
  profile: {
    title: 'Configuración de Perfil',
    description: 'Administra los detalles de tu cuenta',
    personalInfo: 'Información Personal',
    fullName: 'Nombre Completo',
    fullNamePlaceholder: 'Ingresa tu nombre completo',
    email: 'Correo electrónico',
    saveChanges: 'Guardar Cambios',
    addresses: {
      title: 'Direcciones de Entrega',
      add: 'Agregar Dirección',
      primary: 'Dirección Principal',
      address: 'Dirección',
      instructions: 'Instrucciones',
      confirmDelete: '¿Estás seguro que deseas eliminar esta dirección?',
      noAddresses: 'No has agregado ninguna dirección. Agrega tu primera dirección de entrega.'
    },
    security: {
      title: 'Seguridad',
      description: 'Administra tu contraseña',
      changePassword: 'Cambiar Contraseña'
    },
    preferences: 'Preferencias',
    prefsDescription: 'Configura tu idioma y tema',
    setLanguage: 'Idioma',
    setTheme: 'Tema'
  },
  store: {
    nearLocation: 'Tiendas cerca de {location}',
    categories: {
      all: 'Todas',
      restaurants: 'Restaurantes',
      cafes: 'Cafeterías',
      food: 'Comida'
    },
    status: {
      open: 'Abierto',
      closed: 'Cerrado',
      schedule: 'Horario'
    },
    minOrder: 'Pedido Mín.',
    noMinimum: 'Sin mínimo',
    deliveryTime: 'min',
    rating: 'Calificación',
    reviews: 'reseñas',
    cashback: 'Cashback',
    free: 'Gratis'
  },
  wallet: {
    title: 'Mi Billetera',
    empty: 'No hay métodos de pago configurados'
  },
  favorites: {
    title: 'Mis Favoritos',
    empty: 'No tienes favoritos aún'
  },
  orders: {
    title: 'Mis Pedidos',
    empty: 'No tienes pedidos recientes'
  },
  error: {
    notFound: {
      title: '404',
      description: 'Página no encontrada',
      action: 'Volver al inicio'
    }
  },
  landing: {
    login: 'Iniciar sesión',
    signup: 'Registrarse',
    hero: {
      title: 'Tus tiendas favoritas, entregadas a tu puerta',
      subtitle: 'Recibe todo lo que necesitas de tiendas locales en minutos',
      cta: 'Empieza a comprar',
    },
  },
  product: {
    description: {
      classicBurger: 'Hamburguesa clásica con lechuga, tomate y queso',
    },
    outOfStock: 'Agotado',
    addToCart: 'Agregar al carrito',
    quantity: 'Cantidad',
  }
}; 