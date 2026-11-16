# 🖥️ SISCOMPUTEC — Sistema de Gestión de Taller y E-commerce de Hardware

**Siscomputec** es una plataforma web integral diseñada para la administración de inventario, clasificación de rubros tecnológicos y exhibición de catálogo de hardware, componentes y servicios técnicos.

---

## 🚀 Stack Tecnológico

El proyecto está construido bajo una arquitectura moderna de desarrollo web full-stack:

* **Backend:** PHP 8.3 + Laravel (Arquitectura MVC, Eloquent ORM).
* **Frontend:** React.js con **Inertia.js** (permitiendo una SPA monolítica sin API REST separada).
* **Estilos y UI:** Tailwind CSS (diseño moderno, responsivo y adaptado a dispositivos móviles y de escritorio).
* **Empaquetador de Assets:** Vite.
* **Base de Datos:** MySQL.
* **Entorno de Ejecución:** Docker & Docker Compose (optimizado sobre WSL / Linux).

---

## 📁 Estructura del Proyecto

La arquitectura del código se encuentra modularizada para facilitar el mantenimiento, la escalabilidad y las correcciones:

```text
siscomputec/
├── app/
│   ├── Http/
│   │   ├── Controllers/
│   │   │   └── Admin/
│   │   │       ├── ProductController.php      # CRUD completo, subida de imágenes y manejo de SKU
│   │   │       └── CategoryController.php     # Gestión de categorías y autodetección de iconos SVG
│   │   └── ...
│   └── Models/
│       ├── Product.php                        # Modelo de productos y relaciones Eloquent
│       ├── Category.php                       # Modelo de categorías, slugs e iconos
│       └── ProductImage.php                   # Gestión de imágenes principales y asociadas
├── database/
│   └── migrations/                            # Migraciones de BD (products, categories, product_images)
├── resources/
│   └── js/
│       ├── Components/
│       │   └── ProductCard.jsx                # Tarjeta de producto interactiva para la tienda pública
│       └── Pages/
│           ├── Welcome.jsx                    # Tienda pública, filtros dinámicos y buscador por SKU/nombre
│           ├── Products/
│           │   └── Show.jsx                   # Vista detallada de productos y selector de cantidades
│           └── Admin/
│               ├── Dashboard.jsx              # Panel principal de administración orquestador
│               └── Partials/
│                   ├── ProductTable.jsx       # Tabla modular de inventario con SKU destacado
│                   └── ProductModal.jsx       # Modal reutilizable para crear y editar productos
└── routes/
    └── web.php                                # Rutas web públicas y del panel administrativo con prefijo
```

---

## ✨ Características Principales Implementadas

1. **Panel de Administración Modular:**
   * Gestión completa (CRUD) de productos y servicios con soporte para almacenamiento físico de imágenes.
   * Identificación visual de productos mediante **SKU destacado** en formato monoespaciado y visible ante distintas resoluciones.
   * Control de estados comerciales (*Activo, Oculto, Novedad, Stock*).
   * Interfaz dividida en componentes parciales (`ProductTable`, `ProductModal`) para evitar archivos pesados.

2. **Autodetección Inteligente de Iconos para Categorías:**
   * El backend analiza de forma automática las palabras clave del nombre de la categoría al crearse (ej. *Monitores, Mouse, Teclados, Audio, Redes, Almacenamiento, Memorias, Fundas, Componentes, Impresoras*) e inyecta el icono vectorial SVG correspondiente sin configuraciones manuales.

3. **Tienda Pública y Catálogo Dinámico (`Welcome.jsx`):**
   * Conectado en tiempo real a la base de datos de Laravel.
   * **Buscador avanzado en tiempo real:** Permite filtrar instantáneamente tanto por nombre comercial como por **código SKU**.
   * Filtros laterales dinámicos por categoría y rango de precios.
   * Ordenamiento flexible del catálogo (*Relevancia, Lo más nuevo, Menor a mayor precio, Mayor a menor precio*).

4. **Vista de Detalles del Producto (`Products/Show.jsx`):**
   * Visualización fotográfica a gran escala con indicador de novedad.
   * Control de stock disponible en tiempo real y selector interactivo de cantidades.
   * Integración directa con los botones de acción para compra o cotización.

---

## ⚙️ Guía de Instalación en un Nuevo Equipo (Entorno Docker)

Sigue estos pasos para clonar y poner en marcha el proyecto en una máquina nueva:

### 1. Requisitos Previos
* Git instalado.
* Docker y Docker Compose instalados y en ejecución (recomendado con WSL en Windows).

### 2. Clonar el Repositorio
```bash
git clone <url-del-repositorio>
cd siscomputec
```

### 3. Configurar el Archivo de Entorno (`.env`)
Duplica el archivo de configuración de ejemplo:
```bash
cp .env.example .env
```
Configura las credenciales de tu base de datos acorde a tu entorno Docker:
```env
DB_CONNECTION=mysql
DB_HOST=mysql
DB_PORT=3306
DB_DATABASE=siscomputec
DB_USERNAME=sail
DB_PASSWORD=password
```

### 4. Levantar los Contenedores Docker
Inicia los servicios en segundo plano:
```bash
docker compose up -d
```

### 5. Instalar Dependencias de PHP y Configurar Aplicación
Instala las dependencias del backend dentro del contenedor:
```bash
docker compose app composer install
```
Genera la llave de encripción:
```bash
docker compose exec app php artisan key:generate
```

### 6. Ejecutar Migraciones y Enlace de Almacenamiento
Crea las tablas en la base de datos y genera el enlace simbólico para las imágenes de productos:
```bash
docker compose exec app php artisan migrate --seed
docker compose exec app php artisan storage:link
```

### 7. Ajustar Permisos de Almacenamiento y Temporales
Otorga los permisos correctos para evitar errores de escritura en el contenedor:
```bash
docker compose exec --user root app chmod 1777 /tmp
docker compose exec app chmod -R 775 storage bootstrap/cache
docker compose exec app chown -R www-data:www-data storage bootstrap/cache
```

### 8. Compilar Assets y Ejecutar el Servidor de Desarrollo
Instala las dependencias del frontend y arranca Vite:
```bash
docker compose exec app npm install
docker compose exec app npm run dev
```

¡Listo! Ya puedes acceder a la tienda pública en `http://localhost:8000` y al panel de administración en `http://localhost:8000/admin/dashboard`.
