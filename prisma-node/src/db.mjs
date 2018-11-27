const users = [{
  id: '1',  
  name: 'Toto',
  age: 47,
  email: 'gerald@eef.com'
},
{
  id: '2',  
  name: 'sarah',
  age: 23,
  email: 'gdvdfv@eef.com'
},
{
  id: '3',  
  name: 'verwberb',
  age: 445,
  email: 'geraldsvadvsd@eef.com'
}]

const posts = [{
  id: '10',  
  title: 'vivre a montreal',
  body: 'ergwergyveqr regfqervreq',
  published: false,
  author: '1'
},
{
  id: '20',  
  title: 'mourir a montreal',
  body: 'ergwergveqr regfqersdvsadv vreq',
  published: true,
  author: '1'
},
{
  id: '30',  
  title: 'asta la vista',
  body: 'ergwergvfbvwfwevdbvwfe eqr regfqervreq',
  published: false,
  author: '2'
}]

const comments = [{
  id: '42dv114',  
  text: 'jamais le jour',
  author: '1',
  post: '10'
},
{
  id: 'e12214',  
  text: 'le ciel est bleu',
  author: '1',
  post: '30'
},
{
  id: 'ew1211evv4214',  
  text: 'il fait beau a cuba',
  author: '2',
  post: '20'
},
{
  id: 'ew121wefwe1evv4214',  
  text: 'bienvenu',
  author: '3',
  post: '20'
}]
const db = {
  users,
  posts,
  comments
}
export { db as default }