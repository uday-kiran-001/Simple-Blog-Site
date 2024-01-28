
exports.getDescription= function (title, newBlogs){
    for(let index in newBlogs){
        if(newBlogs[index].title.toLowerCase()===title){
            return index;
        }
    }
    return -1;
}

// console.log(module.exports)

