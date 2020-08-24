let counter = 0;
            
function count() {
    counter++;
    document.querySelector('h1').innerHTML = `counter: ${counter}`;
}

document.addEventListener('DOMContentLoaded', function() {
    document.querySelector('button').onclick = count;
});