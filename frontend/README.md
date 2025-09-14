# Next.js Frontend — Spring Security + Postgres Demo

A small **Next.js (App Router)** frontend that talks to a Spring Boot backend secured with Spring Security and PostgreSQL. It does classic **session (cookie) auth**:

* Login form posts **`application/x-www-form-urlencoded`** to `POST /perform_login`
* Backend returns **200** on success (our custom success handler) or **401** on failure
* Frontend keeps the **JSESSIONID** cookie (`credentials: 'include'`)
* Protected home page fetches `GET /me` and shows **Logout** (POST `/perform_logout`)

> Default backend base URL: **[http://localhost:8080](http://localhost:8080)** (override with `NEXT_PUBLIC_API_BASE`).

---

## 1) Requirements

* **Node.js 18+**
* **npm** or **yarn**
* Spring Boot backend from this repo running on **:8080** with CORS enabled for `http://localhost:3000`

---

## 2) Create the app

```bash
# create a fresh Next.js app (App Router)
npx create-next-app@latest frontend --use-npm --no-eslint --no-src-dir --app

cd frontend
```

> If you already have the provided `frontend/` folder, just `cd` into it and continue.

---

## 3) Install Tailwind CSS

```bash
# from ./frontend
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

Edit **`tailwind.config.js`** so Tailwind scans your App Router files:

```js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
    "./src/pages/**/*.{js,ts,jsx,tsx}" // keep in case you add Pages dir
  ],
  theme: { extend: {} },
  plugins: [],
}
```

Create/ensure **`src/app/globals.css`** includes Tailwind layers at the top:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

> You can paste your custom theme/glass styles **below** those lines.

---

## 4) Configure environment

Create **`.env.local`** (Next.js reads it automatically):

```
NEXT_PUBLIC_API_BASE=http://localhost:8080
```

If you omit this, the app falls back to `http://localhost:8080`.

---

## 5) Project structure (minimal)

```
frontend/
├─ src/
│  └─ app/
│     ├─ globals.css            # Tailwind + your custom styles
│     ├─ layout.js              # Root layout
│     ├─ login/
│     │  └─ page.js             # Login form (POST /perform_login)
│     └─ page.js                # Protected home (GET /me, POST /perform_logout)
├─ package.json
├─ postcss.config.js
└─ tailwind.config.js
```

---

## 6) How the auth works (frontend)

### Login (in `src/app/login/page.js`)

```js
const body = new URLSearchParams();
body.set('username', username.trim());
body.set('password', password);

const res = await fetch(`${API_BASE}/perform_login`, {
  method: 'POST',
  body,
  headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  credentials: 'include',   // keep JSESSIONID
  mode: 'cors',
  redirect: 'manual'
});

if (res.status === 200) router.push('/');
else if (res.status === 401) setError('Invalid credentials');
else setError(`Login failed (status ${res.status})`);
```

### Get current user (in `src/app/page.js`)

```js
const res = await fetch(`${API_BASE}/me`, { credentials: 'include' });
const me = await res.json(); // { authenticated: true/false, username: "user" }
```

### Logout (button on home page)

```js
await fetch(`${API_BASE}/perform_logout`, {
  method: 'POST',
  credentials: 'include'
});
router.push('/login');
```

---

## 7) Run it

```bash
# from ./frontend
npm run dev
# open http://localhost:3000/login
```

Use the backend users (e.g., `admin/admin` or `user/user`) that you inserted with **BCrypt** (stored as `{bcrypt}$2a$...`), or temporarily `{noop}` passwords for quick testing.

---

## 8) Backend expectations (for this frontend)

Your Spring Security should roughly look like:

* `formLogin().loginProcessingUrl("/perform_login")`
* `successHandler((req,res,auth) -> res.setStatus(200))`
* `failureHandler((req,res,ex) -> res.sendError(401, "Bad credentials"))`
* `exceptionHandling().authenticationEntryPoint((req,res,ex) -> res.sendError(401))`
* `logout().logoutUrl("/perform_logout")`
* CORS allows origin `http://localhost:3000`, `allowCredentials=true`
* Password encoder is **Delegating** (`PasswordEncoderFactories.createDelegatingPasswordEncoder()`)

Also expose:

```java
@GetMapping("/me")
public Map<String,Object> me(Principal p) {
  return Map.of("authenticated", p != null, "username", p != null ? p.getName() : null);
}
```

---

## 9) Troubleshooting

* **401 on login**

  * Wrong credentials or password hash mismatch
  * Ensure DB passwords are `{bcrypt}$2a$...` if using Delegating encoder
  * Roles should be `ROLE_USER` / `ROLE_ADMIN`

* **500 on login**

  * Usually missing `{bcrypt}` prefix, empty authorities, or missing entity/repo
  * Check backend logs; enable:

    ```
    logging.level.org.springframework.security=DEBUG
    logging.level.org.hibernate.SQL=DEBUG
    ```

* **ERR\_TOO\_MANY\_REDIRECTS**

  * Don’t use `loginPage("/login")` for SPA unless you actually serve an HTML page
  * Use the success/failure handlers to return **200/401** instead of redirects
  * Frontend uses `redirect: 'manual'`

* **CORS issues**

  * Backend CORS must allow origin `http://localhost:3000`, methods `GET,POST,PUT,DELETE,OPTIONS`, headers like `Content-Type`, and `allowCredentials=true`
  * Frontend must send `credentials: 'include'`

---

## 10) Scripts you’ll use most

```bash
# Dev server
npm run dev

# Lint/Build (if you enabled them)
npm run build
npm run start
```

---

## 11) Optional styling tips

* Keep your global theme tokens and “glass” classes in `globals.css`
* Center the login card with: `min-h-screen flex items-center justify-center`
* Add a small light/dark/system toggle by toggling the `dark` class on `document.documentElement`

---

That’s it! You now have a clean Next.js frontend wired to a Spring Security + Postgres backend using session cookies and Tailwind CSS. Happy building ✨
