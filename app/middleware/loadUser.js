module.exports = function(req, res, next){

    req.user = res.locals.user = null;

    if(!req.session.isHaveAccess){
        return next();
    }else{
        req.user = res.locals.user = true;
    }

    next();

}