const pr = require('./pull-request')
const MESSAGE_TYPES = ['pr'];

const messageCreator = (type)=>{
  if(type === 'pr'){
    return pr()
  }else{
    throw new Error(`Invaild messageType ${type}`)
  }
}

module.exports = {
  messageCreator,
  MESSAGE_TYPES
}