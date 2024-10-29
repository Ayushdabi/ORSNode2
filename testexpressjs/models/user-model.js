const User = require('../bean/user-bean');

const add_user = (userData) => {
    const newUser = new User(userData);
    return newUser.save()
        .then(savedUser => ({ user: savedUser, message: 'Data added successfully' }))
        .catch(error => { throw new Error(error.message); });
};

const update_user = (userId, updateData) => {
    return User.findByIdAndUpdate(userId, updateData)
        .then(updatedUser => {
            if (!updatedUser) throw new Error('User not found');
            return updatedUser;
        })
        .catch(error => { throw new Error(error.message); });
};

const delete_user = (userId) => {
    return User.findByIdAndDelete(userId)
        .then(deletedUser => {
            if (!deletedUser) throw new Error('User not found');
            return { message: 'User deleted successfully' };
        })
        .catch(error => { throw new Error(error.message); });
};

const get_user_by_id = (userId) => {
    return User.findById(userId)
        .then(user => {
            if (!user) throw new Error('User not found');
            return user;
        })
        .catch(error => { throw new Error(error.message); });
};

const search_users = async (query, page, limit) => {
    return await User.find(query)
        .skip((page - 1) * limit)
        .limit(limit);
};

const authenticate_user = (loginId, password) => {
    return User.findOne({ loginId, password })
        .then(user => {
            if (!user) throw new Error('Invalid credentials');
            return user;
        })
        .catch(error => { throw new Error(error.message); });
};

const count_users = async (query) => {
    return await User.countDocuments(query);
};

module.exports = {
    add_user,
    update_user,
    delete_user,
    get_user_by_id,
    search_users,
    count_users,
    authenticate_user
};