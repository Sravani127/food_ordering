const dotenv = require('dotenv');

dotenv.config({
    path:'./.env'
})
const app = require('./index');

const mongoose = require('mongoose');

try {
    mongoose.connect(process.env.CONNECTION_URL, {
        dbName:'pvn-support',
        useNewUrlParser: true,
    }).then(connect => {
        console.log('connected Success!!!');
    }).catch((err)=>{
        console.log('err', err)
    })
} catch (error) {
    console.log(error)
}

app.listen(process.env.PORT || 3000, ()=>{
    console.log(`listening at port ${process.env.PORT || 3000}`)
})








