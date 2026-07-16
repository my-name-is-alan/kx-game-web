local types = [[

]]

local c2s = [[

]]

local s2c = [[

	bigdataHeader %d {
		request {
		name 0 : string #协议名
		index 1 : integer #编号
		len 2 : integer #长度
		}
	}

	bigdataContent %d {
	request {
		index 1 : integer
		data 2 :  binary
	}
	}	
]]

return {
    types = types,
    c2s = c2s,
    s2c = s2c,
}