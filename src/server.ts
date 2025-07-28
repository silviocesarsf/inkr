import app from "./app";
import { errorHandler } from "./middleware/error-handler";
import userRouter from "./routes/auth/user-routes"

app.use(userRouter);
app.use(errorHandler)
app.listen(process.env.PORT, () => {
    console.log("Servidor rodando...");
});