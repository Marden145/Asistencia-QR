const prisma = require('../prisma/client');
const userRepository=
{
    findByEmail:(email)=>prisma.user.findUnique({where:{email}})
};
module.exports = userRepository;