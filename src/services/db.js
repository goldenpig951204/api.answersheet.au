const mongoose = require('mongoose');

const dbConnect = (dbUrl) => {
    mongoose.connect(dbUrl, {
        logger: process.env.NODE_ENV === "development",
        serverSelectionTimeoutMS: 5000,
        dbName: "strapi_cms"
    });
    mongoose.connection.on("connected", () => {
        console.log(`Database was connected successfully! ===>: ${dbUrl}`);
    });
}

module.exports = {
    dbConnect
}