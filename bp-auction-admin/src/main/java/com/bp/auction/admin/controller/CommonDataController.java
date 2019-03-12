package com.bp.auction.admin.controller;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;

import com.bp.auction.common.constants.*;
import com.bp.core.response.ResponseBean;
import com.bp.core.utils.file.FastDFSUtils;
import com.bp.core.utils.type.MapUtils;
import com.bp.core.web.base.ExtJsController;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

/**
 * 通用数据接口
 *
 * @author zwf
 */
@RestController
@RequestMapping("/auction/admin/common/data")
public class CommonDataController extends ExtJsController {
    /**
     * 返回当前服务器时间
     *
     * @return
     */
    @RequestMapping("/getServerTime")
    public Object getServerTime() {
        return responseSuccess(System.currentTimeMillis());
    }

    @Autowired
    private FastDFSUtils fastDFSUtils;

    /**
     * 获取所有的渠道
     *
     * @return
     */
    /*@RequestMapping("/getAllChannels")
    public Object getAllChannels() {
		JSONObject json = getRequestJson();
		long start = json.getLongValue("start");
		long length = json.getLongValue("limit");
		if (length == 0L) {
			length = 20L;
		}

		String keyword = null;
		JSONObject data = json.getJSONObject("data");
		if (data != null) {
			keyword = data.getString("data");
		}
		ChannelInfoDto dto = new ChannelInfoDto();
		if (StringUtils.isNotBlank(keyword)) {
			keyword = keyword.trim();
			if (NumberUtils.isDigits(keyword)) {
				dto.setId(NumberUtils.toLong(keyword));
			} else {
				dto.setName(keyword);
			}
		}

		PageDto<ChannelInfoDto> page = new PageDto<>(dto, start, length);
		page = channelRpcService.find(page);

		DataGrid<ChannelInfoDto> dataGrid = new DataGrid<>();
		dataGrid.setData(page.getData());
		dataGrid.setSuccess(true);
		dataGrid.setTotal(page.getTotal());
		return dataGrid;
	}*/

    /**
     * 获取所有的拍卖状态列表
     *
     * @return
     */
    @RequestMapping("/auctionStatusList")
    public Object auctionStatusList() {
        JSONArray jsonArray = new JSONArray();
        for (AuctionStatus status : AuctionStatus.values()) {
            JSONObject json = newJsonObj(status.getValue(), status.getLabel());
            jsonArray.add(json);
        }
        return jsonArray;
    }

    /**
     * 获取所有的支付状态列表
     *
     * @return
     */
    @RequestMapping("/paymentStatusList")
    public Object paymentStatusList() {
        JSONArray jsonArray = new JSONArray();
        for (PaymentStatus status : PaymentStatus.values()) {
            JSONObject json = newJsonObj(status.getValue(), status.getLabel());
            jsonArray.add(json);
        }
        return jsonArray;
    }

    /**
     * 获取所有的状态列表
     *
     * @return
     */
    @RequestMapping("/statusList")
    public Object statusList() {
        JSONArray jsonArray = new JSONArray();
        for (Status status : Status.values()) {
            JSONObject json = newJsonObj(status.getValue(), status.getLabel());
            jsonArray.add(json);
        }
        return jsonArray;
    }

    /**
     * 获取所有的环境列表
     *
     * @return
     */
    @RequestMapping("/environmentList")
    public Object environmentList() {
        JSONArray jsonArray = new JSONArray();
        for (Environment env : Environment.values()) {
            JSONObject json = newJsonObj(env.getValue(), env.getLabel());
            jsonArray.add(json);
        }
        return jsonArray;
    }

    /**
     * 获取所有的发货状态列表
     *
     * @return
     */
    @RequestMapping("/deliveryStatusList")
    public Object deliveryStatusList() {
        JSONArray jsonArray = new JSONArray();
        for (DeliveryStatus ds : DeliveryStatus.values()) {
            JSONObject json = newJsonObj(ds.getValue(), ds.getLabel());
            jsonArray.add(json);
        }
        return jsonArray;
    }

    /***
     * 获取拍卖类型列表
     * @return
     */
    @RequestMapping("/auctionTypeList")
    public Object auctionTypeList() {
        JSONArray jsonArray = new JSONArray();
        for (AuctionType at : AuctionType.values()) {
            JSONObject json = newJsonObj(at.getValue(), at.getLabel());
            jsonArray.add(json);
        }
        return jsonArray;
    }

    /***
     * 获取滚拍状态列表
     * @return
     */
    @RequestMapping("/rollAuctionStatusList")
    public Object rollAuctionStatusList() {
        JSONArray jsonArray = new JSONArray();
        for (RollAuctionStatus at : RollAuctionStatus.values()) {
            JSONObject json = newJsonObj(at.getValue(), at.getLabel());
            jsonArray.add(json);
        }
        return jsonArray;
    }

    /**
     * 获取滚拍类型列表
     *
     * @return
     */
    @RequestMapping("/rollAuctionTypeList")
    public Object rollAuctionTypeList() {
        JSONArray jsonArray = new JSONArray();
        for (RollAuctionType rt : RollAuctionType.values()) {
            JSONObject json = newJsonObj(rt.getValue(), rt.getLabel());
            jsonArray.add(json);
        }
        return jsonArray;
    }

    /**
     * 获取拍卖场次类型列表
     *
     * @return
     */
    @RequestMapping("auctionClassList")
    public Object auctionClassList() {
        JSONArray jsonArray = new JSONArray();
        for (AuctionClass ac : AuctionClass.values()) {
            JSONObject json = newJsonObj(ac.getValue(), ac.getLabel());
            jsonArray.add(json);
        }
        return jsonArray;
    }


    private static JSONObject newJsonObj(Object id, Object name) {
        JSONObject jsonObj = new JSONObject();
        jsonObj.put("id", id);
        jsonObj.put("name", name);

        return jsonObj;
    }

    /***
     * 上传图片(调fs图片同步)
     * @param imgFile
     * @return
     */
    @RequestMapping("/uploadImage")
    public ResponseBean uploadImage(MultipartFile imgFile) {
        String path = fastDFSUtils.uploadFile(imgFile);
        return responseSuccess(MapUtils.toMap("data", path, "url", fastDFSUtils.getDomainUri(path)));
    }
}
