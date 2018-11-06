const crypto = require('crypto'),
    algorithm = 'aes-256-gcm',
    key = '3zTvzr3p67VC61jmV54rIYu1545x4TlY',
    {Buffer}=require('buffer')

function encrypt(text) {
    var iv = crypto.randomBytes(16);
    var cipher = crypto.createCipheriv(algorithm, key, iv)
    var encrypted = cipher.update(text, 'utf8', 'hex')
    encrypted += cipher.final('hex');
    var tag = cipher.getAuthTag();
    return encrypted + ':' + tag.toString('hex') + ':' + iv.toString('hex');
}

function decrypt(encrypted) {
    var [content, tag, iv] = encrypted.split(':');
    iv = new Buffer(iv, 'hex');
    tag = new Buffer(tag, 'hex');
    var decipher = crypto.createDecipheriv(algorithm, key, iv)
    decipher.setAuthTag(tag);
    var dec = decipher.update(content, 'hex', 'utf8')
    dec += decipher.final('utf8');
    return dec;
}
module.resolve({
    encrypt,
    decrypt
})