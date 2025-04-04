**Documento de Funcionalidades: Panel de Administración (PWA) \- MVP v1.0**

**1\. Visión General y Plataforma**

* **Plataforma:** Progressive Web App (PWA) Responsiva (Desktop, Tablet, Móvil).  
* **Acceso:** Subdominio dedicado (ej. admin.tuapp.com).  
* **Tecnología Base:** React, TypeScript, Vite, Tailwind CSS, shadcn-ui.  
* **Componentes Adicionales:** Recharts (para gráficas).  
* **Gestión de Estado/Datos:** TanStack Query (@tanstack/react-query).  
* **Backend:** Supabase (Auth, DB PostgreSQL, Storage, Edge Functions).  
* **APIs Externas:** Google Maps Platform (Places Autocomplete para direcciones de tienda), Pasarela de Pago (API para reembolsos/gestión), Servicio SMS (API para notificaciones, si aplica).

**2\. Acceso y Roles**

* **2.1. Login:** Página de login específica en el subdominio. Método: Email \+ Contraseña. Recuperación de contraseña habilitada. (Utiliza tabla 'staff' o roles específicos en Supabase Auth, separada de clientes).  
* **2.2. Roles Definidos (RBAC):**  
  * **Super Admin:** Acceso total. Configura todo el sistema.  
  * **Group Manager:** Acceso filtrado a datos y gestión de las tiendas/staff de su(s) grupo(s) asignado(s).  
  * **Store Manager:** Acceso filtrado a datos y gestión de su tienda(s) asignada(s).  
*   
* **2.3. Seguridad:** El backend (Supabase RLS y/o Edge Functions) debe validar el rol del usuario en cada acción y filtrar los datos devueltos.

**3\. Dashboard Principal**

* **3.1. Propósito:** Vista general del negocio, adaptada al rol.  
* **3.2. Componentes:**  
  * Selector de Periodo (Fechas).  
  * KPIs Clave (Cards): Ventas ($), \# Órdenes, Ticket Promedio, Usuarios Nuevos, Pedidos Pendientes, Drivers Activos.  
  * Gráficas (Recharts): Ventas(t), Órdenes(t), Top Productos, Top Tiendas.  
*   
* **3.3. Visibilidad por Rol:** Super Admin (Global), Group Mgr (Datos Grupo), Store Mgr (Datos Tienda).

**4\. Gestión de Órdenes (Orders)**

* **4.1. Propósito:** Seguimiento y gestión del ciclo de vida de pedidos.  
* **4.2. Componentes:**  
  * Listado/Tabla de Órdenes (ID, Cliente, Tienda(s), Estado, Total, Hora, Driver).  
  * Filtros Avanzados (Estado, Fecha, Tienda, Cliente, Driver).  
  * Búsqueda (ID, Cliente Tel/Nombre).  
*   
* **4.3. Vista Detallada de Orden:**  
  * Info Cliente (Nombre, Tel, Dirección \+ Mapa Pin).  
  * Items Pedidos (con opciones/notas).  
  * Desglose Costos (Subtotal, Envío, Descuentos, Cashback usado, Total).  
  * Método Pago (Tarjeta \*\*\*\*, Efectivo, Terminal).  
  * Historial de Estados (Timestamped).  
  * Repartidor Asignado.  
  * Notas del pedido.  
*   
* **4.4. Acciones (Disponibles según rol/estado):**  
  * Cambiar Estado Manualmente (con log/auditoría).  
  * Asignar/Reasignar Repartidor.  
  * Marcar como "Lista para Recoger" (Disponible para Store Manager).  
  * Gestionar Reembolso/Cancelación (Pagos Tarjeta): Ver opción elegida por cliente (Créditos/Banco). Iniciar reembolso en pasarela si eligió banco. Ajustar Créditos Wallet manualmente (con motivo).  
  * Implementar Retención Pago (Autorizar/Capturar) si pasarela lo soporta bien.  
  * Imprimir Ticket/Resumen.  
  * Contactar Cliente (Botón link wa.me/).  
*   
* **4.5. Visibilidad por Rol:** Super Admin (Todo), Group Mgr (Órdenes Grupo), Store Mgr (Órdenes Tienda \- Puede marcar "Lista para Recoger").

**5\. Gestión de Productos (Products)**

* **5.1. Propósito:** Administrar catálogo.  
* **5.2. Componentes:**  
  * Listado Productos (Img, Nombre, Cat, Precio Base, Precio Comparación, Tiendas, Estado, Tipo Producto).  
  * Filtros (Cat, Tienda, Estado, Tipo), Búsqueda (Nombre).  
  * Botón "Añadir Nuevo Producto".  
*   
* **5.3. Vista Edición/Creación Producto:**  
  * Nombre, Descripción, Imágenes.  
  * Precio Base, Precio Comparación (opcional, para UI descuento).  
  * Categorías (Selector múltiple \+ opción "Crear Nueva").  
  * Tiendas Disponibles (Selector múltiple).  
  * Gestión Modificadores: UI para Grupos (Nombre, Oblig/Opc, Múltiple/Única) y Opciones (Nombre, Precio Adicional).  
  * Estado (Activo/Inactivo).  
  * Tipo Producto (Selector): "Físico (Stock Contable)" / "Preparado (Sin Stock)".  
*   
* **5.4. Gestión Categorías:** CRUD para categorías de producto.  
* **5.5. Visibilidad por Rol:** Super Admin (Todo). Group/Store Mgr (Ven todo, pueden Añadir/Editar productos *para sus tiendas asignadas*).

**6\. Gestión de Inventario (Inventory)**

* **6.1. Propósito:** Controlar stock **solo de "Productos Físicos"**.  
* **6.2. Componentes:**  
  * Listado Inventario (Producto, Tienda, Stock Actual, Umbral Bajo Stock).  
  * Filtros (Tienda, Producto, Solo bajos stock).  
*   
* **6.3. Acciones:** Ajustar Stock (con log), Establecer Umbral Bajo Stock.  
* **6.4. Lógica:** Stock disminuye automáticamente al completarse orden.  
* **6.5. Visibilidad por Rol:** Super Admin (Todo). Group Mgr (Inventario Grupo). Store Mgr (Inventario Tienda).

**7\. Gestión de Tiendas (Stores)**

* **7.1. Propósito:** Configurar locales.  
* **7.2. Componentes:**  
  * Listado Tiendas (Nombre, Grupo, Dirección, Estado).  
  * Botón "Añadir Nueva Tienda".  
*   
* **7.3. Vista Edición/Creación Tienda:**  
  * Nombre, Grupo (selector).  
  * Dirección (Componente Google Places Autocomplete \+ Mapa Pin/Coords).  
  * Contacto, Imágenes (Logo, Banner).  
  * Horario Operación (Definición días/horas \+ Opción Horarios Especiales/Feriados).  
  * Parámetros Delivery: Tarifa Envío Base, Pedido Mínimo, Tiempo Estimado.  
  * Zona Cobertura (MVP): Lista de Códigos Postales aceptados.  
  * Asignar Store Manager(s) (selector staff).  
  * Estado (Activo/Inactivo).  
*   
* **7.4. Visibilidad por Rol:** Super Admin (Todo). Group Mgr (Ve/Edita/Crea tiendas en su grupo). Store Mgr (Ve su tienda, puede editar Estado Temporal Abierta/Cerrada y Horarios Especiales).

**8\. Gestión de Grupos (Groups)**

* **8.1. Propósito:** Agrupar tiendas lógicamente (marcas, regiones).  
* **8.2. Componentes:**  
  * Listado Grupos (Nombre, \# Tiendas, Logo).  
  * Botón "Añadir Nuevo Grupo".  
*   
* **8.3. Vista Edición/Creación Grupo:**  
  * Nombre, Logo/Imagen (para Wallet Cliente).  
  * Asignar Group Manager(s) (selector staff).  
*   
* **8.4. Visibilidad por Rol:** Solo Super Admin.

**9\. Gestión de Promociones y Cashback**

* **9.1. Propósito:** Configurar descuentos, ofertas, lealtad.  
* **9.2. Componentes:**  
  * **Códigos Promocionales:** CRUD. Campos: Código, Tipo (%, $), Valor, Aplicabilidad (Pedido, Prod, Cat, Tienda), Requisitos (Pedido Mínimo, Usuarios Específicos), Límites (Usos Totales/Usuario, Fechas), Estado.  
  * **Reglas Cashback:** CRUD. Campos: Seleccionar Tienda(s)/Grupo(s), Porcentaje (%), Estado. (Solo Super Admin).  
  * **Promociones Automáticas / Bundles:** CRUD. Tipos MVP: "Compra X Lleva Y", "Bundle Precio Fijo". Campos: Nombre, Tipo, Configuración específica del tipo, Tiendas aplicables, Validez (Siempre / Rango Fechas \- Horario Recurrente Fase 2), Estado.  
*   
* **9.3. Visibilidad por Rol:** Super Admin (Todo). Group/Store Mgr (Pueden crear/gestionar Promos \- Códigos y Automáticas \- *solo* para sus tiendas).

**10\. Gestión de Repartidores (Drivers)**

* **10.1. Propósito:** Administración de flota.  
* **10.2. Componentes:**  
  * Listado Repartidores (Nombre, Tel, Estado Online/Offline, Vehículo, Pedido(s) Asignado(s)).  
  * **No** mapa en tiempo real MVP.  
  * Filtros (Estado), Búsqueda (Nombre, Tel).  
  * Botón "Añadir Nuevo Repartidor".  
*   
* **10.3. Vista Perfil/Edición Repartidor:**  
  * Info Personal, Credenciales Login (Email/Pass), Vehículo.  
  * Documentación (Subir/Ver/Validar \- Supabase Storage).  
  * Historial Entregas.  
  * Calificaciones (Post-MVP).  
  * Estado Cuenta (Activo/Inactivo/Suspendido).  
  * **No** datos bancarios MVP.  
*   
* **10.4. Visibilidad por Rol:** Super Admin gestiona todo. (Preparado para rol Logistics Mgr futuro).

**11\. Gestión de Usuarios (Clientes \- Customers)**

* **11.1. Propósito:** Visualización y gestión básica de clientes.  
* **11.2. Componentes:** Listado, Búsqueda, Vista Detallada (Perfil, Direcciones, Historial Pedidos, Historial Wallet \- Cashback/Créditos).  
* **11.3. Acciones:** Desactivar cuenta, Resetear contraseña, **Ajustar Créditos Wallet manualmente** (con campo "Motivo" obligatorio).  
* **11.4. Visibilidad por Rol:** Super Admin.

**12\. Gestión de Staff (Admin Users)**

* **12.1. Propósito:** Gestionar accesos al Admin Panel.  
* **12.2. Componentes:** Listado, Botón Invitar/Crear, Formulario (Nombre, Email, Rol, Asignación Tienda/Grupo), Acciones (Desactivar, Resetear Pass).  
* **12.3. Visibilidad:** Solo Super Admin.

**13\. Configuración General (Settings)**

* **13.1. Propósito:** Ajustes globales.  
* **13.2. Componentes (Secciones):** Info Negocio, Config Pagos (Claves Pasarela, Métodos Aceptados, Retención?), Config Notificaciones (Servicio SMS?), Parámetros Delivery Global (Umbral Envío Gratis), Textos Legales, Modo Mantenimiento App Cliente.  
* **13.3. Visibilidad:** Solo Super Admin.

