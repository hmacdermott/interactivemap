# Interactive China Map

A full-stack web application that allows users to create, view, edit, and delete location pins on an interactive map of China. Each pin includes an image, title, and description.

![Interactive China Map](https://img.shields.io/badge/Google%20Maps-API-4285F4?logo=googlemaps)
![Node.js](https://img.shields.io/badge/Node.js-18+-339933?logo=node.js)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?logo=mongodb)

## Features

- **User Authentication**: Secure registration and login with JWT tokens
- **Interactive Map**: Google Maps integration centered on China
- **Pin Management**: Create, view, edit, and delete location pins
- **Image Upload**: Attach images to pins with preview
- **User Permissions**: Users can only edit/delete their own pins
- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Real-time Updates**: Markers update immediately after CRUD operations

## Tech Stack

### Frontend
- HTML5, CSS3, JavaScript (Vanilla)
- Google Maps JavaScript API
- Responsive design with CSS Grid and Flexbox

### Backend
- Node.js + Express.js
- MongoDB Atlas (Cloud Database)
- JWT Authentication
- Multer (Image Upload)
- bcrypt (Password Hashing)

## Prerequisites

Before running this application, make sure you have:

- [Node.js](https://nodejs.org/) (v14 or higher)
- MongoDB Atlas account (free tier available)
- Google Maps API key

## Installation

### 1. Clone the repository

```bash
git clone https://github.com/hmacdermott/interactivemap.git
cd interactivemap
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

Create a `.env` file in the root directory (copy from `.env.example`):

```bash
cp .env.example .env
```

Then edit `.env` and add your actual credentials:

```env
PORT=5000
MONGODB_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_strong_random_secret_key
GOOGLE_MAPS_API_KEY=your_google_maps_api_key
```

**Important**:
- Never commit the `.env` file to Git (already in `.gitignore`)
- Use a strong random string for `JWT_SECRET` (at least 32 characters)
- See [Configuration Guide](#configuration) below for how to obtain each credential

### 4. Start the server

```bash
npm start
```

Or for development:

```bash
npm run dev
```

The application will be available at `http://localhost:5000`

## Usage

### Register/Login

1. Open `http://localhost:5000` in your browser
2. Register a new account or login with existing credentials
3. Your authentication token will be stored in localStorage

### Create a Pin

1. Click anywhere on the map
2. A modal will appear with a form
3. Fill in:
   - **Title**: Name of the location (max 100 characters)
   - **Description**: Details about the location (max 500 characters)
   - **Image**: Upload an image (max 5MB, formats: jpeg, jpg, png, gif, webp)
4. Click "Create Pin"
5. The pin will appear on the map with a blue marker

### View Pin Details

1. Click on any marker on the map
2. A modal will show the pin's image, title, description, creator, and date
3. If you created the pin, you'll see Edit and Delete buttons

### Edit a Pin

1. Click on your pin marker
2. Click the "Edit" button
3. Update the title, description, or image
4. Click "Update Pin"

### Delete a Pin

1. Click on your pin marker
2. Click the "Delete" button
3. Confirm the deletion
4. The pin and its image will be removed

### Logout

Click the "Logout" button in the navigation bar

## Project Structure

```
/map
├── server/
│   ├── server.js              # Express app entry point
│   ├── config/
│   │   └── db.js             # MongoDB connection
│   ├── models/
│   │   ├── User.js           # User schema
│   │   └── Pin.js            # Pin schema
│   ├── routes/
│   │   ├── auth.js           # Authentication endpoints
│   │   └── pins.js           # Pin CRUD endpoints
│   ├── middleware/
│   │   └── auth.js           # JWT verification
│   └── uploads/              # Uploaded images
├── public/
│   ├── index.html            # Main HTML file
│   ├── styles.css            # Stylesheet
│   ├── auth.js               # Authentication logic
│   ├── map.js                # Google Maps integration
│   └── app.js                # Main app logic
├── .env                       # Environment variables
├── .env.example              # Environment template
├── .gitignore                # Git ignore rules
├── package.json              # Dependencies
└── README.md                 # This file
```

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register new user
  ```json
  {
    "email": "user@example.com",
    "password": "password123"
  }
  ```

- `POST /api/auth/login` - Login user
  ```json
  {
    "email": "user@example.com",
    "password": "password123"
  }
  ```

- `GET /api/auth/me` - Get current user (protected)

### Pins

- `GET /api/pins` - Get all pins (public)
- `POST /api/pins` - Create new pin (protected)
  ```json
  {
    "title": "Great Wall of China",
    "description": "Historic landmark",
    "latitude": 40.4319,
    "longitude": 116.5704,
    "imageUrl": "/uploads/pin-123456789.jpg"
  }
  ```
- `PUT /api/pins/:id` - Update pin (protected, owner only)
- `DELETE /api/pins/:id` - Delete pin (protected, owner only)

### File Upload

- `POST /api/pins/upload` - Upload image (protected)
  - Form data with `image` field
  - Returns `{ imageUrl: "/uploads/filename.jpg" }`

## Security Features

- **Password Hashing**: bcrypt with salt rounds
- **JWT Tokens**: Expire after 24 hours
- **Protected Routes**: Middleware verifies token validity
- **Input Validation**: Server-side validation for all inputs
- **File Upload Restrictions**: Images only, max 5MB
- **Ownership Verification**: Users can only modify their own pins
- **CORS**: Configured for security

## Troubleshooting

### MongoDB Connection Failed

- Verify your MongoDB Atlas connection string is correct
- Check if your IP address is whitelisted in MongoDB Atlas (set to 0.0.0.0/0 for development)
- Ensure your database user has correct permissions

### Google Maps Not Loading

- Verify your Google Maps API key is correct
- Check if the Maps JavaScript API is enabled in Google Cloud Console
- Ensure there are no API restrictions blocking localhost

### Image Upload Fails

- Check file size (max 5MB)
- Verify file format (jpeg, jpg, png, gif, webp)
- Ensure `server/uploads/` directory has write permissions

### Port Already in Use

Change the PORT in `.env` file:
```env
PORT=3000
```

## Development

To modify the application:

1. **Backend changes**: Edit files in `server/`
2. **Frontend changes**: Edit files in `public/`
3. **Database models**: Edit files in `server/models/`
4. **API routes**: Edit files in `server/routes/`

Restart the server after backend changes.

## Deployment

This application is ready to deploy to **Vercel** with zero configuration!

### Quick Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone)

For detailed deployment instructions, see **[DEPLOYMENT.md](./DEPLOYMENT.md)**

### Key Features for Production:
- ✅ Serverless-ready with automatic scaling
- ✅ Cloudinary integration for image uploads
- ✅ MongoDB Atlas cloud database
- ✅ Environment-based configuration (dev vs production)
- ✅ Automatic HTTPS and CDN

### Other Deployment Options

- **Backend**: Heroku, Railway, Render, DigitalOcean
- **Database**: MongoDB Atlas (already cloud-hosted)
- **Storage**: Cloudinary (for Vercel) or local filesystem (for traditional hosting)

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit your changes: `git commit -am 'Add feature'`
4. Push to the branch: `git push origin feature-name`
5. Submit a pull request

## License

MIT License - feel free to use this project for personal or commercial purposes.

## Support

For issues or questions:
- Open an issue on GitHub
- Contact: hmacdermott (GitHub username)

## Acknowledgments

- Google Maps Platform for mapping services
- MongoDB Atlas for database hosting
- Express.js community for excellent documentation

---

**Built with ❤️ using Node.js, Express, MongoDB, and Google Maps API**
