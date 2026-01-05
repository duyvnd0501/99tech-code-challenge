import { AppDataSource } from "./data-source";
import app from "./app";

AppDataSource.initialize().then(async () => {
    app.listen(3001, () => {
        console.log("Express server has started on port 3001.");
        console.log("API: http://localhost:3001/products");
        console.log("Docs: http://localhost:3001/api-docs");
    });
}).catch(error => console.log(error));
