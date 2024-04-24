const mongoose = require("mongoose");

const connectdb = (url) => {
  return mongoose
    .connect(url, {
      // useNewUrlParser: true,
      // useUnifiedTopology: true,
      dbName: "Internship",
    })
    // .then(() => {
    //   console.log("Database Connected");
    // })
    // .catch((e) => {
    //   console.log(e);
    // });
};



module.exports = connectdb;