const express = require("express")
const mongoose = require("mongoose")
const app = express()


const PORT = process.env.PORT || 5000

const authRoute = require("./routes/auth.route")


app.use(express.json({ extended: true }))

app.use("/api/auth", authRoute)

async function start() {
    try {
        await mongoose.connect("mongodb+srv://Baxrom:WDK5t6NtUNWngzxe@cluster0.bdcts.mongodb.net/todo?retryWrites=true&w=majority")

        app.listen(PORT, () => {
            console.log("Server started on port 5000");
        })


    } catch (error) {
        console.log(error);
    }
}
start()


