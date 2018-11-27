export const Query = {
  
  users(parents, args, { prisma }, info) {
    const opArgs = {}
    if(args.query) {
      opArgs.where = {
        OR: [{
          name_contains: args.query
        }, {
          email_contains: args.query
        }]
      }
    }
    const fragment = `fragment PostToUSer on User { id name email posts { id title body published } comments {id text} }`
    return prisma.users(opArgs, info).$fragment(fragment)
  },
  posts(parents, args, { prisma }, info) {
    const opArgs = {}
    if(args.query) {
      opArgs.where = {
        OR: [{
          title_contains: args.query
        }, {
          body_contains: args.query
        }]
      }
    }
    const fragment = `fragment UsertoPost on Post { id title body published author { id name email } comments {id text} }`
    return prisma.posts(opArgs, info).$fragment(fragment)
  },
  comments(parents, args, { prisma }, info) {
    const fragment = `fragment CommentToPost on Comment { id text post {id title body published} author { id name email } }`
    return prisma.comments(null, info).$fragment(fragment)
  },
  me() {
    return {
      id: '128214214',  
      name: 'Toto',
      email: 'gerald@eef.com'
    } 
  }
}