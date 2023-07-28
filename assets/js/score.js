
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
        <td class="score">${data[key].score[0]}</td>
        <td class="score">${data[key].score[1]}</td>
        <td class="score">${data[key].score[2]}</td>
        <td class="score">${data[key].score[3]}</td>
        <td class="score">${data[key].score[4]}</td>
      </tr>`
    }
    tbody.innerHTML = str
}
renderScoreData()

//双击表格进入编辑状态