import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import getUserId from '../utils/getUserId.mjs'

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
    async deleteUser(parent, args, { prisma, req }, info) {
      const userId = getUserId(req)
      return prisma.deleteUser({id: userId }, info)
    },
    async updateUser(parent, args, { prisma, req }, info) {
      const userId = getUserId(req)
      return prisma.updateUser({
          where: { id: userId },
          data: args.data
        }, info)
    },
    async createPost(parent, args, { prisma, req }, info) {
      const userId = getUserId(req)

      return prisma.createPost(
        {
          title: args.data.title,
          body: args.data.body,
          published: args.data.published,
          author: {
            connect: {
              id: userId
            }
        }
      }, info)
    },
    async deletePost(parent, args, { prisma, req }, info) {
      const userId = getUserId(req)
      const postExists = await prisma.$exists.post({
        id: args.id,
        author: {
          id: userId
        }
      })

      if (!postExists) {
        throw new Error('Unable to delete post')
      }
      return prisma.deletePost({id: args.id }, info)
    },
    async updatePost(parent, args, { prisma, req }, info) {
      const userId = getUserId(req)

      const postExists = await prisma.$exists.post({
        id: args.id,
        author: {
          id: userId
        }
      })

      if (!postExists) {
        throw new Error('Unable to delete post')
      }
      return prisma.updatePost({
        where: { id: args.id },
        data: args.data
      }, info)
    },

    createComment(parent, args, { prisma, req }, info) {
      const userId = getUserId(req)

      return prisma.createComment(
        {
          text: args.data.text,
          author: {
            connect: {
              id: userId
            }
          },
          post: {
            connect: {
              id: args.data.post
            }
          }
      }, info)
    },
    async deleteComment(parent, args, { prisma, req }, info) {
      const userId = getUserId(req)
      const commentExists = await prisma.$exists.comment({
        id: args.id,
        author: {
          id: userId
        }
      })

      if (!commentExists) {
        throw new Error('Unable to delete comment')
      }
      return prisma.deleteComment({id: args.id }, info)
    },
    async updateComment(parent, args, { prisma, req }, info) {
      const userId = getUserId(req)
      const commentExists = await prisma.$exists.comment({
        id: args.id,
        author: {
          id: userId
        }
      })

      if (!commentExists) {
        throw new Error('Unable to delete comment')
      }
      return prisma.updateComment({
        where: { id: args.id },
        data: args.data
      }, info)
    }
}