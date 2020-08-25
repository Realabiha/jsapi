// 防抖
function debounce(cb, delay){
    let timer;
    return function (){
        const later = function(){
            cb()
        }
        clearTimeout(timer);
        timer = setTimeout(later, delay)
    }
}
// 节流
function throtte(cb, delay){
    let flag = false
    return function(){
        if(flag) return;
        cb();
        flag = true;
        setTimeout(_=>{
            flag = false
        }, delay)
    }
}
// 对象拷贝  JSON
function cloneObj(target = {}, source, deep = false, toString = Object.prototype.toString){
    if(!deep){
        target = source;
        return target;
    }
    for(let key in source){
        if(!source.hasOwnProperty(key)) continue;
        if(typeof source[key] !== 'object'){
            target[key] = source[key];
        }
        else if(toString.call(source[key]) == "[object Array]"){
            target[key] = [];
            deepClone(target[key], source[key]);
        }
        else if(toString.call(source[key]) == "[object Object]"){
            target[key] = {};
            deepClone(target[key], source[key]);
        }
    }
    return target;
    // Object.keys().forEach()
    // instanceof 引用类型判断
    // JSON 快速深克隆对象数组
    // Object.assign 浅克隆
    // ... 展开运算符 浅克隆
    // concat 快速克隆一个简单数组(引用类型浅克隆)或者一个字串
}
// 函数拷贝
function cloneFun(source){
    let context = this;
    let target = function(){
        const args = arguments;
        return source.apply(context, args);
    }
    target.prototype = source.prototype;
    for(let prop in source){
        if(!source.hasOwnProperty(prop) || prop == 'prototype') continue;
        target[key] = source[key];
    }
    return target;
}
// 事件委托
function delegate(type, parent, selector,  cb){
    parent.addEventListener(type, e => {
        let node = e.target;
        // while(!node.matches(selector)){
        //     node = node.parentNode;
        // }
        // node && cb.call(node, e);
        // return node;

        try {
            while(node.matches){
                if(node.matches(selector)){
                    cb.call(node, e);
                }else{
                    node = node.parentNode;
                }
            }
        } catch (error) {
            console.log(error);
        }
    })
}
// reduce
Array.prototype.$reduce = function(cb, init){
    let i = 0;
    if(init === undefined){
        i = 1;
        init = this[0];
    }
    for(; i < this.length; i++){
        console.log(init, i, this[i]);
       init = cb(init, this[i], i, this);
    }
    return init;
}
// htmlstr replace
function htmlEscape(str){
    str.replace(/[<>"&]/g, function(match, pos, str){
        switch(match){
            case '<': return '&lt;'; 
            case '>': return '&gt;'
            case '"': return '&quot;';
            case '&': return '&amp;';
            default: return match;
        }
    })
}
// getRange min max
function getRange(min, max){
    const range = Math.abs(min-max)+1;
    return Math.floor(Math.random()*range+min);
}
let book = {
    _year: 2020,
    edition: 1,
}
Object.defineProperty(book, 'year', {
    get(){
        return this._year;
    },
    set(value){
        if(value>2020){
            this._year = value;
            this.edition = value - 2020 + 1;
            return value;
        }
    }
})
console.log(book.year);
book.year = 2021;
console.dir(book);