
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
    console.log(res);
    const str = res.data.reduce((a, b) => a + `<option>${b}</option>`, '<option>--市--</option>')
    city.innerHTML = str
})
city.addEventListener('change', async function () {
    const res = await axios({ url: 'geo/county', params: { pname: province.value, cname: city.value } })
    console.log(res);
    const str = res.data.reduce((a, b) => a + `<option>${b}</option>`, '<option>--县--</option>')
    county.innerHTML = str
})
//添加学员
addStudentBtn.addEventListener('click', async function () {
    modal.show()

})
