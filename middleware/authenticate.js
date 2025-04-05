const isAuthenticated = (req, res, next) => {
    // if (!res.){
    //     return res.status(401).json("You do not have access.");
    // }
    const token = req.cookies?.token; // Verifica se o cookie "token" existe
    if (!token) {
        return res.status(401).json("You do not have access.");
    }
    next();
};

module.exports = {
    isAuthenticated
}