document.querySelector('.searchBtn').addEventListener('click', function() {
    var txtInput = document.querySelector('.txtInput');
    var resultsTable = document.querySelector('.results-table');
    
    if (txtInput.value.trim() !== '') {
        resultsTable.style.display = 'block';
    } else {
        resultsTable.style.display = 'none';
    }
});
