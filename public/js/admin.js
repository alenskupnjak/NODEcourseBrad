

const deleteDataFrontend =  (data) => {
  console.log('1',data);
  console.log('2',data.closest('tr'));
  console.log('3',data.parentNode);
  console.log(data.parentNode.querySelector('[name="edit"]'));
  console.log(data.parentNode.querySelector('[name="edit"]').getAttribute("id"));
  console.log(data.parentNode.querySelector('[name="brisi"]'));
  console.log(data.parentNode.querySelector('[name="brisi"]').getAttribute("id"));


  const prodId = data.parentNode.querySelector('[name="brisi"]').getAttribute("id");
  // const csfr = data.parentNode.querySelector('[name="_csrf"]').value;
  const productElement = data.closest('tr')
// @route     DELETE /api/v1/reviews/:id
  fetch('/api/v1/reviews/' + prodId, {
    method: 'DELETE',
    // headers: {
    //   'csrf-token': csfr,
    // },
  })
    .then((result) => {
      return result.json();
    })
    .then(data => {
     productElement.parentNode.removeChild(productElement)
    })
    .catch((err) => {
      console.log(err, 'Greška kod brisanja');
    });
};
