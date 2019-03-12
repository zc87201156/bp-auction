package com.bp.auction.admin;


import com.bp.auction.common.queue.MessagePipeline;
import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.netflix.eureka.EnableEurekaClient;
import org.springframework.cloud.stream.annotation.EnableBinding;
import org.springframework.context.annotation.ComponentScan;

/**
 * 启动类入口
 * @author zc
 * @version 1.0.0
 */
@SpringBootApplication
@EnableEurekaClient
@MapperScan("com.bp.auction.admin.dal.mapper")
@ComponentScan("com.bp")
@EnableBinding({MessagePipeline.class})
public class Application {

    public static void main(String[] args) {
        SpringApplication.run(Application.class, args);
    }
}