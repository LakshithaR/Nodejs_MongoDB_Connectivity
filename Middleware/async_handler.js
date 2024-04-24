const async_handler = (fx) => async(req,res,next) => {
    // return (req,res,next)=>{
    //     return Promise.resolve(fx(req,res,next)).catch(next);
    // }
    try {
        return await fx(req,res,next);
    } catch (error) {
        // res.json({
        //     Success: false,
        //     Message: error
        // });
        next(error);
    }
}

module.exports=async_handler;