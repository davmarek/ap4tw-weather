# 🚀 Running the project 

**Install packages**
```bash
yarn
# or
npm install
```

<br>

**Run the project**
```bash
yarn dev
# or
npm run dev
```
<br>

Website should be running at http://localhost:5173

# 🕸️ Project structure
All source code is located in `src/`:
- the app lifecycle starts in `src/main.tsx`
- whole app _component_ is defined in `src/App.tsx`
- all subcomponents are located in `src/components/`
- helper functions and TypeScript types are in `src/helpers/`

# Other info
Project uses _Vite_ with **_React_**. Entire app is styped with **_TailwindCSS_**. Fetching is done through _Axios_. **_React Query_** is used for easier async state management, caching and debugging.