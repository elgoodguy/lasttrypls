// Exporta el CSS para que Tailwind funcione en las apps
import './styles.css';

// Utilidades
export { cn } from './lib/utils';

// Componentes comunes
export { GlobalLoader } from './components/common/GlobalLoader';
export { LanguageToggle } from './components/common/LanguageToggle';

// Componentes de UI
export * from './components/ui';

// Componentes de navegación
export { BottomNavBar } from './components/navigation/BottomNavBar';
export { UserMenu } from './components/navigation/UserMenu';

// Componentes de entrada
export { AutocompleteInput } from './components/input/AutocompleteInput';

// Componentes de dirección
export { AddressSelector } from './components/address/AddressSelector';

// Componentes de tienda
export { StoreStatusIndicator } from './components/store/StoreStatusIndicator';

// Componentes de producto
export { ProductCard } from './components/ProductCard';
