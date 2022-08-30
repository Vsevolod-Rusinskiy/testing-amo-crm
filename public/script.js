
getLeads()

async function getLeads() {
    const query = await fetch("http://localhost:3000/api/leads", {
        mode: "no-cors",
        method: "get",
        headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
            "Authorization": "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImp0aSI6ImQ0ZDUxYmNjZDc0YjY3Y2MyODkyMGY5NDkzZmRlN2U1ZTRhZjc0ZjkwODgxMDM3YTM0NDlhN2RjOWExMjY0ZjY3OWQ5MmQ1OWEwZThlYmJjIn0.eyJhdWQiOiI1YjY5NmFiYy0wYTI3LTQ5ODMtOTg5ZS1jM2FiYzZlZTBlMjQiLCJqdGkiOiJkNGQ1MWJjY2Q3NGI2N2NjMjg5MjBmOTQ5M2ZkZTdlNWU0YWY3NGY5MDg4MTAzN2EzNDQ5YTdkYzlhMTI2NGY2NzlkOTJkNTlhMGU4ZWJiYyIsImlhdCI6MTY2MTcxMDA0MSwibmJmIjoxNjYxNzEwMDQxLCJleHAiOjE2NjE3OTY0NDEsInN1YiI6Ijg0OTkzMTkiLCJhY2NvdW50X2lkIjozMDM2MzE0OCwic2NvcGVzIjpbInB1c2hfbm90aWZpY2F0aW9ucyIsImZpbGVzIiwiY3JtIiwiZmlsZXNfZGVsZXRlIiwibm90aWZpY2F0aW9ucyJdfQ.HSTTM_AIRVVSeeRK-Br7cfxpeJke-OZpVvZXl4Py5yn0l0-nweoq_cq9xvU4tf24rsIPE6QYb-XCWDBCRBzGbTjIh4HnxSfTvoximh6cOpqFg2ud_8qwLi11PIisiIJ3Kyxgj32ei2ndek6aOLQWuG7PMql8kgazvpqqB1_vnzxRpzLblKkO1O2uw2RVfufnlCnNTOOJhslfcczfdy2eu1hMoIO4MaAIOudeyNDMj2hHxPZM_NwPn_nKdpELw4LBIOJCL5fM1s1SG1hHFJPRZTMkZr4T1PYw_lzO3tjXB00cASsuXDqIN92z8F5E-iiPxmfXNWJ9z6XwSat-ZOw31w",
        }
    })
    const answer = await query.text()
    console.log(typeof answer)
}



