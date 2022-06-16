const { profile, user } = require('../../models/profile');

module.exports = async (req, res) => {
    try {
        // Update User
        const updateUser = await user.update({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password
        }, {
            where: {
                id: req.params.id
            }
        });
    } catch (err) {
        console.log(err);
        throw new Error(err);
    }
}