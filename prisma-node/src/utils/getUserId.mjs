import jwt from 'jsonwebtoken'

const getUserId = (req) => {
  const header = req.headers.authorization

  if(!header) {
    throw new Error('Authentication required')
  }
  const token = header.replace('Bearer ', '')
  
  try {
    const decoded = jwt.verify(token, 'thisisasecret')
    return decoded.userId
  } catch(err) {
    throw new Error('invalid token')
  }


}
export default getUserId


