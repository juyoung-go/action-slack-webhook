const core = require('@actions/core')
const slackMessage = require('./slack/message')

const MESSAGE_TYPES = ['pr'];

(async ()=>{

  try{

    //inputs
    const messageType = core.getInput('messageType')
    const extraMessage = core.getInput('extraMessage')
    const mention = core.getInput('mention')
    
    //check inputs
    if(!MESSAGE_TYPES.includes(messageType)){
      core.setFailed(`Invaild messageType ${messageType} ( Valid Only ${MESSAGE_TYPES.join(', ')} )`)
      return
    }
    
    if(!process.env.SLACK_WEBHOOK_URL){
      core.setFailed(`SLACK_WEBHOOK_URL is empty`)
    }
    if(!process.env.SLACK_TOKEN){
      core.setFailed(`SLACK_TOKEN is empty`)
    }
    
    //create message
    const message = extraMessage || ''
    
    //send message
    await slackMessage(message, mention)
  
    //set result
    core.setOutput('sendResult', 'OK')

  }catch(error){
    core.setFailed(error.message)
  }

})()
