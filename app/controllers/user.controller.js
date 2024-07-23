const db = require('../models');
const User = db.user;
const Role = db.role
var bcrypt = require("bcryptjs");
const { Op } = require('sequelize');


exports.createUser = async (req, res) => {
  try {
    const { username, email, password, roleNames } = req.body;

    if (!username || !email || !password || !roleNames || !Array.isArray(roleNames) || roleNames.length === 0) {
      return res.status(400).json({ message: 'Username, email, password, and at least one role are required' });
    }

    const existingUser = await User.findOne({ where: { [Op.or]: [{ email }, { username }] } });
    if (existingUser) {
      return res.status(400).json({ message: 'Email or username already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      username,
      email,
      password: hashedPassword,
      status: 'Active' 
    });

  
    const roles = await Role.findAll({ where: { name: roleNames } });

    
    await user.addRoles(roles);

    res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      include: Role,
    });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getUserById = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/*exports.updateUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (user) {
      // Hash password if provided in request body
      if (req.body.password) {
        req.body.password = bcrypt.hashSync(req.body.password, 8);
      }

      await user.update(req.body);
      res.json(user);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};*/

exports.updateUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id, {
      include: Role,
    });

    if (user) {
      // Hash password if provided in request body
      if (req.body.password) {
        req.body.password = bcrypt.hashSync(req.body.password, 8);
      }

      // Update user details
      await user.update(req.body);

      // Update roles if provided in request body
      if (req.body.roles) {
        const roles = await Role.findAll({
          where: {
            name: req.body.roles,
          },
        });

        await user.setRoles(roles);
      }

      res.json(user);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (user) {
      await user.destroy();
      res.status(204).end();
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.addUserRole = async (req, res) => {
  try {
    const { userId } = req.params;
    const { roleName } = req.body;

    // Check if roleName is provided
    if (!roleName) {
      return res.status(400).json({ message: 'Role name is required' });
    }

    const user = await User.findByPk(userId, { include: Role });
    if (!user) return res.status(404).json({ message: 'User not found' });
    
    // Check if the role already exists for the user
    const existingRole = user.roles.find(role => role.name === roleName);
    if (existingRole) {
      return res.status(400).json({ message: 'Role already exists for the user' });
    }

    const role = await Role.findOne({ where: { name: roleName } });
    if (!role) return res.status(404).json({ message: 'Role not found' });

    await user.addRole(role);
    res.status(200).json({ message: 'Role added to user successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.blockUser = async (req, res) => {
  const userId = req.params.id;

  try {
    const user = await User.findByPk(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.status = 'Inactive'; // Update user status to Inactive (blocked)
    await user.save();

    res.json({ message: `User ${userId} has been blocked successfully` });
  } catch (error) {
    console.error("Error blocking user:", error);
    res.status(500).json({ message: "Error blocking user" });
  }
};

// Example: Controller method to unblock user (if needed)
exports.unblockUser = async (req, res) => {
  const userId = req.params.id;

  try {
    const user = await User.findByPk(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.status = 'Active'; // Update user status to Active (unblocked)
    await user.save();

    res.json({ message: `User ${userId} has been unblocked successfully` });
  } catch (error) {
    console.error("Error unblocking user:", error);
    res.status(500).json({ message: "Error unblocking user" });
  }
};


// Update user role
/*exports.updateUserRole = async (req, res) => {
  try {
    const { userId, roleId } = req.params;
    const user = await User.findByPk(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });
    
    const role = await Role.findByPk(roleId);
    if (!role) return res.status(404).json({ message: 'Role not found' });

    await user.setRoles([role]);
    res.status(200).json({ message: 'User role updated successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};*/


exports.deleteUserRole = async (req, res) => {
  try {
    const { userId, roleId } = req.params;
    const user = await User.findByPk(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });
    
    const role = await Role.findByPk(roleId);
    if (!role) return res.status(404).json({ message: 'Role not found' });

    await user.removeRole(role);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.toggleUserStatus = async (req, res) => {
  try {
    const userId = req.params.id;

    // Find the user by id
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Toggle the user status
    user.status = user.status === "Active" ? "Inactive" : "Active";
    await user.save();

    res.status(200).json({ message: `User ${user.status === "Active" ? "activated" : "deactivated"} successfully` });
  } catch (error) {
    console.error("Error toggling user status:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};


exports.allAccess = (req, res) => {
    res.status(200).send("Public Content.");
  };
  
  exports.adminBoard = (req, res) => {
  res.status(200).send("Admin Content.");
};

exports.managerBoard = (req, res) => {
  res.status(200).send("Manager Content.");
};

exports.paymasterBoard = (req, res) => {
  res.status(200).send("Paymaster Content.");
};
