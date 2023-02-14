const JWT_SECRET = 'eddkljikrjiireoi';   // CREATING A JWT SECRET STRING
const jwt = require('jsonwebtoken');

const fetchUser = async (req, res, next) => {
    //GET USER FROM JwT TOKEN AND ADD ID TO REQUEST OBJECT
    const token = req.header('auth-token');
    if (!token) {
        res.status(401).send({ error: "Please authentiate using valid token" })
    }

    try {
        const data = await jwt.verify(token, JWT_SECRET);
        const objId = data.id
        req.id =objId
        next();
    } catch (error) {
        res.status(401).send({ error: "Invalid token" })
    }
 
}



module.exports = fetchUser;