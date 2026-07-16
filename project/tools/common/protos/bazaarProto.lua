local c2s = [[

#坊市只读权威报价；独立追加以保持所有既有协议号不变
bazaarQuotePurchase %d {
    request {
        id 0: integer
        num 1: integer #购买策略组数
        policyVersion 2: string #客户端当前看到的会话策略版本
    }
    response {
        errorcode 0: integer
        quote 4: bazaarQuote
        policyVersion 5: string
        bazaarError 6: string
    }
}
]]

return {
    c2s = c2s,
}
