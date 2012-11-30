envs =
    production: 
        domain: (String) process.env.PROD_DOMAIN
        port: (Number) process.env.PROD_PORT
        db: (String) process.env.PROD_DB
        user: (String) process.env.PROD_USER
        pass: (String) process.env.PROD_PASS

    local_pak:
        domain: (String) process.env.PAK_PROD_DOMAIN
        port: (Number) process.env.PAK_PROD_PORT
        db: (String) process.env.PAK_PROD_DB
        user: (String) process.env.PAK_PROD_USER
        pass: (String) process.env.PAK_PROD_PASS

# Control creds by env variables
env = (String) process.env.NODE_ENV
if not env? then env = 'local_pak'

module.exports = envs[env]
