// // Rota para criar usuário
// router.post("/create-user", async (req, res) => {
//     const { email, password } = req.body;

//     if (!email || !password) {
//         return res.status(400).json({ error: "Email and password are required." });
//     }

//     try {
//         const result = await userControler.createUser(email, password);
//         return res.status(201).json(result);
//     } catch (error) {
//         console.error("Erro ao criar usuário:", error.message);
//         return res.status(400).json({ error: error.message });
//     }
// });

// // Rota para atualizar senha do usuário
// router.put("/update-user", async (req, res) => {
//     const { email, newPassword } = req.body;

//     if (!email || !newPassword) {
//         return res
//             .status(400)
//             .json({ error: "Email and new password are required." });
//     }

//     try {
//         const result = await updateUser(email, newPassword);
//         return res.status(200).json(result);
//     } catch (error) {
//         console.error("Error updating user:", error.message);
//         return res.status(400).json({ error: error.message });
//     }
// });

// // Rota para autenticar (login) do usuário
// router.post("/login", async (req, res) => {
//     const { email, password } = req.body;

//     if (!email || !password) {
//         return res.status(400).json({ error: "Email and password are required." });
//     }

//     try {
//         const result = await authenticateUser(email, password);
//         return res.status(200).json(result);
//     } catch (error) {
//         console.error("Error authenticating user:", error.message);
//         return res.status(400).json({ error: error.message });
//     }
// });

// //routes for user creation, login and logout


// router.get("/login-oauth", passport.authenticate("github"), (req, res) => {});

// router.get("/logout-oauth", function(req, res, next){
//     if (isAuthenticated){
//         req.logOut(function(err){
//             if (err) { return next(err);}
//         }); 
//         res.redirect("/");  
//     }
//     res.send("You are not logged in.");
    
// });