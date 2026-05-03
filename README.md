# Inventory App

A full-stack web application for managing a gaming inventory with user authentication, skin management, and case opening features. Built with Node.js, Express, and PostgreSQL.

Live-Demo https://inventory-app-tzx4.onrender.com

## Features

- **User Authentication**: Secure registration and login with password hashing (bcrypt)
- **Inventory Management**: Browse and manage your collection of gaming skins
- **Case Opening**: Interactive case opening animation with sound effects
- **Skin Browsing**: Browse all available skins with filtering and pagination
- **Responsive Design**: Optimized for different screen sizes
- **Session Management**: Secure session handling with Express sessions

## Tech Stack

- **Backend**: Node.js with Express.js
- **Frontend**: EJS templating engine with HTML/CSS
- **Database**: PostgreSQL
- **Authentication**: bcrypt for password hashing, Express Session for session management
- **Environment Management**: dotenv
- **Development**: nodemon for auto-restart on file changes

## Prerequisites

Before running this project, ensure you have:

- Node.js (v14 or higher)
- PostgreSQL (database running and accessible)
- npm (comes with Node.js)

## Installation

1. **Clone or download the project**
   ```bash
   cd Inventory-App
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env` file in the root directory with the following variables:
   ```
   SESSION_SECRET=your_session_secret_key
   DB_USER=your_database_user
   DB_PASSWORD=your_database_password
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=your_database_name
   ```

4. **Set up the database**
   - Create a PostgreSQL database with the name specified in your `.env` file
   - Run the database setup script:
   ```bash
   node db/populate-db.js
   ```

## Running the Application

### Development Mode
```bash
npm run dev
```
This will start the server with nodemon, which automatically restarts when files change.

### Production Mode
```bash
node app.js
```

The application will be available at `http://localhost:3001`

## Project Structure

```
├── app.js                          # Main Express application
├── package.json                    # Project dependencies and scripts
├── .env                           # Environment variables (create this)
│
├── controllers/                   # Request handlers
│   ├── allSkinsController.js     # All skins view logic
│   ├── authController.js          # Authentication logic
│   ├── caseController.js          # Case opening logic
│   ├── giftSkinController.js      # Gift skin logic
│   └── inventoryController.js     # Inventory management logic
│
├── routes/                        # API routes
│   ├── allSkinsRouter.js          # Routes for viewing all skins
│   ├── authRoutes.js              # Authentication routes
│   ├── caseRoutes.js              # Case opening routes
│   └── inventoryRoutes.js         # Inventory management routes
│
├── middleware/                    # Express middleware
│   └── requireAuth.js             # Authentication middleware
│
├── db/                            # Database related files
│   ├── pool.js                    # PostgreSQL connection pool
│   ├── queries.js                 # Database queries
│   ├── authQueries.js             # Authentication-related queries
│   ├── filter.js                  # Filtering logic
│   └── populate-db.js             # Database population script
│
├── views/                         # EJS templates
│   ├── case.ejs                   # Case opening page
│   ├── inventory.ejs              # Inventory page
│   ├── skins.ejs                  # Skins browsing page
│   ├── auth/                      # Authentication pages
│   │   ├── login.ejs              # Login page
│   │   └── register.ejs           # Registration page
│   └── partials/                  # Reusable template components
│       ├── header.ejs             # Header navigation
│       ├── filter.ejs             # Filtering component
│       └── pagination.ejs         # Pagination component
│
└── public/                        # Static assets
    ├── css/
    │   └── main.css               # Main stylesheet
    └── sounds/                    # Sound effects
```

## Routes

### Authentication Routes (`/auth`)
- `GET /auth/register` - Display registration page
- `POST /auth/register` - Handle user registration
- `GET /auth/login` - Display login page
- `POST /auth/login` - Handle user login
- `GET /auth/logout` - Handle user logout

### Skins Routes (`/`)
- `GET /` - Browse all available skins with filtering and pagination

### Inventory Routes (`/inventory`) - *Requires Authentication*
- View and manage your personal inventory

### Case Routes (`/case`) - *Requires Authentication*
- Open cases and receive random skins

## Features in Detail

### User Authentication
- Secure password hashing with bcrypt
- Session-based authentication
- Protected routes that require authentication
- User information stored in session

### Inventory System
- Browse personal inventory of skins
- Filter skins by various criteria
- Pagination for easy browsing

### Case Opening
- Interactive case opening animation
- Sound effects during case opening
- Random skin distribution system

### Responsive Design
- Fully responsive layout
- Optimized for desktop, tablet, and mobile devices
- Unified color scheme and styling

## Development Workflow

The project uses nodemon for development, allowing automatic server restarts on file changes.

```bash
npm run dev
```

## Security Features

- Password hashing with bcrypt
- Session-based authentication
- Environment variable protection (sensitive data in `.env`)
- Protected routes with authentication middleware

## Future Enhancements

- Deploy to production server
- Add more filtering options
- Implement trading system
- Add user profiles
- Create admin panel

## License

ISC

## Author

Created by Lukas

---

For questions or issues, please refer to the project documentation or contact the author.
