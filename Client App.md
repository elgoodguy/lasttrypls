**Documento de Funcionalidades: Aplicación del Cliente (PWA) \- MVP v1.0**

**1\. Visión General y Plataforma**

* **Plataforma:** Progressive Web App (PWA).  
* **Enfoque:** Mobile First (Diseño responsivo adaptable a tablet/desktop).  
* **Tecnología Base:** React, TypeScript, Vite, Tailwind CSS, shadcn-ui.  
* **Gestión de Estado/Datos:** React Context API, TanStack Query (@tanstack/react-query).  
* **Backend:** Supabase (Auth, DB PostgreSQL, Storage, Edge Functions, Realtime).  
* **APIs Externas:** Google Maps Platform (Places Autocomplete, Geocoding), Pasarela de Pago (Stripe, Conekta, etc. \- a definir), Servicio SMS (Twilio o similar \- a definir).  
* **Estética:** Dark Mode por defecto (con opción Light Mode), Color Acento Principal: \#F07167.

**2\. Onboarding y Autenticación**

* **2.1. Landing Page:**  
  * **Componentes:** Toggles Idioma/Modo, Botón "Login/Signup", Logo, Input "Ingresa tu dirección".  
  * **Flujo Ubicación:**  
    1. Input click/foco: Muestra botón "Usar mi ubicación actual" \+ Input búsqueda manual \+ Sugerencias Google Places Autocomplete.  
    2. Selección \-\> Modal Confirmación Dirección.  
  *   
  * **Modal Confirmación Dirección:**  
    1. Formulario con campos **editables**: Calle, \# Ext, \# Int, Colonia, CP, Ciudad, País, Instrucciones Entrega.  
    2. Mapa pequeño con pin (Google Maps API).  
    3. Botón "Confirmar Dirección".  
    4. Manejo de errores de geolocalización claro, guía a búsqueda manual.  
  *   
*   
* **2.2. Autenticación (Modal):**  
  * **Disparadores:** Botón Login/Signup, Acceso a áreas restringidas (Favoritos, Pedidos, Wallet, Perfil, Notificaciones).  
  * **Métodos MVP:**  
    1. Teléfono \+ OTP (SMS \- requiere integración servicio externo).  
    2. Email \+ Contraseña (Supabase Auth).  
    3. Google Login (Supabase Auth \+ Google Cloud Config).  
  *   
  * **Flujo Nuevo Usuario:** Método \-\> Verificación \-\> Recolección Datos ("Nombre Completo", Teléfono \[req si no usó Tel\], Email \[opcional\]) \-\> **Forzar "Añadir Primera Dirección"** (Modal Confirmación Dirección) \-\> Redirige a Home (logueado).  
  * **Flujo Usuario Existente:** Método \-\> Autenticación \-\> Forzar "Añadir Primera Dirección" si no existe \-\> Redirige a Home (logueado).  
  * **Recuperación Contraseña:** Vía link seguro enviado por email.  
*   
* **2.3. Toggles Persistentes (Idioma/Modo):**  
  * **Idioma:** EN/ES. Default EN.  
  * **Modo:** Dark/Light. Default Dark.  
  * **Almacenamiento:** Local Storage (invitado), Perfil Usuario (logueado). Preferencias de LS se migran al perfil al registrarse/loguearse.  
* 

**3\. Navegación Principal (Shell)**

* **3.1. Top Navigation Bar:**  
  * **Ubicación Actual:**  
    * Invitado: Clicable \-\> Abre Modal Confirmación/Cambio Dirección.  
    * Logueado: Clicable \-\> Abre Dropdown (Lista direcciones guardadas \+ Opción "Añadir nueva"). Cambiar dirección refresca Home.  
  *   
  * **Notificaciones (Icono Campana):** Solo logueados. Badge con contador no leídas. Link a pantalla Notificaciones.  
  * **Perfil/Avatar (Icono Usuario):**  
    * Invitado: Clicable \-\> Abre Modal Login/Signup.  
    * Logueado: Muestra Avatar (si existe) o Iniciales. Clicable \-\> Link a pantalla Perfil.  
  *   
*   
* **3.2. Bottom Navigation Bar:**  
  * Iconos: Home, Favoritos (Logueado), Pedidos (Logueado), Wallet (Logueado).  
*   
* **3.3. Botón Flotante Carrito (FAB):**  
  * Visible en esquina inferior derecha (sobre Bottom Nav) **solo si el carrito tiene \> 0 ítems**.  
  * Muestra icono de carrito \+ badge con número de ítems.  
  * Click \-\> Lleva a pantalla Carrito de Compras.  
* 

**4\. Home Page (Enfoque Delivery MVP)**

* **4.1. Estructura:** Saludo (si logueado), Barra Búsqueda, Scroll H. Categorías (Chips), Scroll V. Secciones (ej. "Destacadas" \- curadas en Admin) con Scroll H. de Tarjetas de Tienda.  
* **4.2. Funcionalidad:**  
  * **Búsqueda:** Busca en Nombres de Tienda y Producto \-\> Lleva a Página de Resultados dedicada.  
  * **Categorías (Chips):** Filtra la vista actual de tiendas en Home. Opción "Ver Todo" para limpiar filtro.  
  * **Tarjetas de Tienda:** Muestran Logo/Img, Nombre, Tipo, Tiempo Estimado, Costo Envío, Indicador Cashback (si aplica). Click \-\> Va a Vista de Tienda.  
  * **No** mostrar productos individuales en Home MVP.  
* 

**5\. Flujo de Compra (Delivery)**

* **5.1. Vista de Tienda (Store View):**  
  * **Header:** Banner, Logo, Nombre, Tipo, Calificación (futuro), Tiempo, Costo Envío, Horario, Indicador Cashback, Botón Favorito (logueado), Indicador Estado (Abierta/Cerrada). Mostrar "Pedido Mínimo: $X.XX". Si cerrada, indica "Solo Agendar".  
  * **Body:** Sección "Promociones/Bundles" (si existen), luego Secciones Verticales por Categoría de productos de la tienda.  
  * **Lista Productos:** Tarjeta simple (Img, Nombre, Desc Breve, Precio). Click \-\> Va a Vista de Producto.  
  * **Tienda Cerrada:** Se puede navegar y añadir al carrito. Checkout se convierte en "Agendar Pedido".  
*   
* **5.2. Vista de Producto (Product View):**  
  * **Info:** Imagen grande, Nombre, Descripción, Precio base.  
  * **Opciones:** Variantes (Tarjetas seleccionables), Extras (Checkboxes con $ adicional). Precio total ítem se actualiza dinámicamente.  
  * **Cantidad:** Input numérico o \+/-.  
  * **Notas:** Campo de texto para ítem.  
  * **Botón "Añadir al Carrito":** Muestra precio total ítem (con opciones x cantidad). Añade, muestra toast confirmación, actualiza badge FAB.  
*   
* **5.3. Carrito de Compras (Cart View):**  
  * **Acceso:** Vía FAB.  
  * **Items:** Agrupados por tienda. Detalle por ítem (Img, Nombre, Opciones, Notas, Precio U., Qty \+/-, Precio Total Ítem, Eliminar).  
  * **Resumen:** Subtotal, Costo Envío (Lógica: Tarifa fija por tienda definida en Admin; si multi-tienda, se cobra la más alta; gratis si subtotal \> umbral global), Total.  
  * **Multi-Tienda:** Soportado en MVP (asumiendo tiendas propias).  
  * **Notas Generales:** Campo de texto.  
  * **Botón "Checkout":** Deshabilitado si no cumple pedido mínimo. Se convierte en "Agendar Pedido" si alguna tienda está cerrada.  
  * **Edición:** Cantidad/Eliminar inline. Cambiar opciones/notas \-\> Click en ítem vuelve a Vista Producto.  
*   
* **5.4. Checkout (Pantalla Única Scrollable):**  
  * **Pasos:**  
    1. Dirección Entrega (Seleccionar/Confirmar activa).  
    2. Contacto (Nombre/Teléfono prellenado/editable).  
    3. Método Pago: Tarjeta (Invitado: Formulario Pasarela; Logueado: Lista guardadas \+ 'Otra' con opción guardar), Terminal, Efectivo (Campo opcional "Pagaré con $\_\_\_"). **CVV se pide aquí, NUNCA se guarda.**  
    4. Cashback (Logueado): Checkbox **" \[ \] Usar mi cashback ($X.XX disponible)"**. No automático.  
    5. Código Promocional: Input \+ Botón Aplicar.  
    6. Resumen Final: Ítems, Subtotal, Envío, Descuento Cashback, Descuento Promo, Total.  
  *   
  * **Botón Principal:** "Pagar $ \[Total\]" (Tarjeta) / "Confirmar Pedido" (Offline).  
  * **Procesamiento Pago Tarjeta:** Idealmente Autorizar \-\> Capturar al entregar (si pasarela lo soporta bien). Si no, Cobrar directo y manejar Reembolso/Créditos si cancela.  
*   
* **5.5. Pantalla Confirmación Orden:**  
  * Mensaje éxito, \# Orden, Resumen, Tiempo Estimado, Cashback **Ganado**.  
  * **Botón Cancelar Pedido:** Visible si estado permite (Confirmado/Preparando).  
  * **Flujo Cancelación (Si pagó Tarjeta):** Modal con opciones \-\> "Recibir Créditos Wallet (Inmediato)" o "Reembolso a Tarjeta (X días)".  
  * Botón "Ver mis pedidos".  
  * Widget estado pedido en Home page.  
*   
* **5.6. Seguimiento Orden (Sección "Mis Pedidos"):**  
  * Lista pedidos (en curso / históricos).  
  * Detalle En Curso: Estados claros (Confirmado \-\> Preparando \-\> Listo Recoger \-\> En Camino \-\> Entregado). Botón WhatsApp a repartidor (si "En Camino"). Botón Cancelar (si estado permite).  
  * **No** mapa repartidor en MVP.  
* 

**6\. Wallet (Solo Usuarios Logueados)**

* **6.1. Acceso:** Icono "Wallet" en Bottom Nav.  
* **6.2. Estructura:** Pestañas "Mis Saldos" y "Métodos de Pago".  
* **6.3. Pestaña "Mis Saldos":**  
  * **Superior:** "Créditos Disponibles: $\[Saldo General Créditos\]". (Créditos se obtienen por reembolsos cancelados).  
  * **Inferior (Cashback):** Lista vertical. Fila: Logo/Nombre Tienda/Grupo, Saldo Cashback $. Click \-\> Modal Historial Cashback (Ganado/Usado) para esa tienda/grupo. Mostrar Total Cashback acumulado.  
  * **No** expiración de cashback MVP. **No** niveles de cashback MVP.  
*   
* **6.4. Pestaña "Métodos de Pago":**  
  * Lista tarjetas guardadas (tokenizadas vía pasarela).  
  * Info Tarjeta: Logo tipo, Banco (si posible), \*\*\*\* 1234, MM/AA, Indicador "Predeterminada".  
  * **Acciones:** Botón "Añadir Nueva Tarjeta" (Formulario seguro pasarela \+ opción guardar), "Eliminar" por tarjeta, Opción "Marcar como Predeterminada".  
* 

**7\. Otras Secciones (Solo Usuarios Logueados)**

* **7.1. Perfil:**  
  * Editar: Nombre Completo, Teléfono, Email.  
  * Gestionar Direcciones: Añadir (Modal Confirmación), Editar, Eliminar, Establecer Predeterminada.  
  * Cambiar Contraseña.  
  * Gestionar Preferencias (Idioma/Modo).  
  * Botón Cerrar Sesión.  
*   
* **7.2. Favoritos:**  
  * Lista de Tiendas/Productos marcados como favoritos.  
  * Acceso directo para ver la tienda o producto.  
*   
* **7.3. Notificaciones:**  
  * Lista de notificaciones recibidas (estado orden, promos, etc.).  
  * Botón "Marcar todas como leídas".  
*   
* **7.4. Historial de Pedidos ("Mis Pedidos"):**  
  * Sección ya descrita en 5.6, incluye pedidos pasados y en curso.  
* 

**8\. Funcionalidades PWA Específicas**

* **Instalación (Add to Home Screen):** Configurar Manifest (manifest.json) y Service Worker básico para permitir instalación.  
* **Offline Básico:** Service Worker debe cachear el "shell" de la app (elementos UI principales, JS/CSS) para carga rápida y mostrar una página offline personalizada si no hay conexión.  
* **Notificaciones Push:** Usar Service Workers y API Push para recibir notificaciones (nuevas órdenes, estado, promos) del backend (Supabase puede dispararlas desde Edge Functions). Requiere permiso del usuario.

