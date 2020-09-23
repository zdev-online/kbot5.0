const fs = require('fs');

module.exports.findOBJ = function(array, key, value){
    if(!Array.isArray(array)){ throw Error('It\'s isn\'t array!');}
    for(let i = 0; i < array.length; i++){
        if(array[i][key] == value){
            return {
                ind: i,
                arr: array,
                el: array[i]
            };
        }
    }
    return false;
}

module.exports.getClanCFG = function(key){
    let data = JSON.parse(fs.readFileSync(`${__dirname}\\..\\vk\\clan.config.json`));
    return data[key] || false; 
}
module.exports.setClanCFG = function(key, value){
    let data = JSON.parse(fs.readFileSync(`${__dirname}\\..\\vk\\clan.config.json`));
    data[key] = value;
    fs.writeFileSync(`${__dirname}\\..\\vk\\clan.config.json`, JSON.stringify(data, '', 4));
    return data;
}