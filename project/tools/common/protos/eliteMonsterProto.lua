local types = [[

.elitemonsterInfo {
    elitemonster 		                    0: *elitemonster(id) #精怪背包
    activityEliteMonsterEncyclopedia		1: *eliteMonsterEncyclopedia #已激活的精怪共鸣
	activityEliteMonsterAttrs               2: *string #精怪收集总加成
	elitemonsterDebris                      3: *elitemonsterDebris(id) #精怪碎片背包
    eliteMonsterRecruitLimit 4: integer #精怪每日限制数
}

.elitemonster{
    id 0 :string # 精怪ID
    level 1:integer # 等级
    teamId 2:integer # 队伍ID1-3(弃用)
    teamPosition 3:integer # 队伍位置1-3(弃用)
    protoId 8:integer # 原型ID
}
.elitemonsterDebris{
    id 0 :string        #碎片物品ID
    protoId 1:integer   #原型ID
    count 2:integer     #数量
}
.eliteMonsterTeam {
    teamId 0:integer #队伍ID
    eliteMonsterId 1:string #精怪ID;精怪ID;精怪ID
}
#精怪共鸣
.eliteMonsterEncyclopedia {
    resonanceId 0:integer #共鸣id
    resonanceLevel 1:integer #共鸣等级
}
#碎片结构
.debris {
    debrisProtoId   0 : string  # 碎片原型
    debrisCount     1 : integer # 碎片数量
}

]]

local c2s = [[
    #阵容编辑
    editteamcomposition %d {
        request {
            teamId 0:integer #队伍ID 1-3
            eliteMonsterIdStr 1:string #精怪ID;精怪ID;精怪ID
        }
        response {
            errorcode 0:integer
            eliteMonsterTeam 1:*eliteMonsterTeam
        }
    }   
    #选择阵容
    setelitemonsterbattleteamid %d {
        request {
            teamId 0:integer #队伍ID 1-3
        }
        response {
            errorcode 0:integer
            teamId 1:integer #队伍ID 1-3
        }
    }  

    #  精怪招募（广告）
    recruitEliteMonsterForAd %d {
        request {

        }
        response {
            errorcode 0:integer
            itemInserts     1 : *itemInsert #抽取物品
            debris          2 : *debris # 碎片结构
            eliteMonsterRecruitLimit            3:integer  # 每日招募次数
            elityMonsterDrawCardRewardCount     4:integer  # 保底抽取总次数(0-200循环)
            elityMonsterDrawCardReward          5:*integer # 保底奖励列表
        }
    }  

    #单抽
    recruitsingleelitemonster %d {
        request {

        }
        response {
            errorcode 0:integer
            itemRemoves     1 : *itemRemove #消耗物品
            itemInserts     2 : *itemInsert #抽取物品
            debris          3 : *debris # 碎片结构
            eliteMonsterRecruitLimit 4:integer # 每日招募次数
            elityMonsterDrawCardRewardCount     5:integer  # 保底抽取总次数(0-200循环)
            elityMonsterDrawCardReward          6:*integer # 保底奖励列表
        }
    }
    #多抽
    recruitmultipleelitemonsters %d {
        request {

        }
        response {
            errorcode 0:integer
            itemRemoves     1 : *itemRemove #消耗物品 
            itemInserts     2 : *itemInsert #抽取物品
            debris          3 : *debris # 碎片结构
            eliteMonsterRecruitLimit 4:integer # 每日招募次数
            elityMonsterDrawCardRewardCount     5:integer  # 保底抽取总次数(0-200循环)
            elityMonsterDrawCardReward          6:*integer # 保底奖励列表
        }
    }   
    # 领取保底奖励
    openSpecialguarantees %d {
        request {
            itemId 0: integer # 保底奖励列表项
            eliteMonsterProtoId 1: integer #精怪原型ID (自选宝箱时)
        }
        response {
            errorcode                       0 :integer
            itemInserts                     1 :*itemInsert #抽取物品
            elityMonsterDrawCardReward      2 :*integer # 保底奖励列表
        }
    }  
    #激活精怪
    activiteEliteMonster %d {
        request {
            eliteMonsterProtoId 0: integer #精怪原型ID
        }
        response {
            errorcode 0:integer
            itemRemoves 1 : *itemRemove #消耗物品 
            itemInserts 2 : *itemInsert #获得物品
            elitemonster 3: elitemonster #精怪
            attrs 4: *string # 属性
        }
    }   
    #精怪升级
    levelUpEliteMonster %d {
        request {
            eliteMonsterId 0: string #精怪ID
        }
        response {
            errorcode 0:integer
            itemRemoves 1 : *itemRemove #消耗物品 
            elitemonster 2: elitemonster #精怪
            attrs 3: *string # 属性
        }
    }  
    #激活/升级精怪图鉴
    activateOrUpgradeEliteMonsterEncyclopedia %d {
        request {
            resonanceId         0:       integer #精怪共鸣id
        }
        response {
            errorcode           0:       integer
            resonanceId         1:       integer #精怪共鸣id
            resonanceLevel      2:       integer #精怪共鸣等级
            attrs 3: *string # 属性
        }
    }  
]]

local s2c = [[

    onEliteMonsterRecruitReset %d { #重置每日招募次数
        request {
            eliteMonsterRecruitLimit 0:integer
        }
    }
]]

return {
    types = types,
    c2s = c2s,
    s2c = s2c
}
