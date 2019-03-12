package com.bp.auction.common.util;

import java.io.File;
import java.util.HashMap;
import java.util.Map;

/**
 * 类名称：LuaScriptCache
 * 类描述：
 * 开发人：朱水平【Tank】
 * 创建时间：2019/1/8.18:04
 * 修改备注：
 *
 * @version 1.0.0
 */
public class LuaScriptCache {

    private static Map<String, String> scriptCache = new HashMap();
    static {
        String rootPath = LuaScriptCache.class.getResource("/lua").getPath();
        File file = new File(rootPath);
        String[] filelist = file.list();
        for (int i = 0; i < filelist.length; i++) {
            String filePath = rootPath + "\\" + filelist[i];
            String key = filelist[i].substring(0, filelist[i].length() - 4);
            String value = FileUtil.readFileByLines(filePath);
            scriptCache.put(key, value);
        }
    }

    public static String getScriptByName(String scriptName) {
        if (scriptCache.containsKey(scriptName)) {
            return (String) scriptCache.get(scriptName);
        }
        return null;
    }
}
