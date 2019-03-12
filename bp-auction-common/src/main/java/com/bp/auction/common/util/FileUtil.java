package com.bp.auction.common.util;


import java.io.BufferedReader;
import java.io.File;
import java.io.FileReader;
import java.io.IOException;

/**
 * 类名称：FileUtil
 * 类描述：
 * 开发人：朱水平【Tank】
 * 创建时间：2019/1/8.17:59
 * 修改备注：
 *
 * @version 1.0.0
 */
public class FileUtil {

    public static String readFileByLines(String fileName) {
        File file = new File(fileName);
        BufferedReader reader = null;
        try {
            reader = new BufferedReader(new FileReader(file));
            String tempString = null;
            StringBuilder sb = new StringBuilder();
            while ((tempString = reader.readLine()) != null) {
                sb.append(tempString + "\n");
            }
            reader.close();
            return sb.toString();
        } catch (IOException e) {
            e.printStackTrace();
        } finally {
            if (reader != null) {
                try {
                    reader.close();
                } catch (IOException localIOException3) {
                }
            }
        }
        return null;
    }
}
