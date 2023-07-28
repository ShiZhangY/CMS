
const tbody = document.querySelector('tbody')
//渲染学员成绩
async function renderScoreData() {
    const res = await axios({ url: 'score/list' })
    const data = res.data.data
    console.log(data);
    let str = ''
    for (const key in data) {
        str += `<tr>
        <th scope="row">${key}</th>
        <td>${data[key].name}</td>
        <td class="score" data-batch="1">${data[key].score[0]}</td>
        <td class="score" data-batch="2">${data[key].score[1]}</td>
        <td class="score" data-batch="3">${data[key].score[2]}</td>
        <td class="score" data-batch="4">${data[key].score[3]}</td>
        <td class="score" data-batch="5">${data[key].score[4]}</td>
      </tr>`
    }
    tbody.innerHTML = str
}
renderScoreData()
//双击表格进入编辑状态
tbody.addEventListener('dblclick', function (e) {
    //获取表格原本的值
    if (e.target.classList.contains('score')) {
        let oldData = e.target.innerText
        const input = document.createElement('input')
        input.type = 'text'
        input.value = oldData
        input.setAttribute('data-id', `${e.target.parentNode.children[0].innerText}`)
        e.target.appendChild(input)
        input.style.display = 'block'
        document.querySelector('input').focus()
    }
})
//失去焦点事件
tbody.addEventListener('blur', async function (e) {
    try {
        if (e.target.tagName === 'INPUT') {
            const data = {
                "stu_id": e.target.dataset.id,
                "batch": e.target.parentNode.dataset.batch,
                "score": e.target.value
            }
            await axios({ url: 'score/entry', method: 'post', data })
            e.target.parentNode.removeChild(e.target);
            toastr.success('修改成功')
            setTimeout(() => {
                renderScoreData()
            }, 200);
        }
    } catch (error) {
        toastr.error('成绩必须1-100之间')
        console.dir(error);
    }

}, true)