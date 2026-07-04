import jwt from 'jsonwebtoken';

function verifyJWT(token) {
    if (!token) return ''; 

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        return decoded.username; 
    } catch (err) {
        console.error("Error al verificar JWT:", err.message);
        return '';
    }
}

export default verifyJWT;