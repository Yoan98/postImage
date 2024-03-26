let newName = "ANQUANRENZHENG(Saa11)@2X"
newName = newName.replace(/\s+/g, "");
    newName = newName.replace('@2X', "");
    newName = newName.replace('@1X', "");
    newName = newName.replace(/\([0-9a-z]*\)/gi, "");

console.log(newName)