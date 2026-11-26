const scenarios = {
  ok: ['Lookup: Dispatched · Policy: 14 days', 'A100 has shipped. Unused items can be returned within 14 days of delivery.'],
  missing: ['Lookup: No matching order · Policy: 14 days', 'Please check the order ID A999. The policy allows returns of unused items within 14 days of delivery.'],
  timeout: ['Lookup: Timed out · Policy: 14 days', 'I could not retrieve the status of A101. The policy allows returns of unused items within 14 days of delivery.']
};
const scenario = document.querySelector('#scenario');
scenario.disabled = false;
scenario.addEventListener('change', () => {
  const [observation, answer] = scenarios[scenario.value];
  document.querySelector('#observation').textContent = observation;
  document.querySelector('#answer').textContent = answer;
});
