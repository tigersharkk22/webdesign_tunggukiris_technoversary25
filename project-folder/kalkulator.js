// Carbon Calculator Logic
document.addEventListener('DOMContentLoaded', function() {
    const carbonForm = document.getElementById('carbon-form');
    const resultsContainer = document.getElementById('results');
    const saveResultBtn = document.getElementById('save-result');
    const recalculateBtn = document.getElementById('recalculate');

    if (carbonForm) {
        carbonForm.addEventListener('submit', function(e) {
            e.preventDefault();
            calculateCarbon();
        });
    }

    if (recalculateBtn) {
        recalculateBtn.addEventListener('click', function() {
            resultsContainer.style.display = 'none';
            carbonForm.reset();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    if (saveResultBtn) {
        saveResultBtn.addEventListener('click', function() {
            saveToStatistics();
        });
    }
});

function calculateCarbon() {
    // Get form values
    const transport = parseFloat(document.getElementById('transport').value) || 0;
    const electricity = parseFloat(document.getElementById('electricity').value) || 0;
    const plastic = parseFloat(document.getElementById('plastic').value) || 0;
    const foodWaste = parseFloat(document.getElementById('food-waste').value) || 0;
    const water = parseFloat(document.getElementById('water').value) || 0;
    const paper = parseFloat(document.getElementById('paper').value) || 0;

    // Calculate emissions (kg CO2)
    const transportEmission = transport * 2; // 2 kg per trip
    const electricityEmission = electricity * 0.5; // 0.5 kg per hour
    const plasticEmission = plastic * 0.3; // 0.3 kg per bottle
    const foodWasteEmission = foodWaste; // Direct value from select
    const waterEmission = water > 10 ? (water - 10) * 0.1 : 0; // Penalty for >10 min
    const paperEmission = paper * 0.01; // 0.01 kg per sheet

    const totalEmission = transportEmission + electricityEmission + plasticEmission + 
                         foodWasteEmission + waterEmission + paperEmission;

    // Display results
    displayResults(totalEmission, {
        transport: transportEmission,
        electricity: electricityEmission,
        plastic: plasticEmission,
        foodWaste: foodWasteEmission,
        water: waterEmission,
        paper: paperEmission
    }, {
        transport,
        electricity,
        plastic,
        foodWaste,
        water,
        paper
    });
}

function displayResults(total, breakdown, inputs) {
    const resultsContainer = document.getElementById('results');
    const totalEmissionElement = document.getElementById('total-emission');
    const breakdownList = document.getElementById('breakdown-list');
    const recommendationsList = document.getElementById('recommendations-list');
    const impactText = document.getElementById('impact-text');

    // Display total
    totalEmissionElement.textContent = total.toFixed(2);

    // Display breakdown
    breakdownList.innerHTML = '';
    if (breakdown.transport > 0) {
        breakdownList.innerHTML += `<li>🚗 Transportasi: ${breakdown.transport.toFixed(2)} kg CO₂</li>`;
    }
    if (breakdown.electricity > 0) {
        breakdownList.innerHTML += `<li>💡 Listrik: ${breakdown.electricity.toFixed(2)} kg CO₂</li>`;
    }
    if (breakdown.plastic > 0) {
        breakdownList.innerHTML += `<li>🥤 Plastik: ${breakdown.plastic.toFixed(2)} kg CO₂</li>`;
    }
    if (breakdown.foodWaste > 0) {
        breakdownList.innerHTML += `<li>🍽️ Limbah Makanan: ${breakdown.foodWaste.toFixed(2)} kg CO₂</li>`;
    }
    if (breakdown.water > 0) {
        breakdownList.innerHTML += `<li>💧 Pemborosan Air: ${breakdown.water.toFixed(2)} kg CO₂</li>`;
    }
    if (breakdown.paper > 0) {
        breakdownList.innerHTML += `<li>📄 Kertas: ${breakdown.paper.toFixed(2)} kg CO₂</li>`;
    }

    // Generate recommendations
    const recommendations = generateRecommendations(inputs, breakdown);
    recommendationsList.innerHTML = '';
    recommendations.forEach(rec => {
        recommendationsList.innerHTML += `<li>${rec}</li>`;
    });

    // Impact comparison
    const treesNeeded = Math.ceil(total * 365 / 22); // Trees needed to offset annual emissions
    const comparison = getImpactComparison(total);
    impactText.innerHTML = `<strong>Perbandingan:</strong> ${comparison}<br><strong>Untuk offset emisi tahunanmu, dibutuhkan ${treesNeeded} pohon!</strong>`;

    // Show results
    resultsContainer.style.display = 'block';
    resultsContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function generateRecommendations(inputs, breakdown) {
    const recommendations = [];

    if (inputs.transport >= 2) {
        recommendations.push('🚴 Kurangi penggunaan kendaraan bermotor dengan berjalan kaki, bersepeda, atau naik transportasi umum 2-3x seminggu untuk menurunkan emisi hingga 30%.');
    }

    if (inputs.electricity >= 5) {
        recommendations.push('💡 Matikan lampu dan peralatan elektronik saat tidak digunakan. Gunakan lampu LED yang lebih hemat energi.');
    }

    if (inputs.plastic >= 2) {
        recommendations.push('♻️ Bawa botol minum dan tas belanja sendiri. Hindari plastik sekali pakai untuk mengurangi emisi hingga 0.6 kg CO₂ per hari.');
    }

    if (inputs.foodWaste > 0) {
        recommendations.push('🍽️ Ambil makanan secukupnya dan habiskan. Sisa makanan menghasilkan gas metana yang 25x lebih berbahaya dari CO₂.');
    }

    if (inputs.water > 10) {
        recommendations.push('💧 Kurangi waktu mandi menjadi maksimal 10 menit. Setiap menit menghemat 9 liter air dan energi pemanas air.');
    }

    if (inputs.paper >= 5) {
        recommendations.push('📄 Gunakan kertas bolak-balik dan beralih ke dokumen digital. Daur ulang kertas bekas untuk mengurangi penebangan pohon.');
    }

    if (recommendations.length === 0) {
        recommendations.push('🌟 Hebat! Kamu sudah melakukan yang terbaik. Terus pertahankan kebiasaan hijau ini dan ajak teman-temanmu!');
    }

    return recommendations;
}

function getImpactComparison(dailyEmission) {
    if (dailyEmission < 2) {
        return 'Emisimu setara dengan mengendarai motor sejauh 1 km. Sangat baik!';
    } else if (dailyEmission < 5) {
        return 'Emisimu setara dengan mengendarai mobil sejauh 10 km atau charging smartphone 100x.';
    } else if (dailyEmission < 10) {
        return 'Emisimu setara dengan mengendarai mobil sejauh 25 km atau menyalakan AC selama 10 jam.';
    } else {
        return 'Emisimu setara dengan mengendarai mobil sejauh 50 km atau penerbangan jarak pendek. Yuk, kurangi!';
    }
}

function saveToStatistics() {
    const totalEmission = parseFloat(document.getElementById('total-emission').textContent);
    
    // Get current statistics from localStorage
    const currentEnergySaved = parseFloat(localStorage.getItem('energySaved')) || 0;
    const currentWasteRecycled = parseFloat(localStorage.getItem('wasteRecycled')) || 0;
    
    // Calculate reductions (assuming user will follow recommendations)
    const potentialReduction = totalEmission * 0.3; // 30% reduction potential
    const wasteReduction = parseFloat(document.getElementById('plastic').value) * 0.3 || 0;
    
    // Update statistics
    localStorage.setItem('energySaved', (currentEnergySaved + potentialReduction).toFixed(2));
    localStorage.setItem('wasteRecycled', (currentWasteRecycled + wasteReduction).toFixed(2));
    
    // Show success message
    alert('✅ Hasil berhasil disimpan ke statistik sekolah!\n\nTerima kasih atas kontribusimu. Data ini akan membantu SMANDA memantau jejak karbon kolektif dan merencanakan program lingkungan yang lebih baik.');
    
    // Disable save button
    document.getElementById('save-result').disabled = true;
    document.getElementById('save-result').textContent = 'Sudah Disimpan ✓';
    document.getElementById('save-result').style.opacity = '0.6';
}