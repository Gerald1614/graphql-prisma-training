import getUserId from "../utils/getUserId.mjs";

export const User = {
  email: {
    fragment: 'fragment userId on User { id }',
    resolve(parent, args, {req}, info) {
      const userId = getUserId(req, false)
      if (userId && userId === parent.id) {
        return parent.email
      } else {
        return null
      }
    }
  },
  posts: {
    fragment: 'fragment userId on User { id }',
    resolve(parent, args, {prisma, req}, info) {
      return prisma.posts({
        where: {
          published: true,
          author: {
            id: parent.id
          }
        }
      })
      
    }
  }
}