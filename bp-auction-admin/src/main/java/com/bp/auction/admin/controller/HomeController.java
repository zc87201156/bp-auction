package com.bp.auction.admin.controller;

import com.alibaba.fastjson.JSONObject;
import com.bp.core.cache.CacheKey;
import com.bp.core.extjs.model.ButtonModel;
import com.bp.core.extjs.model.MenuModel;
import com.bp.core.extjs.model.TreeModel;
import com.bp.core.utils.GfJsonUtil;
import com.bp.core.web.base.ExtJsController;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang.StringUtils;
import org.jasig.cas.client.util.AssertionHolder;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.redis.core.BoundValueOperations;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;

import javax.servlet.http.HttpServletRequest;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.TimeUnit;

/**
 * 获取菜单
 */
@RestController
@RequestMapping("/admin/home")
@Slf4j
public class HomeController extends ExtJsController{
    @Autowired
    private RedisTemplate redisTemplate;
    //菜单列表接口url
    @Value("${custom.mp.url}")
    private String mpUrl;
    //菜单接口url
    @Value("${custom.mp.button.url}")
    private String mpButtonUrl;
    @Autowired
    private RestTemplate restTemplate;


    private String getMenuCacheKey(String loginName, String menuParCode) {
        String menuCacheKey = loginName + "-" + menuParCode;
        return menuCacheKey;
    }

    private String getButtonCacheKey(String loginName, String systemId) {
        String buttonCacheKey = loginName + "-btn-" + systemId;
        return buttonCacheKey;
    }

    /***
     * 查询当前登录用户
     * @param request
     * @return
     */
    @RequestMapping("/loginUserName")
    public Object loginUserName(HttpServletRequest request) {
        String loginName = AssertionHolder.getAssertion().getPrincipal().getName();
        return responseSuccess(loginName);
    }

    @RequestMapping("/loginout")
    public Object loginout(HttpServletRequest request) {
        request.getSession().invalidate();
        return true;
    }

    /**
     * 左侧一级菜单
     *
     * @return
     */
    @RequestMapping("/listModule")
    public Object listModule(@RequestBody JSONObject root) {
        return getMenu(root.getString("root"));
    }

    private Object getMenu(String menuParCode) {
        String loginName = AssertionHolder.getAssertion().getPrincipal().getName();
        String menuCacheKey = getMenuCacheKey(loginName, menuParCode);
        BoundValueOperations boundValueOperations = redisTemplate.boundValueOps(menuCacheKey);
        Object json = boundValueOperations.get();
        String mp_url = mpUrl;
        if (json == null) {
            if (StringUtils.isBlank(mp_url)) {
                throw new RuntimeException("can not find property 'mp.url' in 'application.properties.'");
            }
            if (mp_url.contains("?")) {
                if (!mp_url.endsWith("&")) {
                    mp_url += "&";
                }
            } else {
                mp_url += "?";
            }
            mp_url += "loginName=" + loginName + "&parentMenuCode=" + menuParCode;
            String body = restTemplate.getForObject(mp_url, String.class);
            boundValueOperations.set(body, CacheKey.MINUTE_1, TimeUnit.SECONDS);
            json = body;
        }
        List<TreeModel> list = GfJsonUtil.parseArray(json.toString(), TreeModel.class);
        List<MenuModel> maps = new ArrayList<>();
        for (TreeModel tm : list) {
            MenuModel mm = new MenuModel();
            mm.setId(tm.getCode());
            mm.setCode(tm.getCode());
            mm.setText(tm.getText());
            mm.setExpanded(tm.isExpanded());
            mm.setIcon(tm.getIcon());
            mm.setLeaf(tm.isLeaf());
            mm.setModuleLink(tm.getModuleLink());
            mm.setParameters(tm.getParameters());
            maps.add(mm);
        }
        return maps;
    }

    /**
     * 左侧二级菜单树
     *
     * @return
     */
    @RequestMapping("/listMenu")
    public Object listMenu(String code) {
        return getMenu(code);
    }

    /**
     * 获取用户该子系统下有权限的按钮
     *
     * @param systemId
     * @return
     */
    @RequestMapping("/listButton")
    public Object listButton(String systemId) {
        String loginName = AssertionHolder.getAssertion().getPrincipal().getName();
        String buttonCacheKey = getButtonCacheKey(loginName, systemId);
        BoundValueOperations boundValueOperations = redisTemplate.boundValueOps(buttonCacheKey);
        Object json = boundValueOperations.get();
        String buttonUrl = mpButtonUrl;
        if (json == null) {
            if (StringUtils.isBlank(buttonUrl)) {
                throw new RuntimeException("can not find property 'mp.button.url' in 'application.properties.'");
            }
            if (buttonUrl.contains("?")) {
                if (!buttonUrl.endsWith("&")) {
                    buttonUrl += "&";
                }
            } else {
                buttonUrl += "?";
            }
            buttonUrl += "loginName=" + loginName + "&systemId=" + systemId;
            String body = restTemplate.getForObject(buttonUrl, String.class);
            boundValueOperations.set(body, CacheKey.MINUTE_1, TimeUnit.SECONDS);
            json = body;
        }
        return GfJsonUtil.parseArray(json.toString(), ButtonModel.class);
    }
}