-- HDHive 积分内购协议：单独文件并在 parser 中置于 c2s 末尾，避免打乱既有协议号
local types = [[
.hdhiveVoucherPrice {
	id 0 : integer
	points 1 : integer
	chance 2 : integer
	money 3 : integer
	first_stone 4 : integer
}
]]

local c2s = [[
applyHdhiveOrder %d { #HDHive 积分内购下单并发货
	request {
	goodsId 0 : integer
	bid 1 : string
	product_id 2: string
	id 6:integer
	giftType 4:integer
	giftId 5:integer
	ext 7:*integer
	index 8:integer
	request_id 9:string
}
	response {
	errorcode 0 : integer
	order 1 : string
	money 2:integer
	id 3:integer
	points 4:integer
	transaction_id 5:integer
	remaining_points 6:integer
	duplicate 7:boolean
	chance 8:integer
	first_stone 9:integer
	terminal 10:boolean
	}
}

queryHdhiveVoucherPrices %d { #查询服务端权威代金券积分价
	request {
	}
	response {
	errorcode 0 : integer
	prices 1 : *hdhiveVoucherPrice
}
}
]]

local s2c = [[
dailyLoginChanceGranted %d {
	request {
		date 0 : integer
		amount 1 : integer
		chance 2 : string
	}
}
]]

return {
	types = types,
	c2s = c2s,
	s2c = s2c,
}
