const { profile, user } = require('../../models/profile');

module.exports = async (req, res) => {
    try {
        const profileUser = await profile.findOne({
            where: {
                id: req.params.id
            },
            attributes: ['id', 'photo', 'phone', 'address', 'city'],
            includes: [{
                model: user,
                where: {
                    email: req.body.email,
                    name: req.body.name
                }
            }]
        });
        if (!profileUser) {
            res.status(404).json({
                status: 'fail',
                message: 'Failed to get data'
            })
        } else {
            res.status(200).json({
                data: profileUser
            })
        }
    } catch (err) {
        console.log(err);
        throw new Error(err);
    }
}