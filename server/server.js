import express from "express";
import cors from 'cors';
import { configDotenv } from "dotenv";
import connectDB from "./configs/db.js";
import adminRouter from "./routes/adminRoutes.js";
import blogRouter from "./routes/blogRoutes.js";
import authRouter from "./routes/authRoutes.js";


configDotenv();

const app = express();

await connectDB();
//Middleware
app.use(cors({ origin: "http://localhost:5173", credentials: true }));

app.use(express.json());

//Routes
app.get('/', (req, res) => {
    res.send('Api is working');
});

app.use('/api/admin', adminRouter);
app.use('/api/blog', blogRouter);
app.use('/api/auth', authRouter);



const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

export default app;