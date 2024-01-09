document.addEventListener('submit', function (e) {
    e.preventDefault(); // フォームのデフォルトの送信をキャンセル
    const form = e.target;
    const query = form.querySelector('[name="query"]').value;
    const searchResultsContainer = document.getElementById('searchResults');
    
    fetch('/search', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: `query=${encodeURIComponent(query)}`
    })
    .then(response => response.text())
    .then(data => {
        searchResultsContainer.innerHTML = data;
    });
});


document.addEventListener('submit1', function (e) {
    e.preventDefault(); // フォームのデフォルトの送信をキャンセル
    const form = e.target;
    const query = form.querySelector('[name="query"]').value;
    const searchResultsContainer = document.getElementById('searchResults');
    
    fetch('/picture', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: `query=${encodeURIComponent(query)}`
    })
    .then(response => response.text())
    .then(data => {
        searchResultsContainer.innerHTML = data;
    });
});


