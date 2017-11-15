const json = function(res, err, result){
    if(err){
        return res.jsonp({error: true, result: result,});
    }else{
        return res.jsonp({error: false, result: result,});
    }
};

module.exports = json;