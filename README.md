
# Fundamentals Project Template

This is a multi-page frontend project template using HTML, SCSS, and JavaScript.  
The project is configured for quick compilation of styles with Sass and easy setup.

---

## Project Structure

fundamentals-project-temlate/
|_
    src/
    ├─ scss/            # SCSS files
    │   ├─ abstracts/   # Variables and mixins
    │   ├─ base/        # Reset styles, fonts
    │   ├─ components/  # Components (buttons, forms, etc.)
    │   └─ pages/       # Page-specific styles
    ├─ js/              # JavaScript files for pages
    └─ html/            # HTML pages of the project
    dist/
    └─ style.css        # Compiled CSS
 
  ---

## Requirements

Before running the project, make sure you have:

- [Node.js](https://nodejs.org/) (includes npm)
- Any modern browser to view the website

---

## Installation and Running the Project

1. Clone the repository

```bash
git clone <YOUR_REPOSITORY_URL>
cd <PROJECT_FOLDER_NAME>


2. Install dependencies

npm install

3. Compile SCSS and start the project

npm run dev

The npm run dev script automatically compiles all .scss files into dist/style.css and watches for changes.
After this, you can open index.html or any other page of the project in your browser.

