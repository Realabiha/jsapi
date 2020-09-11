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
// 访问器属性/数据属性 特性 [[attr]]
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

// 组合式继承(构造函数+原型)
function SuperType(name){
    this.name = name;
    this.friends = ['yancun'];
}
SuperType.prototype.sayFriends = function(){
    console.log(this.friends.join('|'));
}
function SubType(name, age){
    SuperType.call(this, name);
    this.age = age;
}
SubType.prototype = new SuperType();
SubType.prototype.constructor = SubType;
SubType.prototype.sayAge = function(){
    console.log(this.age);
}
// Object.create
function Create(o,des){
    F.prototype = o;
    function F(){}
    const f = new F();
    Object.defineProperties(f, des);
    return f;
}


// Promise
class XY{

    // 内置的三种状态
    static PENDING = 'PENDING';
    static RESOLVE = 'RESOLVE';
    static REJECT = 'REJECT';

    constructor(excutor){
        this.state = XY.PENDING;
        this.value = null;
        this.cbs = [];
        try {
            excutor(this.resolve, this.reject)
        } catch (error) {
            this.reject(error.message);
        }
    }

    resolve = value => {
        // 只有默认状态时才能改变
        if(this.state === XY.PENDING){
            this.state = XY.RESOLVE;
            this.value = value;
            setTimeout(_ => {
                this.cbs.forEach(obj => obj.onResolved(value));
            })   
        } 
    }

    reject = reason => {
        if(this.state === XY.PENDING){
            this.state = XY.REJECT;
            this.value = reason;
            setTimeout(_ => {
                this.cbs.forEach(obj => obj.onRejected(reason));
            })
        }
    }

    then = (onResolved, onRejected) => {
        // 参数容错
        onResolved = typeof onResolved === 'function' ? onResolved : _ => {};
        onRejected = typeof onRejected === 'function' ? onRejected : _ => {};
     
        
        // 新的promise状态和之前的promise是相互独立的
        return new XY((resolve, reject) => {
            // 状态改变异步
            // onResolved/onRejected先暂时存起来
            if(this.state === XY.PENDING){
                this.cbs.push({
                    onResolved: value => {
                        try {
                            resolve( onResolved(value) );
                        } catch (error) {
                            console.log(error)
                            reject(error.message);
                        }
                    }, 
                    onRejected: reason => {
                        try {
                            resolve( onRejected(reason) );
                        } catch (error) {
                            reject(error.message);
                        }
                    }
                });
            }
            // 状态改变是同步
            // 只有状态非默认时onResolved/onRejected才能执行
            if(this.state === XY.RESOLVE){
                // 保证异步执行
                setTimeout( _ => {
                    try {
                        resolve( onResolved(this.value) );
                    } catch (error) {
                        reject(error.message);                
                    }
                })
            }
            if(this.state === XY.REJECT){
                setTimeout(_ => {
                    try {
                        resolve( onRejected(this.value) );
                    } catch (error) {
                        reject(error.message);
                    }
                })
            }
        })
    }
}