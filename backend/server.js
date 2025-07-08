import { app } from "./src/app.js"
import { connectToDataBase } from "./src/db/databse.js";

const port = process.env.PORT || 5001

connectToDataBase().then(()=>{
    app.listen( port , () => {
        console.log(`Server is running at http:/localhost/${port}`);
    })
}).catch((error) => {
    console.log("Error while Connecting to server in server file" , error);
    
})




