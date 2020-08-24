if (!localStorage.getItem('counter')) {
    localStorage.setItem('counter', 0);
}
            
function count() {
    let counter = localStorage.getItem('counter');
    counter++;
    document.querySelector('h1').innerHTML = `counter: ${counter}`;
    localStorage.setItem('counter', counter)
}

document.addEventListener('DOMContentLoaded', function() {
    document.querySelector('h1').innerHTML = `counter: ${localStorage.getItem('counter')}`
    document.querySelector('button').onclick = count;
});