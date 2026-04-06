# Express.js Accessories Website

This is an Express.js application with EJS templating for Honey, I'm home Accessories.

## Setup Instructions

1. **Run the setup batch file** to create folders and copy files:
   ```
   setup.bat
   ```

2. **Install dependencies** (if not already installed):
   ```
   npm install express ejs
   ```

3. **Start the server**:
   ```
   node app.js
   ```

4. **Open your browser** and go to:
   ```
   http://localhost:3000
   ```

## Folder Structure

```
Lab Task-2/
├── app.js                  (Express server)
├── package.json
├── views/
│   ├── index.ejs          (Main page template)
│   ├── header.ejs         (Header partial)
│   └── footer.ejs         (Footer partial)
└── public/
    ├── css/
    │   └── styles.css
    ├── js/
    │   └── script.js
    └── images/
        └── *.webp (all product images)
```

## Features

- ✅ Express.js server
- ✅ EJS templating with partials
- ✅ Static file serving
- ✅ Responsive design
- ✅ Mobile menu toggle
- ✅ Product showcase
- ✅ Newsletter subscription form
