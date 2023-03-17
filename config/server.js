const mongoose = require('mongoose');


mongoose.set('strictQuery', false);
mongoose.connect('mongodb://127.0.0.1:27017/pet-paradise', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
var db = mongoose.connection
db.on("error", (err) => {
  console.log(err);
})
db.once('open', () => {
  console.log("database connected");
})
