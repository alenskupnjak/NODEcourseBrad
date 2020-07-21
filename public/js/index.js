const loginForm = document.querySelector('.form');
const daj = document.getElementById('ajmoo');



console.log(loginForm, daj);

alert('tu sam')
console.log('**********************************');


daj.addEventListener('click',(e)=>{
    console.log('++++++++++++++++++++++++++++++++');
    
})

if (loginForm) {
  document.querySelector('.form').addEventListener('submit', (e) => {
    e.preventDefault();
    // VALUES
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    console.log(email, password );
    
    // login(email, password);
  });
}