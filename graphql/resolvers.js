const User = require("../models/user");
const bcrypt = require("bcryptjs");
const { UserInputError } = require("apollo-server-lambda");

module.exports = {
  Query: {
    getUsers: async () => {
      try {
        const users = await User.find({});
        return users;
      } catch (error) {
        console.error(error);
        throw error;
      }
    },
  },
  Mutation: {
    register: async (root, args) => {
      let { username, email, password, confirmPassword } = args;
      try {
        let errors = {};

        if (username.trim() === "")
          errors.username = "username must not be empty";
        if (email.trim() === "") errors.email = "email must not be empty";
        if (password.trim() === "")
          errors.password = "password must not be empty";
        if (confirmPassword.trim() === "")
          errors.confirmPassword = "confirmPassword must not be empty";

        if (password !== confirmPassword)
          errors.confirmPassword = "passwords must match";

        const userExists = await User.findOne({ username });
        if (userExists)
          errors.username = "user already exists with that username";

        const emailExists = await User.findOne({ email });
        if (emailExists) errors.email = "user already exists with that email";

        if (Object.keys(errors).length > 0) {
          throw errors;
        }

        password = await bcrypt.hash(password, 6);

        const user = await User.create({
          username,
          email,
          password,
        });
        return user;
      } catch (error) {
        console.error(error);
        throw new UserInputError("Bad Input", { errors: error });
      }
    },
  },
};
