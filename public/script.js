const btn = document.querySelector("button");

// async function query() {

//     // const query = await fetch("http://localhost:3000/events/all", {
//     const query = await fetch("https://alekseirizchkov.amocrm.ru/api/v4/leads", {
//         mode: "no-cors",
//         method: "get",
//         headers: {
//             "Content-Type": "application/json",
//             "Access-Control-Allow-Origin": "*",
//             "Authorization": "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImp0aSI6ImQ0ZDUxYmNjZDc0YjY3Y2MyODkyMGY5NDkzZmRlN2U1ZTRhZjc0ZjkwODgxMDM3YTM0NDlhN2RjOWExMjY0ZjY3OWQ5MmQ1OWEwZThlYmJjIn0.eyJhdWQiOiI1YjY5NmFiYy0wYTI3LTQ5ODMtOTg5ZS1jM2FiYzZlZTBlMjQiLCJqdGkiOiJkNGQ1MWJjY2Q3NGI2N2NjMjg5MjBmOTQ5M2ZkZTdlNWU0YWY3NGY5MDg4MTAzN2EzNDQ5YTdkYzlhMTI2NGY2NzlkOTJkNTlhMGU4ZWJiYyIsImlhdCI6MTY2MTcxMDA0MSwibmJmIjoxNjYxNzEwMDQxLCJleHAiOjE2NjE3OTY0NDEsInN1YiI6Ijg0OTkzMTkiLCJhY2NvdW50X2lkIjozMDM2MzE0OCwic2NvcGVzIjpbInB1c2hfbm90aWZpY2F0aW9ucyIsImZpbGVzIiwiY3JtIiwiZmlsZXNfZGVsZXRlIiwibm90aWZpY2F0aW9ucyJdfQ.HSTTM_AIRVVSeeRK-Br7cfxpeJke-OZpVvZXl4Py5yn0l0-nweoq_cq9xvU4tf24rsIPE6QYb-XCWDBCRBzGbTjIh4HnxSfTvoximh6cOpqFg2ud_8qwLi11PIisiIJ3Kyxgj32ei2ndek6aOLQWuG7PMql8kgazvpqqB1_vnzxRpzLblKkO1O2uw2RVfufnlCnNTOOJhslfcczfdy2eu1hMoIO4MaAIOudeyNDMj2hHxPZM_NwPn_nKdpELw4LBIOJCL5fM1s1SG1hHFJPRZTMkZr4T1PYw_lzO3tjXB00cASsuXDqIN92z8F5E-iiPxmfXNWJ9z6XwSat-ZOw31w",
        
//         }
//     })
//     console.log(query.text())
//     const response = await query.text()
//     console.log(response)
//     console.log(111) 
//     console.log(JSON.stringify(query))
// }
// query()

var myHeaders = new Headers();
myHeaders.append("Content-Type", "application/json");
myHeaders.append("Authorization", "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImp0aSI6ImQ0ZDUxYmNjZDc0YjY3Y2MyODkyMGY5NDkzZmRlN2U1ZTRhZjc0ZjkwODgxMDM3YTM0NDlhN2RjOWExMjY0ZjY3OWQ5MmQ1OWEwZThlYmJjIn0.eyJhdWQiOiI1YjY5NmFiYy0wYTI3LTQ5ODMtOTg5ZS1jM2FiYzZlZTBlMjQiLCJqdGkiOiJkNGQ1MWJjY2Q3NGI2N2NjMjg5MjBmOTQ5M2ZkZTdlNWU0YWY3NGY5MDg4MTAzN2EzNDQ5YTdkYzlhMTI2NGY2NzlkOTJkNTlhMGU4ZWJiYyIsImlhdCI6MTY2MTcxMDA0MSwibmJmIjoxNjYxNzEwMDQxLCJleHAiOjE2NjE3OTY0NDEsInN1YiI6Ijg0OTkzMTkiLCJhY2NvdW50X2lkIjozMDM2MzE0OCwic2NvcGVzIjpbInB1c2hfbm90aWZpY2F0aW9ucyIsImZpbGVzIiwiY3JtIiwiZmlsZXNfZGVsZXRlIiwibm90aWZpY2F0aW9ucyJdfQ.HSTTM_AIRVVSeeRK-Br7cfxpeJke-OZpVvZXl4Py5yn0l0-nweoq_cq9xvU4tf24rsIPE6QYb-XCWDBCRBzGbTjIh4HnxSfTvoximh6cOpqFg2ud_8qwLi11PIisiIJ3Kyxgj32ei2ndek6aOLQWuG7PMql8kgazvpqqB1_vnzxRpzLblKkO1O2uw2RVfufnlCnNTOOJhslfcczfdy2eu1hMoIO4MaAIOudeyNDMj2hHxPZM_NwPn_nKdpELw4LBIOJCL5fM1s1SG1hHFJPRZTMkZr4T1PYw_lzO3tjXB00cASsuXDqIN92z8F5E-iiPxmfXNWJ9z6XwSat-ZOw31w");
myHeaders.append("Cookie", "session_id=j56m9g5hhh9lrolqg0unvohm8j; user_lang=ru; csrf_token=def50200d5b8d0948f0e4652b58455d38180db224d58ef6e7e599f15543411f483cc775e7bc1911204f68db961c9e682ffdf2bc34812c21ae6e0ff66c4294316db8516e09c4dcba339c6fe9292bd6985868c9d7995cfebad31521aaeb7ec8f7968e5121a6bbf073b5912547d62ef8c35bf05cc7efa024c64fda9fa01c9c40d3924e706c455bea4059ab2b17efac9d6ee86f3fc4dc1033bc0ca2045f9ce1a248653428821a9582964d650a9d2053b5bb42c5e76a3fc4e65dea6bae604b049a76fc084c04322efb48ae63baa93e37bcce642e3b8f0a547208b3690453c2f6632235b18e5ccad9a0ea4edd0c140a635bf7be10b646401544fc048b502c172bfe1807c59986c02b74f78988d02");

var raw = "";

var requestOptions = {
  method: 'GET',
  headers: myHeaders,
//   body: raw,
  redirect: 'follow'
};

fetch("https://alekseirizchkov.amocrm.ru/api/v4/leads", requestOptions)
  .then(response => response.text())
  .then(result => console.log(result))
  .catch(error => console.log('error', error));

//     fetch("https://jsonplaceholder.typicode.com/todos/1")
//   .then(response => response.json())
//   .then(json => console.log(json))



// btn.addEventListener("click", query)