# Convenciones de Importación y Exportación

## Introducción

Esta guía establece las convenciones y mejores prácticas para importaciones y exportaciones en nuestro proyecto de monorepo. Seguir estas convenciones asegura la consistencia del código, facilita el mantenimiento y evita problemas comunes relacionados con las importaciones.

## Principios Generales

1. **Claridad**: Las importaciones y exportaciones deben ser claras y explícitas.
2. **Consistencia**: Usar los mismos patrones en todo el proyecto.
3. **Mantenibilidad**: Facilitar la refactorización y el mantenimiento del código.
4. **Modularidad**: Promover la separación de responsabilidades y la encapsulación.

## Convenciones para Barrel Files

### ¿Qué es un Barrel File?

Un barrel file es un archivo (generalmente llamado `index.ts` o `index.tsx`) que re-exporta módulos desde múltiples archivos, simplificando las importaciones.

### Estructura de Barrel Files

- **Nivel de Paquete**: Cada paquete debe tener un archivo `index.ts` o `index.tsx` en su raíz que exporte todo lo que debe ser accesible externamente.
- **Nivel de Categoría**: Dentro de cada paquete, las carpetas que representan categorías (como `components/common`, `components/ui`, etc.) deben tener su propio barrel file.
- **Agrupación Lógica**: Los componentes o funciones relacionados deben exportarse juntos desde el mismo barrel file.

### Reglas para Exportaciones

1. **Preferir Exportaciones Nombradas**: 
   ```typescript
   // Preferido
   export { Button } from './Button';
   
   // Evitar
   export default Button;
   ```

2. **Re-exportaciones Explícitas**:
   ```typescript
   // Preferido
   export { Button } from './button';
   export { Card, CardHeader, CardContent } from './card';
   
   // Evitar (no es claro qué se está exportando)
   export * from './button';
   export * from './card';
   ```

3. **Agrupar con Comentarios**:
   ```typescript
   // Componentes básicos
   export { Button } from './button';
   export { Input } from './input';
   
   // Componentes de diálogo
   export { Dialog, DialogContent } from './dialog';
   ```

### Ejemplo de Barrel File Bien Estructurado

```typescript
// packages/ui/src/index.tsx

// Utilidades
export { cn } from './lib/utils';

// Componentes comunes
export { GlobalLoader } from './components/common/GlobalLoader';
export { LanguageToggle } from './components/common/LanguageToggle';

// Componentes de UI
export { Button, buttonVariants } from './components/ui/button';
export { Card, CardHeader, CardContent } from './components/ui/card';
```

## Convenciones para Alias de Importación

### Configuración de Alias

- **Aplicaciones**: Usar el alias `@/` para referenciar la carpeta `src/` local.
   ```typescript
   // En apps/customer-pwa/src/App.tsx
   import { HomePage } from '@/pages/HomePage';
   ```

- **Paquetes**: Usar el prefijo `@repo/` para importar desde otros paquetes.
   ```typescript
   // En cualquier archivo
   import { Button } from '@repo/ui';
   import { useGeolocation } from '@repo/hooks';
   ```

- **Importaciones Relativas**: Usar solo cuando los archivos están en la misma carpeta o en carpetas directamente relacionadas.
   ```typescript
   // En packages/ui/src/components/navigation/UserMenu.tsx
   import { Avatar } from '../ui/avatar';
   ```

### Configuración Técnica

La configuración de alias se realiza en:

1. **TypeScript**: En el archivo `tsconfig.json` de cada paquete/aplicación:
   ```json
   {
     "compilerOptions": {
       "baseUrl": ".",
       "paths": {
         "@/*": ["./src/*"],
         "@repo/*": ["../../packages/*/src"]
       }
     }
   }
   ```

2. **Vite**: En el archivo `vite.config.ts` de cada aplicación:
   ```typescript
   export default defineConfig({
     resolve: {
       alias: {
         '@': path.resolve(__dirname, './src'),
         '@repo/ui': path.resolve(__dirname, '../../packages/ui/src'),
         // ...otros paquetes
       }
     }
   });
   ```

## Casos Especiales

### Importaciones Circulares

Las importaciones circulares ocurren cuando dos módulos se importan entre sí, directa o indirectamente. Para evitarlas:

1. Reorganizar el código para eliminar la dependencia circular
2. Crear un tercer módulo que contenga la funcionalidad compartida
3. En casos extremos, usar la importación dinámica (`import()`)

### Componentes con Dependencias Condicionales

Para componentes con dependencias opcionales o que solo se cargan en ciertas condiciones:

```typescript
// Carga dinámica
const HeavyComponent = React.lazy(() => import('./HeavyComponent'));

// Uso
{shouldRender && (
  <React.Suspense fallback={<Loader />}>
    <HeavyComponent />
  </React.Suspense>
)}
```

### Optimización de Importaciones

Para reducir el tamaño del bundle:

1. Importar solo lo que se necesita:
   ```typescript
   // Preferido
   import { Button } from '@repo/ui';
   
   // Evitar (importa todo el paquete)
   import * as UI from '@repo/ui';
   UI.Button;
   ```

2. Utilizar code-splitting con importaciones dinámicas:
   ```typescript
   // Rutas con carga dinámica
   const ProfilePage = React.lazy(() => import('@/pages/ProfilePage'));
   ```

## Lista de Verificación

Utiliza esta lista para verificar que estás siguiendo las convenciones:

- [ ] ¿Las exportaciones son nombradas y explícitas?
- [ ] ¿Los barrel files están organizados con comentarios descriptivos?
- [ ] ¿Se están utilizando alias para las importaciones (`@/` y `@repo/`)?
- [ ] ¿Las importaciones relativas se usan solo cuando es necesario?
- [ ] ¿Se han evitado las importaciones circulares?
- [ ] ¿Se está importando solo lo necesario (no importaciones con `*`)?

## Herramientas

Herramientas que pueden ayudar a mantener las convenciones:

- **ESLint**: Reglas para importaciones, como `import/order` y `import/no-cycle`
- **Import Sort**: Ordena automáticamente las importaciones
- **TypeScript Path Aliases**: Verificación de rutas de alias

## Conclusión

Seguir estas convenciones nos permite:
- Mantener un código más limpio y legible
- Evitar errores comunes relacionados con importaciones
- Facilitar la refactorización y el mantenimiento
- Optimizar el rendimiento de la aplicación

Si tienes preguntas o sugerencias sobre estas convenciones, consulta con el equipo de desarrollo. 