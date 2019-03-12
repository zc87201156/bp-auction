package com.bp.auction.server.config;

import com.fasterxml.jackson.databind.SerializationFeature;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.converter.json.Jackson2ObjectMapperBuilder;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurationSupport;

/***
 * @Author: zc
 * @Date : 2019/3/1
 * @Description: 拦截给前端用户的返回请求
 **/
@Configuration
public class WebAppConfig extends WebMvcConfigurationSupport {
    @Bean
    public Jackson2ObjectMapperBuilder objectMapperBuilder() {
        Jackson2ObjectMapperBuilder builder = new Jackson2ObjectMapperBuilder();
        //jackson自动将日期类型转成时间戳
        builder.featuresToEnable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);
        return builder;
    }
}