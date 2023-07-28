
const tbody = document.querySelector('tbody')//渲染内容区域
//渲染学生基本信息
async function getStudentData() {
    const res = await axios({ url: 'student/list' })
    console.log(res.data.data);
    const str = res.data.data.reduce((a, { id, name, age, sex, group, phone, salary, truesalary, province }) => a + `
        <tr>
            <th scope="row">${id}</th>
            <td>${name}</td>
            <td>${age}</td>
            <td>${sex}</td>
            <td>${group}</td>
            <td>${phone}</td>
            <td>${salary}</td>
            <td>${truesalary}</td>
            <td>${province}</td>
            <td>
            <button type="button" class="btn btn-primary btn-sm" data-id=${id}>修改</button>
            <button type="button" class="btn btn-danger btn-sm" data-id=${id}>删除</button>
            </td>
        </tr>
    `, '')
    tbody.innerHTML = str
}
getStudentData()

const modal = new bootstrap.Modal('#addModal')//modal bootstrap对象
const addStudentBtn = document.querySelector('.show-modal-btn')//添加学员按钮
const form = document.querySelector('.add-form')//表单
const submitBtn = document.querySelector('.col-sm-10 .btn-primary')//确认按钮
const resetBtn = document.querySelector('.col-sm-10 .btn-secondary')//重置按钮
const addModalLabel = document.querySelector('#addModalLabel')//模态框标题

const province = document.querySelector('[name=province]')
const city = document.querySelector('[name=city]')
const county = document.querySelector('[name=county]')
//初始化 省市区 下拉列表
async function initializeProvince() {
    const res = await axios({ url: 'geo/province' })
    console.log(res);
    const str = res.data.reduce((a, b) => a + `<option>${b}</option>`, '<option>--省--</option>')
    province.innerHTML = str
}
initializeProvince()
province.addEventListener('change', async function () {
    const res = await axios({ url: 'geo/city', params: { pname: province.value } })
    const str = res.data.reduce((a, b) => a + `<option>${b}</option>`, '<option>--市--</option>')
    city.innerHTML = str
})
city.addEventListener('change', async function () {
    const res = await axios({ url: 'geo/county', params: { pname: province.value, cname: city.value } })
    const str = res.data.reduce((a, b) => a + `<option>${b}</option>`, '<option>--县--</option>')
    county.innerHTML = str
})
//点击添加学员
addStudentBtn.addEventListener('click', async function () {
    modal.show()//弹出模态框
})
//点击重置按钮重置表单
resetBtn.addEventListener('click', function () {
    form.reset()
})
//重置表单时重置下拉列表值
form.addEventListener('reset', function () {
    city.innerHTML = '<option>--市--</option>'
    county.innerHTML = '<option>--县--</option>'
})
//点击确认
submitBtn.addEventListener('click', async function (e) {
    e.preventDefault()
    const data = serialize(form, { hash: true, empty: true })
    const { id, age, name, phone, salary, truesalary } = data
    delete data.id
    console.log(data);
    //表单非空校验
    for (const key in data) {
        if (data[key] == '') {
            toastr.error('表单某项为空，请检查')
            return
        }
    }
    if (!/^[\u4E00-\u9FA5]{2,10}(·[\u4E00-\u9FA5]{2,10}){0,2}$/.test(name)) {
        toastr.error('姓名不符合规范2-10')
        return
    }
    if (!/^[0-9]{2}$/.test(age)) {
        toastr.error('年龄不符合规范')
        return
    }
    if (!/^[0-9]{11}$/.test(phone)) {
        toastr.error('手机号不符合规范11位')
        return
    }
    if (!/^(?:[1-9][0-9][0-9]{1,3}|99999)$/.test(salary)) {
        toastr.error('薪资不符合规范100-99999')
        return
    }
    if (province.value == '--省--' || city.value == '--市--' || county.value == '--县--') {
        toastr.error('表单某项为空，请检查')
        return
    }
    await axios({ url: 'student/add', method: 'post', data })
    toastr.success('操作成功')
    getStudentData()
})

//删除和表单回填
tbody.addEventListener('click', async function (e) {
    //删除学员
    if (e.target.classList.contains('btn-danger')) {
        if (confirm('您确定删除吗？')) {
            const { id } = e.target.dataset
            const res = await axios({ url: 'student/delete', method: 'delete', params: { id } })
            if (res.data.code === 0) {
                toastr.success(`${res.data.message}`)
            } else {
                toastr.error(`${res.data.message}`)
            }
        }
    }
    if (e.target.classList.contains('btn-primary')) {
        const { id } = e.target.dataset
        console.log(id);
        addModalLabel.innerText = '修改学员信息' //修改模态框标题
        modal.show()//弹出模态框
        //根据id获取学员详细信息
        const res = await axios({ url: 'student/one', params: { id } })
        const data = res.data.data
        //初始化省市县数据
        const cityRes = await axios({ url: 'geo/city', params: { pname: data.province } })
        const cityStr = cityRes.data.reduce((a, b) => a + `<option>${b}</option>`, '<option>--市--</option>')
        city.innerHTML = cityStr

        const countyRes = await axios({ url: 'geo/county', params: { pname: data.province, cname: data.city } })
        const countyStr = countyRes.data.reduce((a, b) => a + `<option>${b}</option>`, '<option>--县--</option>')
        county.innerHTML = countyStr
        //回填单选按钮
        document.querySelector(`.form-check-input[value='${data.sex}']`).checked = true
        //回填其他输入框
        form.querySelectorAll('[name]').forEach(a => {
            if (a.type !== 'radio') {
                a.value = data[a.name]
            }
        })
    }
})
