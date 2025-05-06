db.createUser({
    user: MONGO_ROOT_USER,
    pwd: MONGO_ROOT_PASSWORD,  
    roles: [
      {
        role: "root",
        db: "admin"
      }
    ]
  });