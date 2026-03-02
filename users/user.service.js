const bcrypt = require('bcryptjs');
const db = require('_helpers/db');

module.exports = {
    getAll,
    getById,
    create,
    update,
    delete: _delete
};

async function getAll() {
    return await db.User.findAll();
}

async function getById(id) {
    return await getUser(id);
}

async function create(params) {
    
    if (await db.User.findOne({ where: { email: params.email } })) {
        throw 'Email "' + params.email + '" is already registered';
    }
    

    const user = new db.User(params);
    user.passwordHash = await bcrypt.hash(params.password, 10);
    await user.save();
}

async function update(id, params) {
    // Extract password fields from params if they exist
    const { currentPassword, newPassword, confirmPassword, ...updateFields } = params;

    // Fetch the user with password hash
    const user = await db.User.scope('withHash').findByPk(id);

    if (!user) {
        throw 'User not found';
    }

    // Check if username has changed and is available
    const usernameChanged = updateFields.username && user.username !== updateFields.username;
    if (usernameChanged && await db.User.findOne({ where: { username: updateFields.username } })) {
        throw `Username "${updateFields.username}" is already taken`;
    }

    // If a password change is requested, validate current and new passwords
    if (currentPassword && newPassword) {
        const isMatch = await bcrypt.compare(currentPassword, user.passwordHash);
        if (!isMatch) {
            throw 'Current password is incorrect';
        }

        if (await bcrypt.compare(newPassword, user.passwordHash)) {
            throw 'New password cannot be the same as the current password';
        }

        if (newPassword !== confirmPassword) {
            throw 'New password and confirm password do not match';
        }

        // Hash the new password and update the user
        user.passwordHash = await bcrypt.hash(newPassword, 10);
    }

    // Apply other updates from params
    Object.assign(user, updateFields);

    // Save the user
    await user.save();
}


async function _delete(id) {
    const user = await getUser(id);
    await user.destroy();
}

async function getUser(id) {
    const user = await db.User.findByPk(id);
    if (!user) throw 'User not found';
    return user;
}