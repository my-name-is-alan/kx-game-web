local types = [[

]]

local c2s = [[

    breakthrough %d { #突破
        response {
            errorcode 0:integer
            phase 1:integer
            level 2:integer
            exp 3:integer
        }
    }

    evolve %d { #发展升级
        response {
            errorcode 0:integer
            evolveFinishTime 1:integer
        }
    }

    speedUpEvolveForAd %d { #加速发展（广告）
        request {
            costStone 0:integer # 消耗玉璧  0：否 1：是
        }

        response {
            errorcode 0:integer
            evolveFinishTime 1:integer
        }
    }

    speedUpEvolve %d { #加速发展
        request {
            count 0:integer #消耗券数量
        }

        response {
            errorcode 0:integer
            evolveFinishTime 1:integer
            itemRemoves 2:*itemRemove
        }
    }
]]

local s2c = [[
    onEvolveFinish %d { #发展完成
        request {
            evolutionLevel 0:integer #发展等级
   	        evolveFinishTime 1:integer #发展升级完成时间戳
        }
    }

    onEvolveTimeChange %d { #发展时间变动
        request {
   	        evolveFinishTime 0:integer #发展升级完成时间戳
        }
    }
]]

return {
    types = types,
    c2s = c2s,
    s2c = s2c,
}