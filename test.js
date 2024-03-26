let newName = "ANQUANRENZHENG()@2X"
newName = newName.replace(/\s+/g, "");
    newName = newName.replace('@2X', "");
    newName = newName.replace('@1X', "");
    newName = newName.replace(/\([0-9]*\)/, "");

console.log(newName)