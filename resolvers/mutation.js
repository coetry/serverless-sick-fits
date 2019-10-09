const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { randomBytes } = require("crypto");
const { promisify } = require("util");

const Mutation = {
  async createItem(parent, args, ctx, info) {
    // TODO: Check if they are logged in
    const item = await ctx.db.mutation.createItem(
      {
        data: {
          ...args
        }
      },
      info
    );
    return item;
  },
  updateItem(parent, args, ctx, info) {
    // first take a copy of the updates
    const updates = { ...args };
    // remove the ID from the updates
    delete updates.id;
    // run the update method
    return ctx.db.mutation.updateItem(
      {
        data: updates,
        where: {
          id: args.id
        }
      },
      info
    );
  },
  async deleteItem(parent, args, ctx, info) {
    const where = { id: args.id };
    const item = await ctx.db.query.item({ where }, `{id, title}`);
    return ctx.db.mutation.deleteItem({ where }, info);
  },
  async signup(parent, args, ctx, info) {
    args.email = args.email.toLowerCase();
    // hash the password
    const password = await bcrypt.hash(args.password, 10);
    // create the user in the database
    const user = await ctx.db.mutation.createUser(
      {
        data: {
          ...args,
          password,
          permissions: { set: ["USER"] }
        }
      },
      info
    );
    // create JWT for them
    const token = jwt.sign({ userId: user.id }, process.env.PRISMA_SECRET);
    // We set the jwt as a cookie on the response
    ctx.response.setHeader(
      "Set-Cookie",
      `token=${token}; HttpOnly; Max-Age=${1000 * 60 * 60 * 24 * 365}`
    );

    return user;
  },
  async signin(parent, { email, password }, ctx, info) {
    // 1. check if there is a user with that email
    const user = await ctx.db.query.user({ where: { email } });
    if (!user) {
      throw new Error("No such user found for email " + email);
    }
    // 2. check if password is correct
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      throw new Error("Invalid Password");
    }
    // 3. generate jwt
    const token = jwt.sign({ userId: user.id }, process.env.PRISMA_SECRET);
    // We set the jwt as a cookie on the response
    ctx.response.setHeader(
      "Set-Cookie",
      `token=${token}; HttpOnly; Max-Age=${1000 * 60 * 60 * 24 * 365}`
    );

    return user;
  },
  signout(parent, args, ctx, info) {
    ctx.response.setHeader(
      "Set-Cookie",
      `token=; Expires=${new Date(1).toUTCString()} HttpOnly;`
    );
    return { message: "Goodbye!" };
  }
};

module.exports = Mutation;
