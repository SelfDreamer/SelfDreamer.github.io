const themeSwitch = document.getElementById('themeSwitch');
const body = document.body;
if (localStorage.getItem('theme') === 'light') {
    body.classList.add('light-mode');
    themeSwitch.checked = false;
} else {
    body.classList.add('dark-mode');
    themeSwitch.checked = true;
}
themeSwitch.addEventListener('change', () => {
    if (themeSwitch.checked) {
        body.classList.replace('light-mode', 'dark-mode');
        localStorage.setItem('theme', 'dark');
    } else {
        body.classList.replace('dark-mode', 'light-mode');
        localStorage.setItem('theme', 'light');
    }
});
