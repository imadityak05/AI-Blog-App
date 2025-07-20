# AI Blog Application

A full-stack blog application with AI-powered content generation, built with MERN stack (MongoDB, Express.js, React.js, Node.js) and integrated with Google's Gemini AI.

## Features

- User authentication (login/logout)
- Create, read, update, and delete blog posts
- AI-powered blog post generation using Gemini AI
- Comment system with admin moderation
- Responsive design for all devices
- Admin dashboard for content management
- Image upload and management

## Tech Stack

- **Frontend**: React.js, Tailwind CSS, React Router, React Hot Toast
- **Backend**: Node.js, Express.js
- **Database**: MongoDB with Mongoose
- **AI Integration**: Google's Gemini AI
- **Image Storage**: ImageKit
- **Authentication**: JWT (JSON Web Tokens)

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- MongoDB Atlas account or local MongoDB installation
- Google Gemini API key
- ImageKit account (for image storage)

## Getting Started

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/ai-blog-app.git
   cd ai-blog-app
   ```

2. **Set up the backend**
   ```bash
   cd server
   npm install
   ```
   Create a `.env` file in the server directory with the following variables:
   ```
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   IMAGEKIT_URL_ENDPOINT=your_imagekit_url_endpoint
   IMAGEKIT_PRIVATE_KEY=your_imagekit_private_key
   IMAGEKIT_PUBLIC_KEY=your_imagekit_public_key
   GEMINI_API_KEY=your_gemini_api_key
   ```

3. **Set up the frontend**
   ```bash
   cd ../client
   npm install
   ```

4. **Start the development servers**
   - In the server directory: `npm run dev`
   - In the client directory: `npm run dev`

5. Open [http://localhost:5173](http://localhost:5173) to view the application in your browser.

## Project Structure

```
ai-blog-app/
├── client/                 # Frontend React application
│   ├── public/            # Static files
│   └── src/               # React source code
├── server/                # Backend Node.js/Express application
│   ├── configs/           # Configuration files
│   ├── controllers/       # Route controllers
│   ├── middleware/        # Custom middleware
│   ├── models/            # MongoDB models
│   ├── routes/            # API routes
│   └── server.js          # Entry point for the backend
└── README.md              # This file
```

## Deployment

### Backend Deployment
1. Deploy the backend to a service like Render, Railway, or Heroku
2. Set up environment variables in your hosting provider
3. Update the API base URL in the frontend configuration

### Frontend Deployment
1. Build the frontend: `cd client && npm run build`
2. Deploy the `build` folder to a static hosting service like Vercel, Netlify, or GitHub Pages

## Environment Variables

### Server (.env)
- `MONGODB_URI`: MongoDB connection string
- `JWT_SECRET`: Secret key for JWT authentication
- `PORT`: Port for the server (default: 5000)
- `IMAGEKIT_URL_ENDPOINT`: ImageKit URL endpoint
- `IMAGEKIT_PRIVATE_KEY`: ImageKit private API key
- `IMAGEKIT_PUBLIC_KEY`: ImageKit public API key
- `GEMINI_API_KEY`: Google Gemini API key

## Contributing

1. Fork the repository
2. Create a new branch: `git checkout -b feature/your-feature-name`
3. Make your changes and commit them: `git commit -m 'Add some feature'`
4. Push to the branch: `git push origin feature/your-feature-name`
5. Open a pull request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [React](https://reactjs.org/)
- [Node.js](https://nodejs.org/)
- [MongoDB](https://www.mongodb.com/)
- [Google Gemini AI](https://ai.google/)
- [ImageKit](https://imagekit.io/)

---

Happy coding! 🚀
