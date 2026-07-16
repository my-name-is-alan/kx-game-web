local types = [[

]]

local c2s = [[
    #进入关卡
    challengestage %d {
        request {
            stageId 1:integer #关卡ID 	
        }
        response {
            errorcode 0:integer
            bonusesResult 1:bonusesResult #关卡奖励
            battleResult 3:battleResult #战斗结果
            stageId 4:integer #下个关卡ID，如果失败就还是当前关卡ID 
            isWin 5: integer #是否胜利,1为胜利,2为失败	
        }
    }   

    #一键领取章节奖励
    claimchapterreward %d {
        request {
        }
        response {
            errorcode 0:integer
            bonusesResultArr    1:*bonusesResult     #章节奖励
        }
    }   
]]

local s2c = [[

]]

return {
    types = types,
    c2s = c2s,
    s2c = s2c
}
