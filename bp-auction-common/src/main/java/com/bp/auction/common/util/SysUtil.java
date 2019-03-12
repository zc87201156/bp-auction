package com.bp.auction.common.util;


import com.bp.auction.common.constants.Environment;
import org.apache.commons.lang.StringUtils;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.util.HashMap;
import java.util.Map;

/**
 * 系统工具类
 *
 * @author zc
 */
@Component
public class SysUtil {
    //默认不配,是正式环境
    private static String environment = "online";

    //static变量不能直接用 @value注入，需要通过set方法注入
    @Value("${custom.environment}")
    public void setEnvironment(String environment) {
        SysUtil.environment = environment;
    }

    /**
     * 返回当前系统所属的环境。灰度环境或正式环境
     *
     * @return
     */
    public static Environment getEnvironment() {
        return Environment.getByLabel(environment.toUpperCase());
    }
}
