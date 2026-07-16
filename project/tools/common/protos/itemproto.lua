local types = [[
.item {
	id 1 : string
	protoId 2 : integer
	ownerId 3 : string
	container 4 : integer
	slot 5 : integer
	binding 6 : integer
	count 7 : integer
	data  8 : string #

	getTime 9:integer #过期物品获得时间 可能为nil
}

.itemInst {
	type 0 : integer
	item 1 : item
	hero 2 : hero
	pet 3: pet
	elitemonster 4: elitemonster
	elitemonsterdebris 5: elitemonsterDebris
    theurgyFrag 6:theurgyFrag # 神通碎片
    theurgySeal 7:theurgySeal # 神通印记

	
}

.itemInsert {
	itemid 1 : string
	addCount 2 : integer
	create 3 : integer
	itemInst 4 : itemInst 	
}

.itemRemove {
	itemid 1 : string
	count 2 : integer
	destory 3 : integer
}

.extraShow {
	
}

.bonusesResult {
	inserts         0 : *itemInsert 	# 新物品

	item            1:integer 		    # 道具 -- 没有
	money           2:integer           # 金币
    stone           4:integer           # 钻石
    exp             5:integer           # 经验
    chance          8:string           # 机缘
    extraShow		15:extraShow		#额外展示信息
}

.drawResult {
	type 1 : integer 			# 显示的类型
	protoId 2 : integer 		# 原型ID(物品)
	count 3 : integer 			# 个数(物品)
	point 4 : integer 			# 数量(非物品)
}

# 消耗结果
.costResult { 					
	itemRemoves     0 : *itemRemove     # 消耗物品
	money           2:integer           # 金币
    stone           4:integer           # 钻石
    exp             5:integer           # 经验
    chance          8:string           # 机缘
}

.chestSelect {
	index		1:integer	#自选宝箱下标
	count		2:integer 	#宝箱个数
}

]]

local c2s =[[
useitem %d { 					# 使用物品
	request {
		instId 0 : string 		# 物品实例ID
		count 1 : integer 		# 使用个数
		heroId 2:string #卡牌实例ID 使用卡牌经验物品的时候传
        data  3: *integer       #扩展参数 可能为nil
	}
	response {
		errorcode 0 : integer
		protoId 1 : integer
		itemRemoves 2 : *itemRemove	
	    count 3 : integer # 道具使用个数
        effectResult 4:effectResult #效果结果   可能为nil
	}
}

# 使用多个物品，只支持玩家属性的物品
useItemStr %d { 					
	request {
		data 0 : string 		# 物品实例ID,个数;
	}
	response {
	    errorcode    0:integer
        costResult   1:costResult       #消耗结果 
	}
}

sortbag %d { #整理背包 
	request {

}
	response {
	errorcode 0:integer
	items 1: *item 			#客户端清空背包 替换成items
}	
}

addbagslot %d { #扩充背包
	request {

}
	response {
	errorcode 0:integer
	itemRemoves 1:*itemRemove
	bagLevel 2:integer #背包等级
	grid 3:integer #现在背包格子数
}

 
}


    mergeItem %d { # 合成物品
        request {
            mergeId 0:integer # 物品合成表id
            count 1:integer # 次数
        }

        response {
            errorcode 0:integer
            itemInserts 1: *itemInsert
            itemRemoves 2: *itemRemove
        }
    }

    openChest %d { # 打开宝箱
        request {
            instId 0:string # 宝箱实例ID
            count 1:integer # 开启宝箱个数
            chestSelectArr 2:*chestSelect # 选择宝箱
        }
        response {
            errorcode    0:integer
            itemRemoves  1:*itemRemove
            bonusesResult 2:bonusesResult
        }
    }
]]

local s2c =[[

itemInserts %d {
	request {
		itemInserts 0 : *itemInsert
        source 1 : integer                                      # 来源
	}
}

itemRemoves %d {
	request {
		itemRemoves 0 : *itemRemove
	}
}

]]

return {
    types = types,
    c2s = c2s,
    s2c = s2c,
}