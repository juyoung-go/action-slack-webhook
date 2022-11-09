const {WebClient} = require('@slack/web-api')

const webClient = new WebClient(process.env.SLACK_TOKEN)

class SlackApi {

  usergroups

  static async getUser(name){
    return webClient.users.info({
      user:name
    })
  }

  static async getUserGroupList(cache){

    if(cache && this.usergroups){
      return this.usergroups
    }

    const res = await webClient.usergroups.list({
      include_count:false,
      include_disabled:false,
      include_users:false,
    })

    if(!this.usergroups && res.usergroups){
      this.usergroups = res.usergroups
    }

    return res.usergroups

  }

  static async getUserGroup(handle){
    
    const usergroups = await this.getUserGroupList(true)
    
    const result = []
    const inputIsArray = Array.isArray(handle)
    for(let group of usergroups){

      if((inputIsArray && handle.includes(group.handle))
      || handle === group.handle
      ){
        if(inputIsArray){
          !result.includes(group) && result.push(group)
        }else{
          return group
        }
      }
      
    }
    
    return result

  }

}

module.exports = SlackApi
