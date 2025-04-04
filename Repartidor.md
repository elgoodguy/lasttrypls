**Documento de Funcionalidades: Aplicación del Repartidor (PWA) \- MVP v1.0**

**1\. Visión General y Plataforma**

* **Plataforma:** Progressive Web App (PWA) Responsiva (Enfoque principal: Móvil).  
* **Acceso:** Subdominio dedicado (ej. driver.tuapp.com) o ruta específica (admin.tuapp.com/driver).  
* **Tecnología Base:** React, TypeScript, Vite, Tailwind CSS, shadcn-ui (adaptado para móvil).  
* **Gestión de Estado/Datos:** TanStack Query (@tanstack/react-query).  
* **Backend:** Supabase (Auth, DB PostgreSQL, Storage, Edge Functions, Realtime).  
* **APIs Externas:** API de Navegación (Google Maps/Waze via URL Scheme).

**2\. Login y Autenticación**

* **2.1. Página de Login:** Interfaz simple móvil. Método: **Email \+ Contraseña**. Opción "Recordarme". Recuperación de contraseña vía email. (Credenciales gestionadas desde Admin Panel).  
* **2.2. Solicitud de Permisos:** Al primer inicio o periódicamente, solicitar:  
  * **Ubicación:** Permiso "Mientras se usa la app". Esencial para asignación/seguimiento básico.  
  * **Notificaciones:** Permiso para recibir alertas de nuevas órdenes.  
* 

**3\. Pantalla Principal / Dashboard (Home)**

* **3.1. Propósito:** Vista central del repartidor.  
* **3.2. Componentes:**  
  * **Toggle Disponibilidad:** Botón/Switch grande y claro "Online" / "Offline".  
  * **Estado Actual:** Texto (Online/Offline/En entrega).  
  * **Mapa:** Pequeño mapa mostrando ubicación actual (opcional MVP, si es fácil de implementar). **No** mapa con seguimiento en tiempo real para Admin en MVP.  
  * **Órdenes Asignadas:** Lista/Tarjetas de las órdenes activas asignadas (soporta múltiples).  
    * Info por Orden (Resumen): ID Orden, Tienda (Nombre), Cliente (Dirección Resumen). Click \-\> Va a Pantalla Orden Activa.  
  *   
  * **Saldo Pendiente (Efectivo):** Widget "Efectivo a entregar: $\[Monto\]".  
  * **Gamificación/Logros:** **Deferir para Fase 2\.**  
*   
* **3.3. Navegación (Bottom Nav Bar Simple):**  
  * Home (Dashboard)  
  * Órdenes (Historial)  
  * Saldo (Liquidaciones de Efectivo)  
  * Perfil  
* 

**4\. Gestión de Órdenes Asignadas**

* **4.1. Notificación:** Notificación Push al recibir nueva(s) orden(es).  
* **4.2. Asignación:** Las órdenes aparecen directamente en la lista del Dashboard. **No hay Aceptar/Rechazar.**  
* **4.3. Selección:** El repartidor selecciona una orden de la lista para iniciar/continuar su gestión.

**5\. Flujo de Entrega (Pantalla de Orden Activa)**

* **5.1. Propósito:** Guiar al repartidor paso a paso para completar la orden seleccionada.  
* **5.2. Información Visible:**  
  * ID Orden.  
  * Próxima Acción Clara (ej. "Ve a Tienda X", "Ve a Cliente Y").  
  * Dirección Recogida (Tienda).  
  * Dirección Entrega (Cliente).  
  * Contacto Cliente (Nombre, Teléfono \+ Botón WhatsApp wa.me/).  
  * Método Pago Esperado (Tarjeta/Terminal/Efectivo \+ Monto).  
  * Detalle Ítems (Colapsable).  
  * Notas del Pedido.  
*   
* **5.3. Botones de Acción Contextuales (Secuenciales):**  
  * **Botón 1: "Iniciar Viaje a Tienda"**: Abre Navegación Externa. Estado Orden \-\> "En Camino a Tienda".  
  * **Botón 2: "Llegué a la Tienda"**: Estado Orden \-\> "En Tienda".  
  * **Botón 3: "Pedido Recogido"**: ¿Check rápido ítems? Estado Orden \-\> "En Camino a Cliente".  
  * **Botón 4: "Iniciar Viaje a Cliente"**: Abre Navegación Externa. (Estado sigue "En Camino a Cliente").  
  * **Botón 5: "Llegué (Entregar Pedido)"**: Estado Orden \-\> "En Proceso de Entrega".  
  * **Botón 6: "Pedido Entregado / Confirmar Pago"**:  
    * Pago Tarjeta: Confirma. Estado \-\> "Entregado".  
    * Pago Terminal: Modal Confirmación Cobro \+ Botón "Subir Comprobante" (Foto Voucher). Estado \-\> "Entregado".  
    * Pago Efectivo: Modal Confirmación Cobro \+ Botón "Subir Foto Efectivo" (Opcional). Estado \-\> "Entregado". Monto se suma a "Saldo Pendiente".  
  *   
*   
* **5.4. Botón "Reportar Problema":** Siempre visible. Notifica al Admin.

**6\. Navegación Externa**

* **6.1. Integración:** Los botones "Iniciar Viaje..." generan URLs para abrir Google Maps o Waze con la dirección de destino.

**7\. Historial de Órdenes (Sección Órdenes)**

* **7.1. Propósito:** Ver órdenes completadas.  
* **7.2. Componentes:** Lista simple (ID Orden, Fecha, Tienda, Cliente). Filtro básico por fecha.

**8\. Saldo Pendiente / Liquidaciones (Sección Saldo)**

* **8.1. Propósito:** Gestionar el efectivo cobrado.  
* **8.2. Componentes:**  
  * Mostrar "Saldo Actual a Entregar: $\[Monto\]".  
  * Historial de Liquidaciones (Fecha, Monto Liquidado \- Registrado por Admin).  
  * Instrucciones de Liquidación (Texto fijo).  
* 

**9\. Perfil del Repartidor (Sección Perfil)**

* **9.1. Propósito:** Información básica y cierre de sesión.  
* **9.2. Componentes:** Nombre, Foto (si subida desde Admin), Vehículo, Calificación Promedio (Post-MVP), Botón "Cerrar Sesión", Link Soporte/FAQs.

