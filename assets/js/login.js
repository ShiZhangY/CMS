const registerBox = document.querySelector('.register.box')//注册框
const loginBox = document.querySelector('.login.box')//登录框
const registerA = document.querySelector('.register-a')//去登录
const loginA = document.querySelector('.login-a')//去注册

//切换登录注册
registerBox.style.display = 'none'
registerA.addEventListener('click', function (e) {
    e.preventDefault()
    registerBox.style.display = 'none'
    loginBox.style.display = 'block'
})
loginA.addEventListener('click', function (e) {
    e.preventDefault()
    registerBox.style.display = 'block'
    loginBox.style.display = 'none'
})

const loginBtn = document.querySelector('.login .btn-primary')//登录按钮
const loginForm = document.querySelector('.login form.container')//登录表单
const registerBtn = document.querySelector('.register .btn-primary')//注册按钮
const registerForm = document.querySelector('.register form.container')//注册表单

loginBtn.addEventListener('click', function (e) {
    e.preventDefault()
    let data = serialize(loginForm, { hash: true, empty: true })
    if (!(/[a-zA-Z0-9_]{2,15}/).test(data.username)) {
        toastr.error('请检查用户名2-15')
        return
    }
    if (!(/[a-zA-Z0-9_]{6,15}/).test(data.password)) {
        toastr.error('请检查密码6-15')
        return
    }
    axios({
        method: 'post',
        url: 'api/login',
        data
    }).then(res => {
        if (res.data.code == 0) {
            toastr.success('登录成功')
            setTimeout(() => {
                location.href = 'dashboard.html'
            }, 1000);
        } else {
            toastr.error(`${res.data.message}`)
        }
    }).catch(error => {
        console.dir(error);
    })
})
registerBtn.addEventListener('click', function (e) {
    e.preventDefault()
    let data = serialize(registerForm, { hash: true, empty: true })
    if (!(/[a-zA-Z0-9_]{2,15}/).test(data.username)) {
        toastr.error('请检查用户名2-15')
        return
    }
    if (!(/[a-zA-Z0-9_]{6,15}/).test(data.password)) {
        toastr.error('请检查密码6-15')
        return
    }
    axios({
        method: 'post',
        url: 'api/register',
        data
    }).then(res => {
        if (res.data.code == 0) {
            toastr.success('注册成功')
            setTimeout(() => {
                registerBox.style.display = 'none'
                loginBox.style.display = 'block'
            }, 1000);
        } else {
            toastr.error(`${res.data.message}`)
        }
        console.log(res);
    }).catch(error => {
        close.log(error)
    })
})