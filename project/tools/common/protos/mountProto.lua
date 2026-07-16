local types = [[

    .mount { #
        gid 0: string # 坐骑实例编号
        tid 1: integer # 坐骑配置表编号
        stage 2: integer # 坐骑阶级
        level 3: integer # 坐骑等级
        cid 4: integer # 皮肤
        item 5: integer # 升级物品消耗
        tactivate 6: string # 坐骑激活表    坐骑1,坐骑2
        cactivate 7: string # 化形激活表    化形1,等级;化形2,等级    
    }

]]

local c2s = [[
    mountOpen %d { # 开启坐骑系统
        request {
        }

        response {
            errorcode 0:integer
            mount 1: mount
        }
    }
    
    mountUnlock %d { # 坐骑解锁
        request {
            tid 1: integer
        }

        response {
            errorcode 0:integer
            mount 1: mount
        }
    }
    
    mountClothes %d { # 皮肤解锁
        request {
            cid 1: integer
        }

        response {
            errorcode 0:integer
            mount 1: mount
            costResult 2: costResult
        }
    }
    
    mountUpgrades %d { # 升级坐骑
        request {
            count 0:integer # 物品数量      0用于升阶
        }

        response {
            errorcode 0:integer
            mount 1: mount
            costResult 2: costResult
        }
    }
    
    mountCat %d { # 切换坐骑
        request {
            tid 1: integer
        }

        response {
            errorcode 0:integer
            mount 1: mount
        }
    }
    
    mountCatClothes %d { # 切换皮肤
        request {
            cid 1: integer
        }

        response {
            errorcode 0:integer
            mount 1: mount
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