# Implementación de Landing Page

## Objetivo
Crear una landing page como punto de entrada principal, moviendo la página actual a `/home` y estableciendo restricciones para usuarios guest.

## Plan de Implementación

### 1. Preparación y Estructura
- [x] Crear nueva rama `feature/landing-page`
- [x] Crear nuevo componente `LandingPage`
- [x] Crear nuevo componente `GuestUserAvatar`
- [x] Crear nuevo componente `BenefitsList`

### 2. Implementación de Landing Page
- [x] Implementar layout básico de landing:
  - [x] Logo grande centrado
  - [x] Toggles de tema/idioma en esquina superior derecha
  - [x] Dos botones principales (Login/Signup y Continue as Guest)
  - [x] Sección de beneficios con bullets
- [x] Implementar navegación:
  - [x] Login/Signup > AuthModal > AddressModal > Home
  - [x] Continue as Guest > AddressModal > Home

### 3. Modificaciones en Rutas
- [x] Mover página actual de `/` a `/home`
- [x] Establecer landing page como nueva `/`
- [x] Actualizar todas las redirecciones internas
- [x] Actualizar BottomNavBar para reflejar nuevos paths

### 4. Implementación de Guest User
- [ ] Crear estado de usuario guest
- [ ] Modificar Avatar para mostrar "U" en modo guest
- [ ] Restringir opciones en dropdown de perfil:
  - Mostrar solo "User" sin email
  - Mostrar solo Preferences y Sign In
  - Ocultar Profile, Orders, Wallet
- [ ] Restringir funcionalidades de dirección:
  - Deshabilitar "Manage Address"
  - Deshabilitar "Set as Primary"
- [ ] Implementar redirección a AuthModal para funciones restringidas

### 5. Testing
- [ ] Probar flow de login/signup
- [ ] Probar flow de guest
- [ ] Verificar restricciones de usuario guest
- [ ] Verificar redirecciones
- [ ] Verificar persistencia de estado guest

### 6. Limpieza y Optimización
- [ ] Remover código no utilizado
- [ ] Optimizar imports
- [ ] Verificar performance
- [ ] Documentar cambios

### 7. Deployment
- [ ] Merge a rama principal
- [ ] Verificar deployment
- [ ] Monitorear errores post-deployment

## Notas
- Mantener los modales existentes (AuthModal y AddressModal)
- Asegurar que el estado de guest se mantenga consistente
- Implementar manejo de errores para funciones restringidas
- Considerar UX para usuarios guest 