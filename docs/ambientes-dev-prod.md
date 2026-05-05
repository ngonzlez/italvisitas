# Guía: Ambiente de Desarrollo y Producción

Esta guía explica paso a paso cómo separar el ambiente de desarrollo del de producción usando Git branches, Vercel y dos proyectos de Supabase.

---

## Concepto general

La idea es tener dos "mundos" completamente separados:

| | Desarrollo | Producción |
|---|---|---|
| **Git branch** | `dev` | `main` |
| **URL** | `rondamed-dev.vercel.app` | `rondamed.com` |
| **Base de datos** | Supabase proyecto DEV | Supabase proyecto PROD |
| **Para qué** | Probar features nuevas | Lo que usa el cliente |

Nunca tocás directamente la rama `main`. Todo pasa primero por `dev`, lo probás, y recién ahí lo subís a producción.

---

## Paso 1 — Crear la rama `dev` en Git

Abrí la terminal, posicionada en la carpeta del proyecto:

```bash
cd /Users/libertytechpysa/projects/italvisitas
```

Creá la rama `dev` a partir de `main`:

```bash
git checkout main
git pull origin main
git checkout -b dev
git push origin dev
```

Verificá que existe:

```bash
git branch -a
```

Deberías ver:
```
* dev
  main
  remotes/origin/dev
  remotes/origin/main
```

---

## Paso 2 — Crear el proyecto de Supabase para desarrollo

1. Entrá a [https://supabase.com](https://supabase.com) e iniciá sesión
2. Hacé clic en **"New project"**
3. Completá:
   - **Name:** `rondamed-dev`
   - **Database password:** generá uno seguro y guardalo
   - **Region:** la misma que tu proyecto de producción (US East)
4. Esperá que termine de crear (1-2 minutos)
5. Una vez creado, andá a **Settings → Database → Connection string → URI**
6. Copiá el string que empieza con `postgresql://...` — lo vas a necesitar en el Paso 4

### Aplicar el schema a la base de datos de desarrollo

Con el nuevo proyecto de Supabase creado, necesitás aplicar las migraciones para que tenga las mismas tablas que producción.

Abrí el archivo `.env.local` del proyecto y **temporalmente** reemplazá el `DATABASE_URL` con el de desarrollo:

```bash
# .env.local — reemplazá temporalmente
DATABASE_URL="postgresql://postgres:[PASSWORD]@[HOST]:5432/postgres"
```

Luego ejecutá:

```bash
npx prisma migrate deploy
```

Deberías ver:
```
2 migrations found in prisma/migrations
Applying migration `20260503220000_add_specialty_zone_doctor_places`
Done
```

Restaurá el `.env.local` al DATABASE_URL de producción cuando termines.

> **Importante:** el `.env.local` nunca se sube a Git (está en `.gitignore`). Es solo local.

---

## Paso 3 — Configurar variables de entorno en Vercel por ambiente

1. Entrá a [https://vercel.com](https://vercel.com) → tu proyecto `italvisitas`
2. Andá a **Settings → Environment Variables**
3. Vas a ver las variables actuales. Cada variable tiene tres checkboxes:
   - **Production** (rama `main`)
   - **Preview** (ramas que no son main, como `dev`)
   - **Development** (local)

### Configurar DATABASE_URL para cada ambiente

#### Para producción (ya existe, solo verificar)
- Buscá `DATABASE_URL` en la lista
- Asegurate que tenga marcado **solo "Production"**
- El valor debe ser el connection string de tu Supabase de producción

#### Agregar DATABASE_URL para desarrollo
1. Hacé clic en **"Add New"** o editá la variable existente
2. Variable: `DATABASE_URL`
3. Value: pegá el connection string de tu Supabase **de desarrollo** (el que copiaste en el Paso 2)
4. Marcá **solo "Preview"** (no marques Production)
5. En el campo **"Git Branch"** escribí `dev` para limitarlo solo a esa rama
6. Hacé clic en **Save**

Repetí lo mismo para `NEXTAUTH_SECRET` o cualquier otra variable sensible si corresponde.

---

## Paso 4 — Verificar el deploy automático en Vercel

Cada vez que hagas push a `dev`, Vercel va a generar un deploy automático en una URL de preview.

Para probarlo:

```bash
git checkout dev
# hacé cualquier cambio menor, por ejemplo en un comentario
git add -A
git commit -m "test: verificar deploy de dev"
git push origin dev
```

Andá a Vercel → tu proyecto → sección **"Deployments"**. Vas a ver un deploy nuevo con la etiqueta `dev`. La URL va a ser algo como `italvisitas-git-dev-[tu-usuario].vercel.app`.

---

## Paso 5 — Flujo de trabajo diario

### Cuando querés trabajar en una feature nueva

```bash
# 1. Siempre partir desde dev actualizado
git checkout dev
git pull origin dev

# 2. Crear una rama para la feature
git checkout -b feature/nombre-de-la-feature

# 3. Trabajar, hacer commits normalmente
git add -A
git commit -m "feat: descripcion de lo que hice"

# 4. Subir la rama
git push origin feature/nombre-de-la-feature
```

### Cuando terminaste la feature y querés probarla en dev

```bash
# Mergear la feature a dev
git checkout dev
git merge feature/nombre-de-la-feature
git push origin dev
```

Vercel va a deployar automáticamente a la URL de preview. Probás ahí.

### Cuando todo está probado y querés subir a producción

```bash
# Mergear dev a main
git checkout main
git pull origin main
git merge dev
git push origin main
```

Vercel va a deployar automáticamente a producción.

---

## Paso 6 — Nomenclatura de branches recomendada

| Tipo | Prefijo | Ejemplo |
|------|---------|---------|
| Feature nueva | `feature/` | `feature/filtro-por-zona` |
| Corrección de bug | `fix/` | `fix/error-login` |
| Mejora visual | `ui/` | `ui/nuevo-diseño-login` |
| Hotfix urgente en prod | `hotfix/` | `hotfix/error-critico-visitas` |

### Hotfix urgente (bug en producción que no puede esperar)

Si hay un bug en producción que necesitás corregir ya, sin pasar por dev:

```bash
git checkout main
git checkout -b hotfix/descripcion-del-bug
# corregís el bug
git add -A
git commit -m "fix: descripcion del bug"
git checkout main
git merge hotfix/descripcion-del-bug
git push origin main

# Después llevás el fix a dev también
git checkout dev
git merge hotfix/descripcion-del-bug
git push origin dev
```

---

## Resumen de comandos más usados

```bash
# Ver en qué branch estás
git branch

# Cambiar de branch
git checkout dev
git checkout main

# Crear branch nueva desde donde estás
git checkout -b feature/mi-feature

# Actualizar tu branch con los últimos cambios remotos
git pull origin dev

# Ver el estado de los archivos modificados
git status

# Agregar todos los cambios y hacer commit
git add -A
git commit -m "descripcion del cambio"

# Subir al repositorio remoto
git push origin dev

# Mergear una branch en la que estás parado
git merge feature/mi-feature

# Borrar una branch local que ya no necesitás
git branch -d feature/mi-feature

# Borrar una branch remota que ya no necesitás
git push origin --delete feature/mi-feature
```

---

## Diagrama del flujo completo

```
feature/nueva-pantalla
        |
        | merge cuando está lista
        ↓
       dev  ←── acá probás todo
        |
        | merge cuando dev está estable
        ↓
       main ←── producción, lo que ve el cliente
```

---

## Notas importantes

- **Nunca hagas commits directamente en `main`**. Siempre pasá por `dev` primero.
- **Nunca subas el archivo `.env.local`** a Git. Ya está en `.gitignore`, pero tenelo presente.
- La base de datos de desarrollo puede tener datos de prueba sucios — no importa, es para eso.
- Si algo sale mal en dev, no afecta para nada a producción.
- Podés correr el seed en dev cuando quieras para tener datos frescos: `npx tsx prisma/seed.ts`
