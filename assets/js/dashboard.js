//判断是否带有token
checkLogin()

const initialize = document.querySelector('.initialize')
//发送请求获取数据
initialize.addEventListener('click', function () {
    axios({
        url: 'init/data',
    }).then(res => {
        console.log(res);
    }).catch(error => {
        console.dir(error);
    })
})