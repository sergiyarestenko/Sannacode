(function () {
    var testButton = document.querySelectorAll('.click-true');
      for (var i = 0,max = testButton.length; i < max; i ++){        addEventList(testButton[i]);
    }
    document.querySelector('#esc').addEventListener('click',escFunc);
    document.querySelector('#back').addEventListener('click',backFunc);
    document.addEventListener('keydown', onKeydown);
})();

function onKeydown() {
    document.querySelector('#in').focus();
}

function addEventList(el){
    el.addEventListener('click',clickButton);
}

function clickButton() {
    var inInput =  document.querySelector('#in');
    inInput.value = inInput.value + this.value;
    calculator(inInput.value);
}
function escFunc() {
    document.querySelector('#in').value = '';
    document.querySelector('#out').value = '';
}
function backFunc() {

    var inInput =  document.querySelector('#in'),
        currentValue = inInput.value;
        currentValue = currentValue.substring(0, currentValue.length - 1);
        inInput.value =  currentValue;
        calculator(inInput.value);
}
function showResurtCalc(res){
    if(!res){
        document.getElementById('in').classList.add('wrong');
        document.getElementById('out').value = 'wrong expression';
    }else{
        document.getElementById('in').classList.remove('wrong');
        if(!(res[0] != res[0])){
            document.getElementById('out').value = res[0];
        }
    }
}
function calculator(expression){
    var arr = [];
    if(leadUpArr()){
        findNum();
        findBrackets();
    }
    function leadUpArr(){
        expression = expression.replace(/\s/g,'');
        for (var i = 0; i < expression.length; i ++){
            if(isNaN(+expression[i])){
                if(expression[i] == '('|| expression[i] == ')'|| expression[i] == '*'||expression[i] == '/'|| expression[i] == '+'|| expression[i] == '-'|| expression[i] == '.'|| expression[i] == ','){
                    if(expression[i] == ','){
                        arr.push('.');
                    }else{
                        arr.push(expression[i]);
                    }
                }else{
                    showResurtCalc(false);
                    return false;
                }
            }else{
                arr.push(expression[i]);
            }
        }
        return true;
    }
    function findNum(){
        for(var i = 0; i < arr.length; i ++){

            if(!isNaN(arr[i]) && !isNaN(arr[i+1])||!isNaN(arr[i]) && (arr[i+1]) == '.'){
                arr[i] = arr[i].toString() + arr[i+1].toString();
                arr.splice(i+1, 1);
                findNum();
            }
        }
    }

    function findBrackets(){

        if(checkBrackets()){

            var a = false,
                b = false;
            for(var i = 0; i < arr.length; i ++){
                if(arr[i] == '('){
                    a = i;
                }
                if(arr[i] == ')'){
                    b = i;
                }
                if(a===0&&b||a&&b){
                    return cutBrackets(a,b);
                }
            }
            lastCalc(arr);
        }else{

            showResurtCalc(false);
        }
    }

    function checkBrackets(){ //проверка, что все скобкм на месте
        var a = 0,
            b = 0,
            f = true;
        for(var i = 0; i < arr.length; i ++){
            if(arr[i] == '('){
                a++;
                if(i>0 && !isNaN(+arr[i-1])){//ПРОВЕРКА ЗНАКА ПЕРЕД СКОБКОЙ
                    f = false;
                }
            }
            if(arr[i] == ')'){
                b++;
            }
        }

        if(a == b && f){
            return true;
        }else{
            return false;
        }
    }
    function checkFirstSign(arr){//первый знак не может быть умоножением или делением
        if(!isNaN(arr[0])){
            return arr;
        }else if(arr[0] == '-'){
            arr[1] = (+arr[1]*-1);
            arr.splice(0, 1);

            return arr;
        }else if(arr[0] == '+'){
            arr.splice(0, 1);
            return arr;

        }else{
            return false;
        }
    }
    function cutBrackets(start, end){

        var temp = [];
        for (var i = start+1; i < end; i ++ ){
            temp.push(arr[i])
        }
        temp = checkFirstSign(temp);

        if(!temp){
            return showResurtCalc(false);//проверка деления на ноль сработала
        }
        if(!calc(temp)){
            return showResurtCalc(false);//проверка деления на ноль сработала
        }else{
            calc(temp);
            arr[start] = temp[0];
            arr.splice(start+1,end-start);
;
            findBrackets();
        }
    }

    function lastCalc(arr){
        arr = checkFirstSign(arr);
        if(!calc(arr)){
            return showResurtCalc(false);//проверка деления на ноль сработала
        }else{
            showResurtCalc(calc(arr));
        }
    }

    //calculation funcs
    function calc(arr){
        if(!findDivision(arr)){
            return false;	//проверка деления на ноль сработала
        }else{
            arr = findDivision(arr);
            arr = findMult(arr);
            arr = findAdd(arr);
            arr = findSub(arr);
            return arr;
        }
    }
    function findMult(arr){
        for (var i = 0; i < arr.length; i ++){
            if (arr[i] == '*'){
                return mult(arr);
            }
        }
        return arr;
    }
    function mult(arr){
        for(var i = 0; i < arr.length; i++){
            if(arr[i] == "*"){
                arr[i-1] = +arr[i-1] * +arr[i+1];
                arr.splice(i,2);
                return findMult(arr);
            }
        }
    }
    function findDivision(arr){
        for (var i = 0; i < arr.length; i ++){
            if (arr[i] == '/'){
                return division(arr);
            }
        }
        return arr;
    }
    function division(arr){
        for(var i = 0; i < arr.length; i++){
            if(arr[i] == "/"){
                if(+arr[i+1] == 0){
                    return false;

                }
                arr[i-1] = +arr[i-1] / +arr[i+1];
                arr.splice(i,2);
                return findDivision(arr);
            }
        }
    }
    function findAdd(arr){
        for (var i = 0; i < arr.length; i ++){
            if (arr[i] == '+'){
                return addition(arr);
            }
        }
        return arr;
    }
    function addition(arr){
        for(var i = 0; i < arr.length; i++){
            if(arr[i] == "+"){
                arr[i-1] = +arr[i-1] + +arr[i+1];
                arr.splice(i,2);
                return findAdd(arr);
            }
        }
    }
    function findSub(arr){
        for (var i = 0; i < arr.length; i ++){
            if (arr[i] == '-'){
                return substraction(arr);
            }
        }
        return arr;
    }
    function substraction(arr){
        for(var i = 0; i < arr.length; i++){
            if(arr[i] == "-"){
                arr[i-1] = +arr[i-1] - +arr[i+1];
                arr.splice(i,2);
                return findSub(arr);
            }
        }
    }
}
