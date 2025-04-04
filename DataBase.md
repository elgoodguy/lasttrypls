**Diseño de Base de Datos (Supabase/PostgreSQL) \- Parte 1: Núcleo**

**1\. Tabla** 

* Esta tabla la crea y gestiona Supabase automáticamente cuando habilitas Authentication.  
* **Columnas Clave (Proporcionadas por Supabase):**  
  * id (UUID, Primary Key): Identificador único del usuario. **Esta será la clave foránea principal en casi todas las demás tablas.**  
  * email (text, nullable, unique): Email del usuario (si usa ese método).  
  * phone (text, nullable, unique): Teléfono del usuario (si usa ese método).  
  * encrypted\_password (text): Contraseña hasheada (si usa ese método).  
  * created\_at (timestamptz): Fecha de creación.  
  * updated\_at (timestamptz): Última actualización.  
  * last\_sign\_in\_at (timestamptz): Último inicio de sesión.  
  * raw\_user\_meta\_data (jsonb): Metadatos del usuario (nombre, avatar\_url, etc., si los pones aquí).  
  * is\_anonymous (boolean): **¡Importante\!** True si es un usuario anónimo, False si es permanente.  
  * ... (Otras columnas internas de Supabase Auth).  
* 

**2\. Tabla** 

* **Propósito:** Almacenar información adicional del perfil que no está directamente en auth.users. Se vincula 1 a 1 con auth.users.  
* **Columnas:**  
  * user\_id (UUID, Primary Key, Foreign Key \-\> auth.users.id): Vincula este perfil al usuario de autenticación. *Configurar "ON DELETE CASCADE" para que si se borra el usuario en auth, se borre el perfil.*  
  * full\_name (text): Nombre completo ingresado durante el registro.  
  * avatar\_url (text, nullable): URL de la imagen de perfil (almacenada en Supabase Storage).  
  * preferred\_language (text, default: 'en'): 'en' o 'es'.  
  * preferred\_theme (text, default: 'dark'): 'dark' o 'light'.  
  * created\_at (timestamptz, default: now()): Fecha de creación del perfil.  
  * updated\_at (timestamptz, default: now()): Última actualización del perfil.  
*   
* **RLS (Row Level Security):**  
  * Permitir SELECT si user\_id \= auth.uid().  
  * Permitir INSERT si user\_id \= auth.uid() Y is\_anonymous IS FALSE (solo usuarios permanentes pueden *crear* perfil formal).  
  * Permitir UPDATE si user\_id \= auth.uid() Y is\_anonymous IS FALSE.  
* 

**3\. Tabla** 

* **Propósito:** Almacenar múltiples direcciones por usuario.  
* **Columnas:**  
  * id (UUID, Primary Key, default: gen\_random\_uuid()): ID único de la dirección.  
  * user\_id (UUID, Foreign Key \-\> auth.users.id): Usuario al que pertenece la dirección. *ON DELETE CASCADE.*  
  * is\_primary (boolean, default: false): Indica si es la dirección predeterminada del usuario. *(Debe haber lógica para asegurar solo una primaria por usuario)*.  
  * street\_address (text): Calle y número exterior.  
  * internal\_number (text, nullable): Número interior (Depto, Oficina).  
  * neighborhood (text, nullable): Colonia.  
  * postal\_code (text): Código Postal.  
  * city (text): Ciudad.  
  * country (text, default: 'MX'): País (código ISO o nombre).  
  * delivery\_instructions (text, nullable): Instrucciones adicionales.  
  * latitude (double precision, nullable): Coordenada geográfica (si se obtiene).  
  * longitude (double precision, nullable): Coordenada geográfica (si se obtiene).  
  * google\_place\_id (text, nullable): ID de Google Places (si se usó autocomplete).  
  * created\_at (timestamptz, default: now()).  
  * updated\_at (timestamptz, default: now()).  
*   
* **RLS:**  
  * Permitir SELECT, INSERT, UPDATE, DELETE si user\_id \= auth.uid() Y is\_anonymous IS FALSE. (Solo usuarios registrados guardan direcciones).  
* 

**4\. Tabla** 

* **Propósito:** Define las marcas o entidades lógicas que agrupan tiendas (ej. "McDonald's", "Zona Norte").  
* **Columnas:**  
  * id (UUID, Primary Key, default: gen\_random\_uuid()): ID único del grupo.  
  * name (text, unique): Nombre del grupo (ej. "McDonald's").  
  * logo\_url (text, nullable): URL del logo del grupo (para Wallet Cashback).  
  * created\_at (timestamptz, default: now()).  
  * updated\_at (timestamptz, default: now()).  
*   
* **RLS:**  
  * Permitir SELECT a authenticated (todos los usuarios logueados, incluyendo staff).  
  * Permitir INSERT, UPDATE, DELETE solo si el usuario tiene rol 'Super Admin' (requiere lógica en Edge Function o check de rol personalizado).  
* 

**5\. Tabla** 

* **Propósito:** Almacena la información de cada tienda individual.  
* **Columnas:**  
  * id (UUID, Primary Key, default: gen\_random\_uuid()): ID único de la tienda.  
  * group\_id (UUID, nullable, Foreign Key \-\> groups.id): Grupo al que pertenece (opcional). *ON DELETE SET NULL (o RESTRICT si una tienda debe pertenecer siempre a un grupo)*.  
  * name (text): Nombre de la tienda (ej. "McDonald's \- Sucursal Centro").  
  * is\_active (boolean, default: true): Estado general de la tienda (Activa/Inactiva).  
  * address\_street (text): Dirección de la tienda.  
  * address\_internal (text, nullable).  
  * address\_neighborhood (text, nullable).  
  * address\_postal\_code (text).  
  * address\_city (text).  
  * address\_country (text, default: 'MX').  
  * latitude (double precision).  
  * longitude (double precision).  
  * contact\_phone (text, nullable).  
  * logo\_url (text, nullable).  
  * banner\_url (text, nullable).  
  * operating\_hours (jsonb): JSON para almacenar horarios (ej. {"Mon": "09:00-22:00", "Tue": "09:00-22:00", ...}).  
  * special\_hours (jsonb, nullable): JSON para horarios especiales/feriados (ej. {"2024-12-25": "closed", "2024-12-31": "09:00-18:00"}).  
  * delivery\_fee (numeric, default: 0): Tarifa de envío base de esta tienda.  
  * minimum\_order\_amount (numeric, nullable): Pedido mínimo (si aplica).  
  * estimated\_delivery\_time\_minutes (integer, nullable): Tiempo promedio estimado.  
  * accepted\_postal\_codes (text\[\], nullable): Array de CPs válidos para la zona de cobertura.  
  * created\_at (timestamptz, default: now()).  
  * updated\_at (timestamptz, default: now()).  
*   
* **RLS:**  
  * Permitir SELECT a authenticated.  
  * Permitir INSERT, UPDATE, DELETE solo si rol 'Super Admin' o 'Group Manager' (con validación de pertenencia al grupo).  
* 

**6\. Tabla** 

* **Propósito:** Define las categorías a las que pueden pertenecer los productos (ej. "Bebidas", "Snacks").  
* **Columnas:**  
  * id (UUID, Primary Key, default: gen\_random\_uuid()): ID único.  
  * name (text, unique): Nombre de la categoría.  
  * sort\_order (integer, default: 0): Para ordenar las categorías en la UI.  
  * created\_at (timestamptz, default: now()).  
  * updated\_at (timestamptz, default: now()).  
*   
* **RLS:**  
  * Permitir SELECT a authenticated.  
  * Permitir INSERT, UPDATE, DELETE a roles de staff ('Super Admin', 'Group Mgr', 'Store Mgr').  
* 

**7\. Tabla** 

* **Propósito:** Almacena la información base de cada producto ofrecido.  
* **Columnas:**  
  * id (UUID, Primary Key, default: gen\_random\_uuid()): ID único del producto.  
  * name (text): Nombre del producto.  
  * description (text, nullable): Descripción detallada.  
  * base\_price (numeric): Precio base del producto.  
  * compare\_at\_price (numeric, nullable): Precio de comparación (para UI descuento).  
  * image\_urls (text\[\], nullable): Array de URLs de imágenes del producto (Supabase Storage).  
  * is\_active (boolean, default: true): Estado general del producto.  
  * product\_type (text, default: 'physical'): 'physical' (con stock) o 'prepared' (sin stock).  
  * created\_at (timestamptz, default: now()).  
  * updated\_at (timestamptz, default: now()).  
*   
* **RLS:**  
  * Permitir SELECT a authenticated.  
  * Permitir INSERT, UPDATE, DELETE a roles de staff.  
* 

**8\. Tabla** 

* **Propósito:** Tabla intermedia (muchos-a-muchos) que indica qué productos están disponibles en qué tiendas. Permite que un Store Manager gestione sus productos sin afectar el catálogo general.  
* **Columnas:**  
  * product\_id (UUID, Foreign Key \-\> products.id): Producto. *ON DELETE CASCADE.*  
  * store\_id (UUID, Foreign Key \-\> stores.id): Tienda. *ON DELETE CASCADE.*  
  * is\_available\_in\_store (boolean, default: true): Indica si el producto está activo *en esta tienda específica*. (Permite a Store Mgr desactivar localmente).  
  * *(Clave Primaria Compuesta: (*  
*   
* **RLS:**  
  * Permitir SELECT a authenticated.  
  * Permitir INSERT, UPDATE, DELETE a roles de staff (con validación de que el Store/Group Mgr solo modifique las de sus tiendas).  
* 

**9\. Tabla** 

* **Propósito:** Tabla intermedia (muchos-a-muchos) para asignar productos a una o más categorías.  
* **Columnas:**  
  * product\_id (UUID, Foreign Key \-\> products.id): Producto. *ON DELETE CASCADE.*  
  * category\_id (UUID, Foreign Key \-\> product\_categories.id): Categoría. *ON DELETE CASCADE.*  
  * *(Clave Primaria Compuesta: (*  
*   
* **RLS:**  
  * Permitir SELECT a authenticated.  
  * Permitir INSERT, DELETE a roles de staff.  
* 

**10\. Tabla** 

* **Propósito:** Define un grupo de opciones (ej. "Tamaño", "Extras").  
* **Columnas:**  
  * id (UUID, Primary Key, default: gen\_random\_uuid()): ID único del grupo.  
  * product\_id (UUID, Foreign Key \-\> products.id): Producto al que pertenece este grupo. *ON DELETE CASCADE.*  
  * name (text): Nombre del grupo (ej. "Elige tu tamaño").  
  * selection\_type (text, default: 'single'): 'single' (radio/cards) o 'multiple' (checkbox).  
  * is\_required (boolean, default: false): ¿Es obligatorio seleccionar una opción de este grupo?  
  * sort\_order (integer, default: 0): Para ordenar los grupos en la UI del producto.  
  * created\_at (timestamptz, default: now()).  
  * updated\_at (timestamptz, default: now()).  
*   
* **RLS:**  
  * Permitir SELECT a authenticated.  
  * Permitir INSERT, UPDATE, DELETE a roles de staff.  
* 

**11\. Tabla** 

* **Propósito:** Define una opción específica dentro de un grupo (ej. "Chico", "Queso Extra").  
* **Columnas:**  
  * id (UUID, Primary Key, default: gen\_random\_uuid()): ID único de la opción.  
  * group\_id (UUID, Foreign Key \-\> product\_modifier\_groups.id): Grupo al que pertenece esta opción. *ON DELETE CASCADE.*  
  * name (text): Nombre de la opción (ej. "Grande", "Aguacate").  
  * additional\_price (numeric, default: 0): Costo extra por seleccionar esta opción.  
  * sort\_order (integer, default: 0): Para ordenar las opciones dentro del grupo.  
  * created\_at (timestamptz, default: now()).  
  * updated\_at (timestamptz, default: now()).  
*   
* **RLS:**  
  * Permitir SELECT a authenticated.  
  * Permitir INSERT, UPDATE, DELETE a roles de staff.  
* 

**Diseño de Base de Datos (Supabase/PostgreSQL) \- Parte 2: Proceso de Compra**

**12\. Tabla** 

* **Propósito:** Representa el carrito de compras activo de un usuario. Podría contener ítems de múltiples tiendas si así lo permitimos.  
* **Columnas:**  
  * id (UUID, Primary Key, default: gen\_random\_uuid()): ID único del carrito.  
  * user\_id (UUID, Unique, Foreign Key \-\> auth.users.id): Usuario al que pertenece este carrito. La relación es 1 a 1 (un usuario tiene un carrito activo). *ON DELETE CASCADE.*  
  * created\_at (timestamptz, default: now()).  
  * updated\_at (timestamptz, default: now()).  
  * metadata (jsonb, nullable): Campo opcional para guardar información temporal del carrito (ej. notas generales, cupón aplicado tentativamente antes del checkout final).  
*   
* **Consideración:** Alternativamente, podríamos no tener una tabla carts explícita y manejar el carrito directamente a través de cart\_items vinculados al user\_id. Sin embargo, tener una tabla carts puede ser útil si queremos añadir funcionalidades futuras como "carritos abandonados" o metadatos específicos del carrito. **Para MVP, quizás la tabla** 

**12\. Tabla** 

* **Propósito:** Almacena cada producto específico (con sus opciones seleccionadas) que un usuario ha añadido a su carrito.  
* **Columnas:**  
  * id (UUID, Primary Key, default: gen\_random\_uuid()): ID único del ítem en el carrito.  
  * user\_id (UUID, Foreign Key \-\> auth.users.id): Usuario al que pertenece este ítem del carrito. *ON DELETE CASCADE.* **(Clave si no usamos tabla**   
  * product\_id (UUID, Foreign Key \-\> products.id): Producto base añadido. *ON DELETE CASCADE.*  
  * store\_id (UUID, Foreign Key \-\> stores.id): Tienda de la cual se está pidiendo este producto. *ON DELETE CASCADE.* \**(Importante para multi-tienda).*  
  * quantity (integer, default: 1, check: quantity \> 0): Cantidad de este producto/configuración.  
  * selected\_options (jsonb, nullable): JSON que almacena las opciones seleccionadas y sus detalles. Ej: \[{"group\_id": "uuid\_tamano", "option\_id": "uuid\_grande", "option\_name": "Grande", "additional\_price": 2.50}, {"group\_id": "uuid\_extras", "option\_id": "uuid\_queso", "option\_name": "Queso Extra", "additional\_price": 1.00}\]. Esto permite reconstruir el ítem y su precio.  
  * item\_notes (text, nullable): Notas específicas para este ítem (ej. "sin cebolla").  
  * price\_at\_addition (numeric): Precio unitario del producto base *en el momento en que se añadió al carrito* (por si los precios cambian).  
  * options\_price\_at\_addition (numeric): Suma de los precios adicionales de las opciones seleccionadas *en el momento de añadir*.  
  * created\_at (timestamptz, default: now()).  
*   
* **RLS:**  
  * Permitir SELECT, INSERT, UPDATE, DELETE si user\_id \= auth.uid(). (Tanto anónimos como permanentes pueden gestionar su carrito).  
* 

**13\. Tabla** 

* **Propósito:** Tabla principal que registra cada orden confirmada.  
* **Columnas:**  
  * id (UUID, Primary Key, default: gen\_random\_uuid()): ID único de la orden.  
  * order\_number (text, unique): Número de orden legible para el cliente/soporte (ej. "APP-000123"). Podría generarse con una secuencia o función.  
  * user\_id (UUID, Foreign Key \-\> auth.users.id): Usuario que realizó la orden. *ON DELETE SET NULL (para mantener historial de órdenes aunque el usuario se borre).*  
  * status (text, default: 'pending\_payment'): Estado actual de la orden (ej. 'pending\_payment', 'confirmed', 'preparing', 'ready\_for\_pickup', 'out\_for\_delivery', 'delivered', 'cancelled', 'failed'). Usar un enum de PostgreSQL es ideal aquí.  
  * delivery\_address (jsonb): Objeto JSON con la dirección de entrega completa (copiada de addresses o ingresada por invitado en el momento del pedido). Incluir calle, \#int, \#ext, colonia, CP, ciudad, país, lat, lon, instrucciones.  
  * contact\_name (text): Nombre de contacto para la entrega.  
  * contact\_phone (text): Teléfono de contacto para la entrega.  
  * subtotal\_amount (numeric): Suma de los precios de todos los ítems.  
  * delivery\_fee\_amount (numeric): Costo de envío calculado.  
  * cashback\_discount\_amount (numeric, default: 0): Monto descontado por usar cashback.  
  * promo\_discount\_amount (numeric, default: 0): Monto descontado por código promocional.  
  * total\_amount (numeric): Monto final pagado o a pagar (subtotal \+ delivery \- cashback \- promo).  
  * payment\_method (text): Método elegido (ej. 'card', 'cash', 'terminal'). Usar enum.  
  * payment\_status (text, default: 'pending'): Estado del pago (ej. 'pending', 'paid', 'failed', 'refunded', 'authorized'). Usar enum.  
  * payment\_gateway\_reference (text, nullable): ID de la transacción en la pasarela de pago (si aplica).  
  * cashback\_earned\_amount (numeric, default: 0): Monto de cashback generado por esta orden.  
  * order\_notes (text, nullable): Notas generales del cliente para la orden.  
  * scheduled\_delivery\_time (timestamptz, nullable): Si la orden fue agendada.  
  * driver\_id (UUID, nullable, Foreign Key \-\> drivers.id): Repartidor asignado. *ON DELETE SET NULL.*  
  * store\_ids (UUID\[\], nullable): Array con los IDs de las tiendas involucradas en esta orden (útil para filtros y lógica multi-tienda).  
  * cancellation\_reason (text, nullable): Motivo si la orden fue cancelada.  
  * refund\_option\_chosen (text, nullable): 'credits' o 'bank' si fue cancelada y pagada con tarjeta.  
  * created\_at (timestamptz, default: now()).  
  * updated\_at (timestamptz, default: now()).  
*   
* **RLS:**  
  * Permitir SELECT si user\_id \= auth.uid() (para clientes) O si el usuario es staff (Admin/Group/Store con filtros adicionales).  
  * Permitir INSERT si user\_id \= auth.uid().  
  * Permitir UPDATE (cambio de estado, asignación driver, etc.) solo a roles de staff y/o funciones del sistema (Edge Functions).  
* 

**14\. Tabla** 

* **Propósito:** Detalla cada producto comprado dentro de una orden específica. Similar a cart\_items pero persistente.  
* **Columnas:**  
  * id (UUID, Primary Key, default: gen\_random\_uuid()): ID único del ítem en la orden.  
  * order\_id (UUID, Foreign Key \-\> orders.id): Orden a la que pertenece. *ON DELETE CASCADE.*  
  * product\_id (UUID, Foreign Key \-\> products.id): Producto base. *ON DELETE SET NULL (para mantener el ítem aunque el producto se borre del catálogo).*  
  * store\_id (UUID, Foreign Key \-\> stores.id): Tienda que surtió este ítem. *ON DELETE SET NULL.*  
  * product\_name (text): Nombre del producto *en el momento de la compra* (histórico).  
  * quantity (integer): Cantidad comprada.  
  * unit\_price (numeric): Precio unitario base *en el momento de la compra*.  
  * selected\_options (jsonb, nullable): JSON con las opciones seleccionadas, nombres y precios *en el momento de la compra*.  
  * item\_notes (text, nullable): Notas del cliente para este ítem.  
  * total\_item\_price (numeric): Precio total de este renglón ((unit\_price \+ options\_price) \* quantity).  
*   
* **RLS:**  
  * Hereda permisos de la tabla orders a través de la relación. Permitir SELECT si el usuario puede ver la order\_id correspondiente.  
  * INSERT solo al crear la orden. No se modifica después.  
* 

**15\. Tabla** 

* **Propósito:** Almacenar un registro más detallado de cada intento o transacción de pago, especialmente útil para pagos con tarjeta y reembolsos.  
* **Columnas:**  
  * id (UUID, Primary Key, default: gen\_random\_uuid()): ID único del pago.  
  * order\_id (UUID, Foreign Key \-\> orders.id): Orden asociada. *ON DELETE CASCADE.*  
  * user\_id (UUID, Foreign Key \-\> auth.users.id): Usuario que paga. *ON DELETE SET NULL.*  
  * amount (numeric): Monto de la transacción.  
  * currency (text, default: 'MXN'): Moneda.  
  * status (text): Estado del pago devuelto por la pasarela (ej. 'succeeded', 'failed', 'pending', 'requires\_action'). Usar enum.  
  * payment\_gateway (text): Nombre de la pasarela (ej. 'stripe', 'conekta').  
  * gateway\_transaction\_id (text, unique): ID único de la transacción en la pasarela.  
  * error\_message (text, nullable): Mensaje de error si falló.  
  * payment\_method\_details (jsonb, nullable): Detalles adicionales (ej. últimos 4 dígitos tarjeta, tipo tarjeta).  
  * created\_at (timestamptz, default: now()).  
  * updated\_at (timestamptz, default: now()).  
*   
* **RLS:**  
  * Permitir SELECT a roles de staff. Clientes no necesitan ver esta tabla directamente.  
  * INSERT, UPDATE manejados principalmente por Edge Functions que interactúan con la pasarela.  
* 

---

**Diseño de Base de Datos (Supabase/PostgreSQL) \- Parte 3: Wallet, Repartidores, Promociones y Staff**

**16\. Tabla** 

* **Propósito:** Almacena el saldo de créditos generales de un usuario (obtenidos principalmente por reembolsos). Este saldo se puede usar como método de pago.  
* **Columnas:**  
  * user\_id (UUID, Primary Key, Foreign Key \-\> auth.users.id): Usuario al que pertenece el saldo. *ON DELETE CASCADE.*  
  * balance (numeric, default: 0, check: balance \>= 0): Saldo actual de créditos.  
  * updated\_at (timestamptz, default: now()): Última vez que se actualizó el saldo.  
*   
* **RLS:**  
  * Permitir SELECT si user\_id \= auth.uid() (cliente ve su saldo) O si es staff.  
  * Permitir UPDATE (para añadir/restar saldo) solo a roles de staff (Super Admin) o Edge Functions (ej. al procesar reembolso/cancelación o aplicar créditos a una orden).  
* 

**17\. Tabla** 

* **Propósito:** Registra cada movimiento (entrada/salida) del saldo de créditos para auditoría.  
* **Columnas:**  
  * id (UUID, Primary Key, default: gen\_random\_uuid()): ID único de la transacción.  
  * user\_id (UUID, Foreign Key \-\> auth.users.id): Usuario afectado. *ON DELETE CASCADE.*  
  * type (text): 'credit' (entrada) o 'debit' (salida). Usar enum.  
  * amount (numeric, check: amount \> 0): Monto de la transacción.  
  * reason (text): Motivo (ej. 'refund\_order\_cancel', 'applied\_to\_order', 'manual\_adjustment'). Usar enum.  
  * related\_order\_id (UUID, nullable, Foreign Key \-\> orders.id): Orden relacionada (si aplica). *ON DELETE SET NULL.*  
  * admin\_adjuster\_id (UUID, nullable, Foreign Key \-\> auth.users.id): ID del admin que hizo el ajuste manual (si aplica). *ON DELETE SET NULL.*  
  * created\_at (timestamptz, default: now()).  
*   
* **RLS:**  
  * Permitir SELECT si user\_id \= auth.uid() (cliente ve su historial) O si es staff.  
  * Permitir INSERT solo a roles de staff o Edge Functions.  
* 

**18\. Tabla** 

* **Propósito:** Almacena el saldo de cashback específico que un usuario tiene para cada tienda o grupo participante.  
* **Columnas:**  
  * user\_id (UUID, Foreign Key \-\> auth.users.id): Usuario. *ON DELETE CASCADE.*  
  * entity\_type (text): 'store' o 'group'. Usar enum.  
  * entity\_id (UUID): ID de la tienda (stores.id) o del grupo (groups.id) para el cual es este saldo.  
  * balance (numeric, default: 0, check: balance \>= 0): Saldo actual de cashback para esta entidad.  
  * updated\_at (timestamptz, default: now()).  
  * *(Clave Primaria Compuesta: (*  
*   
* **RLS:**  
  * Permitir SELECT si user\_id \= auth.uid() (cliente ve sus saldos) O si es staff.  
  * Permitir UPDATE solo a Edge Functions (al ganar/usar cashback).  
* 

**19\. Tabla** 

* **Propósito:** Registra cada ganancia o uso de cashback.  
* **Columnas:**  
  * id (UUID, Primary Key, default: gen\_random\_uuid()): ID único transacción.  
  * user\_id (UUID, Foreign Key \-\> auth.users.id): Usuario. *ON DELETE CASCADE.*  
  * type (text): 'earned' o 'spent'. Usar enum.  
  * entity\_type (text): 'store' o 'group'. Usar enum.  
  * entity\_id (UUID): ID de la tienda/grupo relacionado.  
  * amount (numeric, check: amount \> 0): Monto de cashback ganado o gastado.  
  * related\_order\_id (UUID, Foreign Key \-\> orders.id): Orden que generó/usó el cashback. *ON DELETE CASCADE.*  
  * created\_at (timestamptz, default: now()).  
*   
* **RLS:**  
  * Permitir SELECT si user\_id \= auth.uid() (cliente ve su historial) O si es staff.  
  * Permitir INSERT solo a Edge Functions.  
* 

**20\. Tabla** 

* **Propósito:** Almacena los tokens seguros de las tarjetas guardadas por el usuario.  
* **Columnas:**  
  * id (UUID, Primary Key, default: gen\_random\_uuid()): ID único interno.  
  * user\_id (UUID, Foreign Key \-\> auth.users.id): Usuario dueño. *ON DELETE CASCADE.*  
  * payment\_gateway (text): Nombre de la pasarela (ej. 'stripe', 'conekta').  
  * gateway\_customer\_id (text, nullable): ID del cliente en la pasarela (si lo provee).  
  * gateway\_method\_id (text, unique): ID del método de pago (token) en la pasarela. **¡Esta es la clave\!**  
  * card\_brand (text, nullable): Ej. 'visa', 'mastercard'.  
  * card\_last4 (text, nullable): Últimos 4 dígitos.  
  * card\_exp\_month (integer, nullable): Mes expiración.  
  * card\_exp\_year (integer, nullable): Año expiración.  
  * is\_default (boolean, default: false): Si es el método predeterminado.  
  * created\_at (timestamptz, default: now()).  
*   
* **RLS:**  
  * Permitir SELECT (columnas no sensibles como gateway\_method\_id), UPDATE (is\_default), DELETE si user\_id \= auth.uid() Y is\_anonymous IS FALSE.  
  * Permitir INSERT si user\_id \= auth.uid() Y is\_anonymous IS FALSE, manejado vía Edge Function segura que obtiene el token de la pasarela.  
* 

**21\. Tabla** 

* **Propósito:** Almacena la información de los repartidores.  
* **Columnas:**  
  * id (UUID, Primary Key, default: gen\_random\_uuid()): ID único interno del repartidor.  
  * user\_id (UUID, Unique, Foreign Key \-\> auth.users.id): Vincula al usuario de autenticación (auth.users) que usa el repartidor para loguearse en la Driver App. *ON DELETE CASCADE.*  
  * full\_name (text): Nombre completo.  
  * phone (text, unique): Teléfono de contacto.  
  * vehicle\_type (text, nullable): 'motorcycle', 'bicycle', 'car'. Usar enum.  
  * vehicle\_details (text, nullable): Ej. Placas, modelo.  
  * documentation\_status (text, default: 'pending'): 'pending', 'verified', 'rejected'. Usar enum.  
  * account\_status (text, default: 'pending'): 'active', 'inactive', 'suspended'. Usar enum.  
  * is\_online (boolean, default: false): Estado actual de disponibilidad (controlado desde Driver App).  
  * current\_latitude (double precision, nullable): Última ubicación conocida.  
  * current\_longitude (double precision, nullable): Última ubicación conocida.  
  * location\_last\_updated (timestamptz, nullable): Timestamp de la última ubicación.  
  * cash\_pending\_settlement (numeric, default: 0): Monto de efectivo que debe liquidar.  
  * created\_at (timestamptz, default: now()).  
  * updated\_at (timestamptz, default: now()).  
*   
* **RLS:**  
  * Permitir SELECT (info no sensible) si user\_id \= auth.uid() (para Driver App).  
  * Permitir UPDATE (is\_online, current\_location, etc.) si user\_id \= auth.uid().  
  * Permitir SELECT, INSERT, UPDATE completo a roles de staff (Super Admin).  
* 

**22\. Tabla** 

* **Propósito:** Almacena referencias a los documentos subidos.  
* **Columnas:**  
  * id (UUID, Primary Key, default: gen\_random\_uuid()).  
  * driver\_id (UUID, Foreign Key \-\> drivers.id): Repartidor. *ON DELETE CASCADE.*  
  * document\_type (text): 'license', 'id\_card', 'vehicle\_registration'. Usar enum.  
  * file\_url (text): URL del archivo en Supabase Storage.  
  * verification\_status (text, default: 'pending'): 'pending', 'verified', 'rejected'.  
  * uploaded\_at (timestamptz, default: now()).  
  * verified\_at (timestamptz, nullable).  
  * verifier\_id (UUID, nullable, Foreign Key \-\> auth.users.id): Admin que verificó. *ON DELETE SET NULL.*  
*   
* **RLS:**  
  * Permitir SELECT si rol es staff.  
  * Permitir INSERT si driver\_id corresponde al user\_id logueado (desde Driver App) O si es staff.  
  * Permitir UPDATE (status) solo a staff.  
* 

**23\. Tabla** 

* **Propósito:** Historial de cuándo un repartidor entregó el efectivo pendiente.  
* **Columnas:**  
  * id (UUID, Primary Key, default: gen\_random\_uuid()).  
  * driver\_id (UUID, Foreign Key \-\> drivers.id): Repartidor. *ON DELETE CASCADE.*  
  * amount\_settled (numeric, check: amount\_settled \> 0): Monto liquidado.  
  * settled\_at (timestamptz, default: now()): Fecha/Hora de liquidación.  
  * processed\_by\_admin\_id (UUID, Foreign Key \-\> auth.users.id): Admin que registró la liquidación. *ON DELETE SET NULL.*  
  * notes (text, nullable).  
*   
* **RLS:**  
  * Permitir SELECT si driver\_id corresponde al user\_id logueado O si es staff.  
  * Permitir INSERT solo a staff (Super Admin).  
* 

**24\. Tabla** 

* **Propósito:** Almacena los códigos de descuento creados en el Admin Panel.  
* **Columnas:**  
  * id (UUID, Primary Key, default: gen\_random\_uuid()).  
  * code (text, unique): El código que ingresa el usuario.  
  * discount\_type (text): 'percentage' o 'fixed\_amount'. Usar enum.  
  * discount\_value (numeric, check: discount\_value \> 0).  
  * applies\_to (text): 'order', 'specific\_products', 'specific\_categories', 'specific\_stores'. Usar enum.  
  * applicable\_ids (UUID\[\], nullable): Array de IDs (productos, categorías o tiendas) si aplica.  
  * minimum\_order\_amount (numeric, nullable): Requisito de pedido mínimo.  
  * allowed\_user\_ids (UUID\[\], nullable): Array de user\_ids si es para usuarios específicos.  
  * max\_uses\_total (integer, nullable): Límite total de usos.  
  * max\_uses\_per\_user (integer, nullable, default: 1).  
  * start\_date (timestamptz, nullable).  
  * end\_date (timestamptz, nullable).  
  * is\_active (boolean, default: true).  
  * uses\_count (integer, default: 0): Contador de cuántas veces se ha usado.  
  * created\_at (timestamptz, default: now()).  
  * updated\_at (timestamptz, default: now()).  
*   
* **RLS:**  
  * Permitir SELECT (columnas necesarias para validación) a authenticated.  
  * Permitir INSERT, UPDATE, DELETE a roles de staff con permiso para gestionar promociones.  
* 

**25\. Tabla** 

* **Propósito:** Rastrea qué usuario usó qué código en qué orden.  
* **Columnas:**  
  * id (UUID, Primary Key, default: gen\_random\_uuid()).  
  * promo\_code\_id (UUID, Foreign Key \-\> promo\_codes.id). *ON DELETE CASCADE.*  
  * user\_id (UUID, Foreign Key \-\> auth.users.id). *ON DELETE CASCADE.*  
  * order\_id (UUID, Foreign Key \-\> orders.id). *ON DELETE CASCADE.*  
  * used\_at (timestamptz, default: now()).  
  * *(Clave Única Compuesta: (*  
*   
* **RLS:**  
  * Permitir SELECT a staff.  
  * Permitir INSERT solo vía Edge Function al aplicar el código en checkout.  
* 

**26\. Tabla** 

* **Propósito:** Define qué tiendas o grupos gestiona un Store Manager o Group Manager.  
* **Columnas:**  
  * staff\_user\_id (UUID, Foreign Key \-\> auth.users.id): ID del usuario staff. *ON DELETE CASCADE.*  
  * entity\_type (text): 'store' o 'group'. Usar enum.  
  * entity\_id (UUID): ID de la tienda (stores.id) o grupo (groups.id) asignado.  
  * *(Clave Primaria Compuesta: (*  
*   
* **RLS:**  
  * Gestionado solo por Super Admin. Necesario para filtrar datos en el Admin Panel para Group/Store Managers.  
* 

