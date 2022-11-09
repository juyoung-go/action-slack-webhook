const {IncomingWebhook} = require('@slack/webhook')
const SlackApi = require('./api')

const section = (text)=>{
  return {
    type: "section",
    text: {
      type: "mrkdwn",
      text: text
    }
  }
}
const divider = ()=>{
  return {
    type: "divider"
  }
}

const message = async ({markdownMessage, mention, extraMessage})=>{

  const slack = new IncomingWebhook(process.env.SLACK_WEBHOOK_URL)

  const blocks = []

  //mention
  if(mention){
    const mentionList = mention.split(',')
    if(mentionList.length > 0){
      const usergroups = await SlackApi.getUserGroup(mentionList)
      if(usergroups && usergroups.length > 0){

        let mentionString = ''
        for(let group of usergroups){
          mentionString += `<!subteam^${group.id}> `
        }

        blocks.push(section(mentionString))

      }
    }
  }

  //extraMessage
  if(extraMessage){
    blocks.push(section(extraMessage))
    blocks.push(divider())
  }

  //main message
  blocks.push(section(markdownMessage))
  
  //send
  await slack.send({
    blocks
  })

}

module.exports = message