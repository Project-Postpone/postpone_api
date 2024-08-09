//  import
import { User } from "../models/user_model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import {
  createUserValidator,
  loginValidator,
  registerValidator,
  updateUserValidator,
} from "../validators/user.js";

export const register = async (req, res, next) => {
  try {
    const { error, value } = registerValidator.validate(req.body);
    // checking for errors
    if (error) {
      return res.status(400).send(error.details[0].message);
    }
    const { email, password } = value;

    //  check if user exists
    const userExistence = await User.findOne({ email });
    if (userExistence) {
      return res.status(401).send("User already exists!");
    } else {
      //  if user does not exist, create new account with encrypted password
      const hashedPassword = await bcrypt.hash(value.password, 10);
      value.password = hashedPassword;

      // const addUser = await User.create({
      //     ...value,
      //     passowrd: hashedPassword
      // });

      //  create a new session for the user
      const newUser = await User.create(value);
      req.session.user = { id: newUser._id };

      //  return a response for success
      return res.status(201).json({ message: "Registration Successful!" });
    }
  } catch (error) {
    next(error);
    console.log(error);
  }
};

// //  creating a function that allows a user to login
// export const login = async (req, res, next) => {
//   try {
//     const { email, userName, password, error } = loginValidator.validate(
//       req.body
//     );
//     if (!email || !userName || !password) {

//     }
//     //  finding a user using their email or username
//     const user = await User.findOne({
//       $or: [{ email: value.email }, { userName: value.userName }],
//     });

//     // checking whether a user exists or not
//     if (!user) {
//       return res.status(401).json("User not found!");
//     }
//     // verify: compare the password given to ensure it is accurate
//     const correctPass = bcrypt.compare(password, user.password);

//     //  ask user to try again if password is incorrect
//     if (!correctPass) {
//       return res.status(401).json("Invalid login details. Please try again");
//     }

//     //  generate a session for the user
//     req.session.user = { id: user.id };

//     // console.log("user", req.session.user);

//     //  return success message
//     res.status(201).json("Login successful!");

//     // error handling
//   } catch (error) {
//     next(error);
//   }
// };

//  token generation...install jwt token
export const token = async (req, res, next) => {
    try {
      const { userName, email, password } = req.body;
      //  Find a user using their email or username
      const user = await User.findOne({
        $or: [{ email: email }, { userName: userName }],
      });
  
      if (!user) {
        return res.status(401).json("User does not exist");
      } else {
        const correctPass = bcrypt.compare(password, user.password);
        if (!correctPass) {
          return res.status(401).json("Invalid login details");
        }
        // Generate a token for the user
        const token = jwt.sign(
          { id: user.id },
          process.env.JWT_PRIVATE_KEY,
          { expiresIn: "72h" }
        );
  
        //   Return response
        res.status(200).json(
          {
            message: 'User logged in', 
            accessToken: token,
  
            user: {
              firstName: user.firstName,
              lastName: user.lastName,
              userName: user.userName,
              otherNames: user.otherNames,
              email: user.email
            }
          });
  
  
      }
  
    } catch (error) {
      next(error);
    }
  };

//  working on the logout section
export const logout = async (req, res, next) => {
  try {
    //  destroy the session currently available (clear session cookie)
    await req.session.destroy();

    //  return response to user
    res.status(200).json("Logout successful!");
  } catch (error) {
    next(error);
  }
};

// create user
export const createUser = async (req, res, next) => {
  try {
    // Validate request
    const { value, error } = createUserValidator.validate(req.body);
    if (error) {
      return res.status(422).json(error);
    }
    // Encrypt user password
    const hashedPassword = bcrypt.hashSync(value.password, 10);
    // Create user
    await User.create({
      ...value,
      password: hashedPassword,
    });
    // Send email to user
    // await mailTransport.sendMail({
    //     from: "noreply@corextreme.com",
    //     to: value.email,
    //     subject: "User Account Created!",
    //     text: `Dear user,\n\nA user account has been created for you with the following credentials.
    //         \n\nUsername: ${value.username}\nEmail: ${value.email}\nPassword: ${value.password}
    //         \nRole: ${value.role}\n\nThank you!`
    //     ,
    // });
    // Return response
    res.status(201).json("User Created");
  } catch (error) {
    next(error);
  }
};

//  For the user's profile
export const profile = async (req, res, next) => {
  try {
    // Get user id from session or request
    const id = req.session?.user?.id || req?.user?.id;
    // Find user by id
    const user = await User.findById(id).select({ password: false });
    // Return response
    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

/* Creating all routes for the user */

// route to get all users
export const getUsers = async (req, res, next) => {
  try {
    // extract and cinvert email and usernames to lowercases
    const email = req.query.email?.toLowerCase();
    const userName = req.query.userName?.toLowerCase();

    //  add email and username as filters conditionally
    const filter = {};
    if (email) {
      filter.email = email;
    }
    if (userName) {
      filter.userName = userName;
    }

    //  retireve users that match the filter criteria
    const users = await User.find(filter);

    // return response (all the users)
    res.status(200).json({ users });
  } catch (error) {
    next(error);
  }
};

//  getting a particular user
export const getUser = async (req, res, next) => {
  try {
    const userName = req.params.userName.toLowerCase();

    // Get user based on the id
    const userDetails = await User.findOne({ userName })
    .select("-password");

    if (!userDetails) {
      return res.status(404).json(userDetails);
    }

    return res.status(200).json({ userDetails });
  } catch (error) {
    next(error);
  }
};

export const updateUser = async (req, res, next) => {
  try {
    const userId = req.params.id;
    const { error, value } = updateUserValidator.validate(req.body);
    if (error) {
      return res.status(400).json(error.details[0].message);
    }

    if (value.password) {
      value.password = bcrypt.hash(value.password, 10);
    }

    //  assign a variable to find user and update details
    const updatedUser = await User.findByIdAndUpdate(userId, value, {
      new: true,
    });

    if (!updatedUser) {
      return res.status(404).json("User not found");
    }

    return res.status(200).json("User updated successfully");
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (req, res, next) => {
  try {
    const userId = req.params.id;
    const deletedUser = await User.findByIdAndDelete(userId);

    if (!deletedUser) {
      return res.status(404).json("User not found");
    }

    return res.status(200).json("User deleted successfully");
  } catch (error) {
    next(error);
  }
};
