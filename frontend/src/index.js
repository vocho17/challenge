import './styles.css'

const autoValues = {
  terms: [24, 36, 48],
  minLoan: 3000,
  maxLoan: 100000
}

const homeValue = {
  terms: [120, 180, 240],
  minLoan: 30000,
  maxLoan: 4500000
}

export const changeGarantia = garantiaSelect => {
  if (garantiaSelect === 'veiculo') {
    fillSelectTerms(autoValues.terms)
    fillSliderValues(autoValues.minLoan, autoValues.maxLoan)
  } else {
    fillSelectTerms(homeValue.terms)
    fillSliderValues(homeValue.minLoan, homeValue.maxLoan)
  }
}

export const fillSelectTerms = terms => {
  const selectParcelas = document.getElementById('parcelas')
  selectParcelas.options.length = 0
  terms.forEach(term => {
    const option = document.createElement("option")
    option.text = term
    option.value = term
    selectParcelas.add(option)
  })
}

export const fillSliderValues = (min, max) => {
  const textSlider = document.getElementById('valor-emprestimo')
  const slider = document.getElementById('valor-emprestimo-range')
  const labelContainer = slider.parentNode.children[1]
  textSlider.value = parseInt(max / 2)
  labelContainer.children[0].textContent = min
  labelContainer.children[1].textContent = max
  slider.min = min
  slider.max = max
  slider.value = parseInt(max / 2)
}

export const checkFormValidity = formElement => formElement.checkValidity()

export const getFormValues = formElement =>
  Object.values(formElement.elements)
    .filter(element => ['SELECT', 'INPUT'].includes(element.nodeName))
    .map(element => ({
      field: element.name,
      value: element.value
    }))

export const toStringFormValues = values => {
  return `Confirmação\n${values
    .map(value => `Campo: ${value.field}, Valor: ${value.value}`)
    .join('\n')}`.concat(
      `\nTotal ${calculateTotalLoan()}`
    )
}

export function Send(values) {
  return new Promise((resolve, reject) => {
    try {
      resolve(toStringFormValues(values))
    } catch (error) {
      reject(error)
    }
  })
}

export function Submit(formElement) {
  formElement.addEventListener('submit', function (event) {
    event.preventDefault()
    if (checkFormValidity(formElement)) {
      Send(getFormValues(formElement))
        .then(result => confirm(result, 'Your form submited success'))
        .catch(error => Alert('Your form submited error', error))
    }
  })
}

export const updateTotalLabel = () => {
  const quota = document.getElementsByClassName('quota__container--price')
  const amount = document.getElementsByClassName('amount__container--price')
  const tax = document.getElementsByClassName('tax__container--price')
  quota[0].textContent = calculateTotalLoan()
  amount[0].textContent = `R$ ${(calculateTotalLoan() / Number(document.getElementById('parcelas').value)).toFixed(2)}`
  tax[0].textContent = `R$ ${(calculateTotalLoan() * 0.10).toFixed(2)} %`
  console.log(`R$ ${calculateTotalLoan()}`)
}

export const handleChangeSlide = (rangeElement, warrantyElement) => {
  rangeElement.addEventListener('change', function (event) {
    warrantyElement.value = event.target.value
    updateTotalLabel()
  })
}

export const handleChangeGarantia = garantiaElement => {
  garantiaElement.addEventListener('change', function () {
    changeGarantia(garantiaElement.value)
    updateTotalLabel()
  })
}

export const handleChangeParcelas = parcelasElement => {
  parcelasElement.addEventListener('change', function () {
    updateTotalLabel()
  })
}

export const calculateTotalLoan = () => {
  const IOF = 6.38 / 100
  const INTEREST_RATE = 2.34 / 100
  const TIME = Number(document.getElementById('parcelas').value) / 1000
  const LOAN_AMOUNT = Number(document.getElementById('valor-emprestimo').value)
  const TOTAL = (IOF + INTEREST_RATE + TIME + 1) * LOAN_AMOUNT
  return TOTAL.toFixed(2)
}

export default class CreditasChallenge {
  static initialize () {
    this.registerEvents()
    fillSliderValues(autoValues.minLoan, autoValues.maxLoan)
    updateTotalLabel()
  }

  static registerEvents () {
    Submit(document.querySelector('.form'))

    handleChangeSlide(
      document.getElementById('valor-garantia-range'),
      document.getElementById('valor-garantia')
    )

    handleChangeSlide(
      document.getElementById('valor-emprestimo-range'),
      document.getElementById('valor-emprestimo')
    )

    handleChangeGarantia(
      document.getElementById('garantia')
    )

    handleChangeParcelas(
      document.getElementById('parcelas')
    )
  }
}

document.addEventListener('DOMContentLoaded', function () {
  CreditasChallenge.initialize()
})
