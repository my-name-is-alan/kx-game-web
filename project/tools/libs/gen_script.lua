require("json")

local escapes = {
    amp = '&',
    quot = '"',
    apos = '\'',
    gt = '>',
    lt = '<',
}

local function helper(s)
    local num = string.match(s, '^#(%d+)$')
    if num then return string.char(tonumber(num)) end
    return escapes[s]
end

local function strip_escapes(s)
    s = string.gsub(s, '&(#?[%a%d]+);', helper)
    return s
end

local function parseargs(s)
    local arg = {}
    string.gsub(s, "([%w_]+)%s*=%s*([\"'])(.-)%2", function (w, _, a)
        arg[strip_escapes(w)] = strip_escapes(a)
    end)
    return arg
end

local NODEFIELD = "TAGNAME"
local function xmlToTable(s)
    local i = 1
    local top = {}
    local stack = {top}

    while true do
        local tb,te,close,tag,xarg,empty = string.find(s, "<(%/?)([%w_]+)(.-)(%/?)>", i)
        if not tb then break end
		
        if empty == "/" then  -- empty element tag
            local elem = parseargs(xarg)
            elem[NODEFIELD] = tag
            table.insert(top, elem)

        elseif close == "" then   -- start tag
            top = parseargs(xarg)
            top[NODEFIELD] = tag
            table.insert(stack, top)   -- new level

        else  -- End tag
            local toclose = assert(table.remove(stack))  -- remove top
            top = stack[#stack]
            if #stack < 1 then
                error("nothing to close with "..label)
            end
            if toclose[NODEFIELD] ~= tag then
                error("trying to close "..toclose[NODEFIELD].." with "..tag)
            end
            table.insert(top, toclose)
        end
        i = te + 1
    end
	
    if #stack > 1 then
        error("unclosed "..stack[#stack].label)
    end
    return stack[1]
end

local function xmlToTableHandler(stack)
	while true do
		local top = table.remove(stack, 1)
		if not top then break end
		if not stack.tagArrays then
			stack.tagArrays = {}
		end
		xmlToTableHandler(top)
		table.insert(stack.tagArrays, top)
	end
	return stack
end

local function tableToJson(obj)
	if type(obj) == "table" then
		local newobj = {}
		for key,value in pairs(obj) do
			if key == "tagArrays" then
				for kkkkk,vvvvv in ipairs(value) do
					if not newobj["_" .. vvvvv[NODEFIELD]] then
						newobj["_" .. vvvvv[NODEFIELD]] = {}
					end
					table.insert(newobj["_" .. vvvvv[NODEFIELD]], tableToJson(vvvvv))
				end
			elseif key == NODEFIELD then
				-- do nothing
			else
				newobj[key] = tableToJson(value)
			end
		end
		return newobj
	else
		return obj
	end
end

local ARGV = {...}
if ARGV[1] == "xmltojson" then
	if #ARGV < 5 then
		return
	end
	
	local fileName = ARGV[4]
	local jsonName = ARGV[5]
	local srcPath = ARGV[2] .. fileName
	local dstPath = ARGV[3] .. jsonName
	local fh = assert(io.open(srcPath))
	local buffer = fh:read("*a")
	fh:close()
	
	local fh = assert(io.open(dstPath, "w"), "can not create file:" .. jsonName)
	local jsonstr = string.gsub(json.encode(tableToJson(xmlToTableHandler(xmlToTable(buffer)))), "\\\\n", "\\n")
	fh:write(jsonstr)
	fh:close()
elseif ARGV[1] == "genprotobin" then
	if #ARGV < 3 then
		return
	end
	
	-- package.cpath = ".\\luaso/?.dll" .. package.cpath -- lpeg库已经放到本目录，无需再添加
	__cnf = __cnf or {benchmark = true} -- 适配sproto内部需要的全局
	package.path = ".\\.\\common\\?.lua;.\\.\\common\\protos\\?.lua;" .. package.path -- require的查找目录，lua文件的require的目录有些不一样。
	
	local srcPath = ARGV[2]
	local dstPath = ARGV[3]
	
	local fh = assert(io.open(srcPath, "r"))
	local str = fh:read("*a")
	fh:close()

	str = string.gsub(str, "return proto", "return types .. c2s .. s2c")
	local protoStr = loadstring(str)()
	local sprotoparser  = require "sprotoparser"
	local content = sprotoparser.parse(protoStr)
	local fh = assert(io.open(dstPath, "w+b"), "can not create file:" .. dstPath)
	fh:write(content)
	fh:close()
end