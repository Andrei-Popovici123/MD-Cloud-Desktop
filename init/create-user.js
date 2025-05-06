db = db.getSiblingDB("MetadefenderCloudDesktopDB");

db.createUser({
  user: "serviceUser",
  pwd: "parola01",
  roles: [
    {
      role: "readWrite",
      db: "MetadefenderCloudDesktopDB"
    }
  ]
});