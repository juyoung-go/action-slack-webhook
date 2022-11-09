const github = require('@actions/github');

const prMessageCreator = async ()=>{
  
  //octokit
  const octo = github.getOctokit(process.env.GITHUB_TOKEN)

  //pr info
  const prInfo = (await octo.rest.pulls.get({
    owner:github.context.issue.owner,
    repo:github.context.issue.repo,
    pull_number:github.context.payload.pull_request.number
  })).data

  //start
  let msg = `*[${github.context.repo.repo}] ${github.context.actor} 님에 의해 Pull request 가 Open 되었습니다.*`

  //pr body content
  const content = prInfo.body
  content && content.length > 0 && (msg += "\n\n```"+content+"```")

  //pr link
  msg += `\n\n<${prInfo.html_url}>`
  
  return msg

}

module.exports = prMessageCreator