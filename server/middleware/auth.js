import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const auth = (req, res, next) => {
    try {
        // Check if authorization header exists
        if (!req.headers.authorization) {
            return res.status(401).json({ 
                success: false, 
                message: "Authorization header is missing" 
            });
        }

        // Check if the token is in the correct format
        const authHeader = req.headers.authorization;
        if (!authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ 
                success: false, 
                message: "Invalid token format. Use 'Bearer [token]" 
            });
        }

        const token = authHeader.split(' ')[1];
        if (!token) {
            return res.status(401).json({ 
                success: false, 
                message: "No authentication token provided" 
            });
        }
        
        // Verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // Attach user info to the request
        next();
    } catch (error) {
        console.error('Authentication error:', error.message);
        return res.status(401).json({ 
            success: false, 
            message: error.name === 'JsonWebTokenError' ? 'Invalid token' : 'Authentication failed',
            error: error.message 
        });
    }
}

export default auth;


