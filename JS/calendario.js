document.addEventListener('DOMContentLoaded', () => {
    const calendarElement = document.querySelector('.calendar');
    const daysOfWeek = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
    const monthNames = [
        'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
        'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ];
    const currentMonthElement = document.getElementById('current-month');
    const prevMonthButton = document.getElementById('prev-month');
    const nextMonthButton = document.getElementById('next-month');
    let currentMonth = new Date().getMonth();
    let currentYear = new Date().getFullYear();
    let events = [];

    const modal = document.createElement('div');
    modal.classList.add('modal');
    modal.innerHTML = `
        <div class="modal-content">
            <span class="close">&times;</span>
            <img class="modal-image" src="" alt="Event Image">
            <div class="modal-description"></div>
        </div>
    `;
    document.body.appendChild(modal);

    const modalImage = modal.querySelector('.modal-image');
    const modalDescription = modal.querySelector('.modal-description');
    const closeModalButton = modal.querySelector('.close');

    closeModalButton.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    window.addEventListener('click', (event) => {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });

    fetch('./Data/data.json')
        .then(response => response.json())
        .then(data => {
            events = data;
            updateCalendar();
        })
        .catch(error => console.error('Error al cargar los eventos:', error));

    function updateCalendar() {
        calendarElement.innerHTML = '';

        currentMonthElement.textContent = `${monthNames[currentMonth]} ${currentYear}`;

        daysOfWeek.forEach(day => {
            const dayElement = document.createElement('div');
            dayElement.classList.add('day', 'header');
            dayElement.textContent = day;
            calendarElement.appendChild(dayElement);
        });

        const firstDay = new Date(currentYear, currentMonth, 1).getDay();
        const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

        for (let i = 0; i < firstDay; i++) {
            const emptyElement = document.createElement('div');
            emptyElement.classList.add('day');
            calendarElement.appendChild(emptyElement);
        }

        for (let i = 1; i <= daysInMonth; i++) {
            const dayElement = document.createElement('div');
            dayElement.classList.add('day');
            dayElement.textContent = i;

            const dayEvents = events.filter(event => event.day === i && event.month === currentMonth + 1);
            if (dayEvents.length > 0) {
                dayEvents.forEach(event => {
                    const eventElement = document.createElement('div');
                    eventElement.classList.add('event');
                    eventElement.textContent = `${event.title} (${event.year})`;
                    applyEventColor(eventElement, event.type);
                    eventElement.addEventListener('click', () => {
                        showModal(event);
                    });
                    dayElement.appendChild(eventElement);
                });
            }

            calendarElement.appendChild(dayElement);
        }
    }

    function applyEventColor(element, eventType) {
        switch (eventType) {
            case 'nacimiento':
                element.classList.add('orange');
                break;
            case 'descubrimiento':
                element.classList.add('red');
                break;
            case 'exploración':
                element.classList.add('navy');
                break;
            case 'teoría':
                element.classList.add('brown');
                break;
            case 'fundación':
                element.classList.add('purple');
                break;
            case 'dia mundial':
                element.classList.add('pink');
                break;
            default:
                break;
        }
    }

    function showModal(event) {
        modalImage.src = event.imagen || '';
        modalImage.style.display = event.imagen ? 'block' : 'none';
        modalDescription.textContent = event.description;
        modal.style.display = 'block';
    }

    prevMonthButton.addEventListener('click', () => {
        currentMonth--;
        if (currentMonth < 0) {
            currentMonth = 11;
            currentYear--;
        }
        updateCalendar();
    });

    nextMonthButton.addEventListener('click', () => {
        currentMonth++;
        if (currentMonth > 11) {
            currentMonth = 0;
            currentYear++;
        }
        updateCalendar();
    });
});
