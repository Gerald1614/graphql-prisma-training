import getUserId from "../utils/getUserId.mjs";

export const Query = {
  
  users(parents, args, { prisma }, info) {
    const opArgs = {
      first: args.first,
      skip: args.skip,
      after: args.after
    }
    if(args.query) {
      opArgs.where = {
        OR: [{
          name_contains: args.query
        }]
      }
    }
    return prisma.users(opArgs, info)
  },
  posts(parents, args, { prisma }, info) {
    const opArgs = {
      first: args.first,
      skip: args.skip,
      after: args.after,
      where: {
        published: true
      }
    }
    if(args.query) {
      opArgs.where.OR = [{
          title_contains: args.query
        }, {
          body_contains: args.query
        }]
    }
    const fragment = `fragment UsertoPost on Post { id title body published author { id name email } comments {id text} }`
    return prisma.posts(opArgs, info).$fragment(fragment)
  },
  myPosts(parents, args, { prisma, req }, info) {
    const userId = getUserId(req)
    const opArgs = {
      first: args.first,
      skip: args.skip,
      after: args.after,
      where: {
        author: {
          id: userId
        }
      }
    }
    if(args.query) {
      opArgs.where.OR = [{
          title_contains: args.query
        }, {
          body_contains: args.query
        }]
    }
    const fragment = `fragment UsertoPost on Post { id title body published author { id name email } comments {id text} }`
    return prisma.posts(opArgs, info).$fragment(fragment)
  },
  comments(parents, args, { prisma }, info) {
    const opArgs = {
      first: args.first,
      skip: args.skip,
      after: args.after
    }

    const fragment = `fragment CommentToPost on Comment { id text post {id title body published} author { id name email } }`
    return prisma.comments(opArgs, info).$fragment(fragment)
  },
   me(parent, args, { prisma, req }, info) {
    const userId = getUserId(req)
    return prisma.user({
        id: userId
    })
  },
  async post(parent, args,{ prisma, req }, info) {
    const userId = getUserId(req, false)
    const fragment = `fragment UsertoPost on Post { id title body published author { id name email } comments {id text} }`
    const posts = await prisma.posts({
      where: {
        id: args.id,
        OR: [{
          published: true
        }, {
          author: {
            id: userId
          }
        }]
      }
    }, info).$fragment(fragment)
    if(posts.length === 0) {
      throw new Error('Post not found')
    }
    return posts[0]
  }
}