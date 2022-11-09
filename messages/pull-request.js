const github = require('@actions/github');

const prMessageCreator = async ()=>{
  
  //octokit
  const octo = github.getOctokit(process.env.GITHUB_TOKEN)

  //pr params
  const prParams = {
    owner:github.context.issue.owner,
    repo:github.context.issue.repo,
    pull_number:github.context.payload.pull_request.number
  }

  //pr info
  const prInfo = (await octo.rest.pulls.get(prParams)).data

  //pr commits
  const prCommits = (await octo.rest.pulls.listCommits({
    per_page:5,
    ...prParams
  })).data

  //start
  let msg = `:open_file_folder: *${github.context.repo.repo}* :open_file_folder:\n\n*${github.context.actor} 님에 의해 Pull request 가 Open 되었습니다.*`

  //pr body content
  const content = prInfo.body
  content && content.length > 0 && (msg += "\n\n```"+content+"```")

  //pr commit list
  if(prCommits && prCommits.length > 0){

    msg += '\n\n*Commit 목록 미리보기*'
    for(let commit of prCommits){
      msg += `\n- <${commit.html_url}|${commit.commit.message}>`
    }

    if(prInfo.commits > prCommits.length){
      msg += `\n 외 ${prInfo.commits - prCommits.length} 건`
    }

  }

  //List pull requests files
  const prFiles = (await octo.rest.pulls.listFiles({
    per_page:5,
    ...prParams
  })).data

  if(prFiles && prFiles.length > 0){

    prFiles.sort((f1, f2)=>{
      return f1.status > f2.status?1:-1
    })

    msg += '\n\n*변경된 파일 목록 미리보기*'
    for(let file of prFiles){
      msg += `\n<${prInfo.html_url}/files#diff-${file.sha}|[${file.status}] ${file.filename}>`
    }

    if(prInfo.changed_files > prFiles.length){
      msg += `\n 외 ${prInfo.changed_files - prFiles.length} 건`
    }

  }

  //pr link
  msg += `\n\n<${prInfo.html_url}>`
  
  return msg

}

module.exports = prMessageCreator