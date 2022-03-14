const blacklist = require('./blacklist')

const { promisify } = require('util')
const existsAsync = promisify(blacklist.exist).bind(blacklist)
const setAsync = promisify(blacklist.set).bind(blacklist)
const { createHash } = require('crypto')

const jwt = require('jsonwebtoken')

function geraTokenHash(token) {
    return createHash('sha256').update(token).digest('hex')
}

module.exports = {
    adiciona: async (token) => {
        const dataExpiracao = jwt.decode(token).exp
        const tokenHash = geraTokenHash(token)
        await setAsync(token, '')
        blacklist.expireat(token, dataExpiracao)
    },
    contemToken: async (token) => {
        geraTokenHash
        const resultado = await blacklist.exist(token)
        return resultado === 1
    },
}
