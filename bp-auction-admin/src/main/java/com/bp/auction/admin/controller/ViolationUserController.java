package com.bp.auction.admin.controller;
import com.bp.auction.admin.service.ViolationUserService;
import com.bp.auction.common.dal.entity.ViolationUser;
import com.bp.core.base.BasePage;
import com.bp.core.web.base.ExtJsController;
import org.jasig.cas.client.util.AssertionHolder;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

/**
 * @author zc
 * @create 2019-03-06 16:05
 * @desc 违约用户管理
 **/
@RestController
@RequestMapping("/auction/admin/violationUser")
public class ViolationUserController extends ExtJsController {

    @Autowired
    private ViolationUserService violationUserService;

    /**
     * 违约用户名单列表
     *
     * @return
     */
    @RequestMapping("/list")
    public Object list() {
        BasePage<ViolationUser> page = getPage(ViolationUser.class);
        return responseSuccess(violationUserService.listViolationUser(page.getData().getUserId()));
    }

    /***
     * 将用户移出黑名单
     * @return
     */
    @RequestMapping("/remove")
    public Object remove(@RequestParam Long userId) {
        //清除违约信息
        violationUserService.clear(userId, AssertionHolder.getAssertion().getPrincipal().getName());
        return responseSuccess();
    }

}
