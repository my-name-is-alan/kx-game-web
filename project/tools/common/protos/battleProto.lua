local types = [[
    #宠物
    .petInfo{
        pos         1:integer         #宠物的序号
        protoID     2:integer         #原型ID
    }
    #精怪
    .eliteInfo{
        pos         1:integer         #精怪的序号
        protoID     2:integer         #原型ID
    }
    #触发
    .triggerInfo{
        #--两个都为nil就是实体的
        entityID        1:integer         #源实体ID
        petProtoID      2:integer         #宠物原型ID 可能为nil（跟pos搭配找人，找不到就用entityID找）
        eliteProtoID    3:integer         #精怪原型ID 可能为nil（跟pos搭配找人，找不到就用entityID找）
        pos             4:integer         #宠物或者精怪的位置 可能为nil
        targetID        5:integer         #目标实体ID（只能是人物）  
        targetName      6:string          #目标名字
        entityName      7:string          #源名  

    }
    #BUFF信息
    .bufData{
        triggerInfo 1 : triggerInfo
        bufID       2 : integer #buff id
	    type        3 : integer #buff type 1-24（buff类型常量表，发我一下）立即生效就结束的buff，比如回血，根据type判断放特效
	    round       4 : integer #buff 剩余回合
	    value       5 : string  #值 见上面值说明 也可能为nil
	    final       6 : string  #最终值 可能为nil
        battleMaxHP 7 : integer #自己最大血量(有buff会加最大生命值，都是开始buff) 可能为nil
        skillId     8 : integer #技能ID
    }
       
    #技能信息
    .skillData{
		skillId             1:integer        
        beforeAddBuff	    2:*bufData #可能为nil
		beforeHitBuff	    3:*bufData #可能为nil
		beforeRemoveBuff	4:*bufData #可能为nil
        triggerInfo         5:triggerInfo  
        afterAddBuff	    6:*bufData #可能为nil
		afterHitBuff	    7:*bufData #可能为nil
		afterRemoveBuff	    8:*bufData #可能为nil
        name                10:string #技能名字 可能为nil
        multiple            11:integer #技能伤害别率 默认是一，有神识会改倍率
        addBloodInfo        20:addBloodInfo #可能为nil 吸血 
        petAddBloodInfo     21:petAddBloodInfo#可能为nil 宠物吸血
        effectShowIndex     22:integer #可能为nil,有多个effectShow会标识用哪个
        costBloodInfo       23:costBloodInfo #可能为nil 扣血
    }
    #吸血
    .addBloodInfo{
	    value       1 :string    #增加值
	    final       2 :string    #最终值
    }
    #扣血
    .costBloodInfo{
	    value       1 :string    #增少值
	    final       2 :string    #最终值
    }

    #宠物加血或者神通加血
    .petAddBloodInfo{
	    value       1 :string     #增加值
	    final       2 :string     #最终值
    }

  
    #战斗实体
    .entityInfo{
        name                1:string        #名字
        entityID            2:integer       #实体ID
        protoID            	3:integer       #怪物原型ID 可能为nil
        battleCamp          4:integer       #阵营 1攻方 2 守方
        battleHP            5:string        #自己当前血量
        battleMaxHP         6:string        #自己最大血量(初始血量不一定是最人血量 )
        battleAnger         7:integer       #自己最终怒气
        battleMaxAnger      10:integer      #自己最大怒气(同血量 )
        type                11:integer      #实体类型 1人物 2怪物
        
        petInfoArr          12:*petInfo     #宠物信息   可能为nil
        eliteInfoArr        13:*eliteInfo   #精怪信息   可能为nil
        startSkillDataArr   14:*skillData   #开场技能数据 可能为nil

        character           25:integer  #角色   可能为nil
        appearance          26:integer  #形象   可能为nil
        phase               27:integer  #阶段   可能为nil
        mountType           28:integer  #坐骑实例ID   可能为nil
        mountSkin           29:integer  #坐骑皮肤ID   可能为nil
    }   

    #回合信息
    .roundInfo{
        actionInfoArr  1:*actionInfo        #动作信息数组
        roundId        2:integer            #回合ID
        startAddBuff	    6:*bufData 		#回合开始增加BUFF可能为nil
		startHitBuff	    7:*bufData 		#回合开始生效BUFF可能为nil
		startRemoveBuff	    8:*bufData 		#回合开始移除可能为nil
        repMonsterArr       9:*integer      #切换怪物列表可能为nii

        targetEndHP      12:string           #切换怪物,目标最终血量 可能为nii
        targetEndAnger   13:integer          #切换怪物,目标最终怒气 可能为nii
        targetEndMaxHP   14:string           #切换怪物,目标最大血量 可能为nii
    }

    #动作信息
    .actionInfo{    
        critital         4:boolean           #是否暴击
        targetCounter    5:boolean           #目标是否触发反击（每次行动前取上一次行动的值，如果true就飘字“反击”）
        targetMiss       7:boolean           #目标是否触发闪避
        cooperateAttack  8:boolean           #协同攻击
        addAnger         9:integer           #自己消耗怒气
        endAnger         10:integer          #自己最终怒气
 
        targetAddHP      11:string           #伤害(正数)
        targetEndHP      12:string           #目标最终血量
        targetAddAnger   13:integer          #目标消耗怒气
        targetEndAnger   14:integer          #目标最终怒气
        targetEndMaxHP   15:string           #目标最大血量

        comboCnt        20:integer           #连击数，如果大于0，取出后面cnt个动作合并（如果ctn是1就是2连击，数组的下1个数据就是第2连击，如果是近战，则不用回到原位再攻击）
        skillData       30:skillData         #攻击者触发的技能数据
        actionID        31:integer           #动作ID可能为nil
        repMonsterArr   38:*integer          #切换怪物列表可能为nii
    }



    #战斗结果
    .battleResult{
        roundAll        1 :integer      #总回合
        isWin           2 :boolean      #true胜利 false失败
        entityAttack    3 :entityInfo   #攻击方
        entityDefence   4 :entityInfo   #防守方
        roundInfoArr    5 :*roundInfo   #回合信息数组
        roundInfoStr    6 :string       #回合信息字符串
        
    }
]]

local s2c =[[
    
]]

return {
    types = types,
    c2s = c2s,
    s2c = s2c,
}