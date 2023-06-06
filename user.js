function Validator (options) {

    function getParentElement (element,selector)  {
        while(element.parentElement){
            if(element.parentElement.matches(selector)){
                return element.parentElement;
            }
            element = element.parentElement;
        }
    }
    
    var selectorRules = {};

    function Validate(inputElement, rule) {
       
        var errorElement=getParentElement(inputElement,options.formGroupSelector).querySelector(options.errorSelector);
        var messageError;
        var rules=selectorRules[rule.selector];
        
        for (var i=0; i<rules.length; i++) {
           
            messageError=rules[i](inputElement.value);
           
            if (messageError) break;
        };
        
        if (messageError) {
            errorElement.innerText=messageError;
            getParentElement(inputElement,options.formGroupSelector).classList.add('invalid');    
        }
        else {
            errorElement.innerText='';
            getParentElement(inputElement,options.formGroupSelector).classList.remove('invalid');
        }
        return !messageError;

    }
   
    var formElement= document.querySelector(options.form);  
    if (formElement) {
        formElement.onsubmit= (e) => {
            e.preventDefault();
            var isFormValid= true;
            options.rules.forEach ( (rule) =>{
                var inputElement= formElement.querySelector(rule.selector);
                var isValid=Validate(inputElement, rule);
                if (!isValid) {
                    isFormValid= false;
                }
            });
            if (isFormValid) {
                alert('Đăng ký tài khoản thành công')
            }
            else {
                alert('Đăng ký tài khoản thất bại')

            }
        };

        options.rules.forEach ( (rule) =>{
            var inputElement= formElement.querySelector(rule.selector);
        
            if (Array.isArray(selectorRules[rule.selector])){
                selectorRules[rule.selector].push(rule.test);
            }
           
            else {
                selectorRules[rule.selector]=[rule.test];
            }
            if (inputElement) {
                inputElement.onblur= () =>{
                    Validate(inputElement, rule);
                    
                }
                inputElement.oninput = () => {
                var errorElement=getParentElement(inputElement,options.formGroupSelector).querySelector(options.errorSelector);
                    errorElement.innerText='';
                    getParentElement(inputElement,options.formGroupSelector).classList.remove('invalid');
                }
                
            }
            
        });
    }
}

Validator.isRequired =  (selector,message) => {
    return {
        selector: selector,
        test:  (value) => {
            return value.trim()? undefined : message ||"Vui lòng nhập trường này"
        }
    }
}

Validator.isEmail =  (selector,message) =>  {
    return {
        selector: selector,
        test:  (value) => {
            var regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
            return regex.test(value)? undefined :message|| "Enter your email";
        }
    }
}

Validator.minLength =  (selector,min,message) => {
    return {
            selector: selector,
            test:  (value) => {
                return value.length>=min? undefined : message || `Vui lòng nhập tối thiểu ${min} ký tự`;
            }
        }
}
    
Validator.isConfirmed = (selector,getConfirmValue,message) => {
    return {
        selector: selector,
        test:  (value) => {
            return value === getConfirmValue() ?undefined :message || "Vui lòng nhập lại"
        }
    }
}
Validator({
    form:'#form_login',
    formGroupSelector:'.form-group',
    errorSelector:'.form-message',
    rules: [
    Validator.isEmail('#email',"Email is required"),
    Validator.isRequired('#password',"Enter your password"),
    Validator.minLength('#password',6),

]
});
$(document).ready(function () {
    $(document).on('click','#btnLogin',function (e) {
        e.preventDefault();
        $.ajax({
            url:'http://localhost:3000/users/login',
            method:'POST',
            dataType:'json',
            data:{
                email:$("#email").val(),
                password:$("#password").val(),
            },
            success:(data) =>{
                if(data.message === 'Auth successful') {
                    window.location.replace('http://localhost:5500/index.html');
                }
            }
        }).done(function(response,textStatus,jqXHR){
            alert("Login Successfully");
        }).fail(function(jqXHR,textStatus,errorThrown){
            alert("Wrong password or email");
        });
    });
    $(document).on('click','#btnSignup',function (e) {
        e.preventDefault();
        $.ajax({
            url:'http://localhost:3000/users/signup',
            method:'POST',
            dataType:'json',
            data:{
                email:$("#email").val(),
                password:$("#password").val(),
            },
            success:(data) =>{
                if(data.message === 'User created') {
                    window.location.replace('http://localhost:5500/login.html');
                } else {
                    alert(data.message);
                }
            }
        }).done(function(response,textStatus,jqXHR){
            alert("Signup Successfully");
        }).fail(function(jqXHR,textStatus,errorThrown){
            alert("Please Try Again");
        });
    });
});