
module.exports.isUuid = function (uuid) {
	if (!uuid) return false;
	uuid = uuid.toString().toLowerCase();
	return /[0-9a-f]{8}\-?[0-9a-f]{4}\-?4[0-9a-f]{3}\-?[89ab][0-9a-f]{3}\-?[0-9a-f]{12}/.test(uuid)
}


module.exports.isCookieCid = function (cid) {
	return /^[0-9]+\.[0-9]+$/.test(cid)
}


module.exports.ensureValidCid = function (uuid) {
	if (!this.isUuid(uuid)) {
		if (!this.isCookieCid(uuid)) {
			return false;
		}
		return uuid;
	}

	uuid = uuid.replace(/\-/g, "");
	return "" +
		uuid.substring(0, 8) + "-" +
		uuid.substring(8, 12) + "-" +
		uuid.substring(12, 16) + "-" +
		uuid.substring(16, 20) + "-" +
		uuid.substring(20);
}

module.exports.enhancedEcommerce = {
    _setProductParamValue: function (params, key, value, productIndex) {
		if (value) {
			params["pr" + productIndex + "" + key] = value;
		}
	},
	_setProductImpressionParamValue: function (params, key, value, listIndex, productIndex) {
		if (value) {
			params["il" + listIndex + "pi" + productIndex + "" + key] = value;
		}
    },
    setProductSKU: function (params, sku, productIndex = 1) {
        this._setProductParamValue(params, "id", sku, productIndex);
    },
    setProductName: function (params, name, productIndex = 1) {
        this._setProductParamValue(params, "nm", name, productIndex);
    },
    setProductBrand: function (params, brand, productIndex = 1) {
        this._setProductParamValue(params, "br", brand, productIndex);
    },
    setProductCategory: function (params, category, productIndex = 1) {
        this._setProductParamValue(params, "ca", category, productIndex);
    },
    setProductVariant: function (params, variant, productIndex = 1) {
        this._setProductParamValue(params, "va", variant, productIndex);
    },
    setProductPrice: function (params, price, productIndex = 1) {
        this._setProductParamValue(params, "pr", price, productIndex);
    },
    setProductQuantity: function (params, quantity, productIndex = 1) {
        this._setProductParamValue(params, "qt", quantity, productIndex);
    },
    setProductCouponCode: function (params, coupon, productIndex = 1) {
        this._setProductParamValue(params, "cc", coupon, productIndex);
    },
    setProductPosition: function (params, position, productIndex = 1) {
        this._setProductParamValue(params, "cc", position, productIndex);
    },
    setProductCustomDimension: function (params, value, productIndex = 1, dimension = 1) {
		this._setProductParamValue(params, "cd" + dimension, value, productIndex);
    },
    setProductCustomMetric: function (params, value, productIndex = 1, metric = 1) {
		this._setProductParamValue(params, "cm" + metric, value, productIndex);
    },
    setProductImpressionListName: function (params, listName, listIndex = 1) {
		if (listName) {
			params["il" + listIndex + "nm"] = listName;
		}
	},
	setProductImpressionSKU: function (params, sku, listIndex = 1, productIndex = 1) {
        this._setProductImpressionParamValue(params, "id", sku, listIndex, productIndex);
	},
	setProductImpressionName: function (params, name, listIndex = 1, productIndex = 1) {
        this._setProductImpressionParamValue(params, "nm", name, listIndex, productIndex);
	},
	setProductImpressionBrand: function (params, brand, listIndex = 1, productIndex = 1) {
        this._setProductImpressionParamValue(params, "br", brand, listIndex, productIndex);
	},
	setProductImpressionCategory: function (params, category, listIndex = 1, productIndex = 1) {
        this._setProductImpressionParamValue(params, "ca", category, listIndex, productIndex);
	},
	setProductImpressionVariant: function (params, variant, listIndex = 1, productIndex = 1) {
        this._setProductImpressionParamValue(params, "va", variant, listIndex, productIndex);
	},
	setProductImpressionPosition: function (params, position, listIndex = 1, productIndex = 1) {
        this._setProductImpressionParamValue(params, "ps", position, listIndex, productIndex);
	},
	setProductImpressionPrice: function (params, price, listIndex = 1, productIndex = 1) {
        this._setProductImpressionParamValue(params, "pr", price, listIndex, productIndex);
	},
	setProductImpressionCustomDimension: function (params, dimension, value, listIndex = 1, productIndex = 1) {
        this._setProductImpressionParamValue(params, "cd" + dimension, value, listIndex, productIndex);
	},
	setProductImpressionCustomDimension: function (params, metric, value, listIndex = 1, productIndex = 1) {
        this._setProductImpressionParamValue(params, "cm" + metric, value, listIndex, productIndex);
    }
};
