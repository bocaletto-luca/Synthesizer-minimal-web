// synth.js

// Inizializza un sintetizzatore polifonico con Tone.js
const synth = new Tone.PolySynth(Tone.Synth, {
  oscillator: { type: "sine" },
  envelope: { attack: 0.05, decay: 0.2, sustain: 0.5, release: 0.5 }
}).toDestination();

// Inizializza un filtro per il controllo cutoff
const filter = new Tone.Filter(1000, "lowpass").toDestination();
// Collega il sintetizzatore al filtro (oppure crea una catena di effetti)
synth.connect(filter);

// Funzione per aggiornare i parametri del sintetizzatore dai controlli
function updateSynthParameters() {
  const oscType = document.getElementById('oscType').value;
  const attack = parseFloat(document.getElementById('attack').value);
  const decay = parseFloat(document.getElementById('decay').value);
  const sustain = parseFloat(document.getElementById('sustain').value);
  const release = parseFloat(document.getElementById('release').value);
  const cutoff = parseFloat(document.getElementById('cutoff').value);
  
  // Aggiorna i parametri degli inviluppi
  synth.set({
    oscillator: { type: oscType },
    envelope: { attack, decay, sustain, release }
  });
  
  // Aggiorna il filtro
  filter.frequency.value = cutoff;
  
  // Aggiorna le labels dei controlli
  document.getElementById('attackVal').textContent = attack;
  document.getElementById('decayVal').textContent = decay;
  document.getElementById('sustainVal').textContent = sustain;
  document.getElementById('releaseVal').textContent = release;
  document.getElementById('cutoffVal').textContent = cutoff;
}

// Aggiungi event listeners sui controlli per aggiornare i parametri al cambiamento
document.getElementById('oscType').addEventListener('change', updateSynthParameters);
document.getElementById('attack').addEventListener('input', updateSynthParameters);
document.getElementById('decay').addEventListener('input', updateSynthParameters);
document.getElementById('sustain').addEventListener('input', updateSynthParameters);
document.getElementById('release').addEventListener('input', updateSynthParameters);
document.getElementById('cutoff').addEventListener('input', updateSynthParameters);

// Funzione per resettare i controlli ai valori di default
document.getElementById('resetSynth').addEventListener('click', function(){
  document.getElementById('oscType').value = "sine";
  document.getElementById('attack').value = 0.05;
  document.getElementById('decay').value = 0.2;
  document.getElementById('sustain').value = 0.5;
  document.getElementById('release').value = 0.5;
  document.getElementById('cutoff').value = 1000;
  updateSynthParameters();
});

// Gestione della tastiera virtuale:
document.querySelectorAll('#keyboard .key').forEach(function(keyBtn) {
  keyBtn.addEventListener('mousedown', function() {
    const note = this.getAttribute('data-note');
    // Avvia la nota
    synth.triggerAttack(note);
    // Aggiungi una classe per evidenziare il tasto (facoltativo)
    this.classList.add('active');
  });
  keyBtn.addEventListener('mouseup', function() {
    const note = this.getAttribute('data-note');
    synth.triggerRelease(note);
    this.classList.remove('active');
  });
  keyBtn.addEventListener('mouseleave', function() {
    const note = this.getAttribute('data-note');
    synth.triggerRelease(note);
    this.classList.remove('active');
  });
});

// Se viene passato un preset via query string o localStorage, aggiorna i controlli
document.addEventListener("DOMContentLoaded", function() {
  // Se presente un preset salvato in localStorage, applicalo
  const presetData = localStorage.getItem('synthPreset');
  if (presetData) {
    const preset = JSON.parse(presetData);
    document.getElementById('oscType').value = preset.osc || "sine";
    document.getElementById('attack').value = preset.attack || 0.05;
    document.getElementById('decay').value = preset.decay || 0.2;
    document.getElementById('sustain').value = preset.sustain || 0.5;
    document.getElementById('release').value = preset.release || 0.5;
    document.getElementById('cutoff').value = preset.cutoff || 1000;
    updateSynthParameters();
    // Rimuovi preset da localStorage dopo averlo caricato
    localStorage.removeItem('synthPreset');
  }
});
