// Exporta el CSS para que Tailwind funcione en las apps
import './styles.css';

// Exporta utilidades
export { cn } from './lib/utils';

// Exporta componentes comunes
export * from './components/common';

// Exporta componentes de UI
export * from './components/ui';

// Exporta componentes de navegación
export * from './components/navigation/BottomNavBar';
export * from './components/navigation/UserMenu';

// Exporta componentes de entrada
export * from './components/input/AutocompleteInput';

// Exporta componentes de dirección
export * from './components/address/AddressSelector';

// Exporta componentes de tienda
export * from './components/store/StoreStatusIndicator';

// Exporta componentes de producto
export { ProductCard } from './components/ProductCard';
