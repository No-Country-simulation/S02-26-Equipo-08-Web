const jwt = require('jsonwebtoken');

const verificarToken = (req, res, next) => {
    // Obtenemos el token del header 'Authorization'
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Separamos 'Bearer' del token

    if (!token) {
        return res.status(401).json({ error: 'Acceso denegado. Token no proporcionado.' });
    }

    try {
        // Verificamos el token usando la misma clave secreta del login
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Inyectamos los datos del usuario en la petición para que el controlador los use
        req.user = {
            id: decoded.id,
            role: decoded.id_rol // Nota: Usamos 'role' porque así lo espera tu controlador del dashboard
        };
        
        next(); // Continuamos al controlador
    } catch (error) {
        res.status(403).json({ error: 'Token inválido o expirado' });
    }
};

module.exports = { verificarToken };