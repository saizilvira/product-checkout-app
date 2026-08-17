# Product Checkout App

Aplicación full-stack de onboarding de pago de un producto: visualización de stock, captura de datos de tarjeta y entrega, resumen de pago, procesamiento de la transacción y actualización de inventario.

## Stack

### Frontend
- Vue 3 + TypeScript
- Pinia (state management)
- Vue Router
- Tailwind CSS (Flexbox/Grid)
- Axios
- Jest

**¿Por qué Pinia en lugar de Vuex?**  
Pinia es el sucesor oficial de Vuex para Vue 3, recomendado por el equipo de Vue. Mantiene los principios de la arquitectura Flux (flujo unidireccional, store centralizado, actions). Ofrece mejor soporte de TypeScript y API más simple. La persistencia del progreso del checkout se implementa con `pinia-plugin-persistedstate` sobre `localStorage`, cumpliendo el requisito de resiliencia ante refresh.

### Backend
- NestJS + TypeScript
- TypeORM + PostgreSQL
- Arquitectura Hexagonal (Ports & Adapters)
- Railway Oriented Programming (ROP) en Use Cases
- Helmet + ValidationPipe + Throttler (OWASP)
- Jest

## Arquitectura Backend (Hexagonal)
domain/           → Entidades, Value Objects, Ports (interfaces)
application/      → Use Cases (ROP con Result)
infrastructure/   → Adapters (TypeORM, Payment Gateway, HTTP)


La lógica de negocio no vive en controllers. Los repositorios se definen como ports en el dominio y se implementan en infrastructure.

## Modelo de datos

- **products** — id, name, description, price_in_cents, stock, image_url
- **customers** — id, full_name, email, phone, document_type, document_number
- **deliveries** — id, customer_id, address, city, region, postal_code, phone
- **transactions** — id, reference, payment_gateway_transaction_id, product_id, customer_id, delivery_id, amounts (product, base_fee, delivery_fee, total), status, card metadata, currency

Todos los montos se manejan en **centavos**.

## Flujo de negocio (5 pasos)

1. **Product page** — Muestra producto y stock
2. **Credit Card / Delivery info** — Modal de tarjeta + formulario de entrega
3. **Summary** — Backdrop con Product + Base fee + Delivery fee
4. **Final status** — Resultado de la transacción
5. **Product page** — Redirect con stock actualizado

## API Endpoints

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/products` | Obtener producto |
| GET | `/products/:id` | Obtener producto por ID |
| POST | `/transactions` | Crear transacción PENDING |
| POST | `/transactions/process-payment` | Procesar pago |
| GET | `/transactions/:id` | Consultar transacción |

### Postman / Swagger

- Importar la colección Postman desde: `docs/postman_collection.json` *(crear este archivo)*
- O documentar la URL de Swagger cuando se active: `http://localhost:3000/api`

## Cómo ejecutar en local

### Requisitos
- Node.js 20+
- PostgreSQL 16+
- npm

### Backend

cd backend
cp .env.example .env
# Configurar DB_* y PAYMENT_* keys
npm install
npm run seed
npm run start:dev

### Frontend
cd frontend
cp .env.example .env
npm install
npm run dev

### Test

# Backend
cd backend && npm run test:cov

# Frontend
cd frontend && npm run test:cov

### Seguridad (OWASP)

Helmet (security headers)
ValidationPipe global (whitelist + forbidNonWhitelisted)
Rate limiting (Throttler)
Secretos solo en variables de entorno
Private key nunca expuesta al frontend
HTTPS en despliegue

### Deploy

Frontend: (URL)
Backend: (URL)

### Autor
Candidato — Full Stack Development Test

## Deploy

- Frontend: https://product-checkout-app-git-develop-vendly5.vercel.app/
- Backend: https://product-checkout-app.onrender.com/
- Database: PostgreSQL managed Supabase