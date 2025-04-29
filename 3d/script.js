// Czekaj, aż cała strona zostanie wczytana
document.addEventListener('DOMContentLoaded', () => {
    // Zmień querySelector na querySelectorAll, aby wybrać WSZYSTKIE elementy z klasą 'image_display'
    const imageDisplays = document.querySelectorAll('.image_display');

    // Sprawdź, czy znaleziono jakiekolwiek elementy z tą klasą
    if (imageDisplays.length > 0) {
        // Przejdź przez każdy znaleziony kontener '.image_display'
        imageDisplays.forEach(imageDisplay => {
            // Dodaj nasłuchiwanie na zdarzenia najechania (mouseover) i opuszczenia (mouseout) na TYM konkretnym kontenerze.
            imageDisplay.addEventListener('mouseover', (event) => {
                const target = event.target; // Element, na który najechano

                // Sprawdź, czy element, na który najechano, to obrazek (IMG)
                if (target.tagName === 'IMG') {
                    const originalSrc = target.src; // Pobierz oryginalny adres obrazka

                    // Sprawdź, czy ten obrazek nie jest już obrazkiem '_back'
                    // i czy nie przechowuje już oryginalnego adresu (czyli czy nie jest w stanie 'hover')
                    if (!originalSrc.includes('_back.') && !target.dataset.originalSrc) {
                        // Zapisz oryginalny adres w atrybucie 'data-original-src' obrazka
                        target.dataset.originalSrc = originalSrc;

                        // Buduj nowy adres obrazka z '_back'
                        const parts = originalSrc.split('.');
                        if (parts.length > 1) {
                            const extension = parts.pop();
                            const baseUrl = parts.join('.');
                            const backSrc = `${baseUrl}_back.${extension}`;

                            // Zmień adres obrazka na wersję z '_back'
                            target.src = backSrc;
                        }
                    }
                }
            });

            // Dodaj nasłuchiwanie na zdarzenie opuszczenia (mouseout)
            imageDisplay.addEventListener('mouseout', (event) => {
                const target = event.target; // Element, z którego zjechano myszką

                // Sprawdź, czy element to obrazek i czy ma zapisany oryginalny adres (czyli był w stanie 'hover')
                if (target.tagName === 'IMG' && target.dataset.originalSrc) {
                    // Przywróć oryginalny adres obrazka
                    target.src = target.dataset.originalSrc;

                    // Usuń zapisany oryginalny adres (opcjonalnie, ale czysto)
                    delete target.dataset.originalSrc;
                }
            });
        }); // Koniec pętli forEach
    }
});