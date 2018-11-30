import bcrypt from 'bcryptjs'
import getUserId from '../utils/getUserId.mjs'
import { token } from '../utils/authentication.mjs'
import { hashPassword} from '../utils/hashPassword.mjs'

export const Mutation = { 
  async createUser(parent, args, { prisma }, info) {

    const password = await hashPassword(args.data.password)
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
        token: token(user.id)
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
        token: token(user.id)
      }
    },
    async deleteUser(parent, args, { prisma, req }, info) {
      const userId = getUserId(req)
      return prisma.deleteUser({id: userId }, info)
    },
    async updateUser(parent, args, { prisma, req }, info) {
      const userId = getUserId(req)
      if(typeof args.data.password === 'string') {
        args. data.password = await hashPassword(args.data.password)
      }

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
      const isPublished = await prisma.$exists.post({ id: args.id, published: true})

      if (!postExists) {
        throw new Error('Unable to delete post')
      }
      if (isPublished && args.data.published === false) {
        await prisma.deleteManyComments({ post: { id: args.id } })
      }
      return prisma.updatePost({
        where: { id: args.id },
        data: args.data
      }, info)
    },

    async createComment(parent, args, { prisma, req }, info) {
      const userId = getUserId(req)
      const postIsPublished = await prisma.$exists.post({
        id: args.data.post,
        published: true
      })

      if (!postIsPublished) {
        throw new Error('Unable to comment unpublished post')
      }
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
        throw new Error('Unable to update comment')
      }
      return prisma.updateComment({
        where: { id: args.id },
        data: args.data
      }, info)
    }
}