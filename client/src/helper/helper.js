export const getActiveUsers = (usrsArr,loginUser)=>{
    return usrsArr?.filter((users)=>users?.name!=loginUser)
}