package com.bp.auction.server.rpc;

import com.alibaba.dubbo.config.annotation.Reference;
import com.wf.trans.rpc.AccountRpcService;
import com.wf.trans.rpc.dto.RpcRequest;
import com.wf.trans.rpc.dto.RpcResponse;
import com.wf.trans.rpc.dto.TransAccountDto;
import com.wf.trans.rpc.dto.TransactionLogDto;
import org.springframework.stereotype.Service;

/**
 * 类名称：AuctionRpc
 * 类描述：
 * 开发人：朱水平【Tank】
 * 创建时间：2019/3/11.11:24
 * 修改备注：
 *
 * @author Tank
 * @version 1.0.0
 */
@Service
public class AuctionRpc {

    @Reference
    AccountRpcService accountRpcService;

    /**
     * 更新账号信息
     *
     * @param transactionLog 更新账号的数据信息
     * @return RpcResponse<TransAccountDto> 更新之后的账户信息
     */
    public RpcResponse<TransAccountDto> updateAccount(RpcRequest<TransactionLogDto> transactionLog){
        return accountRpcService.updateAccount(transactionLog);
    }

}
