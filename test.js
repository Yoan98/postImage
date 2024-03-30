let newName = "tongzhi@2x"
newName = newName.replace(/\s+/g, "");
    newName = newName.replace(/(\@2x|\@1x)/gi, "");
    newName = newName.replace(/\([0-9a-z]*\)/gi, "");

console.log(newName)