var logger = require('silence-log').get('silence.chainExecutor');

function create(fcts, callback){
	return function chainExecutor(req, res){
		var i = -1;
		function nexter(err) {
			i++;

			if (i === fcts.length) {
				callback && callback(err);
				return ;
			}

			if(i> fcts.length){
				var errMsg = "I'm asked to use nexter more times than there is fcts:" + (i+1) + ">" + fcts.length;
				logger.error(errMsg);
				return;
			}
			
			if ( (err && fcts[i].length === 3) || ( !err && fcts[i].length === 4)){
				logger.debug("Skipping "+fcts[i].name );
				return nexter(err);
			}

			logger.debug("Running handler "+fcts[i].name );
			try {
				if(err){
					return fcts[i](err, req, res, nexter);
				} else {
					return fcts[i](req, res, nexter);
				}
			} catch(e) {
				return nexter(e);
			}
		}
		nexter();
	};
}

module.exports = create;
