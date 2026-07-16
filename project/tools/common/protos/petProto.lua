local types = [[
    .petModuleInfo {
        pet 				                    1:*pet(id) #宠物
        activityPetEncyclopedia					2:*petEncyclopedia  #已激活的宠物图鉴
        petADSCount                             3:integer           #宠物广告刷新剩余次数
        ownerPetRecord                          4:*integer          #已拥有的宠物ID
        petDrawCount                            5:integer           #终身卡保底已抽次数
    }
    .pet{
        id 0 :string # 宠物ID
        level 1:integer # 等级
        tier 2:integer # 阶级
        devourLevel 3:integer # 吞噬等级
        attackPercentage 4:string # 攻击加成(百分比)
        healthPercentage 5:string # 血量加成(百分比)
        defensePercentage 6:string # 防御加成(百分比)
        isLock 7:integer #是否锁定
        protoId 8:integer #原型ID
        assignPet 9:string #协同宠物
        buffSkill 10:*petBuffSkill #被动技能
        soulSkill 11:*petBuffSkill #塑魂技能
        refreshBuffSkill 12:*integer #洗炼刷新的技能 [1,21115,22234,1]
    }
    .petEncyclopedia {
        activationRequiredPetId 0: *integer #图鉴激活所需宠物id
    }
    .recruitingPets {
        petProtoId 0:integer #宠物原型Id
        state 1:integer #购买状态,0为已购买,1为未购买
    }

    .petBuffSkill {
        buffId 0:integer #buff技能ID
        buffLevel 1:integer #buff技能等级
    }
    .petConsumptionRewardList {
        bonuses 0 :   *integer #specialGuarantees表id
        id 1 : integer 
    }
]]

local c2s = [[
    #宠物上阵
    summonpet %d {
        request {
            petId 0:string #宠物id	
        }
        response {
            errorcode 0:integer
            petId 1:string #宠物id	
        }
    }   
    #宠物下阵(弃用)
    dismisspet %d {
        request {	
        }
        response {
            errorcode 0:integer
        }
    } 
    #宠物升级
    leveluppet %d {
        request {	
            petId 0:string #宠物id	
        }
        response {
            errorcode 0:integer
            costResult 1 : costResult# 消耗物品
            pet 2: pet#宠物数据

        }
    }  
    #宠物吞噬 吞噬者devourerPet 猎物preyPet 
    devourpet %d {
        request {	
            devourerPetId 0:string #吞噬者宠物id	
            preyPetId 1:string #猎物宠物id	
        }
        response {
            errorcode 0:integer
            preyPet 1 : pet #猎物宠物
            devourerPet 2:pet #吞噬者
            itemInserts 3 : *itemInsert #返还材料
            boostItemInserts 4:*itemInsert #加成物品
        }
    }  
    #重置宠物
    petreset %d {
        request {	
            petId 0:string #宠物id	
        }
        response {
            errorcode 0:integer
            itemInserts 1 : *itemInsert #返还材料
            pet 2: pet#宠物数据
            costResult 3:costResult #可能为nil
        }
    }  
    #放生宠物
    petrelease %d {
        request {	
            petId 0:string #宠物id	
        }
        response {
            errorcode 0:integer
            itemInserts 1 : *itemInsert #返还材料
            pet 2: pet#宠物数据
            boostItemInserts 3:*itemInsert #加成物品
        }
    }  
    #切换宠物锁定状态
    togglepetlock %d {
        request {	
            petId 0:string #宠物id
            isLocked 1: integer #0为解锁 1为锁定	
        }
        response {
            errorcode 0:integer
            petId 1:string #宠物id
            isLocked 2: integer #0为解锁 1为锁定	
        }
    }  
    #设置保底宠物
    setpetpitysystem %d {
        request {	
            petProtoId 0:integer #宠物原型Id
        }
        response {
            errorcode 0:integer
            petProtoId 1:integer #宠物原型Id
        }
    }  
    #刷新招募宠物
    refreshrecruitingpets %d {
        request {	
            isADS 0: integer #1为广告刷新,0为非广告刷新
        }
        response {
            errorcode               0 : integer
            itemRemoves             1 : *itemRemove# 消耗物品
            petArr                  2 : *recruitingPets# 三只宠物
            petPitySystemCount      3 : integer #宠物抽卡保底次数
            petDrawCount            4 : integer           #终身卡保底已抽次数
        }
    }  
    #招募宠物
    recruitpet %d {
        request {
            petPosition 1:integer #宠物位置 1,2,3
        }
        response {
            errorcode 0:integer
            itemRemoves 1 : *itemRemove# 消耗物品 
            itemInserts 2 : *itemInsert #返还材料
            petArr 3 : *recruitingPets# 宠物招募列表
            pet 4: pet #宠物
        }
    }  
    #背包扩容
    expandpetinventory %d {
        request {	
        }
        response {
            errorcode 0:integer
            itemRemoves 1 : *itemRemove# 消耗物品 
            petBackpackCapacity 2 : integer #背包容量
        }
    }  
    #协同宠物上阵
    assignPetToBattle %d {
        request {	
            mainPetId 0:string     #宠物ID
            assignPetId 1:string   #协同宠物ID
        }
        response {
            errorcode 0:integer
            pet 1: pet              #宠物
        }
    }  

    #宠物洗炼
    refreshBuffSkill %d {
        request {	
            instID 0:string     #宠物实例ID
            lockArr  1:*integer   #1未锁定0未不锁定 [1,0,0,1]
        }
        response {
            errorcode 0:integer
            buffArr   1:*integer   #buffID数组1为锁定的[1,1010,1010,1]
            instID    2:string     #宠物实例ID
            costResult 3:costResult #消耗
        }
    }  

    
    #保存洗炼
    saveRefreshBuffSkill %d {
        request {	
            instID 0:string     #宠物实例ID
            isSave 1:boolean    #true为保存

        }
        response {
            errorcode 0:integer
            buffSkill 1:*petBuffSkill #被动技能，保存成功返回，取消保存没有
        }
    }  

    #领取同心玉奖励
    takeConsumptionBonuse %d {
        request {	
            groupId 0:integer           #组id
            id      1:integer           #specialGuarantees表id

        }
        response {
            errorcode                   0 : integer
            bonusesResult               1 : bonusesResult
            petConsumptionReward        2 : *petConsumptionRewardList #奖励列表
        }
    }  

]]

local s2c = [[
    #激活图鉴
    activityencyclopedia %d {
        request {
            petEncyclopedia 1:*petEncyclopedia #已激活的图鉴
        }
    }

    insertPetRecord %d {
        request {
            petProtoID 1:integer #已激活的图鉴
        }
    }



    #主宠物的协同宠物更新 (出现在协同宠物被放生时)
    assignPetUpdate %d {
        request {
            pet 1: pet              #主宠物
        }
    }
    petADSCountChange %d {
        request {
            petADSCount         1:integer #宠物广告刷新剩余次数
        }
    }

    #更新同心玉奖励
    updateConsumptionBonuse %d {
        request {	
	        petConsumption              1 : integer  # 宠物抽卡买卡总消耗
            petConsumptionReward        2 : *petConsumptionRewardList #奖励列表
        }
    }  
]]

return {
    types = types,
    c2s = c2s,
    s2c = s2c
}
