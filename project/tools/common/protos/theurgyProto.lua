local types = [[

    .theurgy { # 神通
        cfgId 1: integer # 神通配置表编号
        level 2:integer # 等级
        phase 3:integer # 阶段
        frag 4:integer # 碎片数量
        type 5:integer # 类型
        quality 6:integer # 品质
        status 7:integer #状态 0：闲置 1：穿戴
        seal 8:*integer # 印记
    }

    .theurgyFrag { # 神通碎片
        id 0: string #实例id
        protoId 1: integer # 神通配置表编号
        count 2:integer # 数量
        container 3:integer
        ownerId 4:string
        slot 5:integer
        binding 6:integer
        data 7:string
    }

    .theurgySeal { # 印记
        id 0: string #实例id
        protoId 1: integer # 神通印记配置id
        count 2:integer # 数量
        placeCount 3:integer # 闲置数量
        container 4:integer
        ownerId 5:string
        slot 6:integer
        binding 7:integer
        data 8:string
    }

    .theurgyCatalog { # 图鉴
        id 1: integer # 神通图鉴配置id
        level 2:integer # 等级
    }

    .theurgyInfo {
        theurgies 1:*theurgy # 神通
        theurgyCatalog 2:*theurgyCatalog # 图鉴
        theurgySeal 3:*theurgySeal # 印记
        theurgyFrag 4:*theurgyFrag # 神通碎片
        guaranteedCount 5:integer # 保底数
    }
]]

local c2s = [[

    getTheurgyInfo %d { #获取神通信息
        response {
            errorcode 0:integer
            theurgyInfo 1: theurgyInfo # 神通
        }
    }

    theurgyDerive %d { #衍化
        request {
            count 0:integer # 次数
        }

        response {
            errorcode 0:integer
            deriveTheurgyId 1: *integer # 衍化神通id列表
            itemInserts 2: *itemInsert # 新增神通碎片
            itemRemoves 3: *itemRemove
            newTheurgies 4: *theurgy # 新增神通
            guaranteedCount 5: integer
            theurgyDeriveSpecialCount 6: integer #神通衍化积攒次数
            theurgyDeriveSpecialBonusesList 7: *integer #神通衍化积攒奖励
        }
    }

    theurgyDeriveForAd %d { #衍化（广告）
        request {
        }

        response {
            errorcode 0:integer
            deriveTheurgyId 1: *integer # 衍化神通id列表
            itemInserts 2: *itemInsert # 新增神通碎片
            itemRemoves 3: *itemRemove
            newTheurgies 4: *theurgy # 新增神通
            guaranteedCount 5: integer
        }
    }

    theurgyAttach %d { # 神通穿戴或替换
        request {
            theurgyId 0:integer #神通id 配置
        }

        response {
            errorcode 0:integer
            theurgy 1: theurgy # 替换下神通
            battleTheurgy 2: theurgy # 穿戴上神通
        }
    }

    theurgyLevelUp %d { #升级神通
        request {
            count 0:integer #次数
            theurgyId 1:integer #神通id
        }

        response {
            errorcode 0:integer
            itemRemoves 1: *itemRemove
            theurgy 2: theurgy # 升级目标神通
        }
    }

    theurgyCatalogLevelUp %d { #升级或激活图鉴
        request {
            theurgyCatalogId 0:integer # 图鉴id
        }

        response {
            errorcode 0:integer
            theurgyCatalog 1:theurgyCatalog
        }
    }

    theurgyBreakthrough %d { #突破神通
        request {
            theurgyId 0:integer #神通id
        }

        response {
            errorcode 0:integer
            itemRemoves 1: *itemRemove
            theurgy 2: theurgy
        }
    }

    theurgyReset %d { #重置神通
        request {
            theurgyId 0:integer #神通id
        }

        response {
            errorcode 0:integer
            itemInserts 1:*itemInsert
            theurgy 2: theurgy
            detachTheurgySeals 3:*theurgySeal #被卸下印记
        }
    }

    theurgyAttachSeal %d { #戴上或替换印记
        request {
            theurgyId 0:integer #神通id
            sealId 1:integer # 印记id
            slot 2:integer # 槽位
        }

        response {
            errorcode 0:integer
            attachTheurgySeal 1:theurgySeal #戴上印记
            detachTheurgySeal 2:theurgySeal #被替换印记
            theurgy 3: theurgy
        }
    }

    theurgyDetachSeal %d { #卸下印记
        request {
            theurgyId 0:integer #神通id
            slot 1:integer # 槽位
        }

        response {
            errorcode 0:integer
            theurgySeal 1:theurgySeal #印记
            theurgy 2: theurgy
        }
    }

    mergeSealByType %d { #根据神通类型一键融合印记
        request {
            theurgyType 0:integer #神通类型
        }

        response {
            errorcode 0:integer
            itemInserts 1: *itemInsert # 新增神通印记
            itemRemoves 2: *itemRemove # 移除神通印记
        }
    }

    takeTheurgySpecialBonuses %d { #领取秘籍积攒奖励
        request {
        }
        response {
            errorcode 0 : integer
            bonusesResult 1:bonusesResult
        }
    }

    takeTheurgySpecialLottery %d { #秘籍积攒奖励抽奖(单抽))
        request {
        }
        response {
            errorcode 0 : integer
            id 1 : integer                      #对应specialProbability表ID
            itemRemoves 2:*itemRemove
            bonusesResult 3: bonusesResult 
        }
    }

]]

local s2c = [[
]]

return {
    types = types,
    c2s = c2s,
    s2c = s2c,
}