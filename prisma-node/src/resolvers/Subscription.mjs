
export const Subscription = {
  comment: {
    subscribe(parent, {postId}, { prisma }, info) {
      //issue: returns null (filter is working) from prisma-client-lib that is suppsoed to be fixed soon
      return prisma.$subscribe.comment({
          node: {
            post: {
              id: postId
            }
          }
      }).node()

   }
  },
  post: {
    subscribe(parent, args, { prisma }, info) {
      return prisma.$subscribe.post({
        node: {
            published: true
        }
    }).node()
    }
  }
}