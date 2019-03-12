package com.bp.auction.server.dal.mapper;

import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;

import java.util.List;

/**
 * 重置redis中数据库主键之用，上线后可删除
 * @author zwf
 */
public interface IdMapper {

	@Select("select max(id) from ${tableName}")
	Long getMaxId(@Param("tableName") String tableName);

	@Select("select table_name from information_schema.TABLES where TABLE_SCHEMA = #{databaseName}")
	List<String> getAllTableNames(@Param("databaseName") String databaseName);
}
