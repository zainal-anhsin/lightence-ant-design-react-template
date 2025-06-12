# 📝 Project Setup & Architecture Notes

## 1. Core Libraries & Versions
- **React:** ^18.2.0
- **React DOM:** ^18.2.0
- **Ant Design:** ^4.22.4
- **Redux Toolkit:** ^1.7.1
- **react-redux:** ^7.2.6
- **react-router-dom:** ^6.0.2
- **styled-components:** ^5.3.0
- **TypeScript:** ^4.1.2

## 2. Project Structure
Organize by feature/component. Example:
```
src/
  components/
    common/
      BaseButton/
        BaseButton.tsx
        BaseButton.styles.ts
      BaseCard/
        BaseCard.tsx
        BaseCard.styles.ts
      ...
    profile/
    ...
  pages/
    SchoolPage.tsx
    ...
  hooks/
  store/
  styles/
  ...
```
- **Keep each component and its styles in the same folder** for easy management.

## 3. Component Pattern
- **Wrap Ant Design components** with your own (e.g., `BaseButton`, `BaseCard`, `BaseInput`) to:
  - Apply consistent custom styles
  - Add project-specific props or logic
  - Make future design changes easier
- **Use styled-components** for all custom styles.

## 4. Routing
- **Use `react-router-dom` v6+** for routing.
- **Centralize routes** in a component like `AppRouter.tsx`.
- **Use nested routes** for layouts (e.g., main layout, auth layout).

## 5. State Management
- **Use Redux Toolkit** for global state (user, theme, etc.).
- **Create hooks** like `useAppSelector` and `useAppDispatch` for typed access to the store.

## 6. Theming & Global Styles
- **Use styled-components ThemeProvider** for theming.
- **Create a `GlobalStyle`** file for base CSS resets and global styles.

## 7. Best Practices
- **Type everything** (TypeScript).
- **Use functional components and hooks** only.
- **Keep logic and UI separate** (use hooks for logic, components for UI).
- **Use Ant Design's grid system** (`Row`, `Col`) for layout, or wrap them as `BaseRow`, `BaseCol`.
- **Document your custom components** for easier onboarding.

## 8. Example: Custom Button
```tsx
// src/components/common/BaseButton/BaseButton.tsx
import { Button as AntButton } from 'antd';
import styled from 'styled-components';

export const BaseButton = styled(AntButton)`
  border-radius: 8px;
  font-weight: 600;
  // ...other custom styles
`;
```

## 9. Example: Page Component
```tsx
// src/pages/SchoolPage.tsx
import React from 'react';
import { BaseButton } from '@app/components/common/BaseButton/BaseButton';

const SchoolPage: React.FC = () => (
  <div>
    <BaseButton type="primary">Join</BaseButton>
  </div>
);

export default SchoolPage;
```

## 10. Other Recommendations
- **Use absolute imports** (e.g., `@app/components/...`) for easier refactoring.
- **Keep all assets (images, icons) in a dedicated `assets/` folder.**
- **Write reusable hooks** for common logic (e.g., user, theme, responsive).
- **Keep translations in a `locales/` folder** if you need i18n.

---

**Copy and paste these notes into your new project's README or as a reference file!** 