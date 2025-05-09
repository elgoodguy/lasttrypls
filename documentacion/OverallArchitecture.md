**Documento Maestro de Especificaciones \- MVP v1.0**

**Índice:**

- **Introducción y Visión General**
- **Tecnología Stack Común**
- **Parte I: Aplicación del Cliente (PWA)**
  - A. Onboarding y Autenticación
  - B. Navegación Principal (Shell)
  - C. Home Page (Enfoque Delivery MVP)
  - D. Flujo de Compra (Delivery)
  - E. Wallet (Detallado)
  - F. Otras Secciones (Perfil, Favoritos, Notificaciones, Pedidos)
  - G. Funcionalidades PWA Específicas
-
- **Parte II: Panel de Administración (PWA)**
  - A. Acceso y Roles
  - B. Dashboard Principal
  - C. Gestión de Órdenes (Orders)
  - D. Gestión de Productos (Products)
  - E. Gestión de Inventario (Inventory)
  - F. Gestión de Tiendas (Stores)
  - G. Gestión de Grupos (Groups)
  - H. Gestión de Promociones y Cashback
  - I. Gestión de Repartidores (Drivers)
  - J. Gestión de Usuarios (Clientes \- Customers)
  - K. Gestión de Staff (Admin Users)
  - L. Configuración General (Settings)
-
- **Parte III: Aplicación del Repartidor (PWA)**
  - A. Login y Autenticación
  - B. Pantalla Principal / Dashboard (Home)
  - C. Gestión de Órdenes Asignadas
  - D. Flujo de Entrega (Pantalla de Orden Activa)
  - E. Navegación Externa
  - F. Historial de Órdenes
  - G. Saldo Pendiente / Liquidaciones
  - H. Perfil del Repartidor
-
- **Parte IV: Diseño de Base de Datos (Supabase/PostgreSQL)**
  - Tablas 1-26 (Usuarios, Perfiles, Direcciones, Grupos, Tiendas, Productos, Categorías, Modificadores, Carrito, Órdenes, Pagos, Wallet, Repartidores, Promociones, Staff, etc.)
-
- **Conclusión y Próximos Pasos**

---

**Introducción y Visión General**

Este documento detalla las especificaciones funcionales para el Producto Mínimo Viable (MVP) de la plataforma multi-servicio. La visión a largo plazo es una "Super App" con una potente Wallet, pero el MVP se centrará en perfeccionar el servicio de **Delivery** (productos de conveniencia/fiesta, potencialmente comida futura) e introducir las bases de la **Wallet** (Cashback y Métodos de Pago). La plataforma constará de tres aplicaciones front-end principales (Cliente, Admin, Repartidor) construidas como PWAs responsivas, respaldadas por un backend en Supabase.

**Tecnología Stack Común (MVP)**

- **Frontend:** React, TypeScript, Vite, Tailwind CSS, shadcn-ui.
- **UI/UX libs:** Lucide React (iconos), Recharts (gráficas admin).
- **Gestión Estado/Datos:** React Context API (estado global simple), TanStack Query (@tanstack/react-query) (gestión datos servidor).
- **Backend/Infraestructura:** Supabase (Auth, DB PostgreSQL, Storage, Edge Functions, Realtime).
- **APIs Externas Clave:** Google Maps Platform (Places, Geocoding), Pasarela de Pago (a definir), Servicio SMS (a definir).

---

**Parte I: Aplicación del Cliente (PWA)**

_(Basado en Revisión 2 \+ Wallet Revisión 1\)_

- **A. Onboarding y Autenticación**
  - **1\. Landing Page:** Input "Ingresa tu dirección" \-\> Click/Foco: Botón "Usar ubicación actual" \+ Input búsqueda manual \+ Autocomplete Google Places.
  - **2\. Modal Confirmación Dirección:** Formulario **editable** (Calle, \#Ext, \#Int, Colonia, CP, Ciudad, País, Instrucciones), Mapa pequeño Google, Botón Confirmar. Precisión alta requerida. Manejo de errores geolocalización.
  - **3\. Autenticación (Modal):**
    - Métodos: Teléfono+OTP(SMS), Email+Pass, Google Login. (FB/Apple fuera MVP).
    - Nuevo Usuario: Verificación \-\> Datos (Nombre Completo, Tel \[req\], Email \[opc\]) \-\> **Forzar "Añadir Primera Dirección"** \-\> Home.
    - Usuario Existente: Autenticación \-\> Forzar dirección si no existe \-\> Home.
    - Recuperación Contraseña: Vía email.
  -
  - **4\. Toggles Idioma/Modo:** EN(default)/ES, Dark(default)/Light. Guardado en LS (invitado) / Perfil (logueado). Migración LS-\>Perfil al registrarse.
-
- **B. Navegación Principal (Shell)**
  - **1\. Top Nav:** Ubicación (Invitado: Modal Cambio; Logueado: Dropdown direcciones+Añadir; Refresca Home), Notificaciones (Logueado, Badge, Link), Perfil/Avatar (Invitado: Modal Login; Logueado: Avatar/Iniciales, Link). **No** icono carrito aquí.
  - **2\. Bottom Nav:** Home, Favoritos (Logueado), Pedidos (Logueado), Wallet (Logueado).
  - **3\. Botón Flotante Carrito (FAB):** Visible abajo-derecha (sobre Bottom Nav) **solo si carrito \> 0 ítems**. Icono \+ Badge \# ítems. Click \-\> Pantalla Carrito.
-
- **C. Home Page (Enfoque Delivery MVP)**
  - **1\. Estructura:** Saludo (logueado), Búsqueda, Scroll H Categorías (Chips), Scroll V Secciones (ej. "Destacadas" \- curada Admin) con Scroll H Tarjetas Tienda.
  - **2\. Funcionalidad:** Búsqueda (Tienda/Producto) \-\> Pág. Resultados. Categorías \-\> Filtra Home actual. Tarjetas Tienda (Logo, Nombre, Tipo, Tiempo, Costo Envío, Indicador Cashback) \-\> Click a Vista Tienda. **No** productos sueltos en Home MVP.
-
- **D. Flujo de Compra (Delivery)**
  - **1\. Vista Tienda:** Header (Banner, Logo, Info, Rating\[futuro\], Tiempo, Costo, Horario, Cashback, Fav\[log\], Estado\[Abierta/Cerrada\], Pedido Mínimo). Body (Sección Promos/Bundles \-\> Secciones Verticales por Categoría). Lista Productos (Img, Nombre, Desc, Precio) \-\> Click a Vista Producto. Si cerrada: indica "Solo Agendar".
  - **2\. Vista Producto:** Info (Img Gde, Nombre, Desc, Precio Base). Opciones (Variantes: Tarjetas Seleccionables; Extras: Checkboxes+$). Qty \+/-, Notas Ítem. Botón "Añadir Carrito" (con precio total ítem).
  - **3\. Carrito Compras:** Acceso FAB. Items agrupados por tienda (Img, Nombre, Opc, Notas, Precio U, Qty+/-, Total Ítem, Eliminar). Resumen (Subtotal, Envío\[Lógica: Fijo/Tienda; Multi: Más Alto; Gratis si \>Umbral\], Total). Soportado Multi-Tienda (tiendas propias). Notas Generales. Botón "Checkout" (o "Agendar Pedido" si tienda cerrada; deshabilitado si \< Pedido Mínimo). Edición (Qty/Eliminar; Opciones-\>Vuelve a Vista Prod).
  - **4\. Checkout (Scrollable):** Pasos: Dir Entrega (Select/Confirmar), Contacto, Método Pago (Tarjeta\[Form/Guardadas\], Terminal, Efectivo\[Campo opc Pagaré Con\]), Cashback (Checkbox Usar), Código Promo (Input+Aplicar), Resumen Final. Botón Pagar/Confirmar. Lógica Pago Tarjeta (Ideal Autorizar-\>Capturar).
  - **5\. Confirmación Orden:** Éxito, \#Orden, Resumen, Tiempo Est, Cashback **Ganado**. Botón Cancelar (si estado permite). Flujo Cancelación (Pago Tarjeta): Modal Opción Créditos Wallet (Inmediato) / Reembolso Banco (Lento). Botón "Ver Pedidos". Widget estado en Home.
  - **6\. Seguimiento Orden (Sección "Mis Pedidos"):** Lista (Curso/Histórico). Detalle Curso (Estados Claros), Botón WhatsApp Driver (si "En Camino"), Botón Cancelar (si permite). **No** mapa driver MVP.
-
- **E. Wallet (Detallado \- Logueado)**
  - **1\. Acceso y Estructura:** Icono Bottom Nav \-\> Pestañas "Mis Saldos" y "Métodos de Pago".
  - **2\. Mis Saldos:** Sección Superior ("Créditos Disponibles: $X" \- de reembolsos). Sección Inferior (Cashback): Lista Vertical (Logo/Nombre Tienda/Grupo, Saldo $). Click \-\> Historial Cashback Tienda/Grupo. Mostrar Total Cashback. **No** expiración, **No** niveles MVP.
  - **3\. Métodos de Pago:** Lista Tarjetas Guardadas (Tokenizadas). Info (Logo, Banco?, \*\*\*\*1234, MM/AA, Indicador Predeterminada). Acciones (Añadir Nueva\[Form+Guardar\], Eliminar, Marcar Predeterminada). **CVV NUNCA se guarda**, se pide en checkout.
-
- **F. Otras Secciones (Logueado)**
  - **1\. Perfil:** Editar (Nombre, Tel, Email), Gestionar Direcciones (CRUD \+ Predet), Cambiar Pass, Prefs Idioma/Modo, Cerrar Sesión.
  - **2\. Favoritos:** Lista Tiendas/Productos guardados.
  - **3\. Notificaciones:** Lista notifs recibidas. Botón "Marcar todas leídas".
  - **4\. Historial Pedidos ("Mis Pedidos"):** Detallado en D.6.
-
- **G. Funcionalidades PWA Específicas**
  - Instalación (Manifest, Service Worker básico).
  - Offline Básico (Cache Shell, Página Offline).
  - Notificaciones Push (Service Worker, API Push \- requiere permiso).
- ***

  **Parte II: Panel de Administración (PWA)**

_(Basado en Revisión 3\)_

- **A. Acceso y Roles**
  - **1\. Login:** PWA Responsiva, Subdominio admin. Login específico (Email+Pass). Recuperación Pass.
  - **2\. Roles:** Super Admin, Group Manager, Store Manager (Filtran datos/acciones).
-
- **B. Dashboard Principal**
  - **1\. Propósito:** Vista general negocio (adaptada a rol).
  - **2\. Componentes:** Selector Periodo, KPIs (Ventas, Órdenes, Ticket Promedio, Users Nuevos, Pedidos Pendientes, Drivers Activos), Gráficas (Ventas(t), Órdenes(t), Top Prods, Top Tiendas).
-
- **C. Gestión de Órdenes (Orders)**
  - **1\. Funcionalidad:** Listado/Tabla, Filtros Avanzados, Búsqueda.
  - **2\. Vista Detallada:** Info Cliente, Items, Costos, Pago, Historial Estados, Driver, Notas.
  - **3\. Acciones (según rol/estado):** Cambiar Estado (manual), Asignar/Reasignar Driver, Marcar "Lista Recoger" (Store Mgr), Gestionar Reembolso/Cancelación (ver elección cliente, iniciar reembolso banco), Imprimir Ticket, Contactar Cliente (WhatsApp).
-
- **D. Gestión de Productos (Products)**
  - **1\. Funcionalidad:** Listado (Img, Nombre, Cat, Precios Base/Comparación, Tiendas, Estado, Tipo), Filtros, Búsqueda, Botón Añadir.
  - **2\. Vista Edición/Creación:** Nombre, Desc, Imgs, Precio Base, Precio Comparación (opc), Categorías (Select+Crear Nueva), Tiendas Disp, Gestión Modificadores (UI Grupos/Opciones), Estado, Tipo Producto (Físico/Preparado).
  - **3\. Gestión Categorías:** CRUD.
  - **4\. Visibilidad Rol:** Super Admin (Todo). Group/Store Mgr (Ven todo, Añaden/Editan productos _para sus tiendas_).
-
- **E. Gestión de Inventario (Inventory)**
  - **1\. Propósito:** Stock **solo "Productos Físicos"**.
  - **2\. Funcionalidad:** Listado (Prod, Tienda, Stock, Umbral Bajo), Filtros.
  - **3\. Acciones:** Ajustar Stock, Set Umbral. Stock disminuye auto.
  - **4\. Visibilidad Rol:** Super Admin (Todo), Group Mgr (Grupo), Store Mgr (Tienda).
-
- **F. Gestión de Tiendas (Stores)**
  - **1\. Funcionalidad:** Listado, Botón Añadir.
  - **2\. Vista Edición/Creación:** Nombre, Grupo, Dirección (Google Places+Pin), Contacto, Imgs, Horario Operación (+Horarios Especiales), Params Delivery (Tarifa, Mínimo, Tiempo Est), Zona Cobertura (Lista CPs MVP), Asignar Store Mgrs, Estado.
  - **3\. Visibilidad Rol:** Super Admin (Todo). Group Mgr (CRUD tiendas en su grupo). Store Mgr (Ve su tienda, Edita Estado Temp, Horarios Esp).
-
- **G. Gestión de Grupos (Groups)**
  - **1\. Funcionalidad:** Listado, Botón Añadir.
  - **2\. Vista Edición/Creación:** Nombre, Logo/Imagen (para Wallet), Asignar Group Mgrs.
  - **3\. Visibilidad Rol:** Solo Super Admin.
-
- **H. Gestión de Promociones y Cashback**
  - **1\. Códigos Promocionales:** CRUD. Campos: Código, Tipo(%,$), Valor, Aplicab(Pedido,Prod,Cat,Tienda), Reqs(Pedido Mín, Users Específicos), Límites(Usos Tot/User, Fechas), Estado.
  - **2\. Reglas Cashback:** CRUD. Campos: Select Tienda(s)/Grupo(s), Porcentaje(%), Estado. (Solo Super Admin).
  - **3\. Promos Automáticas/Bundles:** CRUD. Tipos MVP(CompraX-LlevaY, Bundle Precio Fijo). Campos: Nombre, Tipo, Config, Tiendas, Validez(Siempre/Fechas \- Horario Rec Fase 2), Estado.
  - **4\. Visibilidad Rol:** Super Admin (Todo). Group/Store Mgr (CRUD Promos \- Códigos y Auto \- _solo para sus tiendas_).
-
- **I. Gestión de Repartidores (Drivers)**
  - **1\. Funcionalidad:** Listado (Nombre, Tel, Estado Online/Offline, Vehículo, Pedido(s) Asignado(s)). **No** mapa tiempo real MVP. Filtros, Búsqueda, Botón Añadir.
  - **2\. Vista Perfil/Edición:** Info Personal, Credenciales, Vehículo, Documentación (CRUD+Validación), Historial Entregas, Calificaciones (Post-MVP), Estado Cuenta. **No** datos bancarios MVP.
  - **3\. Visibilidad Rol:** Super Admin.
-
- **J. Gestión de Usuarios (Clientes \- Customers)**
  - **1\. Funcionalidad:** Listado, Búsqueda, Vista Detallada (Perfil, Dirs, Hist Pedidos, Hist Wallet).
  - **2\. Acciones:** Desactivar cuenta, Reset Pass, Ajustar Créditos Wallet (con motivo).
  - **3\. Visibilidad Rol:** Super Admin.
-
- **K. Gestión de Staff (Admin Users)**
  - **1\. Funcionalidad:** Listado, Botón Invitar/Crear, Formulario (Nombre, Email, Rol, Asignación Tienda/Grupo). Acciones (Desactivar, Reset Pass).
  - **2\. Visibilidad Rol:** Solo Super Admin.
-
- **L. Configuración General (Settings)**
  - **1\. Funcionalidad:** Info Negocio, Config Pagos (Claves Pasarela, Métodos, Retención?), Config Notifs (SMS?), Params Delivery Global (Envío Gratis Umbral), Textos Legales, Modo Mantenimiento.
  - **2\. Visibilidad Rol:** Solo Super Admin.
- ***

  **Parte III: Aplicación del Repartidor (PWA)**

_(Basado en Revisión 1\)_

- **A. Login y Autenticación**
  - **1\. Login:** PWA Responsiva (Móvil focus). Login específico (Email+Pass). Recordarme. Recuperación Pass.
  - **2\. Permisos:** Solicitar Ubicación ("Mientras se usa"), Notificaciones.
-
- **B. Pantalla Principal / Dashboard (Home)**
  - **1\. Componentes:** Toggle Disponibilidad (Online/Offline), Estado Actual, Mapa Ubicación (opc MVP), Lista/Tarjetas Órdenes Asignadas (Multi-orden soportada), Widget Saldo Pendiente (Efectivo). Gamificación Fase 2\.
  - **2\. Navegación (Bottom Nav):** Home, Órdenes (Historial), Saldo (Liquidaciones), Perfil.
-
- **C. Gestión de Órdenes Asignadas**
  - **1\. Notificación Push:** Alerta nueva(s) orden(es).
  - **2\. Asignación Directa:** Órdenes aparecen en Dashboard. **No Aceptar/Rechazar**.
  - **3\. Selección:** Repartidor elige orden de la lista para gestionar.
-
- **D. Flujo de Entrega (Pantalla Orden Activa)**
  - **1\. Info Visible:** ID Orden, Próxima Acción, Dir Tienda, Dir Cliente, Contacto Cliente (+ Botón WhatsApp), Método Pago Esperado (+Monto), Items (colaps). Notas.
  - **2\. Botones Contextuales Secuenciales:** "Iniciar Viaje Tienda" (Abre Nav) \-\> "Llegué Tienda" \-\> "Pedido Recogido" \-\> "Iniciar Viaje Cliente" (Abre Nav) \-\> "Llegué (Entregar)" \-\> "Pedido Entregado / Confirmar Pago".
  - **3\. Confirmar Pago Offline:**
    - Terminal: Modal Confirmar Cobro \+ Botón "Subir Comprobante" (Foto).
    - Efectivo: Modal Confirmar Cobro \+ Botón opc "Subir Foto Efectivo". Monto suma a Saldo Pendiente.
  -
  - **4\. Botón "Reportar Problema":** Siempre visible. Notifica Admin.
-
- **E. Navegación Externa:** Botones abren Google Maps/Waze con direcciones.
- **F. Historial de Órdenes:** Lista simple órdenes completadas (ID, Fecha, Tienda, Cliente).
- **G. Saldo Pendiente / Liquidaciones:** Mostrar Saldo Actual a Entregar. Historial Liquidaciones (registradas por Admin). Instrucciones.
- **H. Perfil del Repartidor:** Nombre, Foto, Vehículo, Calificación (Post-MVP), Cerrar Sesión, Link Soporte.

---

**Parte IV: Diseño de Base de Datos (Supabase/PostgreSQL)**

_(Resumen de Tablas Definidas)_

1.  **(auth.users):** Gestionada por Supabase Auth (id, email, phone, is_anonymous, etc.).
2.  **:** Datos adicionales usuario (user_id \-\> FK users, full_name, avatar_url, prefs).
3.  **:** Direcciones guardadas (user_id \-\> FK users, is_primary, campos dirección, coords).
4.  **:** Agrupación tiendas (id, name, logo_url).
5.  **:** Tiendas (id, group_id \-\> FK groups, name, address, coords, operating_hours, delivery_fee, min_order, accepted_postal_codes, etc.).
6.  **:** Categorías generales (id, name, sort_order).
7.  **:** Catálogo base (id, name, description, base_price, compare_at_price, image_urls, product_type\['physical'/'prepared'\]).
8.  **:** Disponibilidad Producto en Tienda (product_id \-\> FK products, store_id \-\> FK stores, is_available_in_store). PK(prod_id, store_id).
9.  **:** Asignación Producto a Categoría (product_id \-\> FK products, category_id \-\> FK product_categories). PK(prod_id, cat_id).
10. **:** Grupos de opciones (id, product_id \-\> FK products, name, selection_type\['single'/'multiple'\], is_required).
11. **:** Opciones en grupo (id, group_id \-\> FK groups, name, additional_price).
12. **:** Ítems en carrito activo (id, user_id \-\> FK users, product_id, store_id, quantity, selected_options\[jsonb\], item_notes, prices_at_addition).
13. **:** Órdenes confirmadas (id, order_number, user_id, status\[enum\], delivery_address\[jsonb\], contacts, amounts\[subtotal,delivery,cashback,promo,total\], payment_method\[enum\], payment_status\[enum\], gateway_ref, cashback_earned, notes, scheduled_time, driver_id, store_ids\[\], cancel_reason, etc.).
14. **:** Ítems de una orden (id, order_id \-\> FK orders, product_id, store_id, product_name, quantity, unit_price, selected_options\[jsonb\], item_notes, total_item_price).
15. **:** Log detallado transacciones pasarela (id, order_id, user_id, amount, currency, status, gateway, gateway_transaction_id, error, details\[jsonb\]).
16. **:** Saldo general créditos (user_id \-\> FK users (PK), balance).
17. **:** Historial créditos (id, user_id, type\['credit'/'debit'\], amount, reason\[enum\], related_order_id, admin_adjuster_id).
18. **:** Saldo cashback por entidad (user_id, entity_type\['store'/'group'\], entity_id, balance). PK(user, type, entity).
19. **:** Historial cashback (id, user_id, type\['earned'/'spent'\], entity_type, entity_id, amount, related_order_id).
20. **:** Tokens tarjetas (id, user_id, gateway, gateway_customer_id, gateway_method_id, card_brand, card_last4, card_exp, is_default).
21. **:** Repartidores (id, user_id \-\> FK users (UNIQUE), full_name, phone, vehicle, statuses, current_location, cash_pending_settlement).
22. **:** Documentos repartidor (id, driver_id \-\> FK drivers, document_type\[enum\], file_url, verification_status).
23. **:** Liquidaciones efectivo (id, driver_id, amount_settled, processed_by_admin_id).
24. **:** Códigos promocionales (id, code, discount_type/value, applies_to/ids, reqs, limits, is_active, uses_count).
25. **:** Registro usos códigos (id, promo_code_id, user_id, order_id).
26. **:** Asignación Staff a Tienda/Grupo (staff_user_id \-\> FK users, entity_type, entity_id). PK(staff_id, type, entity).

- **Nota:** Añadir Índices y usar Enums donde corresponda. Implementar RLS detalladas es crucial.

---

**Conclusión y Próximos Pasos**

Este documento consolida las especificaciones detalladas para el MVP. Los próximos pasos recomendados son:

1. **Diseño UI/UX:** Crear wireframes y mockups basados en estas funcionalidades para las 3 PWAs.
2. **Implementación BD:** Crear las tablas, relaciones, enums e índices en Supabase.
3. **Implementación RLS:** Escribir las políticas de seguridad a nivel de fila en Supabase.
4. **Desarrollo Backend:** Codificar la lógica de negocio principal en Supabase Edge Functions (procesamiento órdenes, pagos, cashback, validaciones).
5. **Desarrollo Frontend:** Construir las 3 PWAs (idealmente en un Monorepo) conectándolas a Supabase.
6. **Pruebas:** Realizar pruebas exhaustivas de cada flujo y funcionalidad.
