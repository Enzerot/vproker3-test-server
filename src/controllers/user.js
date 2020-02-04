import jwt from 'jsonwebtoken'
import User from '../database/userSchema'
import { secret } from '../config'
import bcrypt from 'bcrypt'
import validation from '../utils/validation'

const auth = (req, res) => {
    const { login, password, rememberMe } = req.body

    if (
        !validation.validateLogin(req.body.login) &&
        !validation.validatePassword(req.body.password)
    ) {
        User.findOne({ login })
            .then(user => {
                !user && res.status(401).json({ error: 'Incorrect login or password' })

                bcrypt.compare(password, user.password)
                    .then(isSame => {
                        !isSame && res.status(401).json({ error: 'Incorrect login or password' })
                        
                        const token = jwt.sign({ login, role: user.role, password, userID: user._id }, secret, rememberMe ? {} : { expiresIn: '1h' })
                        res.cookie('token', token).sendStatus(200)
                    })
                    .catch(error => console.log(error))
            })
            .catch(error => console.log(error))
    } else {
        res.status(400).json()
    }
}

const requireAuth = (req, res, next) => {
    const { token } = req.cookies
    if (!token) {
        res.status(401).json({ error: 'Unauthorized: No token provided' })
    } else {
        jwt.verify(token, secret, (error, decoded) => {
            error && res.status(401).json(error)

            User.findOne({ login: decoded.login })
                .then(user => {
                    bcrypt.compare(decoded.password, user.password)
                        .then(isSame => {
                            !isSame && res.status(401).json({ error: 'Incorrect login or password' })

                            req.login = decoded.login
                            req.password = decoded.password
                            req.role = decoded.role
                            req.userID = decoded.userID

                            isSame && next()
                        })
                        .catch(error => res.status(500).json(error))
                })
                .catch(error => res.status(500).json(error))
        })
    }
}

const checkToken = (req, res) => res.status(200).json({ login: req.login, role: req.role })

export default {
    auth,
    requireAuth,
    checkToken
}