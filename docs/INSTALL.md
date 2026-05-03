# Italvisitas — Guía de Instalación y Deploy

## Stack

| Capa | Herramienta |
|------|-------------|
| Framework | Next.js 16 (App Router) |
| Base de datos | Supabase (PostgreSQL) |
| ORM | Prisma 7 |
| Storage (fotos) | Supabase Storage |
| Deploy | Vercel |
| Git | GitHub (`git@github-personal:ngonzlez/italvisitas`) |

---

## Paso 1 — Crear proyecto en Supabase

1. Ir a [supabase.com](https://supabase.com) → **New project**
2. Nombre: `italvisitas`, región más cercana (por ej. `South America (São Paulo)`)
3. Anotar la **contraseña** de la base de datos — solo se ve una vez
4. Esperar que termine el aprovisionamiento (~2 min)

### Obtener credenciales

Ir a **Settings → Database** y copiar:

| Variable | Dónde está | Qué usar |
|----------|-----------|----------|
| `DATABASE_URL` | Settings → Database → **Connection string → Transaction pooler** | Puerto **6543** |
| `DIRECT_URL` | Settings → Database → **Connection string → Session pooler** | Puerto **5432** |

Ir a **Settings → API** y copiar:

| Variable | Dónde está |
|----------|-----------|
| `NEXT_PUBLIC_SUPABASE_URL` | Project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `anon` / `public` |
| `SUPABASE_SERVICE_ROLE_KEY` | `service_role` (secreto, nunca al cliente) |

---

## Paso 2 — Crear bucket de fotos en Supabase

1. Ir a **Storage → New bucket**
2. Nombre: `visit-photos`
3. Marcar **Public bucket** (para que las URLs sean accesibles)
4. **Save**

---

## Paso 3 — Configurar .env.local

```bash
cd ~/projects/italvisitas
cp .env.example .env.local
```

Editar `.env.local` con los valores reales:

```env
# --- Supabase PostgreSQL ---
# Transaction pooler — para queries en runtime (puerto 6543)
DATABASE_URL="postgresql://postgres.XXXX:TU_PASSWORD@aws-0-sa-east-1.pooler.supabase.com:6543/postgres?pgbouncer=true"

# Session pooler — para migraciones Prisma (puerto 5432)
DIRECT_URL="postgresql://postgres.XXXX:TU_PASSWORD@aws-0-sa-east-1.pooler.supabase.com:5432/postgres"

# --- Supabase API ---
NEXT_PUBLIC_SUPABASE_URL="https://XXXX.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
SUPABASE_SERVICE_ROLE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."

# --- Storage ---
NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET="visit-photos"
```

> ⚠️ Nunca subir `.env.local` a Git. Está en `.gitignore`.

---

## Paso 4 — Instalar dependencias

```bash
cd ~/projects/italvisitas
npm install
```

---

## Paso 5 — Migrar base de datos

```bash
# Crear las tablas en Supabase
npx prisma migrate dev --name init

# Verificar que las tablas se crearon
npx prisma studio
# Abre http://localhost:5555 — revisá que existan User, Place, Doctor, Visit, Attendance
```

---

## Paso 6 — Cargar datos demo (seed)

```bash
npx prisma db seed
```

Esto crea:
- 4 usuarios (1 admin + 3 visitadores)
- 8 lugares (farmacias, hospitales, clínicas)
- 6 médicos
- ~48 visitas de los últimos 30 días
- ~35 registros de asistencia de los últimos 14 días

**Credenciales demo:**

| Rol | Email | Contraseña |
|-----|-------|------------|
| Admin | `admin@italquimica.com.py` | `admin` |
| Visitador | `maria@italquimica.com.py` | `visita` |
| Visitador | `carlos@italquimica.com.py` | `visita` |
| Visitador | `lucia@italquimica.com.py` | `visita` |

---

## Paso 7 — Probar localmente

```bash
npm run dev
# Abre http://localhost:3000
```

Verificar:
- [ ] Login con credenciales admin → redirige a `/admin`
- [ ] Login con visitador → redirige a `/visits`
- [ ] Admin: dashboard muestra KPIs y charts
- [ ] Visitador: crear nueva visita (3 pasos)
- [ ] Visitador: registrar entrada/salida
- [ ] Responsive: vista mobile en 390px sin overflow

---

## Paso 8 — Subir a GitHub

### Primera vez (crear repo):

1. Ir a [github.com](https://github.com) con la cuenta `ngonzlez`
2. **New repository** → nombre: `italvisitas`
3. Privado, **sin** README ni `.gitignore`
4. Copiar la URL SSH que aparece

```bash
cd ~/projects/italvisitas

# El remote ya está configurado:
git remote -v
# origin  git@github-personal:ngonzlez/italvisitas.git

# Push inicial
git push -u origin main
```

> El host `github-personal` es el alias SSH configurado en `~/.ssh/config` para la cuenta secundaria de GitHub. Ver [GIT-MULTI-CUENTA.md](../../../docker-php-apache/source/www/italquimica/docs/GIT-MULTI-CUENTA.md) si necesitás configurarlo.

### Pushes posteriores:

```bash
git add -A
git commit -m "descripción del cambio"
git push
```

---

## Paso 9 — Deploy en Vercel

### Instalar Vercel CLI (si no lo tenés):

```bash
npm i -g vercel
```

### Primer deploy:

```bash
cd ~/projects/italvisitas
vercel
```

Seguir el wizard:
- **Set up and deploy?** → Y
- **Which scope?** → tu cuenta personal
- **Link to existing project?** → N
- **Project name?** → `italvisitas`
- **In which directory is your code?** → `./` (enter)
- **Auto-detected settings** → Y

### Configurar variables de entorno en Vercel:

**Opción A — Dashboard (recomendado):**

1. Ir a [vercel.com/dashboard](https://vercel.com/dashboard) → proyecto `italvisitas`
2. **Settings → Environment Variables**
3. Agregar cada variable del `.env.local`:

```
DATABASE_URL          → (valor del pooler, puerto 6543)
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY
NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET  → visit-photos
```

**Opción B — CLI:**

```bash
vercel env add DATABASE_URL
vercel env add NEXT_PUBLIC_SUPABASE_URL
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
vercel env add SUPABASE_SERVICE_ROLE_KEY
vercel env add NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET
```

### Deploy a producción:

```bash
vercel --prod
```

Vercel ejecuta automáticamente:
```
npx prisma generate && next build
```
(configurado en `vercel.json`)

---

## Paso 10 — Migraciones en producción

Cuando hagas cambios al schema de Prisma, correr las migraciones desde local apuntando a la DB de producción:

```bash
# Con el .env.local apuntando a Supabase producción
npx prisma migrate deploy
```

> No usar `migrate dev` en producción — usa `migrate deploy`.

---

## Flujo de trabajo diario

```bash
# Desarrollo local
npm run dev

# Cambios al schema
npx prisma migrate dev --name descripcion_del_cambio
npx prisma generate

# Commit y deploy
git add -A
git commit -m "feat: descripción"
git push
vercel --prod
```

---

## Estructura del proyecto

```
italvisitas/
├── app/
│   ├── (auth)/login/          # Pantalla de login
│   ├── (visitor)/             # App móvil (visitadores)
│   │   ├── visits/            # Lista + detalle + nueva visita
│   │   └── attendance/        # Check-in / check-out
│   ├── (admin)/admin/         # Dashboard administrativo
│   │   ├── visits/            # Tabla con filtros
│   │   ├── attendance/        # Log de asistencia
│   │   ├── visitors/          # Directorio visitadores
│   │   ├── doctors/           # Directorio médicos
│   │   ├── places/            # Directorio lugares
│   │   └── reports/           # Reportes con charts
│   └── api/                   # REST API
│       ├── auth/              # Login / logout
│       ├── visits/            # CRUD visitas
│       ├── attendance/        # Check-in / check-out
│       └── upload/            # Subida fotos a Supabase Storage
├── components/
│   ├── ui/                    # Button, Card, Input, Badge
│   ├── visitor/               # Shell móvil, wizard, toggle asistencia
│   └── admin/                 # Sidebar, charts, tabla visitas
├── lib/
│   ├── auth.ts                # Cookie session + bcrypt
│   ├── prisma.ts              # Prisma client singleton (pg adapter)
│   ├── supabase.ts            # Supabase client (server + browser)
│   └── utils.ts               # formatDate, cn, STOCK_CONFIG, etc.
├── prisma/
│   ├── schema.prisma          # Modelos: User, Place, Doctor, Visit, Attendance
│   └── seed.ts                # Datos demo
├── middleware.ts               # Protección de rutas + redirect por rol
├── prisma.config.ts           # Config Prisma 7 (datasource URL)
├── vercel.json                # Config build Vercel
└── .env.example               # Template de variables de entorno
```

---

## Solución de problemas

### Error: `PrismaClient` no inicializa
Verificar que `DATABASE_URL` esté configurado y sea el pooler (puerto 6543).

### Error: `migrate dev` falla
Usar `DIRECT_URL` (puerto 5432) en el campo `datasource.url` de `prisma.config.ts` para migraciones:
```typescript
datasource: {
  url: process.env["DIRECT_URL"]!, // ← directa para migraciones
}
```

### Error de CORS en Storage
Ir a Supabase → Storage → bucket `visit-photos` → **Policies** y agregar política de INSERT para usuarios autenticados.

### Vercel build falla: `Cannot find module '@prisma/client'`
El `vercel.json` ya incluye `npx prisma generate` en el buildCommand. Verificar que esté presente.
