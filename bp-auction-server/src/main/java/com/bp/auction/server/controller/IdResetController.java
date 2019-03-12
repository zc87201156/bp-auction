package com.bp.auction.server.controller;

import com.bp.auction.server.controller.request.IdResetRequest;
import com.bp.auction.server.dal.mapper.IdMapper;
import com.bp.core.response.ResponseBean;
import com.bp.core.web.base.BaseController;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.validation.Valid;
import java.util.ArrayList;
import java.util.List;

/**
 * @author zwf
 */
@RestController
@RequestMapping("/auction/api/secret/id")
public class IdResetController extends BaseController {

	@Autowired
	private IdMapper idMapper;

	@Autowired
	private RedisTemplate redisTemplate;

	private static final String PASSWORD = "1sd34!@#dfD&^*2f()6Bx7%GFDM6xd~@!";

	private static final String REDIS_ID_PREFIX = "generate_id_bp_auction_";

	@PostMapping("/reset")
	public ResponseBean reset(@RequestBody @Valid IdResetRequest request) {
		if (!PASSWORD.equals(request.getPassword())) {
			return responseError("validator failed");
		}

		List<String> result = new ArrayList<>();
		List<String> tables = idMapper.getAllTableNames(request.getDbName());
		for (String table : tables) {
			Long maxId = idMapper.getMaxId(table);
			if (maxId != null) {
				String key = REDIS_ID_PREFIX + table;
				redisTemplate.boundValueOps(key).set(maxId.intValue());
				result.add(key + "->" + maxId);
			}
		}
		return responseSuccess(result);
	}
}
