const clienteModel = require('../models/cliente.model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const {serialize} = require("cookie");

const loginAuthCliente = async (req, res) => {
    try{
        const {correo, contrasena} = req.body;
        const cliente = await clienteModel.findOne({correo: correo});

        if (!cliente) {
            return res.status(200).json({
                message: "email o contraseña incorrecta"
            });
        }
        let passwordCorrecta = false;
        if (bcrypt.compareSync(contrasena, cliente.contrasena))
            passwordCorrecta = true;
        if (!passwordCorrecta) {
            return res.status(200).json({
                message: "email o contraseña incorrecta"
            });
        }
        const payload = {
            cliente: {
                _id: cliente._id
            }
        }

        const token = jwt.sign(payload, process.env.SECRET, {expiresIn: '1h'});
        const serialized = serialize('aToken', token, {
            sameSite: 'none',
            maxAge: 60 * 60 * 1000,
            path: '/',
        })
        res.setHeader("Set-Cookie", serialized);
        res.cookie(serialized);
        res.send();
    } catch (error) {
        return res.status(500).json({
            message: "error al intentar loguearse",
            error: error.message
        })
    }
}

module.exports = {
    loginAuthCliente
}