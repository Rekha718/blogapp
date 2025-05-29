const express = require('express');
const cors = require('cors');
const feedRouter = require('./routes/feed');  

const app = express();
const PORT = 3000;


app.use(cors({
  origin: 'http://localhost:8080', 
  credentials: true,
}));
app.use(express.json()); 


app.use(feedRouter);

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
