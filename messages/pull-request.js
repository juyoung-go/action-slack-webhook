const github = require('@actions/github');

const prMessageCreator = async ()=>{
  
  //octokit
  const octo = github.getOctokit(process.env.GITHUB_TOKEN)

  //pr info
  const prInfo = (await octo.rest.pulls.get({
    pull_number:github.context.payload.pull_request.number
  })).data

  //start
  let msg = `[*${github.context.repo.repo}*] *${github.context.actor}* 님에 의해 *Pull request* 가 *Open* 되었습니다.`

  //pr link
  msg += `\n\n> <${prInfo.html_url}|${prInfo.body || prInfo.html_url}>`

  //pr comment
  const comment = github.context.payload.comment
  comment && comment.length > 0 && (msg += '```comment```')
  
  return msg

}

module.exports = prMessageCreator