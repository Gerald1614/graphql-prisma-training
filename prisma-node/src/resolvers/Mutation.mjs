import uuidv4 from 'uuid/v4'

export const Mutation = { 
  async createUser(parent, args, { prisma }, info) {
    const emailTaken = await prisma.$exists.user({ email: args.data.email })
      if(emailTaken) {
        throw new Error('Email taken.!')
      }
      return prisma.createUser(args.data , info)
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