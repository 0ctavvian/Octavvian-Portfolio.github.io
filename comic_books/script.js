// Czekaj, aż cała strona zostanie wczytana
document.addEventListener('DOMContentLoaded', () => {

    // Zdefiniuj adresy obrazków strzałek
    // Upewnij się, że ścieżka ../images/gui/ jest poprawna względem Twojego pliku HTML
    const arrowBasePath = '../images/gui/';
    const leftArrowEnabledSrc = arrowBasePath + 'left_arrow.png';
    const leftArrowDisabledSrc = arrowBasePath + 'left_arrow_no.png';
    const rightArrowEnabledSrc = arrowBasePath + 'right_arrow.png';
    const rightArrowDisabledSrc = arrowBasePath + 'right_arrow_no.png';


    // Funkcja pomocnicza do sprawdzania, czy obrazek o danym adresie istnieje
    // Jest to asynchroniczne, ponieważ ładowanie obrazka zajmuje czas
    function checkImageExists(url) {
        return new Promise((resolve) => {
            const img = new Image();
            // Ustaw timeout, aby nie czekać w nieskończoność na odpowiedź
            const timeout = setTimeout(() => {
                resolve(false); // Przyjmujemy, że nie istnieje, jeśli timeout minie
                img.onerror = null; // Usuń handler, żeby uniknąć podwójnego wywołania
                img.onload = null;
            }, 5000); // Timeout po 5 sekundach (możesz dostosować)

            img.onload = () => {
                clearTimeout(timeout); // Anuluj timeout
                resolve(true); // Obrazek załadował się pomyślnie (istnieje)
            };
            img.onerror = () => {
                clearTimeout(timeout); // Anuluj timeout
                resolve(false); // Wystąpił błąd podczas ładowania (nie istnieje lub inny problem)
            };
            img.src = url; // Ustaw adres, aby spróbować załadować obrazek
        });
    }

    // Funkcja pomocnicza do aktualizacji stanu strzałek (zmienia src obrazków i klasy)
    async function updateArrowStates(comicImageElement) {
        // Pobierz bieżący numer strony z atrybutu danych obrazka
        const currentPage = parseInt(comicImageElement.dataset.currentPage, 10); // Określ system liczbowy
        const comicTitle = comicImageElement.dataset.comicTitle;
        // Znajdź strzałki powiązane z tym obrazkiem (zakładamy, że są sąsiadami w DOM)
        const leftArrow = comicImageElement.previousElementSibling;
        const rightArrow = comicImageElement.nextElementSibling;

        // --- Obsługa lewej strzałki ---
        if (currentPage === 0) {
            // Jesteśmy na pierwszej stronie, wyłącz lewą strzałkę
            leftArrow.src = leftArrowDisabledSrc; // Zmień obrazek na wersję 'wyłączoną'
            leftArrow.classList.add('disabled'); // Dodaj klasę dla pointer-events: none (CSS)
        } else {
            // Nie jesteśmy na pierwszej stronie, włącz lewą strzałkę
            leftArrow.src = leftArrowEnabledSrc; // Zmień obrazek na wersję 'aktywną'
            leftArrow.classList.remove('disabled'); // Usuń klasę
        }

        // --- Obsługa prawej strzałki ---
        // Sprawdź, czy istnieje następna strona, próbując załadować jej obrazek
        const nextSrc = `images/${comicTitle}_${currentPage + 1}.png`; // Pełny adres do obrazka następnej strony komiksu
        const nextImageExists = await checkImageExists(nextSrc); // Użyj funkcji asynchronicznej

        if (nextImageExists) {
            // Następna strona istnieje, włącz prawą strzałkę
            rightArrow.src = rightArrowEnabledSrc; // Zmień obrazek na wersję 'aktywną'
            rightArrow.classList.remove('disabled'); // Usuń klasę
        } else {
            // Następna strona nie istnieje, wyłącz prawą strzałkę
            rightArrow.src = rightArrowDisabledSrc; // Zmień obrazek na wersję 'wyłączoną'
            rightArrow.classList.add('disabled'); // Dodaj klasę dla pointer-events: none (CSS)
        }
    }

    // --- Główna część skryptu ---

    // Znajdź wszystkie kontenery komiksów na stronie
    const comicViewers = document.querySelectorAll('.comic-viewer');

    // Sprawdź, czy znaleziono jakiekolwiek kontenery komiksów
    if (comicViewers.length > 0) {
        // Przejdź przez każdy znaleziony kontener komiksu
        comicViewers.forEach(viewer => {
            // Wewnątrz każdego kontenera znajdź obrazek komiksu i strzałki
            const comicImage = viewer.querySelector('.comic-page-image');
            const leftArrow = viewer.querySelector('.left-arrow');
            const rightArrow = viewer.querySelector('.right-arrow');

            // Upewnij się, że wszystkie potrzebne elementy zostały znalezione dla tego widza
            if (comicImage && leftArrow && rightArrow) {

                // *** Inicjalizacja ***
                // Przy pierwszym ładowaniu strony, ustaw początkowy stan strzałek dla tego komiksu
                // Używamy async, bo updateArrowStates jest async
                updateArrowStates(comicImage); // Nie potrzebujemy 'await' tutaj, ponieważ nie blokujemy dalszego ładowania strony


                // *** Dodanie nasłuchiwaczy zdarzeń ***

                // Dodaj nasłuchiwanie na kliknięcie lewej strzałki
                leftArrow.addEventListener('click', () => {
                    // Dzięki pointer-events: none w CSS dla .nav-arrow.disabled,
                    // kliknięcie na wyłączony element nie zadziała.
                    // Nie potrzebujemy tutaj dodatkowego sprawdzenia klasy 'disabled'.

                    // Pobierz bieżący numer strony i przekonwertuj na liczbę całkowitą
                    let currentPage = parseInt(comicImage.dataset.currentPage, 10);

                    // Przejdź do poprzedniej strony tylko jeśli jesteś powyżej strony 0
                    if (currentPage > 0) {
                        currentPage--; // Zmniejsz numer strony
                        const comicTitle = comicImage.dataset.comicTitle;
                        // Zbuduj i ustaw nowy adres obrazka strony komiksu
                        comicImage.src = `images/${comicTitle}_${currentPage}.png`;
                        // Zaktualizuj numer strony w atrybucie danych elementu obrazka
                        comicImage.dataset.currentPage = currentPage;

                        // Zaktualizuj stan strzałek na podstawie nowego numeru strony
                        updateArrowStates(comicImage);

                        // Opcjonalnie: Zaktualizuj wyświetlany numer strony, jeśli używasz page-indicator
                        // const pageNumberSpan = viewer.parentElement.querySelector('.current-page-number');
                        // if (pageNumberSpan) {
                        //     pageNumberSpan.textContent = currentPage + 1; // Wyświetlaj 1-indeksowo
                        // }
                    }
                });

                // Dodaj nasłuchiwanie na kliknięcie prawej strzałki
                rightArrow.addEventListener('click', async () => {
                    // Dzięki pointer-events: none w CSS, kliknięcie na wyłączony element nie zadziała

                    // Pobierz bieżący numer strony
                    let currentPage = parseInt(comicImage.dataset.currentPage, 10);
                    const comicTitle = comicImage.dataset.comicTitle;
                    // Zbuduj adres do potencjalnie następnej strony
                    const nextSrc = `images/${comicTitle}_${currentPage + 1}.png`;

                    // Sprawdź, czy następna strona faktycznie istnieje (asynchronicznie)
                    const nextImageExists = await checkImageExists(nextSrc);

                    if (nextImageExists) {
                        // Następna strona istnieje, przejdź do niej
                        currentPage++; // Zwiększ numer strony
                        // Ustaw adres obrazka na adres następnej strony
                        comicImage.src = nextSrc;
                        // Zaktualizuj numer strony w atrybucie danych elementu obrazka
                        comicImage.dataset.currentPage = currentPage;

                        // Zaktualizuj stan strzałek na podstawie nowego numeru strony
                        updateArrowStates(comicImage);

                         // Opcjonalnie: Zaktualizuj wyświetlany numer strony
                        // const pageNumberSpan = viewer.parentElement.querySelector('.current-page-number');
                        // if (pageNumberSpan) {
                        //     pageNumberSpan.textContent = currentPage + 1; // Wyświetlaj 1-indeksowo
                        // }
                    }
                    // Jeśli nextImageExists jest false, kliknięcie i tak by nie zaszło dzięki pointer-events: none,
                    // ale jeśli by zaszło, po prostu nie robimy nic.
                });
            } else {
                // Opcjonalnie: Zaloguj błąd w konsoli, jeśli struktura HTML jest niepoprawna
                console.error("Nie znaleziono wszystkich wymaganych elementów w jednym z '.comic-viewer'.", viewer);
            }
        });
    } else {
         // Opcjonalnie: Zaloguj informację, jeśli nie znaleziono żadnych '.comic-viewer'
         console.log("Nie znaleziono elementów z klasą '.comic-viewer' na stronie.");
    }
});