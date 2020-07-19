const low = require("lowdb");
const FileSync = require("lowdb/adapters/FileSync");

const adapter = new FileSync("db.json");
const db = low(adapter);

db.defaults({
  contacts: [
    {
      fingerPrint: "123456789",
      email: "harryadelb@gmail.com",
      mobile: "01026972326",
      firstName: "Erice",
      lastName: "Andre",
      createdAt: 1595182034050,
    },
    {
      fingerPrint: "123456789",
      email: "harryadelb@gmail.com",
      mobile: "02036551206",
      firstName: "Mikael",
      lastName: "Futhark",
      createdAt: 1595182934437,
    },
    {
      fingerPrint: "123456789",
      email: "jim@gmail.com",
      mobile: "01022999323",
      firstName: "Jim",
      lastName: "Brown",
      createdAt: 1595182936344,
    },
    {
      fingerPrint: "123456789",
      email: "jim@gmail.com",
      mobile: "01026971302",
      firstName: "Jim",
      lastName: "Brown",
      createdAt: 1595182951937,
    },
    {
      fingerPrint: "123456789",
      email: "jim@gmail.com",
      mobile: "01026971302",
      firstName: "Jim",
      lastName: "Brown",
      createdAt: 1595182952778,
    },
    {
      fingerPrint: "123456789",
      email: "ron@gmail.com",
      mobile: "01112971302",
      firstName: "Ron",
      lastName: "King",
      createdAt: 1595182952778,
    },
    {
      fingerPrint: "987654321",
      email: "ren@gmail.com",
      mobile: "01112971302",
      firstName: "Ron",
      lastName: "King",
      createdAt: 1595182952778,
    },
  ],
  users: [
    // user A
    {
      authorization:
        "ff34555392bcd3f268f74d29daf1f819336616f115a38f73318354b374763b05079c0ab18f68",
      deviceToken:
        "10b0c968654b27e0701ad2bf5772d1cdcffe8ea8149cd6506e3ffd35c8e36c6bcfe64116e47a217ae6b1f8cb908e067ae108c14f0077424712195aebf39c8cb747b7811891e201e1",
      fingerPrint: "123456789",
      name: "User A",
    },
    // user B
    {
      authorization:
        "ff34555392bcd3f268f74d29daf1f819336666b742938 c7e348516a568357a4648cb55f688520",
      deviceToken:
        "Ja5ce5c04fea6f000cfc29f9682f4a93f3aleed7019f7f5ae6b1df43863bd8bfa461106d4af442fa715297ef4daf769409882af4442365662a93abb93bcccc747c7014c4",
      fingerPrint: "987654321",
      name: "User B",
    },
  ],
}).write();

db._.mixin({
  updateOrAdd: function (arr, obj, arg) {
    let item;
    for (let i = 0; i < arr.length; i++) {
      for (let j = 0; j < arg.length; j++) {
        if (obj[arg[j]] !== arr[i][arg[j]]) {
          item = undefined;
          break;
        } else {
          item = i;
        }
      }
    }

    if (arr[item] === undefined) {
      arr.push(obj);
    } else {
      for (let key in arr[item]) {
        if (!obj[key]) {
          delete arr[item][key];
        }
      }

      Object.assign(arr[item], obj);
    }
    return arr;
  },
});

module.exports = db;
