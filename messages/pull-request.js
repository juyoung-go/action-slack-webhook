const github = require('@actions/github');

const prMessageCreator = ()=>{
  
  //start
  let msg = `[*${github.context.repo}*] *${github.context.actor}* 님에 의해 Pull request 가 Open 되었습니다.`

  //pr link
  msg += `\n> <${github.context.ref}|${github.context.payload.pull_request.body}>`

  //pr comment
  const comment = github.context.payload.comment
  comment && comment.length > 0 && (msg += '```comment```')
  
  return msg

}

module.exports = prMessageCreator