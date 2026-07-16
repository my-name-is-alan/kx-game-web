local types = [[
.chatPlayerInfo { # 聊天玩家信息
    guid 0:string #玩家id
    avatar 1:string #头像
    avatarBorder 2:string #头像框
    name 3:string #名称
    combatPower 4:integer #战斗力
    phase 5:integer #阶段
    mountType 6:integer #坐骑类型
    mountSkin 7:integer #坐骑皮肤
    summonPet 8:string #宠物
    character 9: integer #角色
    appearance 10:integer #形象
    title 11:integer #称号
}

#聊天信息
.chatInfo {
    senderInfo 0:chatPlayerInfo #聊天玩家信息
    senderId 1:string #发送者ID
    receiverId 2:string #接受者ID
    receiverInfo 3:chatPlayerInfo #聊天玩家信息
    content 4:string #内容
    channelType 5:integer #聊天频道 1私聊,2世界聊天,3系统通知,4活动聊天,5工会聊天
    activityId 6: integer #活动ID
    time 7:integer #当前时间
}

#系统消息
.chatSystemInfo {
    playerName 0:string         #玩家姓名
    reward 1:string             #奖励名
    rewardAmount 2:integer      #奖励数量
    activityId 3: integer       #活动ID
    time 4:integer              #当前时间
}

#历史聊天记录
.chatHistory {
    private 		0: *chatInfo #私聊
	world 			1: *chatInfo #世界聊天
	system 			2: *chatInfo #系统通知
	activity 		3: *chatInfo #活动聊天
	laborUnion 		4: *chatInfo #工会聊天
}

#跑马灯信息
.tickerInfo {
    tickerId 0:integer          #Excel对应消息ID
    playerName 1:string         #玩家姓名
    phase 2:string              #阶段名
    artifact 3:string           #法宝名
    treeLevel 4:integer         #仙树等级
    winnerServer 5:string       #胜者服务器名
    winnerName 6: string        #胜者名
    loserServer 7:string        #败者服务器名
    loserName 8:string          #败者名
    winStreak 9:integer         #连胜次数
    endStreak 10:integer        #终结对方连胜次数
    reward 11:string            #奖励名
    rewardAmount 12:integer     #奖励数量
    pet 13:string               #宠物名
    time 14:integer             #当前时间
    eliteMonsterName 15 : string#精怪名
    goldFingerName 16:string #金手指名字
}



]]

local c2s = [[
    #发送聊天消息
    sendMsgChat %d {
        request {
            receiverId          0:string  #接受者ID
            content             1:string  #消息内容
            channelType         2:integer #聊天频道 1私聊,2世界聊天,3系统通知,4活动聊天,5工会聊天
            activityId          3:integer #活动ID(用于活动频道聊天)
        }
        response {
            errorcode 0:integer
        }
    }   
 
]]

local s2c = [[
#聊天消息
chatInfoChanged %d {
    request {
        chatInfo 0: chatInfo #聊天信息
    }

}   

#活动系统消息
chatSystemInfoChanged %d {
    request {
        chatSystemInfo 0: chatSystemInfo #系统消息
    }

}   

#跑马灯消息
tickerInfoChanged %d {
    request {
        tickerInfo 0: tickerInfo #聊天信息
    }

}   

]]

return {
    types = types,
    c2s = c2s,
    s2c = s2c
}
