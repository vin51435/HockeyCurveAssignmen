# Task Management Application

A task management application built with React and Vite, designed to help users create, manage, and track their tasks efficiently.

## Setup and Run Instructions

1. **Clone the repository:**

   ```bash
   git clone https://github.com/vin51435/HockeyCurveAssignmen.git

   ```

2. **Navigate to the project directory:**

```bash
cd HOCKEY-CURVE-ASSIGNMENT
```

3. **Install dependencies:**

```bash
npm install
```

4. **Start the development server:**

```bash
npm run dev
```

## Features

### Milestone 1 (Basic)

- **Task List Display**: View tasks with titles and descriptions. Add and delete tasks.
- **Task Form**: Form to add new tasks with validation for title and description.
- **State Management**: Utilizes React's `useState` for managing tasks.
- **Styling**: Basic CSS for a presentable UI.

### Milestone 2 (Intermediate)

- **Enhanced Task Properties**: Includes due dates and priority levels (Low, Medium, High). Edit existing tasks.
- **Advanced Validation**: Ensures unique titles and validates due dates.
- **Task Interactions**: Mark tasks as completed, basic search functionality for filtering tasks.
- **Improved State Management**: Utilizes `useReducer` for better state management.
- **Responsive Design**: Adapted for both desktop and mobile devices.

### Good to Have (Advanced)

- **Performance Optimization**: Virtualization for task lists and optimized re-renders with `React.memo()` and `useCallback()`.
- **Advanced Features**: Snooze feature, priority sort, and accordion UI.
- **UI/UX Enhancements**: Dark mode toggle and drag-and-drop functionality.
- **Data Persistence**: LocalStorage to retain tasks between page reloads.
- **Error Handling**: Error boundaries with user-friendly messages.
- **Analytics**: Simple dashboard showing task completion rates and overdue tasks.

