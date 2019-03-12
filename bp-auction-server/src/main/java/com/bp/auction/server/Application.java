package com.bp.auction.server;


import com.alibaba.dubbo.config.spring.context.annotation.EnableDubbo;
import com.bp.auction.common.queue.MessagePipeline;
import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.netflix.eureka.EnableEurekaClient;
import org.springframework.cloud.openfeign.EnableFeignClients;
import org.springframework.cloud.stream.annotation.EnableBinding;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.scheduling.annotation.EnableAsync;

/**
 * 启动类入口
 * @author zc
 * @version 1.0.0
 */
@SpringBootApplication
@EnableEurekaClient
@EnableFeignClients(basePackages = {"com.bp.auction.rpc"})
@ComponentScan("com.bp")
@MapperScan("com.bp.auction.server.dal.mapper")
@EnableBinding({MessagePipeline.class})
@EnableAsync
@EnableDubbo
public class Application {
    public static void main(String[] args) {
        SpringApplication.run(Application.class, args);
    }
}