module.exports = {
	// Para resolver um problema com as paths relativas da AWS
	resolve: {
		fallback: {
			util: require.resolve("util/"),
		},
	},
};
