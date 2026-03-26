# 📘 Agents.md – React Native Project Guidelines

## 🧱 Tech Stack

* React Native (Expo Router)
* TypeScript
* NativeWind (Tailwind for RN)
* Firebase (Firestore)
* React Hook Form
* pnpm

---

## 📂 Project Structure

```
app/
  (auth)/
  (tabs)/
components/
  courses/
  departments/
  ui/
hooks/
services/
  firebase.ts
  courses.ts
  departments.ts
```

### Rules:

* `app/` → screens only (routing)
* `components/` → UI + small business logic
* `services/` → Firebase interaction (API layer)
* `hooks/` → custom hooks
* `ui/` → shared components (Button, Input...)

---

## 🧩 Component Conventions

### 1. Domain-based structure

```
components/
  courses/
    create.tsx
    update.tsx
    delete.tsx
    detail.tsx
```

### 2. Naming

* `CreateCourse`
* `UpdateCourse`
* `DeleteCourse`
* `DetailCourse`

👉 Avoid vague names like `Modal1`, `FormA`

---

## 🎨 UI/UX System (IMPORTANT)

### 🎯 Primary Color

* **Primary (system): ORANGE**

```ts
brand-500 → primary
brand-50 → light background
```

### Rules:

* Primary buttons → orange
* Main icons → orange
* Active state → orange
* No random colors

---

### 🔘 Button Rules

#### Primary Button

```tsx
<Button className="bg-brand-500 rounded-full" />
```

#### Secondary Button

```tsx
<Button className="bg-[#FFEEDD] text-brand-500" />
```

---

### 🧱 Input Rules

* Always use `Input` from `ui/`
* Do NOT use raw `TextInput`

---

### 📦 Card / List Item

* Border radius: `rounded-2xl`
* Light shadow
* Padding: `p-4`

---

## 🧠 State Management

### Rules:

* Avoid excessive `useState`
* Prefer:

  * `react-hook-form` for forms
  * `useState` for small UI states

---

## 📝 Form Rules (React Hook Form)

### Required:

* Use `Controller`
* Do NOT use `useState` for inputs

```tsx
<Controller
  control={control}
  name="courseName"
  render={({ field: { onChange, value } }) => (
    <Input value={value} onChangeText={onChange} />
  )}
/>
```

---

## 🔥 Firebase Rules

### 1. Service Layer

* Do NOT call Firebase directly inside components

```ts
services/courses.ts
```

### 2. Data Shape

```ts
{
  id: string
  createdAt: Timestamp
  updatedAt: Timestamp
  isActive: boolean
  deletedAt: Date | null
}
```

### 3. Soft Delete

```ts
deletedAt != null → deleted
```

---

## 🔁 Data Fetching

### Rules:

* Use `useFocusEffect`
* Do NOT fetch inside render

```ts
useFocusEffect(
  useCallback(() => {
    fetchData();
  }, [])
);
```

---

## 🧼 Code Quality Rules

* Avoid duplicated code
* Use `.map()` for rendering lists
* Split components if >100 lines
* Use clear, meaningful names

---

## 🚫 Anti-patterns (AVOID)

❌ Multiple `useState` for modals

❌ Calling Firebase inside components

❌ Using raw `TextInput`

❌ Hardcoding colors

❌ Repeated logic

---

## ✅ Best Practices

✔ One screen = one responsibility

✔ Domain-based structure

✔ Reusable UI components

✔ Clean, short, readable code

---

## 🚀 Future Improvements

* React Query (caching)
* Zustand (global state)
* Skeleton loading
* Pagination

---

## 📌 Summary

* UI: orange system
* Form: react-hook-form
* Data: service layer (Firebase)
* Code: clean + reusable

👉 Goal: **clean – scalable – maintainable code**
