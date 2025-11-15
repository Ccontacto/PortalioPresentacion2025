# Prompt de Proyecto: MVP POS Web para Restaurante v1

## 1. Visión General

**Proyecto:** Construir un Punto de Venta (POS) Web minimalista y ultra-rápido, enfocado 100% en la tarea de tomar pedidos para delivery.

**Cliente Target:** Operadores de restaurantes que reciben pedidos por teléfono y necesitan una herramienta ágil que no interrumpa su flujo de trabajo.

**Propuesta de Valor:** Un sistema POS propietario, flexible y con una experiencia de usuario superior, que se integra con un backend ya funcional. A diferencia de soluciones como Poster POS o Fudo, nuestra solución ofrece personalización total y control sobre el código a un precio único, sin mensualidades.

## 2. Objetivo Principal

Crear una aplicación de una sola página (Single Page Application) donde un operador pueda **crear y despachar un pedido en menos de 60 segundos** a través de un flujo intuitivo de 4 pasos, sin necesidad de navegar entre distintas pantallas.

## 3. Flujo de Usuario Principal (4 Pasos en una Pantalla)

El diseño debe ser un layout multi-panel en una sola vista, donde cada paso actualiza la siguiente sección.

### Paso 1: Cliente

- **Búsqueda Inteligente:** Un único campo de búsqueda para encontrar clientes por **nombre** o **teléfono**.
- **Alta "en-línea":** Si el cliente no existe, el sistema debe permitir registrarlo con solo **Nombre** y **Teléfono** en la misma vista, sin pop-ups ni redirecciones.
- **Validación E.164:** El campo de teléfono debe forzar el formato E.164 (ej. `+525512345678`) para garantizar la integridad de los datos y la comunicación con APIs de logística.

### Paso 2: Dirección y Logística

- **Selección de Dirección:** Al seleccionar un cliente, se muestran sus direcciones guardadas.
- **Validación Triple en Tiempo Real:** Al seleccionar o introducir una nueva dirección, el sistema debe consultar el backend/API logística (ej. Tookan) y validar tres puntos clave, mostrando el resultado con "chips" de estado claros (verde, amarillo, rojo):
    1.  **Cobertura de Zona:** ¿La dirección está dentro del área de servicio? (Sí/No)
    2.  **Límite de Rango:** ¿La distancia es rentable? (ej. < 7km) (Sí/No)
    3.  **Costo de Envío:** Mostrar el costo exacto del delivery.
- **Bloqueo Inteligente:** Si la dirección no es viable (sin cobertura o fuera de rango), el flujo no debe permitir continuar al siguiente paso.

### Paso 3: Ítems del Pedido

- **Catálogo de Productos:** Una vista simple del menú del restaurante (SKUs).
- **Agregado Rápido:** El operador puede agregar o quitar ítems al pedido.
- **Cálculo Automático:** El subtotal, costo de envío (del paso 2) y el total se calculan y muestran en tiempo real.

### Paso 4: Confirmación y Despacho

- **Resumen del Pedido:** Muestra un resumen final y conciso: Cliente, Dirección, Total y ETA (Tiempo Estimado de Entrega, si lo provee la API logística).
- **Acción Final:** Un único botón "Crear y Despachar Pedido".
- **Respuesta del Sistema:**
    - **Confirmación Instantánea:** Feedback visual inmediato en la UI.
    - **Ticket Imprimible:** Generar un ticket simple (formato térmica) con los detalles del pedido.
    - **Integración Backend:** El pedido se envía al sistema de despacho (backend) en segundo plano.

## 4. Características Clave y Requerimientos No Funcionales

- **Diseño Task-Focused:** La interfaz debe eliminar toda distracción. Cada elemento debe servir al propósito de agilizar la toma del pedido.
- **UI de Alto Contraste:** Debe incluir modos claro y oscuro automáticos (`prefers-color-scheme`) para legibilidad en distintos ambientes (cocina con mucha luz, mostrador con poca luz).
- **Feedback Háptico y Sonoro (Opcional):** Considerar micro-interacciones (sonidos y vibraciones sutiles) para confirmar acciones clave (ej. ítem agregado, pedido creado), mejorando la experiencia para operadores "power-users".
- **Responsive:** Aunque el foco es escritorio, debe ser usable en tablets.

## 5. Fuera de Alcance para el MVP

- **Procesamiento de Pagos:** El POS no es una terminal de pago. Se asume que el cobro es contra-entrega o gestionado por otros medios.
- **Gestión de Inventario:** No se controlará el stock de los productos.
- **Gestión de Catálogo:** El menú y los precios se gestionan desde el backend.
- **Roles y Permisos Avanzados:** Se asume un único rol de "Operador".
- **Dashboard y Reportes:** No se construirán vistas de análisis o reportería.

## 6. Stack Tecnológico

- **Frontend:** React 19 + TypeScript
- **Estilos:** CSS Modules o Styled Components, utilizando el sistema de tokens de diseño proporcionado.
- **Build Tool:** Vite

## 7. Sistema de Diseño (Tokens)

El desarrollo debe adherirse estrictamente al sistema de tokens `UNI·Master` proporcionado. Se debe crear un archivo `tokens.css` que traduzca los tokens del JSON a variables CSS para su consumo en la aplicación.

**Ejemplo de implementación de tokens:**

```css
/* tokens.css */
:root {
  --color-primary: oklch(59% 0.14 230);
  --font-family-sans: -apple-system, Inter, Segoe UI, Roboto, system-ui;
  --radius-md: 12px;
  /* ... etc ... */
}

/* Componente.css */
.button-primary {
  background-color: var(--color-primary);
  font-family: var(--font-family-sans);
  border-radius: var(--radius-md);
}
```

## 8. Preguntas Abiertas a Resolver

1.  **Gestión de Productos:** ¿Cómo se obtiene el catálogo de productos y precios? ¿Es un endpoint de API?
2.  **Manejo de Descuentos:** ¿El operador puede aplicar descuentos (porcentuales o fijos) a ítems o al total del pedido?
3.  **Multi-Sucursal:** ¿El operador necesita seleccionar una sucursal al iniciar sesión, o su sesión está atada a una única sucursal?
4.  **API Logística:** ¿Cuáles son los endpoints y contratos exactos para validar dirección y crear el pedido de delivery?

## 9. Entregables

1.  **Aplicación Web Funcional:** Una SPA que cumple con el flujo de 4 pasos descrito.
2.  **Código Fuente:** Repositorio Git con el código de la aplicación React.
3.  **Documentación de Tokens:** El archivo `tokens.css` generado a partir del JSON.
4.  **Mockup Visual (Opcional):** Un mockup en Figma o similar que represente la interfaz de usuario final.
