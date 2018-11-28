import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

export const Mutation = { 
  async createUser(parent, args, { prisma }, info) {
    if(args.data.password.length < 8) {
      throw new Error('password must be 8 characters or longer')
    }
    const password = await bcrypt.hash(args.data.password, 10)
    const emailTaken = await prisma.$exists.user({ email: args.data.email })
      if(emailTaken) {
        throw new Error('Email taken.!')
      }
      const user = prisma.createUser({
          ...args.data,
          password
      })
      return {
        user,
        token: jwt.sign({userId: user.id}, 'thisisasecret')
      }
    },
    async login(parent, args, { prisma }, info) {
      const user = await prisma.user({ email: args.data.email })
      if (!user) {
        throw new Error('Unable to login')
      }
      const password = args.data.password
      const hashedPassword = user.password
      const isMatch = await bcrypt.compare(password, hashedPassword)
      if (!isMatch) {
        throw new Error('Unable to login')
      }
      return {
        user,
        token: jwt.sign({userId: user.id}, 'thisisasecret')
      }
    },
    async deleteUser(parent, args, { prisma }, info) {
      return prisma.deleteUser({id: args.id }, info)
    },
    async updateUser(parent, args, { prisma }, info) {
      return prisma.updateUser({
          where: { id: args.id },
          data: args.data
        }, info)
    },
    async createPost(parent, args, { prisma }, info) {
      return prisma.createPost(
        {
          title: args.data.title,
          body: args.data.body,
          published: args.data.published,
          author: {
            connect: {
              id: args.data.author
            }
        }
      }, info)
    },
    async deletePost(parent, args, { prisma }, info) {
      return prisma.deletePost({id: args.id }, info)
    },
    updatePost(parent, args, { prisma }, info) {
      return prisma.updatePost({
        where: { id: args.id },
        data: args.data
      }, info)
    },

    createComment(parent, args, { prisma }, info) {
      return prisma.createComment(
        {
          text: args.data.text,
          author: {
            connect: {
              id: args.data.author
            }
          },
          post: {
            connect: {
              id: args.data.post
            }
          }
      }, info)
    },
    deleteComment(parent, args, { prisma }, info) {
      return prisma.deleteComment({id: args.id }, info)
    },
    updateComment(parent, args, { prisma }, info) {
      return prisma.updateComment({
        where: { id: args.id },
        data: args.data
      }, info)
    }
}